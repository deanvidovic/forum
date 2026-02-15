import { TestBed } from '@angular/core/testing';

import { Threads } from './threads';

describe('Threads', () => {
  let service: Threads;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Threads);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
