using Microsoft.AspNetCore.Mvc;
using ShopRauCu.Filters;
using ShopRauCu.Models;
using System.Linq;


namespace ShopRauCu.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AdminAuthorize]
    public class ProductManagementController : Controller
    {
        private readonly AppDbContext _db = new AppDbContext();

        public IActionResult Index()
        {
            var products = _db.Products
                                .OrderByDescending(c => c.CreatedAt)
                                .ToList();

            ViewBag.product = "active"; // highlight menu
            ViewBag.Category = _db.Categories
                                .Where(m => m.ParentId != null)
                                .OrderByDescending(c => c.Id)
                                .ToList();

            return View(products);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Product product, IFormFile Thumb)
        {
            try
            {
                // ========== Xử lý upload file ==========
                if (Thumb != null && Thumb.Length > 0)
                {
                    var fileName = Path.GetFileName(Thumb.FileName);
                    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/products");

                    if (!Directory.Exists(uploadPath))
                        Directory.CreateDirectory(uploadPath);

                    var filePath = Path.Combine(uploadPath, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        Thumb.CopyTo(stream);
                    }

                    // Lưu đường dẫn ảnh
                    product.Thumb = "/uploads/products/" + fileName;
                }

                // ========== Set các trường còn lại ==========
                product.CreatedAt = DateTime.Now;
                product.UpdatedAt = DateTime.Now;

                _db.Products.Add(product);
                _db.SaveChanges();

                TempData["success"] = "Thêm mới sản phẩm thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết ra TempData
                string detailedError =
                    "Message: " + ex.Message + "<br>" +
                    "Inner: " + (ex.InnerException?.Message ?? "Không có") + "<br>" +
                    "StackTrace: <pre>" + ex.StackTrace + "</pre>";

                TempData["error"] = detailedError;

                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, Product product, IFormFile Thumb)
        {
            try
            {
                // Lấy sản phẩm từ DB
                var existingProduct = _db.Products.FirstOrDefault(p => p.Id == id);
                if (existingProduct == null)
                {
                    TempData["error"] = "Sản phẩm không tồn tại!";
                    return RedirectToAction("Index");
                }

                // ========== Xử lý upload file mới ==========
                if (Thumb != null && Thumb.Length > 0)
                {
                    var fileName = Path.GetFileName(Thumb.FileName);
                    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/products");

                    if (!Directory.Exists(uploadPath))
                        Directory.CreateDirectory(uploadPath);

                    var filePath = Path.Combine(uploadPath, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        Thumb.CopyTo(stream);
                    }

                    // Cập nhật đường dẫn ảnh
                    existingProduct.Thumb = "/uploads/products/" + fileName;
                }

                // ========== Cập nhật các trường ==========
                existingProduct.Title = product.Title;
                existingProduct.Slug = product.Slug;
                existingProduct.CategoryId = product.CategoryId;
                existingProduct.OriginPrice = product.OriginPrice;
                existingProduct.DiscountPrice = product.DiscountPrice;
                existingProduct.Amounts = product.Amounts;
                existingProduct.IsHot = product.IsHot;
                existingProduct.IsActive = product.IsActive;
                existingProduct.Desc = product.Desc;
                existingProduct.UpdatedAt = DateTime.Now;

                _db.Products.Update(existingProduct);
                _db.SaveChanges();

                TempData["success"] = "Cập nhật sản phẩm thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                string detailedError =
                    "Message: " + ex.Message + "<br>" +
                    "Inner: " + (ex.InnerException?.Message ?? "Không có") + "<br>" +
                    "StackTrace: <pre>" + ex.StackTrace + "</pre>";

                TempData["error"] = detailedError;
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            var product = _db.Products.FirstOrDefault(c => c.Id == id);
            if (product == null)
                return NotFound();

            _db.Products.Remove(product);
            _db.SaveChanges();

            TempData["success"] = "Xóa sản phẩm thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}
