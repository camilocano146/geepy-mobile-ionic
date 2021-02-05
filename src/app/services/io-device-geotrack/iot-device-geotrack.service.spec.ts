import { TestBed } from '@angular/core/testing';

import { IotDeviceGeotrackService } from './iot-device-geotrack.service';

describe('IotDeviceGeotrackService', () => {
  let service: IotDeviceGeotrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IotDeviceGeotrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
