using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopRauCu.Filters;
using ShopRauCu.Models;
using System.Text;
using System.Security.Cryptography;

namespace ShopRauCu.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AdminAuthorize]
    public class UserManagentController : Controller
    {
        private readonly AppDbContext _db = new AppDbContext();

        // Trang admin: trả về toàn bộ user
        public ActionResult UserAdmin()
        {
            var users = _db.Users
                           .Where(u => u.Role == "Admin")
                           .ToList();
            ViewBag.userAdmin = "active";
            return View(users);
        }

        // Trang user: chỉ trả về user có role = "User"
        public ActionResult User()
        {
            var users = _db.Users
                           .Where(u => u.Role == "User")
                           .ToList();
            ViewBag.user = "active";

            return View(users);
        }

        // POST: UserManagent/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(User user)
        {

            user.CreatedAt = DateTime.Now;
            user.Password = HashPassword(user.Password);
            _db.Users.Add(user);
            _db.SaveChanges();

            TempData["success"] = "Thêm mới tài khoản Admin thành công!";
            return RedirectToAction(nameof(UserAdmin));    // <<< cũng về lại trang hiện tại
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, User updatedUser)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == id);
            updatedUser.Password = user.Password;
            if (user == null)
                return NotFound();

            // Check email trùng (không tính user hiện tại)
            bool emailExists = _db.Users.Any(x => x.Email == updatedUser.Email && x.Id != id);
            if (emailExists)
            {
                TempData["modelErrors"] = System.Text.Json.JsonSerializer.Serialize(
                    new[] {
                new {
                    Field = "Email",
                    Errors = new List<string> { "Email đã tồn tại!" }
                }
                    }
                );
                return RedirectToAction(nameof(UserAdmin));
            }

            // Cập nhật thông tin
            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.Phone = updatedUser.Phone;

            // Nếu người dùng nhập mật khẩu mới → hash mật khẩu
            if (!string.IsNullOrWhiteSpace(updatedUser.Password))
            {
                user.Password = HashPassword(updatedUser.Password);
            }

            _db.SaveChanges();

            TempData["success"] = "Cập nhật tài khoản thành công!";
            return RedirectToAction(nameof(UserAdmin));
        }



        // POST: UserManagent/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == id);

            if (user == null)
                return NotFound();

            _db.Users.Remove(user);
            _db.SaveChanges();

            TempData["success"] = "Xóa tài khoản thành công!";
            return RedirectToAction(nameof(UserAdmin));
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
