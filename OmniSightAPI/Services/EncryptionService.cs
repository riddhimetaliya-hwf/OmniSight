using System.Security.Cryptography;
using System.Text;
using Serilog;

namespace OmniSightAPI.Services
{
    public interface IEncryptionService
    {
        string Encrypt(string plainText);
        string Decrypt(string cipherText);
    }

    public class EncryptionService : IEncryptionService
    {
        private readonly string _encryptionKey;
        private readonly ILogger _logger;

        public EncryptionService(IConfiguration configuration, ILogger logger)
        {
            _encryptionKey = configuration["Encryption:Key"]
                ?? throw new InvalidOperationException("Encryption key not configured in appsettings.json");

            if (_encryptionKey.Length != 32)
            {
                throw new InvalidOperationException("Encryption key must be exactly 32 characters long for AES-256");
            }

            _logger = logger;
        }

        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return plainText;

            try
            {
                using var aes = Aes.Create();
                aes.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                // Use 16 bytes IV for AES-CBC (current implementation writes IV prefix)
                var iv = new byte[aes.BlockSize / 8];
                RandomNumberGenerator.Fill(iv);
                aes.IV = iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using var ms = new MemoryStream();
                // Prepend IV
                ms.Write(aes.IV, 0, aes.IV.Length);

                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                using (var sw = new StreamWriter(cs, Encoding.UTF8))
                {
                    sw.Write(plainText);
                }

                var encrypted = ms.ToArray();
                return Convert.ToBase64String(encrypted);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Encryption error occurred");
                throw new InvalidOperationException("Failed to encrypt data", ex);
            }
        }

        public string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                return cipherText;

            try
            {
                var buffer = Convert.FromBase64String(cipherText);

                using var aes = Aes.Create();
                aes.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                var ivLength = aes.BlockSize / 8;
                var iv = new byte[ivLength];
                Array.Copy(buffer, 0, iv, 0, ivLength);
                aes.IV = iv;

                using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using var ms = new MemoryStream(buffer, ivLength, buffer.Length - ivLength);
                using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
                using var sr = new StreamReader(cs, Encoding.UTF8);

                return sr.ReadToEnd();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Decryption error occurred");
                throw new InvalidOperationException("Failed to decrypt data", ex);
            }
        }
    }
}
