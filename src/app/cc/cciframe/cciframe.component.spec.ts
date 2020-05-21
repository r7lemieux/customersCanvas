import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CciframeComponent } from './cciframe.component';

describe('CciframeComponent', () => {
  let component: CciframeComponent;
  let fixture: ComponentFixture<CciframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CciframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CciframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
