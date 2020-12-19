import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhysicalSimsPage } from './physical-sims-page.component';

describe('ESimsPage', () => {
  let component: PhysicalSimsPage;
  let fixture: ComponentFixture<PhysicalSimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalSimsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalSimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
