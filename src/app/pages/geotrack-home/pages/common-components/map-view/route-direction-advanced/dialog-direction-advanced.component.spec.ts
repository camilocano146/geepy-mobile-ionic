import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDirectionAdvancedComponent } from './dialog-direction-advanced.component';

describe('PlaceAutocompleteComponent', () => {
  let component: DialogDirectionAdvancedComponent;
  let fixture: ComponentFixture<DialogDirectionAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDirectionAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDirectionAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
