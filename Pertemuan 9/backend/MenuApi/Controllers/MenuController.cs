using MenuApi.Data;
using MenuApi.Models;
using MenuApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Controllers;

[ApiController]
[Authorize]
[Route("api/menu")]
public class MenuController(AppDbContext db) : ControllerBase
{
    /// <summary>
    /// Menu dinamis milik user yang login (parent -> child).
    /// Child tampil bila user punya privilege read aktif; parent tampil bila punya child yang tampil.
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<List<MenuNode>>> My()
    {
        var userId = User.GetUserId();

        var privs = await db.Privileges
            .Where(p => p.IdUser == userId && p.IsActive && p.CanRead)
            .ToDictionaryAsync(p => p.IdMenu);

        var menus = await db.Menus
            .Where(m => m.IsActive)
            .OrderBy(m => m.SortOrder).ThenBy(m => m.Id)
            .ToListAsync();

        MenuNode ToNode(Menu m, List<MenuNode> children)
        {
            PrivilegeFlags? flags = privs.TryGetValue(m.Id, out var p)
                ? new PrivilegeFlags(p.CanRead, p.CanCreate, p.CanUpdate, p.CanDelete)
                : null;
            return new MenuNode(m.Id, m.MenuName, m.UrlMenu, flags, children);
        }

        var tree = new List<MenuNode>();
        foreach (var parent in menus.Where(m => m.ParentId == 0))
        {
            var children = menus
                .Where(c => c.ParentId == parent.Id && privs.ContainsKey(c.Id))
                .Select(c => ToNode(c, []))
                .ToList();

            var isGroup = parent.UrlMenu == "#";
            if (isGroup ? children.Count > 0 : privs.ContainsKey(parent.Id))
                tree.Add(ToNode(parent, children));
        }

        return tree;
    }
}
