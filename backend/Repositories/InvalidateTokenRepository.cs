using QLCT.Data;
using QLCT.Entities;

namespace QLCT.Repositories
{
    public class InvalidateTokenRepository : Repository<InvalidateToken>, IInvalidateTokenRepository
    {
        public InvalidateTokenRepository(AppDbContext context) : base(context)
        {
        }
    }
}