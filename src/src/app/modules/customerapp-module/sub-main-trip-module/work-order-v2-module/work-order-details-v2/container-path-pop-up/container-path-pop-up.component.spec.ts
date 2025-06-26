import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerPathPopUpComponent } from './container-path-pop-up.component';

describe('ContainerPathPopUpComponent', () => {
  let component: ContainerPathPopUpComponent;
  let fixture: ComponentFixture<ContainerPathPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerPathPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerPathPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
