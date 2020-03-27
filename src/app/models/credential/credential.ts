import { Global } from '../global/global';

/**
 * Clase para pasar credenciales a login
 **/
export class Credential {
    //Pruebas--------------------------------------------------------
    public client_id: string;
    public client_secret: string;;
    //Producción-----------------------------------------------------
    //public client_id = "LSseygkCginJU3BqaBHC6UQJ2RL1sldHmKt0M6tv";
    //public client_secret = "Iu3Wk72VxNYQZDKwxWI8bUwdNEOepJ91ko8wWkid1uTPaHS1tCn8XJ6JD0Lz75PomqElXigF6IhtWKOYaFrG2vPTpRgJapr7Y3Zv0hk9ayZ6HjWNQAYSOhyHtUNnpsmT";
    public grant_type = "password";
    constructor(
        public username: string,
        public password: string
    ) {
        this.client_id = Global.client_id;
        this.client_secret = Global.client_secret;
    }
}