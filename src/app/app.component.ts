import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  static readonly timeMillisDelayFilter: number = 500;
  static readonly limitAutocompleteValues: number = 10;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService
  ) {
    let language = window.navigator.language.split('-')[0];
    if (language == 'es' || language == 'en') {
      this.translate.setDefaultLang(language);
      this.translate.use(language);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
