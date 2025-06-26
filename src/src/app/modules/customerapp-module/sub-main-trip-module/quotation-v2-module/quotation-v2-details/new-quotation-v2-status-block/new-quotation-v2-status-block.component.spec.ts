import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2StatusBlockComponent } from './new-quotation-v2-status-block.component';

describe('NewQuotationV2StatusBlockComponent', () => {
  let component: NewQuotationV2StatusBlockComponent;
  let fixture: ComponentFixture<NewQuotationV2StatusBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2StatusBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2StatusBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
