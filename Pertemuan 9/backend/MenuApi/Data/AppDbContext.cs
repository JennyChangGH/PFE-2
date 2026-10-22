using MenuApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<PrivilegeUser> Privileges => Set<PrivilegeUser>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
}
