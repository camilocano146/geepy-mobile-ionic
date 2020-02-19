import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimModalSeeRealComponent } from './sim-modal-see-real.component';

describe('SimModalSeeRealComponent', () => {
  let component: SimModalSeeRealComponent;
  let fixture: ComponentFixture<SimModalSeeRealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimModalSeeRealComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimModalSeeRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
