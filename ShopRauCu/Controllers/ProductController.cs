using Microsoft.AspNetCore.Mvc;

namespace ShopRauCu.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
