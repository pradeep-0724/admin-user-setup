import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentNotePreferencesComponent } from './consignment-note-preferences.component';

describe('ConsignmentNotePreferencesComponent', () => {
  let component: ConsignmentNotePreferencesComponent;
  let fixture: ComponentFixture<ConsignmentNotePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignmentNotePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentNotePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
