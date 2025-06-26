import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartJobCardComponent } from './start-job-card.component';

describe('StartJobCardComponent', () => {
  let component: StartJobCardComponent;
  let fixture: ComponentFixture<StartJobCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartJobCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartJobCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
