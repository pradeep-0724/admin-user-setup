import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationNotificationsComponent } from './organisation-notifications.component';

describe('OrganisationNotificationsComponent', () => {
  let component: OrganisationNotificationsComponent;
  let fixture: ComponentFixture<OrganisationNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
