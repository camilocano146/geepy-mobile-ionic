import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable()
export class TariffRechargeService{
    constructor(private http: HttpClient) {
    }
    // Trae las tarifas de recarga
    getTariffsRecharge(): Observable<any>{
        return this.http.get<any>("tariffs_recharge/",{observe: 'response'});
    }
    // Traer tarifa de recarga por id
    getTariffRechargeById(idTariffRecharge: string){
        return this.http.get<any>("tariffs_recharge/" +idTariffRecharge + "/",{observe: 'response'});
    }
}