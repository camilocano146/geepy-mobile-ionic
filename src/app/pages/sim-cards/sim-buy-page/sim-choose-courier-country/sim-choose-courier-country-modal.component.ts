import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-sim-modal-buy',
  templateUrl: './sim-choose-courier-country-modal.component.html',
  styleUrls: ['./sim-choose-courier-country-modal.component.scss'],
})
export class SimChooseCourierCountryModal implements OnInit {
  // Lenguaje
  public language: string;
  public listCourier = [];
  lng: any = -72;
  lat: any = -5;
  zoom: any = 3;
  widthIcon: number = 30;
  heightIcon: number = 30;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private navParams: NavParams,
    private toastController: ToastController,
  ) {
    this.language = this.translate.currentLang;
    this.listCourier = this.navParams.get('data');
  }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  chooseCourier(courier: any) {
    this.modalController.dismiss(courier);
  }
}
