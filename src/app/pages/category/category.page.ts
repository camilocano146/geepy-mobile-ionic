import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, PopoverController, IonContent, IonInfiniteScroll } from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { Category } from 'src/app/models/category/category';
import { Global } from 'src/app/models/global/global';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryAnimation } from 'ngx-gallery-9';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  /**
   * Lista de categorias
   */
  public categories_list: any[];
  /**
   * Preloa de carga de datos
   */
  public preload: boolean;
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


  /**Contenidode la pagina para el scroll */
  @ViewChild('content', { static: false }) content: IonContent;
  @ViewChild('top', { static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(
    private translate: TranslateService,
    private loadingService: LoadingService,
    private categoryService: CategoryService,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    this.categories_list = [];
    this.loadingData = false;
    this.page = 0;
    this.total_number = 0;
    this.limit = 50;

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.page = 0;
    this.total_number = 0;
    this.categories_list = [];
    this.getCategories(this.page);
  }


  /**
 * Obtener catregorias de una org
 */
  getCategories(page) {
    this.loadingService.presentLoading().then(() => {
      this.categoryService.getCategoriesByOrg(Global.organization_id, page, this.limit).subscribe(res => {
        console.log(res);
        if (res.status == 200) {
          this.total_number = res.body.count;
          for (let index = 0; index < res.body.results.length; index++) {
            let c: Category = new Category();
            c.name = res.body.results[index].name;
            c.level = res.body.results[index].level;
            c.organization = res.body.results[index].organization;
            c.image = res.body.results[index].image;
            c.id = res.body.results[index].id;
            this.categories_list.push(c);
          }
          console.log(this.categories_list);
          this.preload = false;
          this.loadingData = false;
          this.loadingService.dismissLoading();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('ecommerce.categories.error_org_cat'));
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


  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }


  loadData(event){
      this.page += 1;
      this.loadingData = true;
      let offset = (((this.page + 1) - 1) * this.limit);
      this.loadingService.presentLoading().then(() => {
        this.categoryService.getCategoriesByOrg(Global.organization_id, offset, this.limit).subscribe(res => {
          console.log(res);
          if (res.status == 200) {
            this.total_number = res.body.count;
            console.log(this.total_number);
            for (let index = 0; index < res.body.results.length; index++) {
              let c: Category = new Category();
              c.name = res.body.results[index].name;
              c.level = res.body.results[index].level;
              c.organization = res.body.results[index].organization;
              c.image = res.body.results[index].image;
              c.id = res.body.results[index].id;
              this.categories_list.push(c);
            }
            console.log(this.categories_list);
            this.preload = false;
            this.loadingData = false;
            event.target.complete();
            if (this.categories_list.length == this.total_number) {
                event.target.disabled = true;
              }
            this.loadingService.dismissLoading();
          }
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('ecommerce.categories.error_org_cat'));
        });
      });


     

  }
}
