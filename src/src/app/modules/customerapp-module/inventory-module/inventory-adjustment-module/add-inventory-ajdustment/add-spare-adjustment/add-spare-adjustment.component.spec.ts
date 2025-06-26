import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpareAdjustmentComponent } from './add-spare-adjustment.component';

describe('AddSpareAdjustmentComponent', () => {
  let component: AddSpareAdjustmentComponent;
  let fixture: ComponentFixture<AddSpareAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSpareAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpareAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
