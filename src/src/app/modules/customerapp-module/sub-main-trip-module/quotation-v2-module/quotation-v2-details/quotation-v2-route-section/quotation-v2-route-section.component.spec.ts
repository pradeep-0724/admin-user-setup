import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2RouteSectionComponent } from './quotation-v2-route-section.component';

describe('QuotationV2RouteSectionComponent', () => {
  let component: QuotationV2RouteSectionComponent;
  let fixture: ComponentFixture<QuotationV2RouteSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2RouteSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2RouteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
