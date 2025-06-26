import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyNotesAttachmentsComponent } from './party-notes-attachments.component';

describe('PartyNotesAttachmentsComponent', () => {
  let component: PartyNotesAttachmentsComponent;
  let fixture: ComponentFixture<PartyNotesAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyNotesAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyNotesAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
