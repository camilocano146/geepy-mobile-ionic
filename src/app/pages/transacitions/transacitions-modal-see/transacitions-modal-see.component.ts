import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-transacitions-modal-see',
  templateUrl: './transacitions-modal-see.component.html',
  styleUrls: ['./transacitions-modal-see.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransacitionsModalSeeComponent implements OnInit {

  @Input() data: any;

  constructor(
    private modalController: ModalController,
    private iab: InAppBrowser) { }

  ngOnInit() {
  }

  downloadStripe(){
    const browser = this.iab.create(this.data.payment_receipt,'_system');
  }
  downloadPaypal(){
    const browser = this.iab.create('https://www.paypal.com/','_system');
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

}
