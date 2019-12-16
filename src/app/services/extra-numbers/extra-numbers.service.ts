import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class ExtraNumbersService{

    constructor(private http: HttpClient) {}
    /**
     * Obtiene numeros extra
     */
    getEnums():Observable<any>{
        return this.http.get<any>("enums/", { observe: 'response' });
    }
    /**
     * 
     */
    getEnumById(id: number){
        return this.http.get<any>("enums/"+id+"/", {observe: 'response'});
    }

    /**
     * Crea un numeroe xtra
     */
    createEnum(number: any):Observable<any>{
        return this.http.post<any>("enums/",number ,{ observe: 'response' });
    }
    /**
     * Editar numero
     */
    editNumber(id: number, enumNew:any):Observable<any>{
        return this.http.patch<any>("enums/"+id+ "/", enumNew,{ observe: 'response' });
    }

}