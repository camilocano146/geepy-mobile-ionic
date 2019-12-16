import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
/**Tradcutor */
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
/** Interceptor */
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { InterceptorService } from './services/interceptor/interceptor.service';
/** Servicios */
import { AuthenticationService } from './services/authentication/authentication.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
/** Material */
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Pagina */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Globalization } from '@ionic-native/globalization/ngx';
import { ServiceAccountService } from './services/service-account/service-account.service';
import { ExtraNumbersService } from './services/extra-numbers/extra-numbers.service';
import { AgmCoreModule } from '@agm/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/','.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //Traductor
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    LocalStorageService,
    ServiceAccountService,
    ExtraNumbersService,
    Globalization,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

