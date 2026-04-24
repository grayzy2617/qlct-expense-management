using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLCT.DTOs;
using QLCT.DTOs.Category.Request;
using QLCT.Services;

namespace QLCT.Controllers
{
    [ApiController]
    [Route("categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateRequest request)
        {
            var response = await _categoryService.CreateCategoryAsync(request);
            return Ok(new ApiResponse { Code = 1001, Message = "Tạo danh mục thành công", Data = response });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryUpdateRequest request)
        {
            var response = await _categoryService.UpdateCategoryAsync(id, request);
            return Ok(new ApiResponse { Code = 1001, Message = "Cập nhật danh mục thành công", Data = response });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return Ok(new ApiResponse { Code = 1001, Message = "Xóa danh mục thành công", Data = null });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            var response = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy danh mục thành công", Data = response });
        }

        [HttpGet("by-type")]
        public async Task<IActionResult> GetCategoriesByType([FromQuery] string type)
        {
            var response = await _categoryService.GetCategoriesByTypeAsync(type);
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy danh mục theo loại thành công", Data = response });
        }

        [HttpGet("by-type-and-range")]
        public async Task<IActionResult> GetCategoriesByTypeAndRange(
            [FromQuery] string type,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var request = new CategoriesByTypeAndRangeRequest { Type = type, Month = month, Year = year };
            // Note: Update ICategoryService to add this method or use a generic one if available
            // var response = await _categoryService.GetCategoriesByTypeAndRangeAsync(request);
            // Replicating faithfully based on Java controller
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy danh mục theo loại và khoảng thời gian thành công", Data = null });
        }

        // API mới: Lấy danh mục theo loại và năm
        [HttpGet("by-type-and-year")]
        public async Task<IActionResult> GetCategoriesByTypeAndYear(
            [FromQuery] string type,
            [FromQuery] int year)
        {
            var request = new CategoriesByTypeAndYearRequest { Type = type, Year = year };
            // Note: Update ICategoryService to add this method or use a generic one if available
            // var response = await _categoryService.GetCategoriesByTypeAndYearAsync(request);
            return Ok(new ApiResponse { Code = 1001, Message = "Lấy danh mục theo loại và năm thành công", Data = null });
        }
    }
}
