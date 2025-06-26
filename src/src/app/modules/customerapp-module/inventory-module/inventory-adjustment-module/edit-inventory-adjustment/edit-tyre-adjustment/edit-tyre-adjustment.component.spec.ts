import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTyreAdjustmentComponent } from './edit-tyre-adjustment.component';

describe('EditTyreAdjustmentComponent', () => {
  let component: EditTyreAdjustmentComponent;
  let fixture: ComponentFixture<EditTyreAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTyreAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTyreAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
