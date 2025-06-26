import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDeleteItemComponent } from './party-delete-item.component';

describe('PartyDeleteItemComponent', () => {
  let component: PartyDeleteItemComponent;
  let fixture: ComponentFixture<PartyDeleteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDeleteItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDeleteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
