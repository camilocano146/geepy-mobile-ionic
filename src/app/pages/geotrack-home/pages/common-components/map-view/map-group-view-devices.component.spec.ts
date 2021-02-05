import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGroupViewDevicesComponent } from './map-group-view-devices.component';

describe('SettingsComponent', () => {
  let component: MapGroupViewDevicesComponent;
  let fixture: ComponentFixture<MapGroupViewDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGroupViewDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGroupViewDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
