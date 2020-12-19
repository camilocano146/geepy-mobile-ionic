import { Component, OnInit } from '@angular/core';
import {SimModalESimsInstructionsAndroidComponent} from '../sim-modal-e-sim-instructions-android/sim-modal-e-sims-instructions-android.component';
import {SimModalESimsInstructionsIosComponent} from '../sim-modal-e-sim-instructions-ios/sim-modal-e-sims-instructions-ios.component';
import {ModalController} from '@ionic/angular';
import {SimModalESimsCompatibleAndroidDevicesComponent} from '../../select-platform/sim-modal-e-sim-compatible-android-devices/sim-modal-e-sims-compatible-android-devices.component';

@Component({
  selector: 'app-popover-activation',
  templateUrl: './popover-compatible-devices.component.html',
  styleUrls: ['./popover-compatible-devices.component.scss'],
})
export class PopoverCompatibleDevicesComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  async openAndroidManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsCompatibleAndroidDevicesComponent,
      componentProps: {
        data: SimModalESimsCompatibleAndroidDevicesComponent.COMPATIBLE_DEVICES_ANDROID,
      }
    });
    return await modal.present();
  }

  async openIOSManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsCompatibleAndroidDevicesComponent
    });
    return await modal.present();
  }
}
