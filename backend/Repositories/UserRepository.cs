using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByUsernameAsync(string name)
        {
            return await _dbSet.AnyAsync(u => u.Username == name);
        }

        public async Task<User?> FindByUsernameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username == name);
        }
    }
}