import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTokenVgmManagementComponent } from './job-token-vgm-management.component';

describe('JobTokenVgmManagementComponent', () => {
  let component: JobTokenVgmManagementComponent;
  let fixture: ComponentFixture<JobTokenVgmManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTokenVgmManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTokenVgmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
