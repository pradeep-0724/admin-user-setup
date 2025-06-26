import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobTemplateTrailerLooseCargoComponent } from './add-job-template-trailer-loose-cargo.component';

describe('AddJobTemplateTrailerLooseCargoComponent', () => {
  let component: AddJobTemplateTrailerLooseCargoComponent;
  let fixture: ComponentFixture<AddJobTemplateTrailerLooseCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobTemplateTrailerLooseCargoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobTemplateTrailerLooseCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
