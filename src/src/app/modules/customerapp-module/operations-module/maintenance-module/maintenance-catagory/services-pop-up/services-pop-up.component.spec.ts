import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPopUpComponent } from './services-pop-up.component';

describe('ServicesPopUpComponent', () => {
  let component: ServicesPopUpComponent;
  let fixture: ComponentFixture<ServicesPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
