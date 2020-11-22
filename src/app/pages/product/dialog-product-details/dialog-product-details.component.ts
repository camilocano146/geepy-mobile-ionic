import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryAnimation } from 'ngx-gallery-9';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dialog-product-details',
    templateUrl: './dialog-product-details.component.html',
    styleUrls: ['./dialog-product-details.component.scss'],
})
export class DialogProductDetailsComponent implements OnInit {

    /**
    * Producto completo
    */
    @Input() data: any;

    /**
* Imagenes
*/
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    /**
     * Cantidad
     */
    public quantity: FormControl;


    constructor(
        private translate: TranslateService,
        private toastController: ToastController,
        private shoppingCartService: ShoppingCartService,
        private loadingService: LoadingService,
        private modalController: ModalController
    ) {
        this.galleryOptions = [
            {
                width: '100%',
                height: '250px',
                thumbnailsColumns: 4,
                imageSize: NgxGalleryImageSize.Contain,
                imageAnimation: NgxGalleryAnimation.Slide,
                closeIcon: 'fa fa-times-circle',
                imageArrows: false,
                imageArrowsAutoHide: false,
                preview: true,
                imageSwipe: true,
                previewSwipe: true,
                previewArrows: false
            },
        ];

    }

    ngOnInit() {
        this.galleryImages = [];
        this.quantity = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(this.data.units_available)]);
        if(this.data.images.length == 0){
            this.galleryOptions = [
                {
                    width: '100%',
                    height: '250px',
                    thumbnailsColumns: 4,
                    imageSize: NgxGalleryImageSize.Contain,
                    imageAnimation: NgxGalleryAnimation.Slide,
                    closeIcon: 'fa fa-times-circle',
                    imageArrows: false,
                    imageArrowsAutoHide: false,
                    preview: false,
                    thumbnails: false
                },
            ];
            let image = {
                small: 'https://marketplace-omg.s3.amazonaws.com/img-blank-products/NoImageAvailable.png',
                medium: 'https://marketplace-omg.s3.amazonaws.com/img-blank-products/NoImageAvailable.png',
                big: 'https://marketplace-omg.s3.amazonaws.com/img-blank-products/NoImageAvailable.png',
            }
            this.galleryImages.push(image);
        } else {
            for (let index = 0; index < this.data.images.length; index++) {
                const element = this.data.images[index];
                let image = {
                    small: element,
                    medium: element,
                    big: element,
                }
                this.galleryImages.push(image);
            }
        }
       
    }

    /**
     * Agregar al carrito
     */
    add() {
        if (this.quantity.valid) {
            this.loadingService.presentLoading().then(() => {
                let products_to_add: any[] = [];
                products_to_add.push(
                    {
                        product: this.data.id,
                        quantity_products: +this.quantity.value
                    }
                );
                const data_add = {
                    products: products_to_add
                }
                this.shoppingCartService.addProductoToCart(data_add).subscribe(res => {
                    this.presentToastOk(this.translate.instant('ecommerce.details_product.add_ok'));
                    this.loadingService.dismissLoading().then( () => {
                        this.dismiss();
                    });
                }, err => {
                    console.log(err);
                    this.loadingService.dismissLoading();
                    if(err.error.error == 'This product already exists in this cart'){
                        this.presentToastWarn(this.translate.instant('ecommerce.details_product.exists'));
                    } else {
                        this.presentToastError(this.translate.instant('ecommerce.details_product.add_error'));
                    }
                    
                });
            });
        } else {
            this.quantity.markAsTouched();
            console.log(this.quantity.value);
        }
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss();
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
    async presentToastWarn(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 3000,
            color: 'warning'
        });
        toast.present();
    }


}
