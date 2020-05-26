import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignEditorIframeComponent } from './design-editor-iframe.component';

describe('DesignEditorIframeComponent', () => {
  let component: DesignEditorIframeComponent;
  let fixture: ComponentFixture<DesignEditorIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignEditorIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignEditorIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
