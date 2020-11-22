import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Global} from '../../../../../models/global/global';
import {FormControl, Validators} from '@angular/forms';
import {IotGroupsGeotrackService} from '../../../../../services/io-groups-geotrack/iot-groups-geotrack.service';
import {LabelService} from '../../../../../services/label/label.service';
import {ModalController} from '@ionic/angular';
import {ToastService} from '../../../../../services/toast/toast.service';
import {LoadingService} from '../../../../../services/loading/loading.service';

@Component({
  selector: 'app-group-register',
  templateUrl: './group-register.component.html',
  styleUrls: ['./group-register.component.scss'],
})
export class GroupRegisterComponent implements OnInit {
  /**
   * Preload create/edit
   */
  public preload_update: boolean;
  maxLengthName = 45;
  maxLengthDescription = 65;
  /**
   * nombre
   */
  public name: FormControl = new FormControl(
    null,
    [Validators.required, Validators.minLength(2), Validators.maxLength(this.maxLengthName)]
  );
  /**
   * Dewscripcion
   */
  public description: FormControl = new FormControl(
    null,
    [Validators.minLength(2), Validators.maxLength(this.maxLengthDescription)]
  );

  constructor(
    private translate: TranslateService,
    private groupService: IotGroupsGeotrackService,
    private labelService: LabelService,
    public modalController: ModalController,
    public toastService: ToastService,
    public loadingService: LoadingService,
  ) { }

  ngOnInit() {}

  /**
   * obtener grupo
   */
  buildBody() {
    if (this.description.value) {
      return {
        name: this.name.value,
        description: this.description.value,
        organization: Global.organization_id,
      };
    } else {
      return {
        name: this.name.value,
        organization: Global.organization_id,
      };
    }
  }

  /**
   * Guardar el grupo
   */
  save() {
    if (this.name.valid && this.description.valid) {
      this.preload_update = true;
      const body = this.buildBody();
      console.log(body);
      this.groupService.createGroup(body).subscribe(res => {
        this.toastService.presentToastOk(this.translate.instant('geo.groups.create_ok'));
        this.preload_update = false;
        this.modalController.dismiss('created');
      }, err => {
        this.preload_update = false;
        this.toastService.presentToastError(this.translate.instant('geo.groups.error_create'));
      });
    } else {
      this.name.markAsTouched();
      this.description.markAsTouched();
    }
  }


  /**
   * Mensaje de error nombre
   */
  getErrorMessageName() {
    return this.name.hasError("required")
      ? this.translate.instant('geo.common.mandatory')
      : this.name.hasError("minlength")
        ? this.translate.instant('geo.common.min_2')
        : this.name.hasError("maxlength")
          ? this.translate.instant('geo.common.max_45')
          : "";
  }

  /**
   * Mensaje de error nombre
   */
  getErrorMessageDescription() {
    return this.description.hasError("required")
      ? this.translate.instant('geo.common.mandatory')
      : this.description.hasError("minlength")
        ? this.translate.instant('geo.common.min_2')
        : this.description.hasError("maxlength")
          ? this.translate.instant('geo.common.max_65')
          : "";
  }
}
