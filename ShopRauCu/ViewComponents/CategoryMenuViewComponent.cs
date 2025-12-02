using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopRauCu.Models;

public class CategoryMenuViewComponent : ViewComponent
{
    private readonly AppDbContext _context;

    public CategoryMenuViewComponent(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var categories = await _context.Categories
            .Where(c => c.ParentId == null)
            .Include(c => c.InverseParent)
            .OrderBy(c => c.Title)
            .ToListAsync();

        return View(categories);
    }
}
