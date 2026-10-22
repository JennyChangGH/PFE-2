using MenuApi.Data;
using MenuApi.Models;
using MenuApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Controllers;

[ApiController]
[Authorize]
[Route("api/privileges")]
public class PrivilegesController(AppDbContext db) : ControllerBase
{
    private const string Menu = "/privileges";

    /// <summary>Matriks hak akses seorang user: semua menu halaman (bukan parent '#').</summary>
    [HttpGet("users/{userId:int}"), RequirePrivilege(Menu, PrivilegeAction.Read)]
    public async Task<ActionResult<List<PrivilegeRow>>> Get(int userId)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId)) return NotFound();

        var menus = await db.Menus.Where(m => m.IsActive).OrderBy(m => m.SortOrder).ThenBy(m => m.Id).ToListAsync();
        var privs = await db.Privileges.Where(p => p.IdUser == userId && p.IsActive)
            .ToDictionaryAsync(p => p.IdMenu);
        var parentNames = menus.ToDictionary(m => m.Id, m => m.MenuName);

        return menus
            .Where(m => m.UrlMenu != "#")
            .OrderBy(m => m.ParentId == 0 ? m.SortOrder : menus.First(x => x.Id == m.ParentId).SortOrder)
            .ThenBy(m => m.SortOrder)
            .Select(m =>
            {
                privs.TryGetValue(m.Id, out var p);
                var parent = m.ParentId != 0 && parentNames.TryGetValue(m.ParentId, out var n) ? n : "-";
                return new PrivilegeRow(m.Id, m.MenuName, parent,
                    p?.CanRead ?? false, p?.CanCreate ?? false, p?.CanUpdate ?? false, p?.CanDelete ?? false);
            })
            .ToList();
    }

    /// <summary>Simpan matriks hak akses seorang user (upsert per menu).</summary>
    [HttpPut("users/{userId:int}"), RequirePrivilege(Menu, PrivilegeAction.Update)]
    public async Task<IActionResult> Save(int userId, List<PrivilegeSave> rows)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId)) return NotFound();

        var validMenuIds = (await db.Menus.Where(m => m.UrlMenu != "#").Select(m => m.Id).ToListAsync()).ToHashSet();
        var existing = await db.Privileges.Where(p => p.IdUser == userId).ToDictionaryAsync(p => p.IdMenu);

        foreach (var r in rows.Where(r => validMenuIds.Contains(r.MenuId)))
        {
            // create/update/delete tanpa read tidak ada artinya
            var read = r.Read || r.Create || r.Update || r.Delete;
            if (!existing.TryGetValue(r.MenuId, out var p))
            {
                if (!read) continue;
                p = new PrivilegeUser { IdUser = userId, IdMenu = r.MenuId };
                db.Privileges.Add(p);
            }
            p.CanRead = read;
            p.CanCreate = r.Create;
            p.CanUpdate = r.Update;
            p.CanDelete = r.Delete;
            p.IsActive = read;
        }

        await db.SaveChangesAsync();
        return NoContent();
    }
}
