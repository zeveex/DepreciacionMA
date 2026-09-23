using System.ComponentModel.DataAnnotations;

namespace DepreciacionService.DTOs
{
    public class CalcularDepreciacionDTO
    {
        [Required(ErrorMessage = "El id del activo es obligatorio")]
        public int IdActivo { get; set; }

        [Required(ErrorMessage = "La fecha de cálculo es obligatoria")]
        public DateTime FechaCalculo { get; set; }
    }
}