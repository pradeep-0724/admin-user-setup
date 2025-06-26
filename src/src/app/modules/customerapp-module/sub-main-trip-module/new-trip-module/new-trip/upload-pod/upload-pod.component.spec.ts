import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPodComponent } from './upload-pod.component';

describe('UploadPodComponent', () => {
  let component: UploadPodComponent;
  let fixture: ComponentFixture<UploadPodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
