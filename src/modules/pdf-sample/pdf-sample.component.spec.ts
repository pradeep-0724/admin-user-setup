import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfSampleComponent } from './pdf-sample.component';

describe('PdfSampleComponent', () => {
  let component: PdfSampleComponent;
  let fixture: ComponentFixture<PdfSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
