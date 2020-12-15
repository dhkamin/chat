import { TestBed } from '@angular/core/testing';

import { SocketUserService } from './socket-user.service';

describe('SocketUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketUserService = TestBed.get(SocketUserService);
    expect(service).toBeTruthy();
  });
});
