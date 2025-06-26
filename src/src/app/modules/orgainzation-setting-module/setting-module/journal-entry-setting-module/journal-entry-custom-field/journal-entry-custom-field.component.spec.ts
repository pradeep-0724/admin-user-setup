import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryCustomFieldComponent } from './journal-entry-custom-field.component';

describe('JournalEntryCustomFieldComponent', () => {
  let component: JournalEntryCustomFieldComponent;
  let fixture: ComponentFixture<JournalEntryCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalEntryCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEntryCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
