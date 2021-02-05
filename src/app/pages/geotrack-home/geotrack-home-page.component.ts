import { Component, OnInit } from '@angular/core';
import {PopoverComponent} from '../../common-components/popover/popover.component';
import {NavController, PopoverController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../services/loading/loading.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-geotrack-home',
  templateUrl: './geotrack-home-page.component.html',
  styleUrls: ['./geotrack-home-page.component.scss'],
})
export class GeotrackHomePage implements OnInit {
  public tabTitle: any;

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private translate: TranslateService,
  ) {
    this.changeTab('geo.menu.devices');
  }

  ngOnInit() {}

  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }

  changeTab(comand: string) {
    this.tabTitle = this.translate.instant(comand);
  }
}
