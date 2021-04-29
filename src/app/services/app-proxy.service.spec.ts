import { TestBed } from '@angular/core/testing';

import { AppProxyService } from './app-proxy.service';

describe('AppProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppProxyService = TestBed.get(AppProxyService);
    expect(service).toBeTruthy();
  });
});
