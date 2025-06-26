import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpareAdjustmentComponent } from './edit-spare-adjustment.component';

describe('EditSpareAdjustmentComponent', () => {
  let component: EditSpareAdjustmentComponent;
  let fixture: ComponentFixture<EditSpareAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSpareAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpareAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
