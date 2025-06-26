import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteLinkComponent } from './invite-link.component';

describe('InviteLinkComponent', () => {
  let component: InviteLinkComponent;
  let fixture: ComponentFixture<InviteLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
