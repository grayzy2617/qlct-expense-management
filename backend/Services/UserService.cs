using System.Collections.Generic;
using System.Threading.Tasks;
using QLCT.DTOs.User.Request;
using QLCT.DTOs.User.Response;
using QLCT.Entities;
using QLCT.Repositories;
using QLCT.Exceptions;
using QLCT.Exceptions;
using Mapster;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using BCrypt.Net;

namespace QLCT.Services
{
    public interface IUserService
    {
        Task<UserResponse> GetCurrentUserAsync();
        Task<UserResponse> SignUpAsync(UserRegisterRequest request);
        Task UpdateUserConfigAsync(int startDay, bool isCalcByNextMonth);
        Task DeleteAllUserDataAsync();
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IItemRepository _itemRepository;
        private readonly ISavingRepository _savingRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            IItemRepository itemRepository,
            ISavingRepository savingRepository,
            ICategoryRepository categoryRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _itemRepository = itemRepository;
            _savingRepository = savingRepository;
            _categoryRepository = categoryRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                   ?? throw new AppException("User not found in context");
        }

        public async Task<UserResponse> GetCurrentUserAsync()
        {
            var userId = GetCurrentUserId();
            var userEntity = await _userRepository.FindByIdAsync(userId) 
                ?? throw new AppException("USER_NOT_FOUND");
            
            return userEntity.Adapt<UserResponse>();
        }

        public async Task<UserResponse> SignUpAsync(UserRegisterRequest request)
        {
            if (request.Password != request.ConfirmPassword)
            {
                throw new AppException("PASSWORD_CONFIRM_NOT_MATCH");
            }

            if (await _userRepository.ExistsByUsernameAsync(request.Username))
            {
                throw new AppException("USER_EXISTED");
            }

            var roleUser = await _roleRepository.FindByNameAsync("ROLE_USER") 
                ?? throw new AppException("UNCATEGORIZED_EXCEPTION");

            var userEntity = new User
            {
                Username = request.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Roles = new List<Role> { roleUser }
            };

            var savedUser = await _userRepository.SaveAsync(userEntity);
            return savedUser.Adapt<UserResponse>();
        }

        public async Task UpdateUserConfigAsync(int startDay, bool isCalcByNextMonth)
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.FindByIdAsync(userId) 
                ?? throw new AppException("USER_NOT_FOUND");

            user.StartDay = startDay;
            user.IsCalcByNextMonth = isCalcByNextMonth;

            await _userRepository.SaveAsync(user);
        }

        public async Task DeleteAllUserDataAsync()
        {
            var userId = GetCurrentUserId();

            await _itemRepository.DeleteAllByUserIdAsync(userId);
            await _savingRepository.DeleteAllByUserIdAsync(userId);
            await _categoryRepository.DeleteAllByUserIdAsync(userId);
        }
    }
}