import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingInviteComponent } from './onboarding-invite.component';

describe('OnboardingInviteComponent', () => {
  let component: OnboardingInviteComponent;
  let fixture: ComponentFixture<OnboardingInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
