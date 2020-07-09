import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
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
/**
 * Stripe
 */
import { Stripe } from '@ionic-native/stripe/ngx';
/**
 * Paypal
 */
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

/** Pagina */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceAccountService } from './services/service-account/service-account.service';
import { ExtraNumbersService } from './services/extra-numbers/extra-numbers.service';
import { ItineraryService } from './services/itinerary/itinerary.service';
import { TariffRechargeService } from './services/tariff-recharge/tariff-recharge.service';
import { BillingService } from './services/billing/billing.service';
import { RecommendService } from './services/recommend/recommend.service';
import { ZonesService } from './services/zones/zones.service';
import { UssdCodesService } from './services/ussd-codes/ussd-codes.service';
import { CourierService } from './services/courier/courier.service';
import { LoadingService } from './services/loading/loading.service';
import { PermissionModuleService } from './services/module/module.service';
import { CountriesService } from './services/countries/countries.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
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
    IonicModule.forRoot(
      {
        mode: 'ios',
        scrollPadding: false,
        scrollAssist: false
      }
    ),
    AppRoutingModule,

  ],
  providers: [
    CountriesService,
    StatusBar,
    SplashScreen,
    AuthenticationService,
    LocalStorageService,
    ServiceAccountService,
    ExtraNumbersService,
    CourierService,
    TariffRechargeService,
    BillingService,
    RecommendService,
    ZonesService,
    UssdCodesService,
    LoadingService,
    Stripe,
    PayPal,
    AppRate,
    CallNumber,
    InAppBrowser,
    FCM,
    AndroidPermissions,
    PermissionModuleService,
    ItineraryService,
    { provide: LOCALE_ID, useValue: "en-US" },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

