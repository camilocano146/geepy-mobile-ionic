import { Component, OnInit } from '@angular/core';
import {SimModalESimsInstructionsAndroidComponent} from '../sim-modal-e-sim-instructions-android/sim-modal-e-sims-instructions-android.component';
import {SimModalESimsInstructionsIosComponent} from '../sim-modal-e-sim-instructions-ios/sim-modal-e-sims-instructions-ios.component';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-popover-activation',
  templateUrl: './popover-activation.component.html',
  styleUrls: ['./popover-activation.component.scss'],
})
export class PopoverActivationComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  async openAndroidManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsInstructionsAndroidComponent,
    });
    return await modal.present();
  }

  async openIOSManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsInstructionsIosComponent,
    });
    return await modal.present();
  }
}
