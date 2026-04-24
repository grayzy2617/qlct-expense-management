using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.DTOs.Saving.Request;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("savings")]
    public class SavingController : ControllerBase
    {
        private readonly ISavingService _savingService;

        public SavingController(ISavingService savingService)
        {
            _savingService = savingService;
        }

        // 1. Lấy danh sách (Mặc định lấy Ongoing nếu không truyền param)
        [HttpGet]
        public async Task<IActionResult> GetSavings([FromQuery] bool status = true)
        {
            var response = await _savingService.GetSavingsByStatusAsync(status);
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy danh sách mục tiêu thành công", Data = response });
        }

        // 2. Lấy chi tiết mục tiêu
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSavingById(string id)
        {
            var response = await _savingService.GetSavingByIdAsync(id);
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy chi tiết mục tiêu thành công", Data = response });
        }

        // 3. Tạo mới mục tiêu
        [HttpPost]
        public async Task<IActionResult> CreateSaving([FromBody] SavingCreateRequest request)
        {
            var response = await _savingService.CreateSavingAsync(request);
            return Ok(new ApiResponse { Code = 1001, Message = "Tạo mục tiêu tích lũy thành công", Data = response });
        }

        // 4. Cập nhật mục tiêu
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSaving(string id, [FromBody] SavingUpdateRequest request)
        {
            var response = await _savingService.UpdateSavingAsync(id, request);
            return Ok(new ApiResponse { Code = 1001, Message = "Cập nhật mục tiêu thành công", Data = response });
        }

        // 5. Đổi trạng thái (Hoàn thành <-> Mở lại)
        // Dùng HttpPatch vì chỉ sửa 1 phần dữ liệu (status)
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            await _savingService.ToggleStatusAsync(id);
            return Ok(new ApiResponse { Code = 1001, Message = "Cập nhật trạng thái thành công", Data = null });
        }

        // 6. Xóa mục tiêu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSaving(string id)
        {
            await _savingService.DeleteSavingAsync(id);
            return Ok(new ApiResponse { Code = 1001, Message = "Xóa mục tiêu thành công", Data = null });
        }
    }
}
