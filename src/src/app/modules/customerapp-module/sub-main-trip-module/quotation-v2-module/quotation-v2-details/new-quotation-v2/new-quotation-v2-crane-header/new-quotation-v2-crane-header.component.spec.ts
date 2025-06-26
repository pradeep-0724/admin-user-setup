import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2CraneHeaderComponent } from './new-quotation-v2-crane-header.component';

describe('NewQuotationV2CraneHeaderComponent', () => {
  let component: NewQuotationV2CraneHeaderComponent;
  let fixture: ComponentFixture<NewQuotationV2CraneHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2CraneHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2CraneHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
