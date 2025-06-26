import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripApprovalComponent } from './trip-approval.component';

describe('TripApprovalComponent', () => {
  let component: TripApprovalComponent;
  let fixture: ComponentFixture<TripApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
