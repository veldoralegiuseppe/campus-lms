import { TestBed } from '@angular/core/testing';

import { CreateSessionService } from './create-session.service';

describe('CreateSessionService', () => {
  let service: CreateSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
