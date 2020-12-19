import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyPhysicalSimsPage } from './my-physical-sims-page.component';

describe('ESimsPage', () => {
  let component: MyPhysicalSimsPage;
  let fixture: ComponentFixture<MyPhysicalSimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPhysicalSimsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPhysicalSimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
