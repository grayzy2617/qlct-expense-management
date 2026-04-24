using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.DTOs.MonthRange.Request;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("months")]
    public class MonthRangeController : ControllerBase
    {
        private readonly IMonthRangeService _monthRangeService;

        public MonthRangeController(IMonthRangeService monthRangeService)
        {
            _monthRangeService = monthRangeService;
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateMonths([FromBody] MonthUpdateBatchRequest request)
        {
            await _monthRangeService.UpdateCustomMonthsAsync(request);
            return Ok(new ApiResponse { Code = 1000, Message = "Cập nhật ngày bắt đầu thành công", Data = null });
        }

        [HttpGet("start-day")]
        public async Task<IActionResult> GetStartDay()
        {
            int startDay = await _monthRangeService.GetStartDayOfUserAsync();
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy ngày bắt đầu thành công", Data = startDay });
        }
    }
}
