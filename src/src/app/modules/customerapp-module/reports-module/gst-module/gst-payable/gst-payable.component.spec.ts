import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstPayableComponent } from './gst-payable.component';

describe('GstPayableComponent', () => {
  let component: GstPayableComponent;
  let fixture: ComponentFixture<GstPayableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstPayableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
