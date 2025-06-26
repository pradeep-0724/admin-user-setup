import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInspectionPopupComponent } from './add-inspection-popup.component';


describe('AddInspectionPopupComponent', () => {
  let component: AddInspectionPopupComponent;
  let fixture: ComponentFixture<AddInspectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInspectionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInspectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
