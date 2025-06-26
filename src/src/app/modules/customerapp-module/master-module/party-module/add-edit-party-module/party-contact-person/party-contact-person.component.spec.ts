import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyContactPersonComponent } from './party-contact-person.component';

describe('PartyContactPersonComponent', () => {
  let component: PartyContactPersonComponent;
  let fixture: ComponentFixture<PartyContactPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyContactPersonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyContactPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
