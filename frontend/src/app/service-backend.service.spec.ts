import { TestBed } from '@angular/core/testing';

import { ServiceBackend } from './service-backend.service';

describe('ServiceBackend', () => {
  let service: ServiceBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
