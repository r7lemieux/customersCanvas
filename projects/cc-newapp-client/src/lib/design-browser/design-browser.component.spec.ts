import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignBrowserComponent } from './design-browser.component';

describe('DesignBrowserComponent', () => {
  let component: DesignBrowserComponent;
  let fixture: ComponentFixture<DesignBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
