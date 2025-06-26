import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePopUpComponent } from './route-pop-up.component';

describe('RoutePopUpComponent', () => {
  let component: RoutePopUpComponent;
  let fixture: ComponentFixture<RoutePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutePopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
