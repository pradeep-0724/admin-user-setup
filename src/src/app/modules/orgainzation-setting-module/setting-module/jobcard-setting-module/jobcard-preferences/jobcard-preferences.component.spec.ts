import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardPreferencesComponent } from './jobcard-preferences.component';

describe('JobCardPreferencesComponent', () => {
  let component: JobCardPreferencesComponent;
  let fixture: ComponentFixture<JobCardPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
