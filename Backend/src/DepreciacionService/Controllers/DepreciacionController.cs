using DepreciacionService.DTOs;
using DepreciacionService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepreciacionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepreciacionController : ControllerBase
    {
        private readonly CalculoDepreciacionService _service;
private readonly ReporteService _reporteService;
        public DepreciacionController(CalculoDepreciacionService service, ReporteService reporteService)
        {
            _service = service;
            _reporteService = reporteService;
        }

        [HttpPost("calcular")]
        public IActionResult Calcular([FromBody] CalcularDepreciacionDTO dto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);

                return BadRequest(new
                {
                    mensaje = string.Join(" | ", errores)
                });
            }

            var (exito, mensaje, resultado) = _service.Calcular(dto);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(resultado);
        }

        [HttpPost("generar-historial/{idActivo}")]
        public IActionResult GenerarHistorial(int idActivo)
        {
            var (exito, mensaje) = _service.GenerarHistorial(idActivo);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new { mensaje });
        }

        [HttpGet("historial/{idActivo}")]
        public IActionResult Historial(int idActivo)
        {
            var historial = _service.ObtenerHistorial(idActivo);

            return Ok(historial);
        }

        [HttpDelete("historial/{idActivo}")]
        public IActionResult Resetear(int idActivo)
        {
            var (exito, mensaje) = _service.ResetearHistorial(idActivo);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new { mensaje });
        }
        [HttpGet("reporte/{idActivo}/pdf")]
public async Task<IActionResult> GenerarReporte(int idActivo)
{
    var pdf = await _reporteService.GenerarReporte(idActivo);

    if (pdf == null)
    {
        return NotFound(new
        {
            mensaje = "No se pudo generar el reporte. Verifique que el activo tenga historial."
        });
    }

    return File(
        pdf,
        "application/pdf",
        $"Reporte_Depreciacion_{idActivo}.pdf"
    );
}
    }
}