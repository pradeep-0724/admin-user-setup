import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBiltyPrefrencesComponent } from './online-bilty-prefrences.component';

describe('OnlineBiltyPrefrencesComponent', () => {
  let component: OnlineBiltyPrefrencesComponent;
  let fixture: ComponentFixture<OnlineBiltyPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineBiltyPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineBiltyPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
