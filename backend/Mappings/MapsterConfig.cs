using Mapster;
using QLCT.Entities;
using QLCT.DTOs.Admin.Response;
using QLCT.DTOs.Category.Response;
using QLCT.DTOs.Item.Response;
using QLCT.DTOs.Saving.Response;
using QLCT.DTOs.User.Response;

namespace QLCT.Mappings;

public static class MapsterConfig
{
    public static void RegisterMappings()
    {
        // Example configuration for Saving -> SavingResponse
        // In Java DTO, categoryId was populated with the Saving's own ID
        TypeAdapterConfig<Saving, SavingResponse>.NewConfig()
            .Map(dest => dest.CategoryId, src => src.Id);

        // General entities mappings, in case navigational properties names mismatch.
        // For Item -> ItemResponse
        TypeAdapterConfig<Item, ItemResponse>.NewConfig()
            .Map(dest => dest.CategoryID, src => src.CategoryId) // Adjust depending on C# entity property names
            .Map(dest => dest.UserID, src => src.UserId);

        // For Category -> CategoryResponse
        TypeAdapterConfig<Category, CategoryResponse>.NewConfig()
            .Map(dest => dest.UserID, src => src.UserId);
    }
}
