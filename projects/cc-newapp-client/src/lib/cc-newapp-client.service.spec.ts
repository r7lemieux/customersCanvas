import { TestBed } from '@angular/core/testing';

import { CcNewappClientService } from './cc-newapp-client.service';

describe('CcNewappClientService', () => {
  let service: CcNewappClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcNewappClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
