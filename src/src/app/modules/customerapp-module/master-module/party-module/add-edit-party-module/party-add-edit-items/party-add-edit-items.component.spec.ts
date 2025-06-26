import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAddEditItemsComponent } from './party-add-edit-items.component';

describe('PartyAddEditItemsComponent', () => {
  let component: PartyAddEditItemsComponent;
  let fixture: ComponentFixture<PartyAddEditItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyAddEditItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyAddEditItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
