using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using QLCT.DTOs.Item.Request;
using QLCT.DTOs.Item.Response;
using QLCT.DTOs.RangeDate;
using QLCT.Entities;
using QLCT.Exceptions;
using QLCT.Repositories;
using Mapster;

namespace QLCT.Services
{
    public interface IItemService
    {
        Task<ItemResponse> GetItemByIdAsync(string id);
        Task<ItemResponse> CreateItemAsync(ItemCreateRequest request);
        Task<ItemResponse> UpdateItemAsync(string id, ItemUpdateRequest request);
        Task DeleteItemAsync(string id);
        Task<List<ItemResponse>> GetItemsByCategoryIdAsync(string categoryId);
        Task<double> GetTotalAmountByTypeAsync(string type, int year, int month);
        Task<double> GetTotalAmountByCategoryAsync(string categoryId, int year, int month);
        Task<List<ItemResponse>> GetItemsByCategoryAndRangeAsync(string categoryId, int year, int month);
    }

    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMonthRangeService _monthRangeService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemService(
            IItemRepository itemRepository,
            ICategoryRepository categoryRepository,
            IUserRepository userRepository,
            IMonthRangeService monthRangeService,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemRepository = itemRepository;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
            _monthRangeService = monthRangeService;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                   ?? throw new AppException("UNAUTHORIZED");
        }

        private async Task ValidateItemOwnershipAsync(string itemId, string userId)
        {
            var item = await _itemRepository.FindByIdAsync(itemId)
                       ?? throw new AppException("ITEM_NOT_FOUND");

            if (item.UserId != userId)
            {
                throw new AppException("UNAUTHORIZED");
            }
        }

        private async Task ValidateCategoryOwnershipAsync(string categoryId, string userId)
        {
            var category = await _categoryRepository.FindByIdAsync(categoryId)
                           ?? throw new AppException("CATEGORY_NOT_FOUND");

            if (category.UserId != userId)
            {
                throw new AppException("UNAUTHORIZED");
            }
        }

        public async Task<ItemResponse> GetItemByIdAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateItemOwnershipAsync(id, userId);

            var itemEntity = await _itemRepository.FindByIdAsync(id)
                             ?? throw new AppException("ITEM_NOT_FOUND");

            return itemEntity.Adapt<ItemResponse>();
        }

        public async Task<ItemResponse> CreateItemAsync(ItemCreateRequest request)
        {
            var userId = GetCurrentUserId();

            await ValidateCategoryOwnershipAsync(request.CategoryID, userId);

            var itemEntity = request.Adapt<Item>();
            itemEntity.UserId = userId; // Update user id

            var savedItem = await _itemRepository.SaveAsync(itemEntity);
            return savedItem.Adapt<ItemResponse>();
        }

        public async Task<ItemResponse> UpdateItemAsync(string id, ItemUpdateRequest request)
        {
            var userId = GetCurrentUserId();
            await ValidateItemOwnershipAsync(id, userId);

            var existingItem = await _itemRepository.FindByIdAsync(id)
                               ?? throw new AppException("ITEM_NOT_FOUND");

            request.Adapt(existingItem);
            var updatedItem = await _itemRepository.SaveAsync(existingItem);
            return updatedItem.Adapt<ItemResponse>();
        }

        public async Task DeleteItemAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateItemOwnershipAsync(id, userId);

            var existingItem = await _itemRepository.FindByIdAsync(id)
                               ?? throw new AppException("ITEM_NOT_FOUND");

            await _itemRepository.DeleteAsync(existingItem);
        }

        public async Task<List<ItemResponse>> GetItemsByCategoryIdAsync(string categoryId)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(categoryId, userId);

            var items = await _itemRepository.FindByCategoryIdAsync(categoryId);
            return items.Adapt<List<ItemResponse>>();
        }

        public async Task<double> GetTotalAmountByTypeAsync(string type, int year, int month)
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            var actualMonth = month;
            var actualYear = year;
            // Similar logic can be implemented based on caculateMonthYearForRequest if needed.
            
            var rangeDate = await _monthRangeService.GetRangeForSpecificMonthAsync(user.StartDay, actualYear, actualMonth);
            return await _itemRepository.GetSumByTypeAndDateRangeAsync(userId, type, rangeDate.Start, rangeDate.End);
        }

        public async Task<double> GetTotalAmountByCategoryAsync(string categoryId, int year, int month)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(categoryId, userId);

            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            var actualMonth = month;
            var actualYear = year;
            
            var rangeDate = await _monthRangeService.GetRangeForSpecificMonthAsync(user.StartDay, actualYear, actualMonth);
            return await _itemRepository.GetSumByCategoryIdAndRangeAsync(userId, categoryId, rangeDate.Start, rangeDate.End);
        }

        public async Task<List<ItemResponse>> GetItemsByCategoryAndRangeAsync(string categoryId, int year, int month)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(categoryId, userId);

            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            var actualMonth = month;
            var actualYear = year;
            
            var rangeDate = await _monthRangeService.GetRangeForSpecificMonthAsync(user.StartDay, actualYear, actualMonth);

            var items = await _itemRepository.FindByUserIdAndCategoryIdAndCreatedAtBetweenOrderByCreatedAtDescAsync(
                userId, categoryId, rangeDate.Start, rangeDate.End);

            return items.Adapt<List<ItemResponse>>();
        }
    }
}