import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizationService {

    constructor(private http: HttpClient) { }    
    /**
     * Obtener plataformas de la org
     */
    getOrganizationPlatforms(id): Observable<any> {
        return this.http.get<any>(`organizations/${id}/platforms/`, { observe: 'response' });
    }

}