import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDeleteViewComponent } from './file-delete-view.component';

describe('FileDeleteViewComponent', () => {
  let component: FileDeleteViewComponent;
  let fixture: ComponentFixture<FileDeleteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDeleteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileDeleteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
