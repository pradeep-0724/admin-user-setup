import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobTemplateCraneComponent } from './add-job-template-crane.component';

describe('AddJobTemplateCraneComponent', () => {
  let component: AddJobTemplateCraneComponent;
  let fixture: ComponentFixture<AddJobTemplateCraneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobTemplateCraneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobTemplateCraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
