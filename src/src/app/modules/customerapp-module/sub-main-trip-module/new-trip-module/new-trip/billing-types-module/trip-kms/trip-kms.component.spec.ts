import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripKmsComponent } from './trip-kms.component';

describe('TripKmsComponent', () => {
  let component: TripKmsComponent;
  let fixture: ComponentFixture<TripKmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripKmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripKmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
