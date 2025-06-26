import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleDestinationComponent2 } from './multiple-destination-2.component';


describe('MultipleDestinationComponent2', () => {
  let component: MultipleDestinationComponent2;
  let fixture: ComponentFixture<MultipleDestinationComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDestinationComponent2 ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleDestinationComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
