import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from} from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Global } from '../../models/global/global';
import { Token } from 'src/app/models/token/token';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {
  
  constructor(
    public loadingCtrl: LoadingController,
    //public storage: Storage,
    private navControler: NavController,
    private localStorageService: LocalStorageService,
    private transalte: TranslateService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token: Token = JSON.parse(localStorage.getItem("g_c_key"));
    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token.access_token),
      });
    }
    // if (!request.headers.has("Content-Type")) {
    //   request = request.clone({
    //     headers: request.headers.set("Content-Type", "application/json"),
    //   });
    // }

    if (request.url != "/assets/i18n/en.json" && request.url != "/assets/i18n/es.json") {

      request = request.clone({
        url: Global.apiGeepyConnect + request.url
      });
      //LLamamos al preload
    //this.presentLoading();
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        //this.dismissLoading();
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
       // this.dismissLoading();
        if (error.status == 403 || error.status == 401) {
          this.localStorageService.removeToken();
          this.removeUserOfLocalStorage();
          this.navControler.navigateBack(["login"]);
        }
        return throwError(error);
      })
    );
  }

  private removeUserOfLocalStorage() {
    localStorage.removeItem('g_c_key');
    localStorage.removeItem('g_c_user');
  }
}
