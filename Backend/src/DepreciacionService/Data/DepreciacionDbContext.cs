using Microsoft.EntityFrameworkCore;
using DepreciacionService.Models;

namespace DepreciacionService.Data
{
    public class DepreciacionDbContext : DbContext
    {
        public DepreciacionDbContext(DbContextOptions<DepreciacionDbContext> options)
            : base(options)
        {
        }

        public DbSet<DetalleDepreciacion> DetallesDepreciacion { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DetalleDepreciacion>(entidad =>
            {
                entidad.ToTable("DETALLE_DEPRECIACION");

                entidad.HasKey(d => new
                {
                    d.IdActivo,
                    d.AnioDep
                });

                entidad.Property(d => d.IdActivo)
                    .HasColumnName("ID_ACTIVO");

                entidad.Property(d => d.AnioDep)
                    .HasColumnName("ANIO_DEP");

                entidad.Property(d => d.FechaCorte)
                    .HasColumnName("FECHA_CORTE");

                entidad.Property(d => d.MesesDepreciados)
                    .HasColumnName("MESES_DEPRECIADOS");

                entidad.Property(d => d.ValorInicial)
                    .HasColumnName("VALOR_INICIAL");

                entidad.Property(d => d.DepreciacionPeriodo)
                    .HasColumnName("DEPRECIACION_PERIODO");

                entidad.Property(d => d.DepreciacionAcumulada)
                    .HasColumnName("DEPRECIACION_ACUMULADA");

                entidad.Property(d => d.ValorActual)
                    .HasColumnName("VALOR_ACTUAL");
            });
        }
    }
}