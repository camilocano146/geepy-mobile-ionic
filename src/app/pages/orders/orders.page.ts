import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { NavController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { DialogOrderDetailComponent } from './dialog-order-detail/dialog-order-detail.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage {

    /**
      * Usuario
      */
    public user: User;
    /**
     * Lista de carrito
     */
    public list: any[];
    /**
     * Control del infinirty scroll
     */
    public loadingData: boolean;
    /**
     * pagina actual
     */
    public page: number;
    /**
     * Total
     */
    public total_number;
    /**
     * Limit
     */
    public limit: number;

    public preload: boolean;


    constructor(
        private translate: TranslateService,
        private navController: NavController,
        private modalController: ModalController,
        private popoverController: PopoverController,
        private loadingService: LoadingService,
        private toastController: ToastController,
        private shoppingCartService: ShoppingCartService,
    ) {
        this.list = [];
        this.loadingData = false;
        this.page = 0;
        this.total_number = 0;
        this.limit = 20;
        this.preload = true;
    }

    ionViewDidEnter() {
        this.list = [];
        this.user = JSON.parse(localStorage.getItem('g_c_user'));
        this.getOrders();
    }


    /**
     * Obtener carrito
     */
    getOrders() {
        this.loadingService.presentLoading().then(() => {
            this.shoppingCartService.getUserOrders(this.user.id, 0, this.limit).subscribe(res => {
                console.log(res);
                this.list = res.body.results;
                this.preload = false;
                this.loadingService.dismissLoading();
            }, err => {
                this.preload = false;
                this.presentToastError(this.translate.instant('ecommerce.orders.error_get'));
            });
        });

    }

    loadData(event) {
        console.log('asdasd');
        this.page += 1;
        this.loadingData = true;
        let offset = (((this.page + 1) - 1) * this.limit);


        this.shoppingCartService.getUserOrders(this.user.id, offset, this.limit).subscribe(res => {
            this.total_number = res.body.count;
            res.body.results.forEach(element => {
                this.list.push(element)
            });
            this.loadingData = false;
            event.target.complete();
            if (this.list.length == this.total_number) {
                event.target.disabled = true;
            }

        }, err => {
            this.presentToastError(this.translate.instant('ecommerce.orders.error_get'));
        });
    }

    /**
   * Ver detalles 
   */
    async goDetails(data) {
        console.log('asdas');
        const modal = await this.modalController.create({
            component: DialogOrderDetailComponent,
            componentProps: {
                'data': data
            }
        });
        modal.onDidDismiss().then(res => {

        }).catch();
        return await modal.present();
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

    async settingsPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverComponent,
            event: ev,
            mode: 'ios',
        });
        return await popover.present();
    }

    goToHome() {
        this.navController.navigateBack('select-platform');
    }


}
