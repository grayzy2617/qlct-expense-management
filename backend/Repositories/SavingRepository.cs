using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class SavingRepository : Repository<Saving>, ISavingRepository
    {
        public SavingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByIdAndViewInReportIsTrueAsync(string id)
        {
            return await _dbSet.AnyAsync(s => s.Id == id && s.ViewInReport == true);
        }

        public async Task<List<Saving>> FindByUserIdAndStatusAsync(string userId, bool status)
        {
            return await _dbSet.Where(s => s.UserId == userId && s.Status == status).ToListAsync();
        }

        public async Task<int> CountByUserIdAsync(string userId)
        {
            return await _dbSet.CountAsync(s => s.UserId == userId);
        }

        public async Task<bool> DeleteAllByUserIdAsync(string userId)
        {
            var savings = await _dbSet.Where(s => s.UserId == userId).ToListAsync();
            if (savings.Any())
            {
                _dbSet.RemoveRange(savings);
                return true;
            }
            return false;
        }
    }
}