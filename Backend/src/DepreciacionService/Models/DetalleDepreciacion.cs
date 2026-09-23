namespace DepreciacionService.Models
{
    public class DetalleDepreciacion
    {
        public int IdActivo { get; set; }
        public int AnioDep { get; set; }
        public DateTime FechaCorte { get; set; }
        public int MesesDepreciados { get; set; }
        public decimal ValorInicial { get; set; }
        public decimal DepreciacionPeriodo { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public decimal ValorActual { get; set; }
    }
}