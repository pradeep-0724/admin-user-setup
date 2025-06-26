import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatPayabaleComponent } from './vat-payabale.component';

describe('VatPayabaleComponent', () => {
  let component: VatPayabaleComponent;
  let fixture: ComponentFixture<VatPayabaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatPayabaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatPayabaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
