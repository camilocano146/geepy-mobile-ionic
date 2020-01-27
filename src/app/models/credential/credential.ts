/**
 * Clase para pasar credenciales a login
 **/
export class Credential {
    //Pruebas--------------------------------------------------------
    //public client_id = "dFsVTJhIGpIypRKHIZsYpHnfPSbdtleNudKGDKc0";
    //public client_secret = "hLHDFzTtmDTBwRYffIzmQB0y4YPEdDGHCLMDoV8BTimwnZOvXe4GE8Wq9BHh0ooMb2QQt8K1bs9KivE5FDlDQ52V79R2jv9c7xwBlBipA5zXeTnQvz3preiU34KiBIxt";
    //Producción-----------------------------------------------------
    public client_id = "LSseygkCginJU3BqaBHC6UQJ2RL1sldHmKt0M6tv";
    public client_secret = "Iu3Wk72VxNYQZDKwxWI8bUwdNEOepJ91ko8wWkid1uTPaHS1tCn8XJ6JD0Lz75PomqElXigF6IhtWKOYaFrG2vPTpRgJapr7Y3Zv0hk9ayZ6HjWNQAYSOhyHtUNnpsmT";
    public grant_type = "password";
    constructor(
        public username: string,
        public password: string
    ) { }
}