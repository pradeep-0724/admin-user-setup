import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAdvanceDriverComponent } from './party-advance-driver.component';

describe('PartyAdvanceDriverComponent', () => {
  let component: PartyAdvanceDriverComponent;
  let fixture: ComponentFixture<PartyAdvanceDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyAdvanceDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyAdvanceDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
