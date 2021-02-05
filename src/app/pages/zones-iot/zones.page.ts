import { Component, OnInit } from '@angular/core';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PopoverController, ToastController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.page.html',
  styleUrls: ['./zones.page.scss'],
})
export class ZonesPage implements OnInit {

  /**
   * Lista de zonas
   */
  public zonesList: any[];
  /**
   * Zona selecioanda
   */
  public zoneSelected: FormControl;
  /**
   * lenguaje actual
   */
  public current_language: string;
  /**
   * paises full por zona
   */
  public paises: any[];
  /**
   * countries full por zona
   */
  public countries: any[];

  constructor(
    private navController: NavController,
    private loadingService: LoadingService,
    private zonesService: ZonesService,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private toastController: ToastController
  ) {
    this.zonesList = [];
    this.paises = [];
    this.countries = [];
    this.zoneSelected = new FormControl(null);
    this.current_language = this.translate.currentLang;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then( () => {
      this.zonesList = [];
      this.zoneSelected = new FormControl(null);
      this.current_language = this.translate.currentLang;
      this.zonesService.getZonesIot().subscribe(res => {
        if (res.status == 200) {
          this.zonesList = res.body;
          this.loadingService.dismissLoading();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('zones.no_load_countries'));
      });
    });
  }

  applyFilter(e) {
    this.paises = [];
    this.countries = [];
    this.zoneSelected.value.paises.forEach(element => {
      this.paises.push(element);
    });
    this.zoneSelected.value.countries.forEach(element => {
      this.countries.push(element);
    });
    let aux1 = [];
    for (let index = 0; index < this.paises.length; index++) {
      const element: string = this.paises[index];
      if (element[0].toLowerCase().includes(e.toLowerCase())) {
        aux1.push(element);
      }
    }
    this.paises = aux1;
    //en ingles
    let aux2 = [];
    for (let index1 = 0; index1 < this.countries.length; index1++) {
      const element: string = this.countries[index1];
      if (element[0].toLowerCase().includes(e.toLowerCase())) {
        aux2.push(element);
      }
    }
    this.countries = aux2;
  }


  changeZone() {
    this.paises = [];
    this.countries = [];
    this.zoneSelected.value.paises.forEach(element => {
      this.paises.push(element);
    });
    this.zoneSelected.value.countries.forEach(element => {
      this.countries.push(element);
    });
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
  goToHome(){
    this.navController.navigateBack('select-platform');
  }
}
