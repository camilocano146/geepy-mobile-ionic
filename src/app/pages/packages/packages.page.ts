import { Component, OnInit } from '@angular/core';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
  /**
   * Preload de las cuentas
   */
  public preload_packages: number;
  /**
   * Lista de paquetes
   */
  public accounts_list: ServiceAccountOrganization[];

  constructor(
    private translate: TranslateService,
    private toastController: ToastController,
    private navController: NavController,
    private loadingService: LoadingService,
    private serviceAccountService: ServiceAccountService) {
    this.preload_packages = 0;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then(() => {
      this.serviceAccountService.getServiceAccountByOrg().subscribe(res => {
        if (res.status == 200) {
          this.accounts_list = res.body;
          this.loadingService.dismissLoading();
          if (this.accounts_list.length == 0) {
            this.preload_packages = 1;
          } else if (this.accounts_list.length > 0) {
            this.preload_packages = 2;
          }
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('packages.error_packages'));
        console.log(err);
      });
    });
  }
  goToHome(){
    this.navController.navigateBack('select-platform');
  }
  async presentToastError(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
}
