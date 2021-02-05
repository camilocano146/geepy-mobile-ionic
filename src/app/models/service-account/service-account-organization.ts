import { ServiceAccountOriginal } from './service-account-original';

export class ServiceAccountOrganization {

    public id: number;
    public organization: any;
    public account: ServiceAccountOriginal;
    public customer_price_usd: string;
    public customer_price_eur: string;
    
    constructor(){}
}