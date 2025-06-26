import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTyreAdjustmentComponent } from './add-tyre-adjustment.component';

describe('AddTyreAdjustmentComponent', () => {
  let component: AddTyreAdjustmentComponent;
  let fixture: ComponentFixture<AddTyreAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTyreAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTyreAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
