using System;
using System.Collections.Generic;

namespace ShopRauCu.Models;

public partial class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Products { get; set; } = null!;

    public string TotalMoney { get; set; } = null!;

    public int AddressId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
