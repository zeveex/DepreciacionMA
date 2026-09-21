namespace VehiculosService.DTOs
{
    public class CrearVehiculoDTO
    {
        public string Descripcion { get; set; } = "";
        public int IdTipo { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal ValorCompra { get; set; }
    }
}