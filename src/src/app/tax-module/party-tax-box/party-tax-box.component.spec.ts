import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTaxBoxComponent } from './party-tax-box.component';

describe('PartyTaxBoxComponent', () => {
  let component: PartyTaxBoxComponent;
  let fixture: ComponentFixture<PartyTaxBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyTaxBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyTaxBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
