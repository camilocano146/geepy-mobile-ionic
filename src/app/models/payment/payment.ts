export class Payment{

    public coupon: string;
    constructor(
        public token:string,
        public tariff:number,
        public currency: string
    ){}
}