import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentNoteCustomFieldComponent } from './consignment-note-custom-field.component';

describe('ConsignmentNoteCustomFieldComponent', () => {
  let component: ConsignmentNoteCustomFieldComponent;
  let fixture: ComponentFixture<ConsignmentNoteCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignmentNoteCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentNoteCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
