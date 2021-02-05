import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingCtrl: LoadingController,
    private transalte: TranslateService) { }

   // Creación del loading
   async presentLoading() {
    return await this.loadingCtrl.create({
     message: this.transalte.instant('loader.loading')
    }).then(a => {
      a.present().then();
    });
  }
  // Cierre del loading
  async dismissLoading() {
    return await this.loadingCtrl.dismiss().then(() => console.log(""));
  }
}
