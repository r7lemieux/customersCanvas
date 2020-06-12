import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcNewappClientComponent } from './cc-newapp-client.component';

describe('CcNewappClientComponent', () => {
  let component: CcNewappClientComponent;
  let fixture: ComponentFixture<CcNewappClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcNewappClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcNewappClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
