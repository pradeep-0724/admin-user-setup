import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomFieldPopupComponent } from './customfield-popup.component';

describe('CustomFieldPopupComponent', () => {
  let component: CustomFieldPopupComponent;
  let fixture: ComponentFixture<CustomFieldPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
