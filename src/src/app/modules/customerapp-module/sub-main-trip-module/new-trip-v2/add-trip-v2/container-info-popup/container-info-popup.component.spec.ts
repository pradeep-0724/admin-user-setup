import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerInfoPopupComponent } from './container-info-popup.component';

describe('ContainerInfoPopupComponent', () => {
  let component: ContainerInfoPopupComponent;
  let fixture: ComponentFixture<ContainerInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerInfoPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
