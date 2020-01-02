export class PaymentPaypal{
    constructor(
        public tariff: string,
        public id_pay_pal_transaction: string,
        public currency: string){}
}