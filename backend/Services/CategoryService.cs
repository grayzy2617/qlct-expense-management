using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using QLCT.DTOs.Category.Request;
using QLCT.DTOs.Category.Response;
using QLCT.Entities;
using QLCT.Exceptions;
using QLCT.Repositories;
using Mapster;

namespace QLCT.Services
{
    public interface ICategoryService
    {
        Task<CategoryResponse> CreateCategoryAsync(CategoryCreateRequest request);
        Task<CategoryResponse> UpdateCategoryAsync(string id, CategoryUpdateRequest request);
        Task DeleteCategoryAsync(string id);
        Task<CategoryResponse> GetCategoryByIdAsync(string id);
        Task<List<CategoryResponse>> GetCategoriesByTypeAsync(string type);
    }

    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CategoryService(
            ICategoryRepository categoryRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _categoryRepository = categoryRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                   ?? throw new AppException("UNAUTHORIZED");
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

        public async Task<CategoryResponse> CreateCategoryAsync(CategoryCreateRequest request)
        {
            var userId = GetCurrentUserId();

            var categoryEntity = request.Adapt<Category>();
            categoryEntity.UserId = userId; // Ensure it's set correctly

            var savedCategory = await _categoryRepository.SaveAsync(categoryEntity);
            return savedCategory.Adapt<CategoryResponse>();
        }

        public async Task<CategoryResponse> UpdateCategoryAsync(string id, CategoryUpdateRequest request)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(id, userId);

            var existingCategory = await _categoryRepository.FindByIdAsync(id)
                                   ?? throw new AppException("CATEGORY_NOT_FOUND");

            request.Adapt(existingCategory);

            var updatedCategory = await _categoryRepository.SaveAsync(existingCategory);
            return updatedCategory.Adapt<CategoryResponse>();
        }

        public async Task DeleteCategoryAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(id, userId);

            var existingCategory = await _categoryRepository.FindByIdAsync(id)
                                   ?? throw new AppException("CATEGORY_NOT_FOUND");

            await _categoryRepository.DeleteAsync(existingCategory);
        }

        public async Task<CategoryResponse> GetCategoryByIdAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateCategoryOwnershipAsync(id, userId);

            var existingCategory = await _categoryRepository.FindByIdAsync(id)
                                   ?? throw new AppException("CATEGORY_NOT_FOUND");

            return existingCategory.Adapt<CategoryResponse>();
        }

        public async Task<List<CategoryResponse>> GetCategoriesByTypeAsync(string type)
        {
            var userId = GetCurrentUserId();
            var categories = await _categoryRepository.FindByUserIdAndTypeAsync(userId, type);
            return categories.Adapt<List<CategoryResponse>>();
        }
    }
}