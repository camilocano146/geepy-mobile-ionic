import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SlidesPage implements OnInit {

  public show: boolean;

  constructor(
    private navController: NavController) {
    this.show = false;
  }

  ngOnInit() {
    let l = localStorage.getItem('first-time-app');
    if (l == null) {
      this.show = true;
    } else {
      this.show = false;
      this.goToHome();
    }
  }

  goToHome() {
    let token = JSON.parse(localStorage.getItem('g_c_key'));
    if(token == null){
      this.navController.navigateRoot('login');
    } else {
      this.navController.navigateRoot('select-platform');
    }
  }
}
