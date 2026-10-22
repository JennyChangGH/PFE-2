namespace MenuApi.Models;

public record LoginRequest(string Username, string Password);
public record UserInfo(int Id, string Username, string FullName);
public record LoginResponse(string Token, UserInfo User);

public record PrivilegeFlags(bool Read, bool Create, bool Update, bool Delete);
public record MenuNode(int Id, string Name, string Url, PrivilegeFlags? Privilege, List<MenuNode> Children);

public record CategoryDto(string Name);
public record ProductDto(string Name, decimal Price, int Stock, int? CategoryId);
public record ProductView(int Id, string Name, decimal Price, int Stock, int? CategoryId, string? CategoryName);

public record UserView(int Id, string Username, string FullName, bool IsActive);
public record UserCreate(string Username, string Password, string FullName, bool IsActive);
public record UserUpdate(string FullName, bool IsActive, string? Password);

public record PrivilegeRow(int MenuId, string MenuName, string ParentName, bool Read, bool Create, bool Update, bool Delete);
public record PrivilegeSave(int MenuId, bool Read, bool Create, bool Update, bool Delete);
