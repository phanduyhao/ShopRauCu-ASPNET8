using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopRauCu.Models;

namespace ShopRauCu.Controllers
{
    public class PageController : Controller
    {

        private readonly AppDbContext _context;

        public PageController(AppDbContext context)
        {
            _context = context;
        }
        public IActionResult About()
        {
            return View();
        }
        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Submit(Feedback model)
        {
            model.CreatedAt = DateTime.Now;
            model.UpdatedAt = DateTime.Now;

            _context.Feedbacks.Add(model);
            _context.SaveChanges();

            TempData["success"] = "Cảm ơn bạn! Phản hồi của bạn đã được gửi thành công.";

            return RedirectToAction("Contact");
        }
    }
}
