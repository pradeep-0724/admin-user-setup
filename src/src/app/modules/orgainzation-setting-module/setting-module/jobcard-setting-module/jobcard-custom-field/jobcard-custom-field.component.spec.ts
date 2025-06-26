import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardCustomFieldComponent } from './jobcard-custom-field.component';

describe('JobCardCustomFieldComponent', () => {
  let component: JobCardCustomFieldComponent;
  let fixture: ComponentFixture<JobCardCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
