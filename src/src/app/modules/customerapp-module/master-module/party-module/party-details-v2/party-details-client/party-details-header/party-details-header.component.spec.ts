import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsHeaderComponent } from './party-details-header.component';

describe('PartyDetailsHeaderComponent', () => {
  let component: PartyDetailsHeaderComponent;
  let fixture: ComponentFixture<PartyDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
