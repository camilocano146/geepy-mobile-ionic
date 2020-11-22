import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogAutocompletePlacePlaceComponent } from './dialog-autocomplete-place-place.component';

describe('AutomplacePlaceComponent', () => {
  let component: DialogAutocompletePlacePlaceComponent;
  let fixture: ComponentFixture<DialogAutocompletePlacePlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAutocompletePlacePlaceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAutocompletePlacePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
