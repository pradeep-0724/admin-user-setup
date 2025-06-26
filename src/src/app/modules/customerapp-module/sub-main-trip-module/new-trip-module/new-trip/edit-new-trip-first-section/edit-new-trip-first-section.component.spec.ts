import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewTripFirstSectionComponent } from './edit-new-trip-first-section.component';

describe('EditNewTripFirstSectionComponent', () => {
  let component: EditNewTripFirstSectionComponent;
  let fixture: ComponentFixture<EditNewTripFirstSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNewTripFirstSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewTripFirstSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
