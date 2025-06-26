import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardServiceComponent } from './job-card-service.component';

describe('JobCardServiceComponent', () => {
  let component: JobCardServiceComponent;
  let fixture: ComponentFixture<JobCardServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCardServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
