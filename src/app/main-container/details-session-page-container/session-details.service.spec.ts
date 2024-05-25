import { TestBed } from '@angular/core/testing';

import { SessionDetailsService } from './session-details.service';

describe('SessionDetailsService', () => {
  let service: SessionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
