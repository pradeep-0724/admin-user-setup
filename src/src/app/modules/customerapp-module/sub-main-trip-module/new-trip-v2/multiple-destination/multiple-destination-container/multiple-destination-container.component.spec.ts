import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDestinationContainerComponent } from './multiple-destination-container.component';

describe('MultipleDestinationContainerComponent', () => {
  let component: MultipleDestinationContainerComponent;
  let fixture: ComponentFixture<MultipleDestinationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDestinationContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleDestinationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
