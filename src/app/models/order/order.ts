export class OrderSims{
    constructor(
        public zip: string,
        public country: string,
        public city: string,
        public address: string,
        public phone: string,
        public sim_card_set: number,
        public account_voyager: number,
        public courier: number
    ){}
}