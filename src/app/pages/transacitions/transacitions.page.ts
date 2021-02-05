import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import {ToastController, PopoverController, ModalController, NavController, IonInfiniteScroll} from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { TranslateService } from '@ngx-translate/core';
import { TransacitionsModalStripeComponent } from './transacitions-modal-stripe/transacitions-modal-stripe.component';
import { TransacitionsModalPaypalComponent } from './transacitions-modal-paypal/transacitions-modal-paypal.component';
import { BillingService } from 'src/app/services/billing/billing.service';
import { TransacitionsModalSeeComponent } from './transacitions-modal-see/transacitions-modal-see.component';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-transacitions',
  templateUrl: './transacitions.page.html',
  styleUrls: ['./transacitions.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransacitionsPage implements OnInit {

  public user: any;
  public paymentsList: any[];
  public preloadTransactions: boolean;
  private nextPage: boolean;
  public pageSim = 0;
  public limit = 40;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    public toastController: ToastController,
    public popoverController: PopoverController,
    private translate: TranslateService,
    private modalController: ModalController,
    private navController: NavController,
    private billingService: BillingService) {
      this.user = null;
      this.paymentsList = [];
    }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.preloadTransactions = true;
    this.nextPage = true;
    this.loadTransactions();
    this.loadingService.presentLoading().then(() => {
      this.userService.obtainUserByToken().subscribe(res => {
        this.user = res.body;
        this.loadingService.dismissLoading();
      }, error => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('profile.error.profile'));
      });
    });
  }

  loadTransactions(eventInfiniteScroll?: CustomEvent) {
    if (this.nextPage) {
      this.billingService.getTransactions(this.pageSim++ * this.limit, this.limit).subscribe(res => {
        this.nextPage = !!res.body.next;
        this.preloadTransactions = false;
        this.paymentsList.push(...res.body?.results);
        console.log(this.paymentsList);
        // @ts-ignore
        eventInfiniteScroll?.target?.complete();
        if (!this.nextPage) {
          this.ionInfiniteScroll.disabled = true;
        }
      }, err => {
        console.log(err);
        this.preloadTransactions = false;
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('payments.error.no_load_payments'));
      });
    }
  }

  /**
   * Abre modal de stripe
   */
  async goToStripe(){
    const modal = await this.modalController.create({
      component: TransacitionsModalStripeComponent,
      componentProps: {
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "created") {
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }
  /**
   * Abre modal de paypal
   */
  async goToPayPal(){
    const modal = await this.modalController.create({
      component: TransacitionsModalPaypalComponent,
      componentProps: {
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "created") {
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }
  /**
   * Abre modal de detalles
   */
  async goToDetails(data){
    const modal = await this.modalController.create({
      component: TransacitionsModalSeeComponent,
      componentProps: {
        'data': data
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "created") {
        this.ionViewDidEnter();
      }
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

  loadMoreData(eventInfiniteScroll: CustomEvent) {
    this.loadTransactions(eventInfiniteScroll);
  }
}
