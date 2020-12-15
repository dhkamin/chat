import { TestBed } from '@angular/core/testing';

import { UserSochServService } from './user-soch-serv.service';

describe('UserSochServService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSochServService = TestBed.get(UserSochServService);
    expect(service).toBeTruthy();
  });
});
