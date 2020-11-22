export class OrderSims{
    constructor(
        public currency: string,
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

export class OrderSimsVoyager{
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
