import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-sim-modal-see-sms',
  templateUrl: './sim-modal-see-sms.component.html',
  styleUrls: ['./sim-modal-see-sms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimModalSeeSmsComponent implements OnInit {

  /**
  * Info de la sim actual
  */
  @Input() sms: any;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.popoverController.dismiss();
  }
}
