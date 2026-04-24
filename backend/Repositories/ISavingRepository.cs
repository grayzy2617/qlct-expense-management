using System.Collections.Generic;
using System.Threading.Tasks;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public interface ISavingRepository : IRepository<Saving>
    {
        Task<bool> ExistsByIdAndViewInReportIsTrueAsync(string id);
        Task<List<Saving>> FindByUserIdAndStatusAsync(string userId, bool status);
        Task<int> CountByUserIdAsync(string userId);
        Task<bool> DeleteAllByUserIdAsync(string userId);
    }
}