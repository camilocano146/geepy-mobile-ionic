import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Storage } from '@ionic/storage'
import { Observable, throwError, from} from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Global } from '../../models/global/global';
import { Token } from 'src/app/models/token/token';
import { LocalStorageService } from '../local-storage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {

  public isLoading: boolean = false;
  
  constructor(
    public loadingCtrl: LoadingController,
    //public storage: Storage,
    private navControler: NavController,
    private localStorageService: LocalStorageService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token: Token = JSON.parse(localStorage.getItem("g_c_key"));
    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token.access_token),
      });
    }
    if (!request.headers.has("Content-Type")) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json"),
      });
    }
   
    if (request.url != "/assets/i18n/en.json" && request.url != "/assets/i18n/es.json") {
      
      request = request.clone({
        url: Global.apiGeepyConnect + request.url
      });
      //LLamamos al preload
    this.presentLoading();
    }
    console.log(request);
    return next.handle(request).pipe(
      
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.dismissLoading();
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        if (error.status == 403 || error.status == 401) {
          this.localStorageService.removeToken();
          this.navControler.navigateBack([""]);
        }
     
        this.dismissLoading();
        return throwError(error);
      })
    ); 
  }









    
    /** ESTE ES EL INTERCEPTOR PAA MOVIL
     *  return from(this.storage.get(TOKEN_KEY))
      .pipe(
        switchMap(token => {
          if (token) {
            request = request.clone(
              { 
              headers: request.headers.set('token', token) 
            });
          }

          if (request.url != "/assets/i18n/en.json" && request.url != "/assets/i18n/es.json") {
            request = request.clone({
              url: Global.apiGeepyConnect + request.url
            });
          }
          console.log(request);
          // Presentamos el Loading al inicio de la llamada
          this.presentLoading();
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                this.dismissLoading();
              }
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              console.error(error);
              this.dismissLoading();
              return throwError(error);
            })
          );
        })
      );
     */
   
  

  // Creación del loading
  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log());
        }
      });
    });
  }
  // Cierre del loading
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log());
  }
}
