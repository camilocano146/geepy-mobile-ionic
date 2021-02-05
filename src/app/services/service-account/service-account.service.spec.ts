import { TestBed } from '@angular/core/testing';

import { ServiceAccountService } from './service-account.service';

describe('ServiceAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceAccountService = TestBed.get(ServiceAccountService);
    expect(service).toBeTruthy();
  });
});
