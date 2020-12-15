import { TestBed } from '@angular/core/testing';

import { MureService } from './mure.service';

describe('MureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MureService = TestBed.get(MureService);
    expect(service).toBeTruthy();
  });
});
