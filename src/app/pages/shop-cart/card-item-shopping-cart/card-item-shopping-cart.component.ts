import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-card-item-shopping-cart',
    templateUrl: './card-item-shopping-cart.component.html',
    styleUrls: ['./card-item-shopping-cart.component.scss'],
})
export class CardItemShoppingCartComponent implements OnInit {

    @Input() item: any;
    /**
     * Cantidad
     */
    public quantity: FormControl;
    @Output() delete = new EventEmitter<string[]>();


    constructor(
        private toastController: ToastController,
        private loadingService: LoadingService,
        private shoppingCartService: ShoppingCartService ) { }

    ngOnInit() {
        console.log(this.item);
        console.log(this.item.product.units_available);
        var max = this.item.product.units_available;
        this.quantity = new FormControl(this.item.quantity_products, [Validators.required, Validators.min(1), Validators.max(max)]);
    }

    changeQuantity(e){
        console.log(this.quantity.value);
        if(this.quantity.value == null){
            this.quantity.setValue(+this.item.quantity_products);
        } else {
            if(this.quantity.valid){
                this.loadingService.presentLoading();
                let itemU: any[] = [];
                itemU.push('update'),
                itemU.push(this.item.oid);
                itemU.push(+this.quantity.value);
                this.delete.emit(itemU);
            }
        }
    }

    removeItem() {
        this.loadingService.presentLoading();
        let itemF: any[] = [];
        itemF.push('delete'),
        itemF.push(this.item.product.id);
        this.delete.emit(itemF);
        
    }


    async presentToastError(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 3000,
            color: 'danger'
        });
        toast.present();
    }
    async presentToastOk(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 3000,
            color: 'success'
        });
        toast.present();
    }


}
