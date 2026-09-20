using Microsoft.EntityFrameworkCore;
using AuthService.Models;

namespace AuthService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>(entidad =>
            {
                entidad.ToTable("USUARIOS");

                entidad.HasKey(u => u.IdUsuario);

                entidad.Property(u => u.IdUsuario)
                    .HasColumnName("ID_USU");

                entidad.Property(u => u.Nombre)
                    .HasColumnName("NOMBRE");

                entidad.Property(u => u.Apellido)
                    .HasColumnName("APELLIDO");

                entidad.Property(u => u.Correo)
                    .HasColumnName("CORREO");

                entidad.Property(u => u.NombreUsuario)
                    .HasColumnName("NOMBRE_USUARIO");

                entidad.Property(u => u.PasswordHash)
                    .HasColumnName("PASSWORD_HASH");

                entidad.Property(u => u.Estado)
                    .HasColumnName("ESTADO");

                entidad.Property(u => u.FechaRegistro)
                    .HasColumnName("FECHA_REGISTRO");
            });
        }
    }
}