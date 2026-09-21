using AuthService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===== Base de datos =====
builder.Services.AddDbContext<AppDbContext>(opciones =>
    opciones.UseSqlServer(
        builder.Configuration.GetConnectionString("ConexionBD")
    )
);

// ===== Servicios propios =====
builder.Services.AddScoped<AuthService.Services.AuthService>();
builder.Services.AddScoped<AuthService.Services.EmailService>();
builder.Services.AddScoped<AuthService.Services.JwtService>();

// ===== CORS: permitir al frontend (Vite en localhost:5173) =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== Autenticacion JWT =====
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones =>
    {
        opciones.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("clave-secreta-depreciacion-2026!!")
            )
        };
    });

builder.Services.AddAuthorization();

// ===== Controladores y OpenAPI =====
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ===== Pipeline HTTP =====
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// HTTPS redirection deshabilitado en desarrollo para evitar redirecciones raras
// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");        // <-- IMPORTANTE: antes de Authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();