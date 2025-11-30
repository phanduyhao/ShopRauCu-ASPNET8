using Microsoft.AspNetCore.Mvc;
using ShopRauCu.Filters;

namespace ShopRauCu.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AdminAuthorize]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.dashboard = "active";
            return View();
        }
    }
}
