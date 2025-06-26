import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCertificateHistoryComponent } from './profile-certificate-history.component';

describe('ProfileCertificateHistoryComponent', () => {
  let component: ProfileCertificateHistoryComponent;
  let fixture: ComponentFixture<ProfileCertificateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCertificateHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCertificateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
