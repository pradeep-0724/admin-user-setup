import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatReceivableComponent } from './vat-receivable.component';

describe('VatReceivableComponent', () => {
  let component: VatReceivableComponent;
  let fixture: ComponentFixture<VatReceivableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatReceivableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
