using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AuthService.Services.AuthService _authService;
        private readonly JwtService _jwtService;

        public LoginController(
            AuthService.Services.AuthService authService,
            JwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost]
        public IActionResult Login(LoginDTO login)
        {
            var usuario = _authService.ValidarUsuario(login);

            if (usuario == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos");
            }

            string token = _jwtService.GenerarToken(
                usuario.IdUsuario,
                usuario.NombreUsuario
            );

            return Ok(new
            {
                mensaje = "Usuario correcto",
                token = token,
                usuario = new
                {
                    idUsuario = usuario.IdUsuario,
                    nombreUsuario = usuario.NombreUsuario,
                    nombre = usuario.Nombre,
                    apellido = usuario.Apellido
                }
            });
        }

        [HttpGet("protegido")]
        [Authorize]
        public IActionResult Protegido()
        {
            return Ok("Acceso permitido con JWT");
        }
    }
}