using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Role?> FindByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.Name == name);
        }
    }
}