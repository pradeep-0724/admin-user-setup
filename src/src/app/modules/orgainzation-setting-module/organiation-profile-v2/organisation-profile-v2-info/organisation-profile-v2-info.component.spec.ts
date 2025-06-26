import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationProfileV2InfoComponent } from './organisation-profile-v2-info.component';

describe('OrganisationProfileV2InfoComponent', () => {
  let component: OrganisationProfileV2InfoComponent;
  let fixture: ComponentFixture<OrganisationProfileV2InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationProfileV2InfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationProfileV2InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
