import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobTemplateOthersComponent } from './add-job-template-others.component';

describe('AddJobTemplateOthersComponent', () => {
  let component: AddJobTemplateOthersComponent;
  let fixture: ComponentFixture<AddJobTemplateOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobTemplateOthersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobTemplateOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
