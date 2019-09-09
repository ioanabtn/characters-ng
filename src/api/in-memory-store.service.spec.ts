import { TestBed } from '@angular/core/testing';

import { InMemoryStoreService } from './in-memory-store.service';

describe('InMemoryStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InMemoryStoreService = TestBed.get(InMemoryStoreService);
    expect(service).toBeTruthy();
  });
});
