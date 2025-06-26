import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedPodComponent } from './uploaded-pod.component';

describe('UploadedPodComponent', () => {
  let component: UploadedPodComponent;
  let fixture: ComponentFixture<UploadedPodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedPodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
