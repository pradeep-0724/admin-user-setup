import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationCommentsComponent } from './quotation-comments.component';

describe('QuotationCommentsComponent', () => {
  let component: QuotationCommentsComponent;
  let fixture: ComponentFixture<QuotationCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
