export class Destinatary {

    public id: number;
    
    constructor(
        public modem: number,
        public destination: string,
        public type: number,
        public moack: boolean,
        public geodata: boolean
    ){}
}