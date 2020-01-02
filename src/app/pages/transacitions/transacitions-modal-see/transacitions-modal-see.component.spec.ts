import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransacitionsModalSeeComponent } from './transacitions-modal-see.component';

describe('TransacitionsModalSeeComponent', () => {
  let component: TransacitionsModalSeeComponent;
  let fixture: ComponentFixture<TransacitionsModalSeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacitionsModalSeeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransacitionsModalSeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
