using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ShopRauCu.Models;
using System.Security.Cryptography;
using System.Text;

namespace ShopRauCu.Controllers
{
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /Auth/Register
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        // POST: /Auth/Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(string email, string name, string password, string? phone)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(password))
            {
                TempData["ErrorAuth"] = "Vui lòng điền đầy đủ thông tin!";
                return View();
            }

            // Kiểm tra email đã tồn tại
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                TempData["ErrorAuth"] = "Email đã được đăng ký!";
                return View();
            }

            var user = new User
            {
                Email = email,
                Name = name,
                Password = HashPassword(password), // hash mật khẩu
                Phone = phone,
                Role = "User",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            TempData["SuccessAuth"] = "Đăng ký thành công! Bạn có thể đăng nhập.";
            return RedirectToAction("Login");
        }

        // GET: /Auth/Login
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // POST: /Auth/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                TempData["ErrorAuth"] = "Vui lòng điền đầy đủ thông tin!";
                return View();
            }

            var hashedPassword = HashPassword(password);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.Password == hashedPassword);

            if (user == null)
            {
                TempData["ErrorAuth"] = "Email hoặc mật khẩu không đúng!";
                return View();
            }

            // Lưu session thông tin user
            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("UserName", user.Name);
            HttpContext.Session.SetString("UserRole", user.Role);

            return RedirectToAction("Index", "Home");
        }

        // GET: /Auth/Logout
        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Xóa toàn bộ session
            return RedirectToAction("Login");
        }

        // Hàm hash mật khẩu
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
