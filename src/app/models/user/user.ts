import { Global } from '../global/global';

export class User {
    public id: number;
    public is_lock: boolean;
    public password: string;
    public roles: any;
    public role: number;
    public organization: string;
    public addres_one: string;
    public addres_two: string;
    public balance_eur: string;
    public balance_usd: string;
    public city: string;
    public country: number;
    public customer_id: string;
    public postal_code: string;
    public referrer: any;
    public state: string;
    public tributary_register: string;
    public reseller_code: string;
    public phone_number: string;
    public person_type : string;
    public organizationId: any;

    constructor(
        public email: string,
        public first_name: string,
        public last_name: string,
        ) {
            this.organization = ""+Global.organization_id;
        }
    }