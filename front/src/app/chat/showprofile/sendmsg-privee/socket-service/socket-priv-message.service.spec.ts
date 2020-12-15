import { TestBed } from '@angular/core/testing';

import { SocketPrivMessageService } from './socket-priv-message.service';

describe('SocketPrivMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketPrivMessageService = TestBed.get(SocketPrivMessageService);
    expect(service).toBeTruthy();
  });
});
