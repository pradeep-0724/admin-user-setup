import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotePreferencesComponent } from './credit-note-preferences.component';

describe('CreditNotePreferencesComponent', () => {
  let component: CreditNotePreferencesComponent;
  let fixture: ComponentFixture<CreditNotePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNotePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNotePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
