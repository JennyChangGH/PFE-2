using MenuApi.Data;
using MenuApi.Models;
using MenuApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    private const string Menu = "/categories";

    // Produk juga butuh daftar kategori untuk dropdown, jadi read boleh dari menu produk.
    [HttpGet]
    public async Task<ActionResult<List<Category>>> List() => await db.Categories.OrderBy(c => c.Name).ToListAsync();

    [HttpPost, RequirePrivilege(Menu, PrivilegeAction.Create)]
    public async Task<ActionResult<Category>> Create(CategoryDto dto)
    {
        var c = new Category { Name = dto.Name.Trim() };
        db.Categories.Add(c);
        await db.SaveChangesAsync();
        return c;
    }

    [HttpPut("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Update)]
    public async Task<IActionResult> Update(int id, CategoryDto dto)
    {
        var c = await db.Categories.FindAsync(id);
        if (c == null) return NotFound();
        c.Name = dto.Name.Trim();
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Delete)]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Categories.FindAsync(id);
        if (c == null) return NotFound();
        db.Categories.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
