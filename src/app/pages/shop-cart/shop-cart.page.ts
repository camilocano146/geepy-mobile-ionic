import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import { ToastController, ModalController, PopoverController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-shop-cart',
    templateUrl: './shop-cart.page.html',
    styleUrls: ['./shop-cart.page.scss'],
})
export class ShopCartPage implements OnInit {
    /**
     * Usuario
     */
    public user: User;
    /**
     * Lista de carrito
     */
    public list: any;
    public total_eur: number;
    public total_usd: number;
    /**
     * Variable de confirmar pedido
     */
    public confirm_order: boolean;
    /**
     * Idioma
     */
    public language: string;
    //----Pais
    public countriesList: any[];
    public countrySelected: FormControl;
    //----Ciudad
    public city: FormControl;
    //----Dirección
    public address: FormControl;
    //----Telefono
    public phone: FormControl;
    //----Zip
    public zip: FormControl;

    constructor(
        private translate: TranslateService,
        private zonesService: ZonesService,
        private navController: NavController,
        private modalController: ModalController,
        private popoverController: PopoverController,
        private loadingService: LoadingService,
        private toastController: ToastController,
        private shoppingCartService: ShoppingCartService,
    ) {
        this.list = [];
        this.countriesList = [];
        this.total_eur = 0;
        this.total_usd = 0;
        this.language = this.translate.currentLang;
        this.countrySelected = new FormControl(null, [Validators.required]);
        this.city = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
        this.address = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]);
        this.zip = new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999999)]);
        this.language = this.translate.currentLang;
        this.phone = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]);
        this.confirm_order = false;
    }

    ngOnInit() {

    }



    ionViewDidEnter() {
        this.getCountries();
        this.user = JSON.parse(localStorage.getItem('g_c_user'));
        this.confirm_order = false;
        this.getShoppingCart();
    }

    /**
     * Obtener carrito
     */
    getShoppingCart() {
        this.loadingService.presentLoading().then(() => {
            this.shoppingCartService.getShoppingCart(this.user.id).subscribe(res => {
                console.log(res);
                this.list = res.body.products;
                this.total_usd = res.body.total_usd;
                this.total_eur = res.body.total_eur;
                console.log(),
                this.loadingService.dismissLoading();
                if (this.list === undefined) {
                    this.list = [];
                }
            }, err => {
                console.log(err);
                this.loadingService.dismissLoading();
                this.presentToastError(this.translate.instant('ecommerce.shopping.error_get'));
            });
        });

    }

    /**
   * Trae los paises
   */
    getCountries() {
        this.zonesService.getAvailableCountiresToPurchase().subscribe(res => {
            if (res.status == 200) {
                this.countriesList = res.body;
            }
        }, err => {
            console.log(err);
            this.presentToastError(this.translate.instant('simcard.error.no_countries'))
        });
    }

    update(e) {
        console.log(e)
        if (e[0] == 'delete') {
            const data_remove = {
                product: e[1]
            }
            this.shoppingCartService.removeProductoToCart(data_remove).subscribe(res => {
                this.loadingService.dismissLoading();
                this.getShoppingCart();

                this.presentToastOk(this.translate.instant('ecommerce.shopping.update_ok'));
            }, err => {
                this.loadingService.dismissLoading();
                this.getShoppingCart();
                this.presentToastError(this.translate.instant('ecommerce.shopping.update_error'));
            });
        } else if (e[0] == 'update') {
            const data_update = {
                detail_id: e[1],
                new_quantity: e[2]
            }
            console.log(data_update);
            this.shoppingCartService.updateQuantity(data_update).subscribe(res => {
                this.loadingService.dismissLoading();
                this.getShoppingCart();
                this.presentToastOk(this.translate.instant('ecommerce.shopping.update_ok'));
            }, err => {
                this.loadingService.dismissLoading();
                this.getShoppingCart();
                this.presentToastError(this.translate.instant('ecommerce.shopping.update_error'));
            });
        }
    }

    /**
     * Pagar carrito
     */
    buy(currencySelected) {
        console.log(currencySelected);
        this.loadingService.presentLoading().then(() => {
            const data_buy = {
                currency: currencySelected,
                zip: "" + this.zip.value,
                country: +this.countrySelected.value.id,
                city: this.city.value,
                address: "" + this.address.value,
                phone: "" + this.phone.value
            }
            console.log(data_buy);
            this.shoppingCartService.buy(data_buy).subscribe(res => {
                console.log(res);
                this.presentToastOk(this.translate.instant("ecommerce.shopping.buy_ok"))
                this.loadingService.dismissLoading().then(() => {
                    this.navController.navigateBack('/shop-home/store')
                });
            }, err => {
                this.loadingService.dismissLoading();
                console.log(err);
                if (err.status == 402 && err.error.details == "User does not have sufficient resources for this purchase") {
                    this.presentToastError(this.translate.instant("simcard.error.not_enough_money"));
                } else if (err.error.details == "One or more of the products are not available in the required quantities") {
                    this.presentToastError(this.translate.instant("ecommerce.shopping.buy_error_quantity"));
                } else {
                    this.presentToastError(this.translate.instant("ecommerce.shopping.buy_error"));
                }
            });
        });
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
