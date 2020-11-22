import {Component, OnInit} from '@angular/core';
import {PopoverComponent} from '../../../../common-components/popover/popover.component';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {TranslateService} from '@ngx-translate/core';
import {Global} from '../../../../models/global/global';
import {LabelService} from '../../../../services/label/label.service';
import {ToastService} from '../../../../services/toast/toast.service';
import {GeotrackLabel} from '../../../../models/geotrack-label/GeotrackLabel';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  public allLabelsList: GeotrackLabel[];
  private preload: boolean;
  private interval: any;
  public filterLabelsList: GeotrackLabel[];

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private loadingService: LoadingService,
    private labelService: LabelService,
    private toastService: ToastService,
    private translate: TranslateService,
    public modalController: ModalController
  ) {
    this.loadLabels();
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

  private loadLabels() {
    this.startLoading();
    this.labelService.getAllLabelsByOrganizationId(Global.organization_id, 0, 99999999).subscribe(
      value => {
        this.preload = false;
        this.allLabelsList = value.results;
        this.filterLabelsList = JSON.parse(JSON.stringify(this.allLabelsList));
        // this.list = value.results;
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError(this.translate.instant('geo.labels.error_load_table'));
      }
    );
  }

  applyFilter(value: string) {
    this.filterLabelsList.splice(0, this.filterLabelsList.length);
    for (const label of this.allLabelsList) {
      if (label.description.toUpperCase().includes(value.toUpperCase())) {
        this.filterLabelsList.push(label);
      }
    }
  }
}
