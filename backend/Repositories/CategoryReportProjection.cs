using System;

namespace QLCT.Repositories
{
    public class CategoryReportProjection
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double LimitAmount { get; set; }
        public double SpentSum { get; set; }
    }
}