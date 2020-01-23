import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private globalization: Globalization,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private fcm: FCM
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.globalization.getPreferredLanguage().then(res => {
      console.log(res.value);
      let language = res.value.split('-')[0];
      console.log(language);
      if (language == 'es' || language == 'en') {
        this.translate.setDefaultLang(language)
        this.translate.use(language);
      } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');

      }
    }).catch(err => {
      console.log(err);
    });
 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      /**
       * this.fcm.onNotification().subscribe(data => {
        console.log(data, 'estoy en app');
        console.log(data.wasTapped);
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });
       */
      
      //let language = this.translate.getBrowserLang();
     
    });
  }
}