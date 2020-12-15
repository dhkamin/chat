import { TestBed } from '@angular/core/testing';

import { ChatPrivateService } from './chat-private.service';

describe('ChatPrivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatPrivateService = TestBed.get(ChatPrivateService);
    expect(service).toBeTruthy();
  });
});
