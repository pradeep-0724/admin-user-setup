import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleDestinationComponent } from './multiple-destination.component';

describe('EditMultipleDestinationComponent', () => {
  let component: EditMultipleDestinationComponent;
  let fixture: ComponentFixture<EditMultipleDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMultipleDestinationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMultipleDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
