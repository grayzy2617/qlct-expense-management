using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using QLCT.DTOs.MonthRange.Request;
using QLCT.DTOs.RangeDate;
using QLCT.Exceptions;
using QLCT.Repositories;

namespace QLCT.Services
{
    public interface IMonthRangeService
    {
        Task UpdateCustomMonthsAsync(MonthUpdateBatchRequest request);
        Task<RangeDate> GetRangeForSpecificMonthAsync(int startDay, int year, int month);
        Task<int> GetStartDayOfUserAsync();
    }

    public class MonthRangeService : IMonthRangeService
    {
        private readonly IUserRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MonthRangeService(
            IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                   ?? throw new AppException("UNAUTHORIZED");
        }

        public async Task UpdateCustomMonthsAsync(MonthUpdateBatchRequest request)
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");

            user.StartDay = request.StartDay;
            user.IsCalcByNextMonth = request.TargetMonth > request.BaseMonth;

            await _userRepository.SaveAsync(user);
        }

        public Task<RangeDate> GetRangeForSpecificMonthAsync(int startDay, int year, int month)
        {
            var start = CalculateStandardDate(year, month, startDay);
            
            var nextMonth = month == 12 ? 1 : month + 1;
            var nextYear = month == 12 ? year + 1 : year;
            var end = CalculateStandardDate(nextYear, nextMonth, startDay).AddDays(-1);

            return Task.FromResult(new RangeDate 
            { 
                Start = start.Date, 
                End = end.Date.AddDays(1).AddTicks(-1) // End of the day 23:59:59
            });
        }

        private DateTime CalculateStandardDate(int year, int month, int configStartDay)
        {
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var actualDay = Math.Min(configStartDay, daysInMonth);
            return new DateTime(year, month, actualDay);
        }

        public async Task<int> GetStartDayOfUserAsync()
        {
            var userId = GetCurrentUserId();
            var user = await _userRepository.FindByIdAsync(userId)
                       ?? throw new AppException("USER_NOT_FOUND");
            
            return user.StartDay;
        }
    }
}