import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {

    constructor(private http: HttpClient) { }

    /**
     * Agregar ´roducto a carrito
     */
    addProductoToCart(data) {
        return this.http.post<any>(`shoping_cart/add_products/`, data, { observe: 'response' });
    }
     /**
     * Remvoer ´roducto de carrito
     */
    removeProductoToCart(data) {
        return this.http.post<any>(`shoping_cart/remove_products/`, data, { observe: 'response' });
    }

    /**
     * Obtener carrito de un usuario
     */
    getShoppingCart(id){
        return this.http.get<any>(`users/${id}/shoping_cart/`, { observe: 'response' });
    }

    /**
     * Trae todas las ordenes que ha hecho el usuario
     */
    getUserOrders(id,offset, limit){
        return this.http.get<any>(`users/${id}/orders/?offset=${offset}&limit=${limit}`, { observe: 'response' });
    }

    /**
     * ctualiza cantidad de un porducto
     */
    updateQuantity(data){
        return this.http.post<any>(`shoping_cart/edit_quantity_products/`, data, { observe: 'response' });
    }

    /**
     * Ejecutar carrito de compras
     */
    buy(data){
        return this.http.post<any>(`orders/execute_buy/`, data, { observe: 'response' });
    }
}
