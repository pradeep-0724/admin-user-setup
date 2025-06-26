import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderContainerInfoComponent } from './workorder-container-info.component';

describe('WorkorderContainerInfoComponent', () => {
  let component: WorkorderContainerInfoComponent;
  let fixture: ComponentFixture<WorkorderContainerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderContainerInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderContainerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
