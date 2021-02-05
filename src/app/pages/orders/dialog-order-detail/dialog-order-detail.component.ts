import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
    selector: 'app-dialog-order-detail',
    templateUrl: './dialog-order-detail.component.html',
    styleUrls: ['./dialog-order-detail.component.scss'],
})
export class DialogOrderDetailComponent implements OnInit {


    /**
    * Producto completo
    */
    @Input() data: any;

    //----Pais
    public countriesList: any[];
    public countrySelected: FormControl;
    public language: string;

    constructor(
        private loadingService: LoadingService,
        private translate: TranslateService,
        private toastController: ToastController,
        private modalController: ModalController,
        private zonesService: ZonesService) {
        this.countrySelected = new FormControl(null, [Validators.required]);
        this.language = this.translate.currentLang
    }

    ngOnInit() {
        console.log(this.data);
        this.getCountries();
    }



    /**
   * Trae los paises
   */
    getCountries() {
        this.loadingService.presentLoading().then( () => {
            this.zonesService.getAvailableCountiresToPurchase().subscribe(res => {
                if (res.status == 200) {
                    this.countriesList = res.body;
                    console.log(this.countriesList[0]);
                    this.countrySelected.setValue(this.data.country);
                    console.log(this.countrySelected.value);
                    this.loadingService.dismissLoading();
                }
            }, err => {
                console.log(err);
                this.loadingService.dismissLoading();
                this.presentToastError(this.translate.instant('simcard.error.no_countries'))
            });
        });
     
    }

    async presentToastError(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 3000,
            color: 'danger'
        });
        toast.present();
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss();
    }

}
