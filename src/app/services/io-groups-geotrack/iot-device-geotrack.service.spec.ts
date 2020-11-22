import { TestBed } from '@angular/core/testing';

import { IotGroupsGeotrackService } from './iot-groups-geotrack.service';

describe('IotDeviceGeotrackService', () => {
  let service: IotGroupsGeotrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IotGroupsGeotrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
