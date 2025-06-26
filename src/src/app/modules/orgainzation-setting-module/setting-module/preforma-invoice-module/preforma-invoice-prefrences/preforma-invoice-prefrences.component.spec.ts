import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreformaInvoicePrefrencesComponent } from './preforma-invoice-prefrences.component';

describe('PreformaInvoicePrefrencesComponent', () => {
  let component: PreformaInvoicePrefrencesComponent;
  let fixture: ComponentFixture<PreformaInvoicePrefrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreformaInvoicePrefrencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreformaInvoicePrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
