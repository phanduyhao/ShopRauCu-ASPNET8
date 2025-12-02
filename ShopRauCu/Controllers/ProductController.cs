using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopRauCu.Models;
using X.PagedList;

namespace ShopRauCu.Controllers
{
    public class ProductController : Controller
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int? page)
        {
            int pageNumber = page ?? 1; // trang hiện tại
            int pageSize = 12;          // số sản phẩm mỗi trang

            var products = _context.Products
                                    .Include(m => m.Category)
                                   .Where(p => p.IsActive)
                                   .OrderByDescending(p => p.Id)
                                   .ToPagedList(pageNumber, pageSize);

            return View(products);
        }
    }
}
