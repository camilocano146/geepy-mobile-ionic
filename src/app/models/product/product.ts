export class Product{
    public brand: string;
    public category: string;
    public description: string;
    public id: string;
    public images: any;
    public name: string;
    public unitary_price_usd: number;
    public unitary_price_eur: number;
    public units_available: number;

    constructor(){
        this.images = [];
    }
}