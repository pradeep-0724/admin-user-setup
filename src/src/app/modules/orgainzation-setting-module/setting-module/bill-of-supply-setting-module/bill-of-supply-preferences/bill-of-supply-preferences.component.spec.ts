import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfSupplyPreferencesComponent } from './bill-of-supply-preferences.component';

describe('BillOfSupplyPreferencesComponent', () => {
  let component: BillOfSupplyPreferencesComponent;
  let fixture: ComponentFixture<BillOfSupplyPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillOfSupplyPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfSupplyPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
