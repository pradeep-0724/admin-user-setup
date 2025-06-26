import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobTemplateContainerComponent } from './add-job-template-container.component';

describe('AddJobTemplateContainerComponent', () => {
  let component: AddJobTemplateContainerComponent;
  let fixture: ComponentFixture<AddJobTemplateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobTemplateContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobTemplateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
