import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';
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
    private translate: TranslateService
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
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      //let language = this.translate.getBrowserLang();
     
    });
  }
}