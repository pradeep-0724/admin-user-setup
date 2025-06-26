import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfHeadingNativeComponent } from './pdf-heading-native.component';

describe('PdfHeadingNativeComponent', () => {
  let component: PdfHeadingNativeComponent;
  let fixture: ComponentFixture<PdfHeadingNativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfHeadingNativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfHeadingNativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
