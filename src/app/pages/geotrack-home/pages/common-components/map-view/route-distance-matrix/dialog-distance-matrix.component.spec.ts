import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDistanceMatrixComponent } from './dialog-distance-matrix.component';

describe('PlaceAutocompleteComponent', () => {
  let component: DialogDistanceMatrixComponent;
  let fixture: ComponentFixture<DialogDistanceMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDistanceMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDistanceMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
