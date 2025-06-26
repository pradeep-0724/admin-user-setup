import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderVoidQuotationComponent } from './work-order-void-quotation.component';

describe('WorkOrderVoidQuotationComponent', () => {
  let component: WorkOrderVoidQuotationComponent;
  let fixture: ComponentFixture<WorkOrderVoidQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderVoidQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderVoidQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
