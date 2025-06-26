import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewSparesComponent } from './edit-new-spares.component';

describe('EditNewSparesComponent', () => {
  let component: EditNewSparesComponent;
  let fixture: ComponentFixture<EditNewSparesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNewSparesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewSparesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
