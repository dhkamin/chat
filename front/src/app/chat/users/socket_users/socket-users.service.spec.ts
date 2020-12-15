import { TestBed } from '@angular/core/testing';

import { SocketUsersService } from './socket-users.service';

describe('SocketUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketUsersService = TestBed.get(SocketUsersService);
    expect(service).toBeTruthy();
  });
});
