import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkOrderBillingsComponent } from './edit-work-order-billings.component';

describe('EditWorkOrderBillingsComponent', () => {
  let component: EditWorkOrderBillingsComponent;
  let fixture: ComponentFixture<EditWorkOrderBillingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkOrderBillingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkOrderBillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
