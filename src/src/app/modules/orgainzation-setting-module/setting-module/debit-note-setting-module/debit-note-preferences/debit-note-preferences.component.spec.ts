import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNotePreferencesComponent } from './debit-note-preferences.component';

describe('DebitNotePreferencesComponent', () => {
  let component: DebitNotePreferencesComponent;
  let fixture: ComponentFixture<DebitNotePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitNotePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNotePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
