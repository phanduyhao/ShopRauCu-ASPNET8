using System;
using System.Collections.Generic;

namespace ShopRauCu.Models;

public partial class Address
{
    public int Id { get; set; }

    public string Province { get; set; } = null!;

    public string District { get; set; } = null!;

    public string Address1 { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
