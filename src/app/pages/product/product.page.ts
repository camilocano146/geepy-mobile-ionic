import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, NavController, ToastController, PopoverController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Category } from 'src/app/models/category/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/models/product/product';
import { DialogProductDetailsComponent } from './dialog-product-details/dialog-product-details.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.page.html',
    styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {


    /**
     * Id de la categoria seleccionada
     */
    public id_category: string;

    /**
    * Lista de categorias
    */
    public products_list: any[];
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
    /**
     * Categoria actual
     */
    public category: Category;

    /**Contenidode la pagina para el scroll */
    @ViewChild('content', { static: false }) content: IonContent;
    @ViewChild('top', { static: false }) infiniteScroll: IonInfiniteScroll;

    constructor(
        private modalController: ModalController,
        private toastController: ToastController,
        private popoverController: PopoverController,
        private translate: TranslateService,
        private categoryService: CategoryService,
        private loadingService: LoadingService,
        private navController: NavController,
        private activatedRoute: ActivatedRoute,
        private productService: ProductService,) {
        this.id_category = (this.activatedRoute.snapshot.paramMap.get('id'));
        console.log(this.id_category);
        if (this.id_category == null || this.id_category == undefined) {
            this.navController.navigateBack('shop-home');
        }
        this.products_list = [];
        this.loadingData = false;
        this.page = 0;
        this.total_number = 0;
        this.limit = 50;
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.page = 0;
        this.total_number = 0;
        this.products_list = [];
        this.getCategoryById();
    }


    /**
   * Obtiene la categoria selccionada
   */
    getCategoryById() {
        this.loadingService.presentLoading().then(() => {
            this.categoryService.getCategoryByID(this.id_category).subscribe(res => {
                this.category = res.body;
                this.getProductos(this.page);
            }, err => {
                this.loadingService.dismissLoading();
                this.presentToastError(this.translate.instant('ecommerce.products.category_error'));
            });
        });
    }


    /**
     * buscar productos
     */
    getProductos(page) {
        this.productService.getProducts(this.id_category, page, this.limit).subscribe(res => {
            this.total_number = res.body.count;
            for (let index = 0; index < res.body.results.length; index++) {
                let p: Product = new Product();
                p.brand = res.body.results[index].brand;
                p.category = res.body.results[index].category;
                p.description = res.body.results[index].description;
                p.id = res.body.results[index].id;
                p.name = res.body.results[index].name;
                p.images = res.body.results[index].images;
                p.unitary_price_eur = res.body.results[index].unitary_price_eur;
                p.unitary_price_usd = res.body.results[index].unitary_price_usd;
                p.units_available = res.body.results[index].units_available;
                this.products_list.push(p);
            }
            this.loadingData = false;
            this.loadingService.dismissLoading();
        }, err => {
            this.loadingService.dismissLoading();
            this.presentToastError(this.translate.instant('ecommerce.products.products_error'));
        });
    }

    loadData(event) {
        console.log('asdasd');
        this.page += 1;
        this.loadingData = true;
        let offset = (((this.page + 1) - 1) * this.limit);


        this.productService.getProducts(this.id_category, offset, this.limit).subscribe(res => {
            this.total_number = res.body.count;
            for (let index = 0; index < res.body.results.length; index++) {
                let p: Product = new Product();
                p.brand = res.body.results[index].brand;
                p.category = res.body.results[index].category;
                p.description = res.body.results[index].description;
                p.id = res.body.results[index].id;
                p.name = res.body.results[index].name;
                p.images = res.body.results[index].images;
                p.unitary_price_eur = res.body.results[index].unitary_price_eur;
                p.unitary_price_usd = res.body.results[index].unitary_price_usd;
                p.units_available = res.body.results[index].units_available;
                this.products_list.push(p);
            }
            this.loadingData = false;
            event.target.complete();
            if (this.products_list.length == this.total_number) {
                event.target.disabled = true;
            }
        }, err => {
            this.presentToastError(this.translate.instant('ecommerce.products.products_error'));
        });

    }


    /**
    * Ver detalles 
    */
    async goDetails(data) {
        console.log('asdas');
        const modal = await this.modalController.create({
            component: DialogProductDetailsComponent,
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
