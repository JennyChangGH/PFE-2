using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace MenuApi.Security;

public class AuthorizeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var method = context.MethodInfo;
        var controller = method.DeclaringType;
        var allowsAnonymous = HasAttribute<AllowAnonymousAttribute>(method)
            || (controller != null && HasAttribute<AllowAnonymousAttribute>(controller));
        var requiresAuthorization = HasAttribute<AuthorizeAttribute>(method)
            || (controller != null && HasAttribute<AuthorizeAttribute>(controller));

        if (!requiresAuthorization || allowsAnonymous)
            return;

        operation.Security ??= [];
        operation.Security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                },
            }] = Array.Empty<string>(),
        });
    }

    private static bool HasAttribute<TAttribute>(MemberInfo member)
        where TAttribute : Attribute =>
        member.GetCustomAttributes(inherit: true).OfType<TAttribute>().Any();
}
