import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAdvanceComponent } from './party-advance.component';

describe('PartyAdvanceComponent', () => {
  let component: PartyAdvanceComponent;
  let fixture: ComponentFixture<PartyAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
