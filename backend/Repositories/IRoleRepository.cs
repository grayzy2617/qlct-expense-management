using System.Threading.Tasks;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> FindByNameAsync(string name);
    }
}