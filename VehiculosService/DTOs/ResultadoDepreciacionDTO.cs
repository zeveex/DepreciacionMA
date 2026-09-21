namespace VehiculosService.DTOs
{
    public class ResultadoDepreciacionDTO
    {
        public int Periodo { get; set; }
        public DateTime Fecha { get; set; }
        public int MesesDepreciados { get; set; }
        public decimal ValorInicial { get; set; }
        public decimal DepreciacionPeriodo { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public decimal ValorActual { get; set; }
    }
}