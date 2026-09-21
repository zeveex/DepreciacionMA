using AuthService.Data;
using AuthService.DTOs;

namespace AuthService.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public Models.Usuario? ValidarUsuario(LoginDTO login)
        {
            var usuario = _context.Usuarios
                .FirstOrDefault(u =>
                    u.NombreUsuario == login.Usuario &&
                    u.PasswordHash == login.Password &&
                    u.Estado == "ACTIVO");

            return usuario;
        }
    }
}