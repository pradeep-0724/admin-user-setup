import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2ListComponent } from './quotation-v2-list.component';

describe('QuotationV2ListComponent', () => {
  let component: QuotationV2ListComponent;
  let fixture: ComponentFixture<QuotationV2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2ListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
