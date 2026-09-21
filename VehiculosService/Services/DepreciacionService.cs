using VehiculosService.DTOs;

namespace VehiculosService.Services
{
    public class DepreciacionService
    {
        public List<ResultadoDepreciacionDTO> CalcularDepreciacion(
            decimal valorCompra,
            decimal porcentajeResidual,
            int vidaUtilAnios,
            DateTime fechaCompra,
            DateTime fechaCalculo)
        {
            var resultado = new List<ResultadoDepreciacionDTO>();

            if (fechaCalculo <= fechaCompra)
            {
                return resultado;
            }

            decimal valorResidual =
                valorCompra * (porcentajeResidual / 100);

            decimal valorDepreciable =
                valorCompra - valorResidual;

            int mesesVidaUtil =
                vidaUtilAnios * 12;

            decimal depreciacionMensual =
                valorDepreciable / mesesVidaUtil;

            decimal depreciacionAcumulada = 0;

            for (int mes = 1; mes <= mesesVidaUtil; mes++)
            {
                DateTime fechaDepreciacion =
                    fechaCompra.AddMonths(mes);

                if (fechaDepreciacion > fechaCalculo)
                {
                    break;
                }

                decimal valorInicial =
                    valorCompra - depreciacionAcumulada;

                decimal depreciacionPeriodo =
                    depreciacionMensual;

                if (depreciacionAcumulada + depreciacionPeriodo >
                    valorDepreciable)
                {
                    depreciacionPeriodo =
                        valorDepreciable - depreciacionAcumulada;
                }

                depreciacionAcumulada += depreciacionPeriodo;

                decimal valorActual =
                    valorCompra - depreciacionAcumulada;

                resultado.Add(new ResultadoDepreciacionDTO
                {
                    Periodo = mes,
                    Fecha = fechaDepreciacion,
                    MesesDepreciados = mes,
                    ValorInicial = Math.Round(valorInicial, 2),
                    DepreciacionPeriodo = Math.Round(depreciacionPeriodo, 2),
                    DepreciacionAcumulada = Math.Round(depreciacionAcumulada, 2),
                    ValorActual = Math.Round(valorActual, 2)
                });
            }

            return resultado;
        }
    }
}