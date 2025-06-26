import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOthersQuotationComponent } from './item-others-quotation.component';

describe('ItemOthersQuotationComponent', () => {
  let component: ItemOthersQuotationComponent;
  let fixture: ComponentFixture<ItemOthersQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOthersQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemOthersQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
