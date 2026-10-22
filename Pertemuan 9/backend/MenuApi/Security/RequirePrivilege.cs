using MenuApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Security;

public enum PrivilegeAction { Read, Create, Update, Delete }

/// <summary>
/// Memeriksa hak akses user (dari table_privilege_user) pada menu dengan url tertentu.
/// Contoh: [RequirePrivilege("/products", PrivilegeAction.Create)]
/// Dicek ke database di setiap request, jadi perubahan hak akses langsung berlaku.
/// </summary>
public class RequirePrivilegeAttribute : TypeFilterAttribute
{
    public RequirePrivilegeAttribute(string menuUrl, PrivilegeAction action) : base(typeof(PrivilegeFilter))
    {
        Arguments = new object[] { menuUrl, action };
    }
}

public class PrivilegeFilter(AppDbContext db, string menuUrl, PrivilegeAction action) : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        if (context.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userId = context.HttpContext.User.GetUserId();

        var priv = await (
            from p in db.Privileges
            join m in db.Menus on p.IdMenu equals m.Id
            join u in db.Users on p.IdUser equals u.Id
            where p.IdUser == userId && m.UrlMenu == menuUrl
                  && p.IsActive && m.IsActive && u.IsActive
            select p).FirstOrDefaultAsync();

        var allowed = priv != null && priv.CanRead && action switch
        {
            PrivilegeAction.Read => true,
            PrivilegeAction.Create => priv.CanCreate,
            PrivilegeAction.Update => priv.CanUpdate,
            PrivilegeAction.Delete => priv.CanDelete,
            _ => false
        };

        if (!allowed) context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}
