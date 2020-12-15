import { TestBed } from '@angular/core/testing';

import { UserconnectedService } from './userconnected.service';

describe('UserconnectedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserconnectedService = TestBed.get(UserconnectedService);
    expect(service).toBeTruthy();
  });
});
