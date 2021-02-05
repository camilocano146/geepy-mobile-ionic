import {Component, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {LabelService} from '../../../../../services/label/label.service';
import {IotDeviceGeotrackService} from '../../../../../services/io-device-geotrack/iot-device-geotrack.service';
import {Global} from '../../../../../models/global/global';
import {LoadingService} from '../../../../../services/loading/loading.service';
import {ToastService} from '../../../../../services/toast/toast.service';
import {LocalStorageService} from '../../../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.scss'],
})
export class DeviceRegisterComponent implements OnInit {
  /**
   * Prrload
   */
  public preload: boolean;
  public preload_types: boolean;
  public preload_platforms: boolean;
  public preload_label: boolean;
  /**
   * Preload create/edit
   */
  public preload_update: boolean;
  /**
   * Nombre del sipositivo
   */
  public name: FormControl;
  /**
   * IMEI
   */
  public imei: FormControl;
  /**
   * Lista de tipos
   */
  public types_list: any[];
  /**
   * Tipó seleccionado
   */
  public type_selected: FormControl;
  /**
   * Lista platsformas
   */
  public platforms_list: any[];
  /**
   * Plataforma selccioanda
   */
  public platform_selected: FormControl;
  /**
   * Lista de etiquetas
   */
  public labels_list: any[];
  /**
   * Etiqueta selecioonada selccioanda
   */
  public label_selected: FormControl;
  public readonly maxNameLength = 30;
  public readonly maxImeiLength = 20;
  public interval: any;

  constructor(
    private labelService: LabelService,
    private iotDeviceGeotrackService: IotDeviceGeotrackService,
    public modalController: ModalController,
    public toastController: ToastController,
    public toastService: ToastService,
    public loadingService: LoadingService,
    public translate: TranslateService,
    public localStorageService: LocalStorageService
  ) {
    this.type_selected = new FormControl(null, [Validators.required]);
    this.platform_selected = new FormControl(null, [Validators.required]);
    this.label_selected = new FormControl(null, [Validators.required]);
    this.name = new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(this.maxNameLength)]);
    this.imei = new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(this.maxImeiLength)]);
    this.types_list = [];
    this.platforms_list = [];
    this.labels_list = [];
    this.preload_update = false;
    this.preload_types = true;
    this.preload_platforms = true;
    this.preload_label = true;
  }

  ngOnInit() {
    this.startLoading();
    this.getTypes();
    this.gePlatformas();
    this.getLabels();
  }

  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    this.interval = setInterval(() => {
      if (this.preload_label === false &&
        this.preload_platforms === false &&
        this.preload_types === false) {
        clearInterval(this.interval);
        this.interval = null;
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  /**
   * Obtener tipos
   */
  getTypes() {
    this.iotDeviceGeotrackService.getTypesIotDeviceGeotrack().subscribe(res => {
      this.types_list = res.body;
      this.preload_types = false;
    }, err => {
      this.preload_types = false;
      this.loadingService.dismissLoading();
      this.toastService.presentToastError(this.translate.instant('geo.devices.register.types_error'));
    });
  }

  /**
   * Obtener plataformas
   */
  gePlatformas() {
    this.iotDeviceGeotrackService.getPlatformsIotDeviceGeotrack().subscribe(res => {
      this.platforms_list = res.body;
      this.preload_platforms = false;
    }, err => {
      this.preload_platforms = false;
      this.loadingService.dismissLoading();
      this.toastService.presentToastError(this.translate.instant('geo.devices.register.platform_error'));
    });
  }

  /**
   * Obtener etiquetas
   */
  getLabels() {
    this.preload_label = true;
    this.labelService.getAllLabelsByOrganizationId(Global.organization_id, 0, 9999).subscribe(res => {
      this.labels_list = res.results;
      this.preload_label = false;
    }, err => {
      this.preload_label = false;
      this.loadingService.dismissLoading();
      this.toastService.presentToastError(this.translate.instant('geo.devices.register.labels_error'));
    });
  }

  /**
   * Registra dispositrivo
   */
  save() {
    if (this.type_selected.valid && this.platform_selected.valid && this.label_selected.valid && this.imei.valid && this.name.valid) {
      this.preload_update = true;
      const data = {
        name: this.name.value,
        imei: this.imei.value,
        organization: Global.organization_id,
        type: +this.type_selected.value,
        platforms: this.platform_selected.value,
        status: 1,
        user: this.localStorageService.getStorageUser().id,
        iot_device_label: +this.label_selected.value
      };
      console.log(data);
      this.iotDeviceGeotrackService.register(data).subscribe(res => {
        this.modalController.dismiss('created');
        this.toastService.presentToastOk(this.translate.instant('geo.devices.register.register_ok'));
      }, err => {
        this.preload_update = false;
        if (err.error.imei) {
          this.toastService.presentToastError(this.translate.instant('geo.devices.register.imei_already'));
        } else {
          this.toastService.presentToastError(this.translate.instant('geo.devices.register.register_error'));
        }
      });
    } else {
      this.type_selected.markAsTouched();
      this.platform_selected.markAsTouched();
      this.label_selected.markAsTouched();
      this.imei.markAsTouched();
      this.name.markAsTouched();
    }
  }

  /**
   * Mensaje de error imei
   */
  getErrorMessageImei() {
    return this.imei.hasError('required')
      ? this.translate.instant('geo.devices.register.write')
      : this.imei.hasError('minlength')
        ? this.translate.instant('geo.devices.register.min_5')
        : this.imei.hasError('maxlength')
          ? this.translate.instant('geo.devices.register.max_20')
          : '';
  }

  /**
   * Mensaje de error nombre
   */
  getErrorMessageName() {
    return this.name.hasError('required')
      ? this.translate.instant('geo.devices.register.write')
      : this.name.hasError('minlength')
        ? this.translate.instant('geo.devices.register.min_2')
        : this.name.hasError('maxlength')
          ? this.translate.instant('geo.devices.register.max_30')
          : '';
  }

  getNamePlatform() {
    return this.platforms_list.find(p => p.id === this.platform_selected.value[0]).name;
  }
}
