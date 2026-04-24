namespace QLCT.DTOs.Authentication.Response;

public record AuthenticationResponse
{
    public bool Authenticated { get; init; }
    public string Token { get; init; } = string.Empty;
}

public record IntrospectResponse
{
    public bool Active { get; init; }
}
