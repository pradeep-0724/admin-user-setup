import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyStatementOfClientComponent } from './party-statement-of-client.component';

describe('PartyStatementOfClientComponent', () => {
  let component: PartyStatementOfClientComponent;
  let fixture: ComponentFixture<PartyStatementOfClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyStatementOfClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyStatementOfClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
