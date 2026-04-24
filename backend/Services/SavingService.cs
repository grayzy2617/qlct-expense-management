using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Mapster;
using Microsoft.AspNetCore.Http;
using QLCT.DTOs.Saving.Request;
using QLCT.DTOs.Saving.Response;
using QLCT.Entities;
using QLCT.Exceptions;
using QLCT.Repositories;

namespace QLCT.Services
{
    public interface ISavingService
    {
        Task<List<SavingResponse>> GetSavingsByStatusAsync(bool status);
        Task<SavingResponse> GetSavingByIdAsync(string id);
        Task<SavingResponse> CreateSavingAsync(SavingCreateRequest request);
        Task<SavingResponse> UpdateSavingAsync(string id, SavingUpdateRequest request);
        Task ToggleStatusAsync(string id);
        Task DeleteSavingAsync(string id);
    }

    public class SavingService : ISavingService
    {
        private readonly ISavingRepository _savingRepository;
        private readonly IUserRepository _userRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SavingService(
            ISavingRepository savingRepository,
            IUserRepository userRepository,
            IItemRepository itemRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _savingRepository = savingRepository;
            _userRepository = userRepository;
            _itemRepository = itemRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                   ?? throw new AppException("UNAUTHORIZED");
        }

        private async Task ValidateSavingOwnershipAsync(string savingId, string userId)
        {
            var saving = await _savingRepository.FindByIdAsync(savingId)
                         ?? throw new AppException("CATEGORY_NOT_FOUND");

            if (saving.UserId != userId)
            {
                throw new AppException("UNAUTHORIZED");
            }
        }

        public async Task<List<SavingResponse>> GetSavingsByStatusAsync(bool status)
        {
            var userId = GetCurrentUserId();
            var savings = await _savingRepository.FindByUserIdAndStatusAsync(userId, status);

            var result = new List<SavingResponse>();
            foreach (var saving in savings)
            {
                result.Add(await MapToResponseWithAmount(saving, userId));
            }
            return result;
        }

        public async Task<SavingResponse> GetSavingByIdAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateSavingOwnershipAsync(id, userId);

            var saving = await _savingRepository.FindByIdAsync(id)
                         ?? throw new AppException("CATEGORY_NOT_FOUND");

            return await MapToResponseWithAmount(saving, userId);
        }

        public async Task<SavingResponse> CreateSavingAsync(SavingCreateRequest request)
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            var entity = request.Adapt<Saving>();
            entity.UserId = userId;
            
            var saved = await _savingRepository.SaveAsync(entity);
            return saved.Adapt<SavingResponse>();
        }

        public async Task<SavingResponse> UpdateSavingAsync(string id, SavingUpdateRequest request)
        {
            var userId = GetCurrentUserId();
            await ValidateSavingOwnershipAsync(id, userId);

            var existingSaving = await _savingRepository.FindByIdAsync(id)
                                 ?? throw new AppException("CATEGORY_NOT_FOUND");

            request.Adapt(existingSaving);
            var updated = await _savingRepository.SaveAsync(existingSaving);

            return await MapToResponseWithAmount(updated, userId);
        }

        public async Task ToggleStatusAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateSavingOwnershipAsync(id, userId);

            var saving = await _savingRepository.FindByIdAsync(id)
                         ?? throw new AppException("CATEGORY_NOT_FOUND");

            saving.Status = !saving.Status;
            await _savingRepository.SaveAsync(saving);
        }

        public async Task DeleteSavingAsync(string id)
        {
            var userId = GetCurrentUserId();
            await ValidateSavingOwnershipAsync(id, userId);

            await _savingRepository.DeleteByIdAsync(id);
        }

        private async Task<SavingResponse> MapToResponseWithAmount(Saving saving, string userId)
        {
            var response = saving.Adapt<SavingResponse>();

            var start = DateTime.MinValue; // Use MinValue
            var end = DateTime.UtcNow.AddYears(100);

            var currentAmount = await _itemRepository.GetSumByCategoryIdAndRangeAsync(userId, saving.Id, start, end);
            response = response with { SavedAmount = currentAmount };

            return response;
        }
    }
}