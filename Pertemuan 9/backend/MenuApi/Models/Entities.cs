using System.ComponentModel.DataAnnotations.Schema;

namespace MenuApi.Models;

[Table("table_user")]
public class AppUser
{
    [Column("id")] public int Id { get; set; }
    [Column("username")] public string Username { get; set; } = "";
    [Column("password_hash")] public string PasswordHash { get; set; } = "";
    [Column("full_name")] public string FullName { get; set; } = "";
    [Column("is_active")] public bool IsActive { get; set; } = true;
}

[Table("table_menu")]
public class Menu
{
    [Column("id")] public int Id { get; set; }
    [Column("menu_name")] public string MenuName { get; set; } = "";
    [Column("url_menu")] public string UrlMenu { get; set; } = "#";
    /// <summary>0 = menu parent, selain itu = id menu parent.</summary>
    [Column("parent_id")] public int ParentId { get; set; }
    [Column("sort_order")] public int SortOrder { get; set; }
    [Column("is_active")] public bool IsActive { get; set; } = true;
}

[Table("table_privilege_user")]
public class PrivilegeUser
{
    [Column("id")] public int Id { get; set; }
    [Column("id_user")] public int IdUser { get; set; }
    [Column("id_menu")] public int IdMenu { get; set; }
    [Column("is_active")] public bool IsActive { get; set; } = true;
    [Column("can_read")] public bool CanRead { get; set; }
    [Column("can_create")] public bool CanCreate { get; set; }
    [Column("can_update")] public bool CanUpdate { get; set; }
    [Column("can_delete")] public bool CanDelete { get; set; }
}

[Table("table_category")]
public class Category
{
    [Column("id")] public int Id { get; set; }
    [Column("name")] public string Name { get; set; } = "";
}

[Table("table_product")]
public class Product
{
    [Column("id")] public int Id { get; set; }
    [Column("name")] public string Name { get; set; } = "";
    [Column("price")] public decimal Price { get; set; }
    [Column("stock")] public int Stock { get; set; }
    [Column("category_id")] public int? CategoryId { get; set; }
}
