import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteCustomFieldComponent } from './credit-note-custom-field.component';

describe('CreditNoteCustomFieldComponent', () => {
  let component: CreditNoteCustomFieldComponent;
  let fixture: ComponentFixture<CreditNoteCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNoteCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
