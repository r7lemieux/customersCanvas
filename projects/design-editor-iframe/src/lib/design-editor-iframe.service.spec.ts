import { TestBed } from '@angular/core/testing';

import { DesignEditorIframeService } from './design-editor-iframe.service';

describe('DesignEditorIframeService', () => {
  let service: DesignEditorIframeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignEditorIframeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
