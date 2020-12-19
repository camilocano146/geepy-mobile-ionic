import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { FormControl, Validators } from '@angular/forms';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderSimsVoyager } from 'src/app/models/order/order';
import { CourierService } from 'src/app/services/courier/courier.service';
import { Global } from 'src/app/models/global/global';
import { Courier } from 'src/app/models/courier/courier';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-sim-modal-buy',
  templateUrl: './sim-modal-e-sims-instructions-ios.component.html',
  styleUrls: ['./sim-modal-e-sims-instructions-ios.component.scss'],
})
export class SimModalESimsInstructionsIosComponent implements OnInit {
  // Lenguaje
  public language: string;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
}
