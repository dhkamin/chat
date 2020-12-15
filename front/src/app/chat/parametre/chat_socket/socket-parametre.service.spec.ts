import { TestBed } from '@angular/core/testing';

import { SocketParametreService } from './socket-parametre.service';

describe('SocketParametreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketParametreService = TestBed.get(SocketParametreService);
    expect(service).toBeTruthy();
  });
});
