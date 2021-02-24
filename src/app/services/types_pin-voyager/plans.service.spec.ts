import { TestBed } from '@angular/core/testing';

import { TypesPinVoyagerService } from './plans.service';

describe('PlanService', () => {
  let service: TypesPinVoyagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesPinVoyagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
