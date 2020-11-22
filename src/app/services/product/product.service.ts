import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener los productos de una categoria
   */
  getProducts(idCategory, page, limit){
    return this.http.get<any>(`categories/${idCategory}/products/?limit=${limit}&offset=${page}`, { observe: 'response' });
  }

  /**
   * Crear categoria
   */
  createProduct(formData) {
    return this.http.post<any>(`products/`, formData, { observe: 'response' } );
  }
  /**
   * Editar categoria
   */
  editProduct(id,formData) {
    return this.http.patch<any>(`products/${id}/`, formData, { observe: 'response' } );
  }

  /**
   * Subir una imagen a procuto
   */
  uploadPhotoToProduct(id, formData) {
    return this.http.post<any>(`products/${id}/add_image/`, formData, { observe: 'response' } );
  }

    /**
   * Subir una imagen a procuto
   */
  deletePhotoToProduct(id, data) {
    return this.http.post<any>(`products/${id}/remove_image/`, data, { observe: 'response' } );
  }

  /**
   * Obtener producto por id
   */
  getProdutcByID(id){
    return this.http.get<any>(`products/${id}/`, { observe: 'response' } );
  }
}