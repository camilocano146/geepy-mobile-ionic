import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { TranslateService } from '@ngx-translate/core';
import {FormControl, Validators} from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import {CountriesService} from '../../services/countries/countries.service';
import {Country} from '../../models/country/Country';
import {Zone} from '../../models/zone/Zone';
import {HelpComponent} from '../../common-components/help/help.component';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.page.html',
  styleUrls: ['./zones.page.scss'],
})
export class ZonesPage implements OnInit {

  /**
   * Lista de zonas
   */
  public zonesList: Zone[];
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
  public countriesSelected: Country[];
  public countriesList: Country[];
  public copyCountriesList: Country[];
  public countrySelect: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private loadingService: LoadingService,
    private zonesService: ZonesService,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private toastController: ToastController,
    private navController: NavController,
    private countriesService: CountriesService,
    private modalController: ModalController,
  ) {
    this.zonesList = [];
    this.paises = [];
    this.countries = [];
    this.copyCountriesList = [];
    this.countriesSelected = [];
    this.zoneSelected = new FormControl(null);
    this.current_language = this.translate.currentLang;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.zonesList.splice(0, this.zonesList.length);
    this.paises.splice(0, this.paises.length);
    this.countries.splice(0, this.countries.length);
    this.copyCountriesList.splice(0, this.copyCountriesList.length);
    this.countriesSelected.splice(0, this.countriesSelected.length);
    this.loadingService.presentLoading().then( () => {
      this.zonesList = [];
      this.zoneSelected = new FormControl(null);
      this.current_language = this.translate.currentLang;
      this.zonesService.getZones().subscribe(res => {
        if (res.status == 200) {
          this.zonesList = res.body;
          this.loadingService.dismissLoading();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('zones.no_load_countries'));
      });

      this.countriesService.getCountries().subscribe(res => {
        if (res.status == 200) {
          this.countriesList = res.body;
          this.copyCountriesList.push(...res.body);
          if (this.current_language === 'es') {
            // @ts-ignore
            this.countriesList.sort((a, b) => a.nombre.localeCompare(b.nombre));
          } else {
            // @ts-ignore
            this.countriesList.sort((a, b) => a.name.localeCompare(b.name));
          }
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('register_user.data.error_country'));
        console.log(err);
      });
    });
  }

  applyFilter(e: string) {
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
      if (element.toLowerCase().includes(e.toLowerCase())) {
        aux1.push(element);
      }
    }
    this.paises = aux1;
    //en ingles
    let aux2 = [];
    for (let index1 = 0; index1 < this.countries.length; index1++) {
      const element: string = this.countries[index1];
      if (element.toLowerCase().includes(e.toLowerCase())) {
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

  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  changeSimsAutocomplete() {
    const countryValue = this.countrySelect.value.toString().toLowerCase();
    if (this.current_language === 'es') {
      this.countriesList = this.copyCountriesList.filter(c => c.nombre.toLowerCase().includes(countryValue));
    } else {
      this.countriesList = this.copyCountriesList.filter(c => c.name.toLowerCase().includes(countryValue));
    }
  }

  onSelectOption(option: Country) {
    const index = this.countriesSelected.indexOf(option);
    if (index === -1) {
      this.countriesSelected.push(option);
    }
    this.countrySelect.setValue('');
  }

  getCountryName(option: Country) {
    return this.current_language === 'es' ? option.nombre : option.name;
  }

  getZonesOfCountry(country: Country) {
    const zonesOfThisCountry = [];
    for (const zone of this.zonesList) {
      const index = zone.countries.indexOf(country.name);
      if (index !== -1) {
        zonesOfThisCountry.push(zone.name);
      }
    }
    return zonesOfThisCountry.join(', ');
  }

  removeSelectedCountry(country: Country) {
    const index = this.countriesSelected.indexOf(country);
    if (index !== -1) {
      this.countriesSelected.splice(index, 1);
    }
  }

  async helpDialog($event: MouseEvent) {
    const modal = await this.modalController.create({
      component: HelpComponent
    });
    return await modal.present();
  }
}
