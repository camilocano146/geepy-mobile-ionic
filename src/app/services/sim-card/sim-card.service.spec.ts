import { TestBed } from '@angular/core/testing';

import { SimCardService } from './sim-card.service';

describe('SimCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimCardService = TestBed.get(SimCardService);
    expect(service).toBeTruthy();
  });
});
