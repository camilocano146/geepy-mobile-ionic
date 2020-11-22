import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItineraryModalEditCancel } from './itinerary-modal-edit-cancel.component';

describe('ItineraryModalEditCancel', () => {
  let component: ItineraryModalEditCancel;
  let fixture: ComponentFixture<ItineraryModalEditCancel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryModalEditCancel ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItineraryModalEditCancel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
