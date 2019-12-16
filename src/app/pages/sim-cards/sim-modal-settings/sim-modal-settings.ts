import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, ToastController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { FormControl, Validators } from '@angular/forms';
import { BuyPackageTop } from 'src/app/models/package/BuyPackageTop';
import { SimModalSendSmsComponent } from '../sim-modal-send-sms/sim-modal-send-sms.component';
import { SimModalSeeSmsComponent } from '../sim-modal-see-sms/sim-modal-see-sms.component';
import { ExtraNumbersService } from 'src/app/services/extra-numbers/extra-numbers.service';
import { } from 'googlemaps';

@Component({
  selector: 'sim-modal-settings',
  templateUrl: './sim-modal-settings.html',
  styleUrls: ['./sim-modal-settings.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimModalSettings implements OnInit {
  /**
   * Info de la sim actual
   */
  @Input() sim_current: any;
  public simCurrent: any;
  //---------Extra numbers
  public extraNumbersList: any[];
  public number_to_delete: FormControl;
  public newNumber: FormControl;
  //---------Preloads
  public preload_simcard: boolean;
  public preload_package: boolean;
  public preload_conectivity: boolean;
  public preload_endpoint: boolean;
  public preload_events: boolean;
  public preload_avaiable_packages: boolean;
  public preload_get_extra_numbers_list: boolean;
  public preload_location_point: boolean;
  //---------Paquetes disponibles
  public avaibalePackages: any;
  //---------Simcard
  public leftData: number;
  //---------Endpoint
  public value_endpoint: FormControl;
  public endpoint: any;
  //---------Paquetes sim
  public package: any;
  //---------Conectividad
  public conectivity: any;
  //---------Last events
  public lastEvents: any;
  //---------SMS
  public listSMS: any[];
  public cost_usd: number;
  public cost_eur: number;
  //---------Location
  public lat = 4.8475;
  public lng = -74.76718;
  public location_data: any;
  public location_status: any;
  public total_location_queries: any;
  public location_service_on: number;
  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  public showHeat: boolean;


  constructor(
    public modalController: ModalController,
    private translate: TranslateService,
    public toastController: ToastController,
    private simCardService: SimCardService,
    public popoverController: PopoverController,
    private extraNumberService: ExtraNumbersService) {
    this.number_to_delete = new FormControl("", Validators.required);
    this.value_endpoint = new FormControl("", [Validators.minLength(5), Validators.maxLength(30)]);
    this.newNumber = new FormControl("", [Validators.required]);
    this.listSMS = [];
    this.extraNumbersList = [];
    this.cost_eur = 0.25;
    this.cost_usd = 0.30;
    this.location_service_on = 0;
    this.showHeat = false;
  }

  ngOnInit(): void {

    this.getSimCardDetails();

  }
  /**
   * Obtiene información de la sim
   */
  getSimCardDetails() {
    this.simCardService.getSimCardById(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.simCurrent = res.body;
        this.number_to_delete.setValue(this.simCurrent.card_stat.card.enum);
        if (this.simCurrent.card_stat.discount) {
          if (this.simCurrent.card_stat.discount.gprs) {
            this.simCurrent.card_stat.discount.gprs.init_volume = this.simCurrent.card_stat.discount.gprs.init_volume / 1048576;
            this.simCurrent.card_stat.discount.gprs.left_volume = this.simCurrent.card_stat.discount.gprs.left_volume / 1048576;
            this.leftData = this.simCurrent.card_stat.discount.gprs.init_volume - this.simCurrent.card_stat.discount.gprs.left_volume;
          }
        }
        this.obtainPackage();
      }
    }, err => {
      this.presentToastError("We couldn't obtain details of simcard.");
    });
  }
  /**
     * Obtiene información de la sim
     */
  getSimCardDetailsWithOutOtherServices() {
    this.simCardService.getSimCardById(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.simCurrent = res.body;
        this.number_to_delete.setValue(this.simCurrent.card_stat.card.enum);
        if (this.simCurrent.card_stat.discount) {
          if (this.simCurrent.card_stat.discount.gprs) {
            this.simCurrent.card_stat.discount.gprs.init_volume = this.simCurrent.card_stat.discount.gprs.init_volume / 1048576;
            this.simCurrent.card_stat.discount.gprs.left_volume = this.simCurrent.card_stat.discount.gprs.left_volume / 1048576;
            this.leftData = this.simCurrent.card_stat.discount.gprs.init_volume - this.simCurrent.card_stat.discount.gprs.left_volume;
          }
        }
      }
    }, err => {
      this.presentToastError("We couldn't obtain details of simcard.");
    });
  }
  /**
   * Obtiene el paquete del la sim
   */
  obtainPackage() {
    this.simCardService.getCurrentPackage(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.package = res.body.discountm.gprs;
        this.package.amount = this.package.amount / 1048576;
        this.getLastEvents();
      }
    }, err => {
      this.presentToastError("We couldn't obtain packages of simcard.");
    });
  }
  /**
   * Ultimos eventos
   */
  getLastEvents() {
    this.simCardService.getLastActivity(this.sim_current.id).subscribe(res => {
      this.lastEvents = res.body;
      this.getConnectivity();
    }, err => {
      this.presentToastError("We couldn't get events simcard.");
    });
  }
  /**
 * Obtiene la conectividad
 */
  getConnectivity() {
    this.simCardService.getConectivity(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.conectivity = res.body;

        this.obtainEndPoint();


      }
    }, err => {
      this.presentToastError("We couldn't get events simcard.");
    });
  }
  /**
   * Obtiene el endpoint de la sim
   */
  obtainEndPoint() {
    this.simCardService.getSimCardEndpoint(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.endpoint = res.body;
        this.value_endpoint.setValue(this.endpoint.endpoint);

        this.obtainAvaiablesPackages();
      }
    }, err => {
      this.presentToastError("We couldn't obtain endpoint of simcard.");
    });
  }
  /**
   * Obtiene el endpoint de la sim
   */
  obtainEndPointWithOutOtherServices() {
    this.simCardService.getSimCardEndpoint(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.endpoint = res.body;
        this.value_endpoint.setValue(this.endpoint.endpoint);
      }
    }, err => {
      this.presentToastError("We couldn't obtain endpoint of simcard.");
    });
  }

  /**
 * Obtiene paquetes disponibles
 */
  obtainAvaiablesPackages() {
    this.simCardService.getAvaiablePackages(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.avaibalePackages = res.body;
        if (this.avaibalePackages.getserviceoptions.gprs) {
          if (this.avaibalePackages.getserviceoptions.gprs.activation_fee) {
            let l = this.avaibalePackages.getserviceoptions.gprs.activation_fee.length - 6;
            this.avaibalePackages.getserviceoptions.gprs.activation_fee = this.avaibalePackages.getserviceoptions.gprs.activation_fee.substring(0, l);
          } else {
            for (let index = 0; index < this.avaibalePackages.getserviceoptions.gprs.length; index++) {
              let l = this.avaibalePackages.getserviceoptions.gprs[index].activation_fee.length - 6;
              this.avaibalePackages.getserviceoptions.gprs[index].activation_fee = this.avaibalePackages.getserviceoptions.gprs[index].activation_fee.substring(0, l);
            }
          }
        }
        if (this.avaibalePackages.getserviceoptions.lbs) {
          if (this.avaibalePackages.getserviceoptions.lbs.activation_fee) {
            let l = this.avaibalePackages.getserviceoptions.lbs.activation_fee.length - 8;
            this.avaibalePackages.getserviceoptions.lbs.activation_fee = this.avaibalePackages.getserviceoptions.lbs.activation_fee.substring(0, l);
          } else {
            for (let index1 = 0; index1 < this.avaibalePackages.getserviceoptions.lbs.length; index1++) {
              let l = this.avaibalePackages.getserviceoptions.lbs[index1].activation_fee.length - 8;
              this.avaibalePackages.getserviceoptions.lbs[index1].activation_fee = this.avaibalePackages.getserviceoptions.lbs[index1].activation_fee.substring(0, l);

            }
          }
        }
        if (this.avaibalePackages.getserviceoptions.sms) {
          if (this.avaibalePackages.getserviceoptions.sms.activation_fee) {
            let l = this.avaibalePackages.getserviceoptions.sms.activation_fee.length - 8;
            this.avaibalePackages.getserviceoptions.sms.activation_fee = this.avaibalePackages.getserviceoptions.sms.activation_fee.substring(0, l);
          } else {
            for (let index2 = 0; index2 < this.avaibalePackages.getserviceoptions.sms.length; index2++) {
              let l = this.avaibalePackages.getserviceoptions.sms[index2].activation_fee.length - 8;
              this.avaibalePackages.getserviceoptions.sms[index2].activation_fee = this.avaibalePackages.getserviceoptions.sms[index2].activation_fee.substring(0, l);
            }
          }
        }
        if (this.avaibalePackages.getserviceoptions.voice) {
          if (this.avaibalePackages.getserviceoptions.voice.activation_fee) {
            let l = this.avaibalePackages.getserviceoptions.voice.activation_fee.length - 8;
            this.avaibalePackages.getserviceoptions.voice.activation_fee = this.avaibalePackages.getserviceoptions.voice.activation_fee.substring(0, l);
          } else {
            for (let index2 = 0; index2 < this.avaibalePackages.getserviceoptions.voice.length; index2++) {
              let l = this.avaibalePackages.getserviceoptions.voice[index2].activation_fee.length - 8;
              this.avaibalePackages.getserviceoptions.voice[index2].activation_fee = this.avaibalePackages.getserviceoptions.voice[index2].activation_fee.substring(0, l);
            }
          }
        }

        this.getSMSSimCard();
      }
    }, err => {
      this.presentToastError("We couldn't obtain avaiable packages.");
    });
  }

  /**
   * Activar paquete datos
   */
  activatePackage(packageToBuy, type) {
    let pb = new BuyPackageTop(packageToBuy, type, 'yes');
    this.simCardService.addPackageToSim(this.sim_current.id, pb).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk("Package purchased successfully!");
        this.ngOnInit();
      }
    }, err => {
      if (err.status == 400 && err.error.discount.text == "Card is blocked") {
        this.presentToastError("The simcard is blocked. Please unlock it first.");
      } else if (err.status == 400 && err.error.discount.text == "Not enough money") {
        this.presentToastError("Not enough money.");
      } else {
        this.presentToastError("We couldn't process your request.");
      }
    });
  }
  /**
   * Cancelar paquete
   * @param packageToBuy id del paquete
   * @param type Tipo
   */
  cancelPackage(packageToBuy, type) {
    let pb = new BuyPackageTop(packageToBuy, type, 'close');
    this.simCardService.addPackageToSim(this.sim_current.id, pb).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk("Package canceled successfully!");
        this.ngOnInit();
      }
    }, err => {
      if (err.status == 400 && err.error.discount.text == "Packet change terms were not met") {
        this.presentToastError("The package has not been activated yet. Please try again later.");
      } else {
        this.presentToastError("We couldn't process your request.");
      }
    });
  }
  /**
  * Desbloquea una simcard
  */
  unblockSimcard() {
    this.simCardService.unblockSimcard(this.sim_current.id).subscribe(res => {
      this.getSimCardDetailsWithOutOtherServices();
      this.presentToastOk('Sim Card activated succesfully.');
    }, err => {
      console.log(err);
      this.presentToastError("We couldn't activate sim card.");
    });
  }
  /**
   * Bloquea una simcard
   */
  blockSimcard() {
    this.simCardService.blockSimcard(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.getSimCardDetailsWithOutOtherServices();
        this.presentToastOk('Sim Card blocked successfully.');
      }
    }, err => {
      console.log(err);
      this.presentToastError("We couldn't suspend sim card.");
    });
  }
  /**
   * Agrega un número extra
   */
  addNewNumber() {
    if (this.newNumber.valid) {
      const enumNew = {
        enum: this.newNumber.value
      }
      this.simCardService.addNumber(this.sim_current.id, enumNew).subscribe(res => {
        if (res.status == 200) {
          this.presentToastOk("New number added successfully.");
          this.ngOnInit();
          this.newNumber.reset();
        }
      }, err => {
        if (err.status == 422 && err.error.enum.text == "Provided Extra Number already set for another card") {
          this.presentToastError("Provided Extra Number already set for another card.");
        } else {
          this.presentToastError("We couldn't add number to simcard.");
        }

      });
    }
  }

  deleteNumber() {
    const enumNew = {
      enum: this.number_to_delete.value
    }
    this.simCardService.deleteNumber(this.sim_current.id, enumNew).subscribe(res => {
      this.presentToastOk('Extra number has been deleted.');
      this.ngOnInit();
      this.number_to_delete.reset();
    }, err => {
      this.presentToastError("We couldn't remove number to simcard.");
    });
  }
  /**
   * Actualiza endpoint
   */
  updateEndpointName() {
    this.preload_endpoint = false;
    const endpont = {
      endpoint: this.value_endpoint.value
    }
    this.simCardService.updateEndpoint(this.sim_current.id, endpont).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk("Endpoint updated successfully.");
        this.preload_endpoint = true;
        this.obtainEndPointWithOutOtherServices();
      }
    }, err => {
      this.presentToastError("We couldn't update endpoint of simcard.");
    });
  }
  /**
     * Método para obtener los SMS de una sim
     */
  getSMSSimCard() {
    this.simCardService.getSMSofSim(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.listSMS = res.body;
        this.getExtraNumbers();
      }
    }, err => {
      this.presentToastError("We couldn't get SMS of Sim card.");
    });
  }

  async openModalSendSMS() {
    const modal = await this.modalController.create({
      component: SimModalSendSmsComponent,
      componentProps: {
        'sim_current': this.sim_current.id
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "sent") {
        this.getSMSSimCard();
      }
    }).catch();
    return await modal.present();
  }

  async openModalSeeSMS(sms: any) {
    console.log(sms);
    const popover = await this.popoverController.create({
      component: SimModalSeeSmsComponent,
      componentProps: {
        'sms': sms
      },
      mode: 'ios',
    });
    return await popover.present();
  }

  /**
   * Obtiene status del servicio de locacion
   */
  obtainStatusLocation() {
    this.simCardService.getLocationStatus(this.sim_current.id).subscribe(res => {
      this.location_data = res;
      console.log(this.location_data);
      if (res.status == 200) {
        if (res.body.record) {
          if (res.body.record.status == "disabled") {
            this.location_service_on = 1;
          }
        } else {
          this.location_status = res.body;
          this.total_location_queries = +this.location_status.records.record.queries_left + +this.location_status.records.record.queries_used;
          this.location_service_on = 2;
        }
        console.log(this.location_data);
        console.log(this.location_status);
      }
    }, err => {
      console.log(err);
      this.presentToastError("We couldn't obtain status location service.");
    });
  }
  /**
   * Activate location
   */
  activateLocationService(idPackage: number) {
    const idpPackage = {
      packetid: "" + idPackage
    }
    console.log(idpPackage);
      this.simCardService.activateLocationService(this.sim_current.id, idpPackage).subscribe(res => {
      if (res.status == 200) {
        this.obtainStatusLocation();
        this.presentToastOk("Location service activated successfuly!");
      }
    }, err => {
     console.log(err);
      if (err.status == 400 && err.error.record.text == "Service is blocked") {
        this.presentToastError("Location service is blocked. Please contact with the administrator site.");
      } else {
        this.presentToastError("We couldn't activate location service.");
      }
    }); 
  }
  /**
   * Obtiene locación
   */
  obtainLocation() {
    this.simCardService.getLocation(this.sim_current.id).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        if (res.body.record.text) {
          this.presentToastError("We couldn't obtain status location service.");
        } else if (res.body.record.latitude == null || res.body.record.longitude == null) {
          this.preload_location_point = true;
          this.presentToastWarning("This Simcard has no current coordinates. The service will be charged.");
          this.obtainStatusLocation();
        } else {
          this.showHeat = true;
          this.lat = +res.body.record.latitude;
          this.lng = +res.body.record.longitude;
          this.obtainStatusLocation();
        }
      }
    }, err => {
     this.presentToastError("We couldn't obtain location of simcard.");
    });
  }
  zoomChange(e) {
    var taxiData = [
      new google.maps.LatLng(this.lat, this.lng)
    ];
    let radio = 10;
    let pointArray = new google.maps.MVCArray(taxiData);
    if (e >= 13) {
      radio = 80;
    } else if (e <= 7) {
      radio = 10;
    } else if(e > 7 && e < 13){
      radio = 40;
    }
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray,
      radius: radio
    })
  }
  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(this.lat, this.lng),

    };
    this.map.setOptions(mapOptions);
    var taxiData = [
      new google.maps.LatLng(this.lat, this.lng)
    ];
    let pointArray = new google.maps.MVCArray(taxiData);

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray,
      radius: 60
    })
    this.heatmap.setMap(this.map);
  }

  /**
   * Reconecta la SIM
   */
  reconect(){
    this.simCardService.reconnectSim(this.sim_current.id).subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.presentToastOk("Conecctivity restarted.");
      }
    }, err => {
      console.log(err);
      this.presentToastError("We couldn't restart the connectivity.");
    });
  }
  /**
  * Obtiene lista numero extra
  */
  getExtraNumbers() {
    this.extraNumberService.getEnums().subscribe(res => {
      if (res.status == 200) {
        let list = [];
        res.body.forEach(element => {
          if (element.available == true) {
            list.push(element.enum);
          }
        });
        this.extraNumbersList = list;
        this.preload_get_extra_numbers_list = false;
        this.preload_endpoint = true;
        this.preload_conectivity = true;
        this.preload_events = true;
        this.preload_package = true;
        this.preload_simcard = true;
        this.preload_avaiable_packages = true;
        this.obtainStatusLocation();
      }
    }, err => {
      this.presentToastError("We couldn't obtain extra numbers.");

    });
  }

  /**
   * Método para eliminar una sim
   */
  deleteSim() {
    this.simCardService.deleteSimCard(this.sim_current.id).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk('Extra number has been deleted.');
        this.dismiss();
      }
    }, err => {
      this.presentToastError("We couldn't delete this Simcard.");
    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
  async presentToastError(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
  async presentToastOk(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async presentToastWarning(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }


  getErrorMessageNew() {
    return this.newNumber.hasError('maxlength') ? "Max 18 characters" :
      this.newNumber.hasError('required') ? "Must have a value" :
        this.newNumber.hasError('minlength') ? "Min 8 characters" :
          '';

  }
  /**
 * Mensaje de error de valor de numero nuevo
 */
  getErrorMessage() {
    return this.value_endpoint.hasError('maxlength') ? "Max 30 characters" :
      this.value_endpoint.hasError('required') ? "Must have a value" :
        this.value_endpoint.hasError('minlength') ? "Min 5 characters" :
          '';
  }
}