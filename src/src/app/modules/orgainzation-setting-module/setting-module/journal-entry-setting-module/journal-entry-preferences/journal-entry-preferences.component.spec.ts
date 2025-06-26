import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryPreferencesComponent } from './journal-entry-preferences.component';

describe('JournalEntryPreferencesComponent', () => {
  let component: JournalEntryPreferencesComponent;
  let fixture: ComponentFixture<JournalEntryPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalEntryPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEntryPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
