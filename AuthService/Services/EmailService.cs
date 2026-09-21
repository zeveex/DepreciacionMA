using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AuthService.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnviarCodigoVerificacion(string destinatario, string codigo)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                _config["Email:NombreRemitente"] ?? "Depreciacion MA",
                _config["Email:Correo"] ?? ""
            ));

            email.To.Add(MailboxAddress.Parse(destinatario));
            email.Subject = "Codigo de verificacion - Depreciacion MA";

            email.Body = new TextPart("html")
            {
                Text = $@"
                    <h2>Bienvenido a Depreciacion MA</h2>
                    <p>Tu codigo de verificacion es:</p>
                    <h1 style='color: #667eea; letter-spacing: 5px;'>{codigo}</h1>
                    <p>Este codigo expira en 15 minutos.</p>
                    <p>Si no solicitaste esta cuenta, ignora este correo.</p>
                "
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            var correo = _config["Email:Correo"] ?? "";
            var password = _config["Email:Password"] ?? "";

            await smtp.AuthenticateAsync(correo, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}