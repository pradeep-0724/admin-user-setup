import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAdvanceFuelComponent } from './party-advance-fuel.component';

describe('PartyAdvanceFuelComponent', () => {
  let component: PartyAdvanceFuelComponent;
  let fixture: ComponentFixture<PartyAdvanceFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyAdvanceFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyAdvanceFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
