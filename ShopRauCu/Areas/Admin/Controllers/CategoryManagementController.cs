using Microsoft.AspNetCore.Mvc;
using ShopRauCu.Filters;
using ShopRauCu.Models;
using System.Linq;

namespace ShopRauCu.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AdminAuthorize]
    public class CategoryManagementController : Controller
    {
        private readonly AppDbContext _db = new AppDbContext();

        // GET: Admin/CategoryManagement
        public ActionResult Index()
        {
            var categories = _db.Categories
                                .OrderByDescending(c => c.CreatedAt)
                                .ToList();

            ViewBag.category = "active"; // highlight menu
            ViewBag.CateParents = _db.Categories.Where(m => m.ParentId == null).ToList();
            return View(categories);
        }

        // POST: Admin/CategoryManagement/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Category category, IFormFile ThumbFile)
        {
            try
            {

                // Upload file nếu có
                if (ThumbFile != null && ThumbFile.Length > 0)
                {
                    var fileName = Path.GetFileName(ThumbFile.FileName);
                    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/categories");

                    if (!Directory.Exists(uploadPath))
                        Directory.CreateDirectory(uploadPath);

                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ThumbFile.CopyTo(stream);
                    }

                    category.Thumb = "/uploads/categories/" + fileName;
                }

                category.CreatedAt = DateTime.Now;
                category.UpdatedAt = DateTime.Now;

                _db.Categories.Add(category);
                _db.SaveChanges();

                TempData["success"] = "Thêm mới danh mục thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                // Lỗi chi tiết
                string detailedError =
                    "Message: " + ex.Message + "<br>" +
                    "Inner: " + (ex.InnerException?.Message ?? "Không có") + "<br>" +
                    "StackTrace: <pre>" + ex.StackTrace + "</pre>";

                TempData["error"] = detailedError;

                return RedirectToAction(nameof(Index));
            }
        }


        // POST: Admin/CategoryManagement/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, Category updatedCategory, IFormFile thumb)
        {
            var category = _db.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
                return NotFound();
            // Check title bị trùng
            bool titleExists = _db.Categories.Any(c => c.Title == updatedCategory.Title && c.Id != id);
            if (titleExists)
            {
                TempData["error"] = "Danh mục đã tồn tại!";
                return RedirectToAction(nameof(Index));
            }

            // ========== XỬ LÝ UPLOAD FILE ==========
            if (thumb != null && thumb.Length > 0)
            {
                var fileName = Path.GetFileName(thumb.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/categories");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    thumb.CopyTo(stream);
                }

                // cập nhật ảnh mới
                category.Thumb = "/uploads/categories/" + fileName;
            }
            // Nếu không upload thì giữ ảnh cũ → không làm gì

            // ========== CẬP NHẬT CÁC TRƯỜNG KHÁC ==========
            category.Title = updatedCategory.Title;
            category.Slug = updatedCategory.Slug;
            category.ParentId = updatedCategory.ParentId;
            category.UpdatedAt = DateTime.Now;

            _db.SaveChanges();

            TempData["success"] = "Cập nhật danh mục thành công!";
            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/CategoryManagement/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            var category = _db.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
                return NotFound();

            // Optional: kiểm tra xem category có con hay product chưa
            if (category.InverseParent.Any() || category.Products.Any())
            {
                TempData["error"] = "Không thể xóa danh mục vì còn danh mục con hoặc sản phẩm!";
                return RedirectToAction(nameof(Index));
            }

            _db.Categories.Remove(category);
            _db.SaveChanges();

            TempData["success"] = "Xóa danh mục thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}
