using System.Threading.Tasks;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> ExistsByUsernameAsync(string name);
        Task<User?> FindByUsernameAsync(string name);
    }
}