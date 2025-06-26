import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstReceivableComponent } from './gst-receivable.component';

describe('GstReceivableComponent', () => {
  let component: GstReceivableComponent;
  let fixture: ComponentFixture<GstReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
