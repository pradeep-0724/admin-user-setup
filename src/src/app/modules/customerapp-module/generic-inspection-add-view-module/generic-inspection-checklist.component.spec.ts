import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericInspectionChecklistComponent } from './generic-inspection-checklist.component';


describe('GenericInspectionChecklistComponent', () => {
  let component: GenericInspectionChecklistComponent;
  let fixture: ComponentFixture<GenericInspectionChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericInspectionChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericInspectionChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
