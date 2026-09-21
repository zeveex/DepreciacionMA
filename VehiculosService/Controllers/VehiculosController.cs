using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VehiculosService.Data;
using VehiculosService.DTOs;
using VehiculosService.Services;

namespace VehiculosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehiculosController : ControllerBase
    {
        private readonly AppDbContext _context;
private readonly DepreciacionService _depreciacionService;

public VehiculosController(
    AppDbContext context,
    DepreciacionService depreciacionService)
{
    _context = context;
    _depreciacionService = depreciacionService;
}
        [HttpGet]
        public async Task<IActionResult> ObtenerVehiculos()
        {
            int idUsuario = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var vehiculos = await _context.Activos
                .Where(a =>
                    a.IdUsuario == idUsuario &&
                    (a.IdTipo == 7 ||
                     a.IdTipo == 8 ||
                     a.IdTipo == 9))
                .ToListAsync();

            return Ok(vehiculos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerVehiculo(int id)
        {
            int idUsuario = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var vehiculo = await _context.Activos
                .FirstOrDefaultAsync(a =>
                    a.IdActivo == id &&
                    a.IdUsuario == idUsuario &&
                    (a.IdTipo == 7 ||
                     a.IdTipo == 8 ||
                     a.IdTipo == 9));

            if (vehiculo == null)
            {
                return NotFound("Vehículo no encontrado");
            }

            return Ok(vehiculo);
        }

        [HttpPost]
        public async Task<IActionResult> CrearVehiculo(CrearVehiculoDTO datos)
        {
            if (datos.IdTipo != 7 &&
                datos.IdTipo != 8 &&
                datos.IdTipo != 9)
            {
                return BadRequest("El tipo de activo no corresponde a un vehículo");
            }

            int idUsuario = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var vehiculo = new Shared.Models.Activo
            {
                Descripcion = datos.Descripcion,
                IdTipo = datos.IdTipo,
                FechaCompra = datos.FechaCompra,
                ValorCompra = datos.ValorCompra,
                IdUsuario = idUsuario
            };

            _context.Activos.Add(vehiculo);
            await _context.SaveChangesAsync();

            return Ok(vehiculo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarVehiculo(
            int id,
            CrearVehiculoDTO datos)
        {
            if (datos.IdTipo != 7 &&
                datos.IdTipo != 8 &&
                datos.IdTipo != 9)
            {
                return BadRequest("El tipo de activo no corresponde a un vehículo");
            }

            int idUsuario = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var vehiculo = await _context.Activos
                .FirstOrDefaultAsync(a =>
                    a.IdActivo == id &&
                    a.IdUsuario == idUsuario &&
                    (a.IdTipo == 7 ||
                     a.IdTipo == 8 ||
                     a.IdTipo == 9));

            if (vehiculo == null)
            {
                return NotFound("Vehículo no encontrado");
            }

            vehiculo.Descripcion = datos.Descripcion;
            vehiculo.IdTipo = datos.IdTipo;
            vehiculo.FechaCompra = datos.FechaCompra;
            vehiculo.ValorCompra = datos.ValorCompra;

            await _context.SaveChangesAsync();

            return Ok(vehiculo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarVehiculo(int id)
        {
            int idUsuario = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var vehiculo = await _context.Activos
                .FirstOrDefaultAsync(a =>
                    a.IdActivo == id &&
                    a.IdUsuario == idUsuario &&
                    (a.IdTipo == 7 ||
                     a.IdTipo == 8 ||
                     a.IdTipo == 9));

            if (vehiculo == null)
            {
                return NotFound("Vehículo no encontrado");
            }

            _context.Activos.Remove(vehiculo);
            await _context.SaveChangesAsync();

            return Ok("Vehículo eliminado correctamente");
        }
        [HttpPost("depreciacion")]
public async Task<IActionResult> CalcularDepreciacion(
    CalcularDepreciacionDTO datos)
{
    int idUsuario = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    var vehiculo = await _context.Activos
        .FirstOrDefaultAsync(a =>
            a.IdActivo == datos.IdActivo &&
            a.IdUsuario == idUsuario &&
            (a.IdTipo == 7 ||
             a.IdTipo == 8 ||
             a.IdTipo == 9));

    if (vehiculo == null)
    {
        return NotFound("Vehículo no encontrado");
    }

    var tipo = await _context.TiposActivos
        .FirstOrDefaultAsync(t =>
            t.IdTipo == vehiculo.IdTipo);

    if (tipo == null)
    {
        return NotFound("Tipo de vehículo no encontrado");
    }

    var categoria = await _context.Categorias
        .FirstOrDefaultAsync(c =>
            c.IdCategoria == tipo.IdCategoria);

    if (categoria == null)
    {
        return NotFound("Categoría no encontrada");
    }

    var resultado = _depreciacionService.CalcularDepreciacion(
        vehiculo.ValorCompra,
        categoria.PorcentajeValorResidual,
        categoria.VidaUtilAnios,
        vehiculo.FechaCompra,
        datos.FechaCalculo
    );

    return Ok(new
    {
        vehiculo = new
        {
            vehiculo.IdActivo,
            vehiculo.Descripcion,
            vehiculo.IdTipo,
            vehiculo.FechaCompra,
            vehiculo.ValorCompra
        },
        categoria = new
        {
            categoria.NombreCategoria,
            categoria.VidaUtilAnios,
            categoria.PorcentajeValorResidual
        },
        depreciacion = resultado
    });
}
    }
}