using System;
using System.Collections.Generic;

namespace ShopRauCu.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? Desc { get; set; }

    public string? Thumb { get; set; }

    public decimal OriginPrice { get; set; }

    public decimal? DiscountPrice { get; set; }

    public int Amounts { get; set; }

    public bool IsHot { get; set; }

    public bool IsActive { get; set; }

    public int CategoryId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual Category Category { get; set; } = null!;
}
