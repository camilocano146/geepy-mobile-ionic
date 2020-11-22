import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IotM2MConnectPage } from './iot-m2-m-connect-page.component';

describe('HomePage', () => {
  let component: IotM2MConnectPage;
  let fixture: ComponentFixture<IotM2MConnectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IotM2MConnectPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotM2MConnectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
