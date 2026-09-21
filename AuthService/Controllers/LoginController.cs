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
                return Ok(new { mensaje = "Usuario correcto", token = token });
            }

            return Unauthorized("Usuario o contrasena incorrectos");
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(RegistroDTO registro)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { mensaje = string.Join(" | ", errores) });
            }

            var (exito, mensaje, idUsuario) = await _authService.RegistrarUsuario(registro);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new
            {
                mensaje,
                idUsuario,
                requiereVerificacion = true
            });
        }

        [HttpPost("verificar")]
        public IActionResult Verificar(VerificarDTO dto)
        {
            var (exito, mensaje) = _authService.VerificarCodigo(dto.IdUsuario, dto.Codigo);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new { mensaje });
        }

        [HttpGet("protegido")]
        [Authorize]
        public IActionResult Protegido()
        {
            return Ok("Acceso permitido con JWT");
        }
    }
}