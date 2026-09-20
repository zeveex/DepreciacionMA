using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
            bool valido = _authService.ValidarUsuario(login);

            if (valido)
            {
                string token = _jwtService.GenerarToken(login.Usuario);

                return Ok(new
                {
                    mensaje = "Usuario correcto",
                    token = token
                });
            }

            return Unauthorized("Usuario o contraseña incorrectos");
        }
        [HttpGet("protegido")]
        [Authorize]
        public IActionResult Protegido()
        {
            return Ok("Acceso permitido con JWT");
        }
    }
}