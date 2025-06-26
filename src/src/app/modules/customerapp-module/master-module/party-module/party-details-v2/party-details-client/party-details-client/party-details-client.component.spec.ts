import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsClientComponent } from './party-details-client.component';

describe('PartyDetailsClientComponent', () => {
  let component: PartyDetailsClientComponent;
  let fixture: ComponentFixture<PartyDetailsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
