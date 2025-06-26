import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripValidationComponent } from './trip-validation.component';


describe('TripValidationComponent', () => {
  let component: TripValidationComponent;
  let fixture: ComponentFixture<TripValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
