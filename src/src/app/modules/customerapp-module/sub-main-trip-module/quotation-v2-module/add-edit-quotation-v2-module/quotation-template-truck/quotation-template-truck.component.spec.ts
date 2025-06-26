import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTemplateTruckComponent } from './quotation-template-truck.component';

describe('QuotationTemplateTruckComponent', () => {
  let component: QuotationTemplateTruckComponent;
  let fixture: ComponentFixture<QuotationTemplateTruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTemplateTruckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationTemplateTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
