using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QLCT.DTOs.Authentication.Request;
using QLCT.DTOs.Authentication.Response;
using QLCT.Entities;
using QLCT.Exceptions;
using QLCT.Repositories;

namespace QLCT.Services
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResponse> AuthenticateAsync(AuthenticationRequest request);
        Task<IntrospectResponse> IntrospectAsync(IntrospectRequest request);
        Task LogoutAsync(LogoutRequest request);
        Task<AuthenticationResponse> RefreshTokenAsync(RefreshRequest request);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IInvalidateTokenRepository _invalidateTokenRepository;
        private readonly IConfiguration _configuration;

        public AuthenticationService(
            IUserRepository userRepository,
            IInvalidateTokenRepository invalidateTokenRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _invalidateTokenRepository = invalidateTokenRepository;
            _configuration = configuration;
        }

        public async Task<AuthenticationResponse> AuthenticateAsync(AuthenticationRequest request)
        {
            var user = await _userRepository.FindByUsernameAsync(request.Username)
                ?? throw new AppException("USER_NOT_FOUND");
                
            bool authenticated = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
            if (!authenticated)
            {
                throw new AppException("PASSWORD_INCORRECT");
            }
            
            var token = GenerateToken(user);
            return new AuthenticationResponse
            {
                Token = token,
                Authenticated = true
            };
        }

        // Generate token
        private string GenerateToken(User user)
        {
            var headerBytes = Encoding.UTF8.GetBytes(_configuration["Jwt:SignerKey"] ?? throw new AppException("JWT_KEY_NOT_CONFIGURED"));
            var singingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(headerBytes),
                SecurityAlgorithms.HmacSha256
            );

            var roles = user.Roles != null 
                ? string.Join(" ", user.Roles.Select(r => r.Name)) 
                : "";

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("scope", roles)
            };

            var expirationInMs = int.Parse(_configuration["Jwt:ExpirationInMs"] ?? "3600000"); // 1 hour default

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMilliseconds(expirationInMs),
                SigningCredentials = singingCredentials,
                Issuer = _configuration["Jwt:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<IntrospectResponse> IntrospectAsync(IntrospectRequest request)
        {
            var token = request.Token;
            try
            {
                await VerifyTokenAsync(token);
                return new IntrospectResponse { Active = true };
            }
            catch
            {
                return new IntrospectResponse { Active = false };
            }
        }

        private async Task<JwtSecurityToken> VerifyTokenAsync(string tokenString)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SignerKey"] ?? throw new AppException("JWT_KEY_NOT_CONFIGURED"));

            try
            {
                tokenHandler.ValidateToken(tokenString, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                // Check Blacklist
                var jti = jwtToken.Id;
                if (await _invalidateTokenRepository.ExistsByIdAsync(jti))
                {
                    throw new AppException("TOKEN_IN_BLACKLIST");
                }

                return jwtToken;
            }
            catch (Exception ex) when (ex is not AppException)
            {
                throw new AppException("UNAUTHENTICATED");
            }
        }
        public async Task LogoutAsync(LogoutRequest request)
        {
            var jwtToken = await VerifyTokenAsync(request.Token);
            var jti = jwtToken.Id;
            var expiry = jwtToken.ValidTo;

            var invalidateToken = new InvalidateToken
            {
                Id = jti,
                ExpirationTime = expiry
            };

            await _invalidateTokenRepository.SaveAsync(invalidateToken);
        }

        public async Task<AuthenticationResponse> RefreshTokenAsync(RefreshRequest request)
        {
            var jwtToken = await VerifyTokenAsync(request.Token);
            var jti = jwtToken.Id;
            var expiry = jwtToken.ValidTo;

            var invalidateToken = new InvalidateToken
            {
                Id = jti,
                ExpirationTime = expiry
            };

            await _invalidateTokenRepository.SaveAsync(invalidateToken);

            var username = jwtToken.Subject;
            var user = await _userRepository.FindByUsernameAsync(username) 
                ?? throw new AppException("USER_NOT_FOUND");

            var token = string.Empty; // Needs proper token generation
            
            return new AuthenticationResponse
            {
                Authenticated = true,
                Token = token
            };
        }
    }
}
