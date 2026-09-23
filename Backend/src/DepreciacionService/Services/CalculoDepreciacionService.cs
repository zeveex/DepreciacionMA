using System.Net.Http.Json;
using System.Net.Http.Headers;
using DepreciacionService.Data;
using DepreciacionService.DTOs;
using DepreciacionService.Models;
using Microsoft.AspNetCore.Http;
using Shared.Contracts.DTOs;
namespace DepreciacionService.Services
{
    public class CalculoDepreciacionService
    {
        private readonly DepreciacionDbContext _context;
private readonly IHttpClientFactory _httpClientFactory;
private readonly IHttpContextAccessor _httpContextAccessor;

        public CalculoDepreciacionService(
    DepreciacionDbContext context,
    IHttpClientFactory httpClientFactory,
    IHttpContextAccessor httpContextAccessor)
{
    _context = context;
    _httpClientFactory = httpClientFactory;
    _httpContextAccessor = httpContextAccessor;
}
private HttpClient ObtenerClienteActivos()
{
    var client = _httpClientFactory.CreateClient("ActivosService");

    var token = _httpContextAccessor.HttpContext?
        .Request.Headers.Authorization.ToString();

    if (!string.IsNullOrEmpty(token))
    {
        client.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(token);
    }

    return client;
}
        public (bool exito, string mensaje, ResultadoDepreciacionDTO? resultado)
            Calcular(CalcularDepreciacionDTO dto)
        {
            var client = ObtenerClienteActivos();

            var respuesta = client
                .GetAsync($"activos/{dto.IdActivo}")
                .GetAwaiter()
                .GetResult();

            if (!respuesta.IsSuccessStatusCode)
                return (false, "Activo no encontrado", null);

            var activo = respuesta.Content
                .ReadFromJsonAsync<ActivoDetalleDTO>()
                .GetAwaiter()
                .GetResult();

            if (activo == null)
                return (false, "Activo no encontrado", null);

            if (dto.FechaCalculo.Date < activo.FechaCompra.Date)
                return (
                    false,
                    "La fecha de cálculo no puede ser anterior a la fecha de compra",
                    null
                );

            decimal valorCompra = activo.ValorCompra;
            int vidaUtilAnios = activo.VidaUtilAnios;
            decimal porcentajeResidual = activo.PorcentajeValorResidual;

            if (vidaUtilAnios <= 0)
                return (false, "La vida útil del activo no es válida", null);

            decimal valorResidual = Math.Round(
                valorCompra * porcentajeResidual / 100m, 2);

            decimal valorDepreciable =
                Math.Round(valorCompra - valorResidual, 2);

            int vidaUtilMeses = vidaUtilAnios * 12;

            decimal depreciacionMensual = Math.Round(
                valorDepreciable / vidaUtilMeses, 2);

            int mesesTranscurridos =
                ((dto.FechaCalculo.Year - activo.FechaCompra.Year) * 12)
                + dto.FechaCalculo.Month
                - activo.FechaCompra.Month;

            if (dto.FechaCalculo.Day < activo.FechaCompra.Day)
                mesesTranscurridos--;

            if (mesesTranscurridos < 0)
                mesesTranscurridos = 0;

            if (mesesTranscurridos > vidaUtilMeses)
                mesesTranscurridos = vidaUtilMeses;

            decimal depreciacionAcumulada = Math.Round(
                depreciacionMensual * mesesTranscurridos, 2);

            if (depreciacionAcumulada > valorDepreciable)
                depreciacionAcumulada = valorDepreciable;

            decimal valorActual = Math.Round(
                valorCompra - depreciacionAcumulada, 2);

            if (valorActual < valorResidual)
                valorActual = valorResidual;

            decimal depreciacionPeriodo = mesesTranscurridos == 0
                ? 0
                : Math.Round(
                    depreciacionAcumulada -
                    Math.Max(
                        0,
                        depreciacionAcumulada - depreciacionMensual
                    ),
                    2
                );

            bool llegoAlLimite =
                mesesTranscurridos >= vidaUtilMeses;

            var resultado = new ResultadoDepreciacionDTO
            {
                IdActivo = activo.IdActivo,
                Descripcion = activo.Descripcion,
                NombreTipo = activo.NombreTipo,
                NombreCategoria = activo.NombreCategoria,
                VidaUtilAnios = vidaUtilAnios,
                PorcentajeValorResidual = porcentajeResidual,
                FechaCompra = activo.FechaCompra,
                ValorCompra = valorCompra,

                Periodo = mesesTranscurridos,
                MesesCalculados = mesesTranscurridos,
                ValorResidual = valorResidual,
                ValorDepreciable = valorDepreciable,

                DepreciacionAnual = Math.Round(
                    valorDepreciable / vidaUtilAnios, 2),

                DepreciacionMensual = depreciacionMensual,
                DepreciacionPeriodo = depreciacionPeriodo,
                DepreciacionAcumulada = depreciacionAcumulada,
                ValorActual = valorActual,
                LlegoAlLimite = llegoAlLimite
            };

            return (true, "Calculo exitoso", resultado);
        }

        public (bool exito, string mensaje) GenerarHistorial(int idActivo)
        {
            var client = ObtenerClienteActivos();

            var respuesta = client
                .GetAsync($"activos/{idActivo}")
                .GetAwaiter()
                .GetResult();

            if (!respuesta.IsSuccessStatusCode)
                return (false, "Activo no encontrado");

            var activo = respuesta.Content
                .ReadFromJsonAsync<ActivoDetalleDTO>()
                .GetAwaiter()
                .GetResult();

            if (activo == null)
                return (false, "Activo no encontrado");

            if (activo.VidaUtilAnios <= 0)
                return (false, "La vida útil del activo no es válida");

            decimal valorCompra = activo.ValorCompra;

            decimal valorResidual = Math.Round(
                valorCompra * activo.PorcentajeValorResidual / 100m, 2);

            decimal valorDepreciable =
                Math.Round(valorCompra - valorResidual, 2);

            int vidaUtilMeses = activo.VidaUtilAnios * 12;

            decimal depreciacionMensual = Math.Round(
                valorDepreciable / vidaUtilMeses, 2);

            int anioCompra = activo.FechaCompra.Year;

            var existentes = _context.DetallesDepreciacion
                .Where(d => d.IdActivo == idActivo)
                .ToList();

            if (existentes.Count > 0)
                _context.DetallesDepreciacion.RemoveRange(existentes);

            for (int anio = 0; anio <= activo.VidaUtilAnios; anio++)
            {
                int meses = anio * 12;

                decimal depreciacionAcumulada = Math.Round(
                    depreciacionMensual * meses, 2);

                if (depreciacionAcumulada > valorDepreciable)
                    depreciacionAcumulada = valorDepreciable;

                decimal valorActual = Math.Round(
                    valorCompra - depreciacionAcumulada, 2);

                if (valorActual < valorResidual)
                    valorActual = valorResidual;

                decimal depreciacionPeriodo;

                if (anio == 0)
                {
                    depreciacionPeriodo = 0;
                }
                else
                {
                    decimal acumuladaAnterior = Math.Round(
                        depreciacionMensual * ((anio - 1) * 12), 2);

                    if (acumuladaAnterior > valorDepreciable)
                        acumuladaAnterior = valorDepreciable;

                    depreciacionPeriodo = Math.Round(
                        depreciacionAcumulada - acumuladaAnterior, 2);
                }

                var detalle = new DetalleDepreciacion
                {
                    IdActivo = idActivo,
                    AnioDep = anioCompra + anio,
                    FechaCorte = activo.FechaCompra.AddYears(anio),
                    MesesDepreciados = meses,
                    ValorInicial = valorCompra,
                    DepreciacionPeriodo = depreciacionPeriodo,
                    DepreciacionAcumulada = depreciacionAcumulada,
                    ValorActual = valorActual
                };

                _context.DetallesDepreciacion.Add(detalle);
            }

            _context.SaveChanges();

            return (true, "Historial generado correctamente");
        }

        public List<DetalleDepreciacion> ObtenerHistorial(int idActivo)
        {
            return _context.DetallesDepreciacion
                .Where(d => d.IdActivo == idActivo)
                .OrderBy(d => d.AnioDep)
                .ToList();
        }

        public (bool exito, string mensaje) ResetearHistorial(int idActivo)
        {
            var detalles = _context.DetallesDepreciacion
                .Where(d => d.IdActivo == idActivo)
                .ToList();

            if (detalles.Count == 0)
                return (false, "No hay historial para este activo");

            _context.DetallesDepreciacion.RemoveRange(detalles);
            _context.SaveChanges();

            return (true, "Historial eliminado. Puede volver a calcular.");
        }
    }
}