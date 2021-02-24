export class Organization{

    public id: number;
    public name: string;
    public place_id: number;
    public addres_one: string;
    public addres_two: string;
    public city: string;
    public state: string;
    public postal_code: string;
    public tributary_register: string;
    public email: string;
    public purchasing_values: string;
    public balance_usd: string;
    public balance_eur: string;
    public isActive: boolean;
    public organization_id: any;

        
    public notifications_active: boolean;
    public email_invoice: string;
    public email_operative: string;
    public email_payment: string;

    constructor(){}
}