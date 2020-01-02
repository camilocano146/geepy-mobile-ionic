export class Payment{
    constructor(
        public token:string,
        public tariff:number,
        public currency: string
    ){}
}