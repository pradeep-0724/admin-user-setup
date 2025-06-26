import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteCustomFieldComponent } from './debit-note-custom-field.component';

describe('DebitNoteCustomFieldComponent', () => {
  let component: DebitNoteCustomFieldComponent;
  let fixture: ComponentFixture<DebitNoteCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitNoteCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNoteCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
