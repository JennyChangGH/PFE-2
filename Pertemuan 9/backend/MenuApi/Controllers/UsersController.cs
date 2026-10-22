using MenuApi.Data;
using MenuApi.Models;
using MenuApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MenuApi.Controllers;

[ApiController]
[Authorize]
[Route("api/users")]
public class UsersController(AppDbContext db) : ControllerBase
{
    private const string Menu = "/users";

    // Daftar user juga dipakai halaman Hak Akses (memilih user), jadi boleh dari salah satu menu tsb.
    [HttpGet]
    public async Task<ActionResult<List<UserView>>> List()
    {
        if (!await HasRead("/users") && !await HasRead("/privileges")) return StatusCode(403);
        return await db.Users.OrderBy(u => u.Id)
            .Select(u => new UserView(u.Id, u.Username, u.FullName, u.IsActive)).ToListAsync();
    }

    [HttpPost, RequirePrivilege(Menu, PrivilegeAction.Create)]
    public async Task<IActionResult> Create(UserCreate dto)
    {
        var username = dto.Username.Trim();
        if (username.Length == 0 || dto.Password.Length < 6)
            return BadRequest(new { message = "Username wajib diisi dan password minimal 6 karakter." });
        if (await db.Users.AnyAsync(u => u.Username == username))
            return Conflict(new { message = "Username sudah dipakai." });

        db.Users.Add(new AppUser
        {
            Username = username,
            FullName = dto.FullName.Trim(),
            IsActive = dto.IsActive,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        });
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Update)]
    public async Task<IActionResult> Update(int id, UserUpdate dto)
    {
        var u = await db.Users.FindAsync(id);
        if (u == null) return NotFound();
        if (id == User.GetUserId() && !dto.IsActive)
            return BadRequest(new { message = "Tidak bisa menonaktifkan akun sendiri." });

        u.FullName = dto.FullName.Trim();
        u.IsActive = dto.IsActive;
        if (!string.IsNullOrEmpty(dto.Password))
        {
            if (dto.Password.Length < 6) return BadRequest(new { message = "Password minimal 6 karakter." });
            u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}"), RequirePrivilege(Menu, PrivilegeAction.Delete)]
    public async Task<IActionResult> Delete(int id)
    {
        if (id == User.GetUserId()) return BadRequest(new { message = "Tidak bisa menghapus akun sendiri." });
        var u = await db.Users.FindAsync(id);
        if (u == null) return NotFound();
        db.Users.Remove(u);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Task<bool> HasRead(string menuUrl)
    {
        var userId = User.GetUserId();
        return (from p in db.Privileges
                join m in db.Menus on p.IdMenu equals m.Id
                where p.IdUser == userId && m.UrlMenu == menuUrl && p.IsActive && m.IsActive && p.CanRead
                select p.Id).AnyAsync();
    }
}
