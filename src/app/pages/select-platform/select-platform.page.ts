import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationService } from 'src/app/services/organization/organization.service';
import { Global } from 'src/app/models/global/global';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-select-platform',
  templateUrl: './select-platform.page.html',
  styleUrls: ['./select-platform.page.scss'],
})
export class SelectPlatformPage implements OnInit {

  //----Preload------------
  public preload: boolean;
  //----Erros--------------
  public error: boolean;
  public errorMessage: string;
  //----Lista de plataformas
  public organization_platforms_list: any[];
  public platforms_list: any[];

  public logos: string[];

  public isReseller: boolean;
  public user: User;

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private navController: NavController,
    private organizationService: OrganizationService,
    private translate: TranslateService,
    private toastController: ToastController,
    private popoverController: PopoverController) {
    this.isReseller = false;
    this.platforms_list = [];
  }

  ngOnInit() {
    this.loadingService.presentLoading().then( () => {
     let u = JSON.parse(localStorage.getItem("g_c_user"));
      console.log(u);
      this.userService.obtainUserById(u.id).subscribe( res => {
       
        this.user =  res.body;
        console.log(this.user);
        this.userService.getUserType(this.user.id).subscribe( res => {
         
          console.log(res);
          if(res.body.user_type == "Basic"){
            this.isReseller = false;
            this.getOrganizationPlatforms();
          } else if(res.body.user_type == "Refered"){
            this.isReseller = true;
            this.getResellerPlatforms(this.user.referrer);
          } else {
            this.isReseller = true;
            this.getResellerPlatforms(this.user.id);
          }
        }, err => {
          console.log(err);
          this.errorMessage = this.translate.instant('select_platform.error_get_platforms');
        });
      }, err => {
        console.log(err);
        this.errorMessage = this.translate.instant('select_platform.error_get_platforms');
      });



    });
  }

  /**
   * Trae las plataformas de la org
   */
  getOrganizationPlatforms() {
      this.organizationService.getOrganizationPlatforms(Global.organization_id).subscribe(res => {
        if (res.status == 200) {
          this.organization_platforms_list = [];
          this.organization_platforms_list = res.body;
          this.organization_platforms_list.sort((a, b) => a.platform.name.localeCompare(b.platform.name));
          for (let index = 0; index < this.organization_platforms_list.length; index++) {
            if (this.organization_platforms_list[index].is_active == false) {
              this.organization_platforms_list.splice(index, 1);
            }
          }
          for (let index2 = 0; index2 < this.organization_platforms_list.length; index2++) {
            if (this.organization_platforms_list[index2].platform.id != Global.platform_voyager_id) {
              this.organization_platforms_list.splice(index2, 1);
            }
          }
          this.preload = false;
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();
        console.log(err);
        this.error = true;
        this.errorMessage = this.translate.instant('select_platform.error_get_platforms');
        this.preload = false;
      });
  }

 /**
   * Platformas de reseller
   */
  getResellerPlatforms(id) {
    this.userService.getResellerPlatforms(id).subscribe(res2 => {
      console.log(res2);
      this.platforms_list = res2.body;
      this.preload = false;
      this.loadingService.dismissLoading();
    }, err => {
      console.log(err);
      this.error = true;
      this.loadingService.dismissLoading();
      this.errorMessage = this.translate.instant('platform.users.platforms.error_reseller');
    });
  }

  /**
     * Redirigue a la plataforma selccionada
     */
  goPlatform(i) {
    switch (i) {
      case Global.platform_voyager_id:
        this.goPlatform1();
        break;
    }
  }

  /**
   * Ir a la plataforma Iot
   */
  goPlatform1() {
    this.navController.navigateRoot('home');
  }
  /**
   * Ir a la plataforma voyager
   */
  goPlatform2() {
    this.navController.navigateRoot('iridium-home');
  }



  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
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
