import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sim-modal-see-real',
  templateUrl: './sim-modal-see-real.component.html',
  styleUrls: ['./sim-modal-see-real.component.scss'],
})
export class SimModalSeeRealComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

}
