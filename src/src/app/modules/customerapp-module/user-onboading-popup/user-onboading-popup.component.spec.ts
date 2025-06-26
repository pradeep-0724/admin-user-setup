import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOnboadingPopupComponent } from './user-onboading-popup.component';

describe('UserOnboadingPopupComponent', () => {
  let component: UserOnboadingPopupComponent;
  let fixture: ComponentFixture<UserOnboadingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOnboadingPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOnboadingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
