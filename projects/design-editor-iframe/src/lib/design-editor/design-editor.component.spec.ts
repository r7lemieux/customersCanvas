import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignEditorComponent } from './design-editor.component';

describe('DesignEditorComponent', () => {
  let component: DesignEditorComponent;
  let fixture: ComponentFixture<DesignEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
