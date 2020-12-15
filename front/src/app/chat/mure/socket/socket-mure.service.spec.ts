import { TestBed } from '@angular/core/testing';

import { SocketMureService } from './socket-mure.service';

describe('SocketMureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketMureService = TestBed.get(SocketMureService);
    expect(service).toBeTruthy();
  });
});
