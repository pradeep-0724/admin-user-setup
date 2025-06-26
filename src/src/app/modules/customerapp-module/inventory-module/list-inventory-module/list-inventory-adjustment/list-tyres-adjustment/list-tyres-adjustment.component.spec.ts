import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTyresAdjustmentComponent } from './list-tyres-adjustment.component';

describe('ListTyresAdjustmentComponent', () => {
  let component: ListTyresAdjustmentComponent;
  let fixture: ComponentFixture<ListTyresAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTyresAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTyresAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
