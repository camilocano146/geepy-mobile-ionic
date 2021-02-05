export class OrderDevice{
    constructor(
        public currency: string,
        public zip: string,
        public country: string,
        public city: string,
        public address: string,
        public phone: string,
        public device: number,
        public account_iridium: number,
        public courier: number
    ){}
}