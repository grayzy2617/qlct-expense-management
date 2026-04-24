using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QLCT.DTOs.Admin.Response;
using QLCT.Exceptions;
using QLCT.Repositories;

namespace QLCT.Services
{
    public interface IAdminService
    {
        Task<List<UserListItemResponse>> GetAllUsersAsync();
        Task<UserDetailResponse> GetUserDetailAsync(string userId);
    }

    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IItemRepository _itemRepository;
        private readonly ISavingRepository _savingRepository;

        public AdminService(
            IUserRepository userRepository,
            ICategoryRepository categoryRepository,
            IItemRepository itemRepository,
            ISavingRepository savingRepository)
        {
            _userRepository = userRepository;
            _categoryRepository = categoryRepository;
            _itemRepository = itemRepository;
            _savingRepository = savingRepository;
        }

        public async Task<List<UserListItemResponse>> GetAllUsersAsync()
        {
            var users = await _userRepository.FindAllAsync();
            var responseList = new List<UserListItemResponse>();

            foreach (var user in users)
            {
                int categoryCount = await _categoryRepository.CountByUserIdAsync(user.Id);
                int itemCount = await _itemRepository.CountByUserIdAsync(user.Id);
                int savingCount = await _savingRepository.CountByUserIdAsync(user.Id);

                responseList.Add(new UserListItemResponse
                {
                    UserId = user.Id,
                    Username = user.Username,
                    CreatedAt = user.CreatedAt,
                    TotalCategories = categoryCount,
                    TotalItems = itemCount,
                    TotalSavings = savingCount
                });
            }

            return responseList;
        }

        public async Task<UserDetailResponse> GetUserDetailAsync(string userId)
        {
            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            var roles = user.Roles?.Select(r => r.Name).ToList() ?? new List<string>();
            var statistics = await CalculateUserStatisticsAsync(userId);

            return new UserDetailResponse
            {
                UserId = user.Id,
                Username = user.Username,
                CreatedAt = user.CreatedAt,
                Roles = roles,
                Statistics = statistics
            };
        }

        private async Task<UserStatistics> CalculateUserStatisticsAsync(string userId)
        {
            int categoryCount = await _categoryRepository.CountByUserIdAsync(userId);
            int itemCount = await _itemRepository.CountByUserIdAsync(userId);
            int savingCount = await _savingRepository.CountByUserIdAsync(userId);

            double totalIncome = await _itemRepository.GetSumByUserIdAndTypeAsync(userId, "INCOME");
            double totalExpense = await _itemRepository.GetSumByUserIdAndTypeAsync(userId, "EXPENSE");
            double balance = totalIncome - totalExpense;

            return new UserStatistics
            {
                TotalCategories = categoryCount,
                TotalItems = itemCount,
                TotalSavings = savingCount,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                Balance = balance
            };
        }
    }
}