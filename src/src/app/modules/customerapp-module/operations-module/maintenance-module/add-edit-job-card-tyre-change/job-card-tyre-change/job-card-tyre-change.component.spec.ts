import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardTyreChangeComponent } from './job-card-tyre-change.component';

describe('JobCardTyreChangeComponent', () => {
  let component: JobCardTyreChangeComponent;
  let fixture: ComponentFixture<JobCardTyreChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCardTyreChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardTyreChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
