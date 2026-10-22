using MenuApi.Data;
using MenuApi.Models;
using MenuApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Controllers;

[ApiController]
[Authorize]
[Route("api/products")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    private const string Menu = "/products";

    [HttpGet, RequirePrivilege(Menu, PrivilegeAction.Read)]
    public async Task<List<ProductView>> List() =>
        await (from p in db.Products
               join c in db.Categories on p.CategoryId equals c.Id into cj
               from c in cj.DefaultIfEmpty()
               orderby p.Id
               select new ProductView(p.Id, p.Name, p.Price, p.Stock, p.CategoryId, c.Name)).ToListAsync();

    [HttpPost, RequirePrivilege(Menu, PrivilegeAction.Create)]
    public async Task<ActionResult<Product>> Create(ProductDto dto)
    {
        var p = new Product { Name = dto.Name.Trim(), Price = dto.Price, Stock = dto.Stock, CategoryId = dto.CategoryId };
        db.Products.Add(p);
        await db.SaveChangesAsync();
        return p;
    }

    [HttpPut("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Update)]
    public async Task<IActionResult> Update(int id, ProductDto dto)
    {
        var p = await db.Products.FindAsync(id);
        if (p == null) return NotFound();
        p.Name = dto.Name.Trim();
        p.Price = dto.Price;
        p.Stock = dto.Stock;
        p.CategoryId = dto.CategoryId;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Delete)]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p == null) return NotFound();
        db.Products.Remove(p);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
