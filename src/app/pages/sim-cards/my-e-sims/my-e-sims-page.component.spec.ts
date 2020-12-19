import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyESimsPage } from './my-e-sims-page.component';

describe('ESimsPage', () => {
  let component: MyESimsPage;
  let fixture: ComponentFixture<MyESimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyESimsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyESimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
