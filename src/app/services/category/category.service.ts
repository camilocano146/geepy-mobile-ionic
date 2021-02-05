import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from 'src/app/models/category/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener categorias
   */
  getCategoriesByOrg(id, page, limit) {
    return this.http.get<any>(`organizations/${id}/categories/?offset=${page}&limit=${limit}`, { observe: 'response' });
  }
  /**
   * Crear categoria
   */
  createCategory(category: Category) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('image', category.file);
    formData.append('level', "1");
    formData.append('organization', category.organization);
    return this.http.post<any>(`categories/`, formData, { observe: 'response' } );
  }
  /**
   * Actualizar categoria
   */
  updateCategory(id,category: Category) {
    const formData = new FormData();
    formData.append('name', category.name);
    if(category.file != null || category.file != undefined){
      formData.append('image', category.file);
    }
    formData.append('level', "1");
    formData.append('organization', category.organization);
    return this.http.patch<any>(`categories/${id}/`, formData, { observe: 'response' } );
  }
  /**
   * Obtener categoria por id
   */
  getCategoryByID(id){
    return this.http.get<any>(`categories/${id}/`, { observe: 'response' });
  }
}
