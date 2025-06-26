import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTaxComponent } from './party-tax.component';

describe('PartyTaxComponent', () => {
  let component: PartyTaxComponent;
  let fixture: ComponentFixture<PartyTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
