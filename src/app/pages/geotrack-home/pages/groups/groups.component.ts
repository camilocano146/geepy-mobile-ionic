import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {TranslateService} from '@ngx-translate/core';
import {GroupRegisterComponent} from './group-register/group-register.component';
import {IotGroupsGeotrackService} from '../../../../services/io-groups-geotrack/iot-groups-geotrack.service';
import {Global} from '../../../../models/global/global';
import {ToastService} from '../../../../services/toast/toast.service';
import {GroupGeotrack} from '../../../../models/geotrack-group/GeotrackGroup';

@Component({
  selector: 'app-groupd',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  public allGroupsList: GroupGeotrack[];
  public filterGroupsList: any[];
  private preload: boolean;
  private interval: any;

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private translate: TranslateService,
    private toastService: ToastService,
    private groupsService: IotGroupsGeotrackService,
    public modalController: ModalController
  ) {
    this.loadGroups();
  }

  private loadGroups() {
    this.startLoading();
    this.groupsService.getIotGroupsGeoTrackByOrganizationId(Global.organization_id, 0, 9999999).subscribe(
      value => {
        this.preload = false;
        this.allGroupsList = value.results;
        this.filterGroupsList = JSON.parse(JSON.stringify(this.allGroupsList));
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError(this.translate.instant('geo.groups.error_load_table'));
      }
    );
  }

  ngOnInit() {
  }

  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    this.interval = setInterval(() => {
      if (this.preload === false) {
        clearInterval(this.interval);
        this.interval = null;
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  async openModalRegisterGroup() {
    const modal = await this.modalController.create({
      component: GroupRegisterComponent,
      componentProps: {
        'data': 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        this.loadGroups();
      }
    }).catch();
    return await modal.present();
  }

  applyFilter(value: string) {
    this.filterGroupsList.splice(0, this.filterGroupsList.length);
    for (const group of this.allGroupsList) {
      if (group.name.toUpperCase().includes(value.toUpperCase())) {
        this.filterGroupsList.push(group);
      }
    }
  }

  openModalSettings(item: any) {
  }
}
