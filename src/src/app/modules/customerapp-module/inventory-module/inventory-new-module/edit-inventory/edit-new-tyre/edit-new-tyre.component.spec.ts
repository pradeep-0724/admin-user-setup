import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewTyreComponent } from './edit-new-tyre.component';

describe('EditNewTyreComponent', () => {
  let component: EditNewTyreComponent;
  let fixture: ComponentFixture<EditNewTyreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNewTyreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewTyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
