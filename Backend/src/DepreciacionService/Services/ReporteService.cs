using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using DepreciacionService.Data;
using DepreciacionService.DTOs;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Shared.Contracts.DTOs;

namespace DepreciacionService.Services
{
    public class ReporteService
    {
        private readonly DepreciacionDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ReporteService(
            DepreciacionDbContext context,
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        // ============================================================
        // Crea el cliente hacia ActivosService, reenviando el JWT
        // ============================================================
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

        // ============================================================
        // Genera el PDF con los datos del activo y su historial
        // ============================================================
        public async Task<byte[]?> GenerarReporte(int idActivo)
        {
            var client = ObtenerClienteActivos();

            var respuesta = await client.GetAsync($"activos/{idActivo}");

            if (!respuesta.IsSuccessStatusCode)
                return null;

            var activo = await respuesta.Content
                .ReadFromJsonAsync<ActivoDetalleDTO>();

            if (activo == null)
                return null;

            var historial = _context.DetallesDepreciacion
                .Where(d => d.IdActivo == idActivo)
                .OrderBy(d => d.AnioDep)
                .ToList();

            if (historial.Count == 0)
                return null;

            QuestPDF.Settings.License = LicenseType.Community;

            var documento = Document.Create(contenedor =>
            {
                contenedor.Page(pagina =>
                {
                    pagina.Margin(40);

                    pagina.Header()
                        .Column(columna =>
                        {
                            columna.Item()
                                .Text("REPORTE DE DEPRECIACIÓN")
                                .FontSize(20)
                                .Bold();

                            columna.Item()
                                .Text("Depreciación de activos")
                                .FontSize(12);
                        });

                    pagina.Content()
                        .PaddingVertical(20)
                        .Column(columna =>
                        {
                            columna.Spacing(10);

                            columna.Item()
                                .Text("DATOS DEL ACTIVO")
                                .FontSize(14)
                                .Bold();

                            columna.Item().Text(
                                $"Descripción: {activo.Descripcion}");

                            columna.Item().Text(
                                $"Tipo: {activo.NombreTipo}");

                            columna.Item().Text(
                                $"Categoría: {activo.NombreCategoria}");

                            columna.Item().Text(
                                $"Fecha de compra: {activo.FechaCompra:dd/MM/yyyy}");

                            columna.Item().Text(
                                $"Valor de compra: ${activo.ValorCompra:N2}");

                            columna.Item().Text(
                                $"Vida útil: {activo.VidaUtilAnios} años");

                            columna.Item().Text(
                                $"Valor residual: {activo.PorcentajeValorResidual:N2}%");

                            columna.Item()
                                .PaddingTop(15)
                                .Text("HISTORIAL DE DEPRECIACIÓN")
                                .FontSize(14)
                                .Bold();

                            columna.Item().Table(tabla =>
                            {
                                tabla.ColumnsDefinition(columnas =>
                                {
                                    columnas.RelativeColumn();
                                    columnas.RelativeColumn();
                                    columnas.RelativeColumn();
                                    columnas.RelativeColumn();
                                    columnas.RelativeColumn();
                                    columnas.RelativeColumn();
                                });

                                tabla.Header(encabezado =>
                                {
                                    encabezado.Cell().Element(Celda).Text("Año");
                                    encabezado.Cell().Element(Celda).Text("Fecha");
                                    encabezado.Cell().Element(Celda).Text("Meses");
                                    encabezado.Cell().Element(Celda).Text("Dep. período");
                                    encabezado.Cell().Element(Celda).Text("Dep. acumulada");
                                    encabezado.Cell().Element(Celda).Text("Valor actual");
                                });

                                foreach (var fila in historial)
                                {
                                    tabla.Cell().Element(Celda)
                                        .Text(fila.AnioDep.ToString());

                                    tabla.Cell().Element(Celda)
                                        .Text(fila.FechaCorte.ToString("dd/MM/yyyy"));

                                    tabla.Cell().Element(Celda)
                                        .Text(fila.MesesDepreciados.ToString());

                                    tabla.Cell().Element(Celda)
                                        .Text($"${fila.DepreciacionPeriodo:N2}");

                                    tabla.Cell().Element(Celda)
                                        .Text($"${fila.DepreciacionAcumulada:N2}");

                                    tabla.Cell().Element(Celda)
                                        .Text($"${fila.ValorActual:N2}");
                                }
                            });
                        });

                    pagina.Footer()
                        .AlignCenter()
                        .Text(texto =>
                        {
                            texto.Span("Reporte generado por el sistema de depreciación");
                        });
                });
            });

            return documento.GeneratePdf();
        }

        static IContainer Celda(IContainer contenedor)
        {
            return contenedor
                .Border(1)
                .Padding(5);
        }
    }
}