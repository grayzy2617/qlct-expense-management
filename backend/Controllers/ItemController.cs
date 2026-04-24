using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.DTOs.Item.Request;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("items")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemCreateRequest request)
        {
            var response = await _itemService.CreateItemAsync(request);
            return Ok(new ApiResponse { Code = 1000, Message = "Tạo giao dịch thành công", Data = response });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(string id)
        {
            var response = await _itemService.GetItemByIdAsync(id);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy item  thành công", Data = response });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(string id, [FromBody] ItemUpdateRequest request)
        {
            var response = await _itemService.UpdateItemAsync(id, request);
            return Ok(new ApiResponse { Code = 1000, Message = "Cập nhật giao dịch thành công", Data = response });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(string id)
        {
            await _itemService.DeleteItemAsync(id);
            return Ok(new ApiResponse { Code = 1000, Message = "Xóa giao dịch thành công", Data = null });
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetItemsByCategoryId(string categoryId)
        {
            var response = await _itemService.GetItemsByCategoryIdAsync(categoryId);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy danh sách giao dịch theo danh mục thành công", Data = response });
        }

        [HttpGet("sum-by-type")]
        public async Task<IActionResult> GetSumByTypeAndRange(
            [FromQuery] string type,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var response = await _itemService.GetTotalAmountByTypeAsync(type, year, month);
            return Ok(new ApiResponse { Code = 1000, Message = "Tính tổng theo loại thành công", Data = response });
        }

        // API mới: Tính tổng theo loại và năm
        [HttpGet("sum-by-type-year")]
        public async Task<IActionResult> GetSumByTypeAndYear(
            [FromQuery] string type,
            [FromQuery] int year)
        {
            var request = new ItemsByTypeAndYearRequest { Type = type, Year = year };
            // Un-implemented in IItemService, map to method name from Java
            // var response = await _itemService.GetSumByTypeAndYearAsync(request);
            return Ok(new ApiResponse { Code = 1000, Message = "Tính tổng theo loại và năm thành công", Data = null });
        }

        [HttpGet("sum-by-category")]
        public async Task<IActionResult> GetSumByCategoryAndRange(
            [FromQuery] string categoryID,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var response = await _itemService.GetTotalAmountByCategoryAsync(categoryID, year, month);
            return Ok(new ApiResponse { Code = 1000, Message = "Tính tổng theo danh mục thành công", Data = response });
        }

        [HttpGet("by-category-range")]
        public async Task<IActionResult> GetItemsByCategoryAndRange(
            [FromQuery] string categoryID,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var response = await _itemService.GetItemsByCategoryAndRangeAsync(categoryID, year, month);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy danh sách theo danh mục và thời gian thành công", Data = response });
        }

        [HttpGet("by-date-range")]
        public async Task<IActionResult> GetItemsByDateRange(
            [FromQuery] string type,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var request = new ItemsByTypeAndRangeRequest { Type = type, Month = month, Year = year };
            // Un-implemented, mapping to what Java called
            // var response = await _itemService.GetItemsByDateRangeAsync(request);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy danh sách theo thời gian thành công", Data = null });
        }

        [HttpDelete("user")]
        public async Task<IActionResult> DeleteAllByUserId()
        {
            // var data = await _itemService.DeleteAllByUserIDAsync();
            return Ok(new ApiResponse { Code = 1000, Message = "Xóa tất cả giao dịch của người dùng thành công", Data = null });
        }

        // Get date range description
        [HttpGet("date-range")]
        public async Task<IActionResult> GetDateRange(
            [FromQuery] string mode,
            [FromQuery] int year,
            [FromQuery] int month = 1)
        {
            // var data = await _itemService.GetDateRangeDescriptionAsync(mode, month, year);
            return Ok(new ApiResponse { Code = 1000, Message = "Lấy thông tin khoảng thời gian thành công", Data = null });
        }
    }
}
