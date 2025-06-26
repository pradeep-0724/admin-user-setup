import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);
import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-pdf-sample',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './pdf-sample.component.html',
  styleUrl: './pdf-sample.component.scss'
})
export class PdfSampleComponent implements OnInit {
  pdfSrc = '';
  ngOnInit(): void {
    // this.generatePdf()
    const pdfDocGenerator = pdfMake.createPdf(this.generatePdf());
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl;
      console.log(dataUrl);

      // const targetElement = document.querySelector('#iframeContainer');
      // if (targetElement) {
      //   const iframe = document.createElement('iframe');
      //   iframe.src = dataUrl;
      //   iframe.width = '100%';
      //   iframe.height = '600px'; // adjust height as needed
      //   targetElement.appendChild(iframe);
      // } else {
      //   console.error('#iframeContainer not found');
      // }
    });
    // pdfMake.createPdf(this.generatePdf()).open({}, window);
    // pdfMake.createPdf(this.generatePdf()).print();

  }

  generatePdf() {
    console.log('ffdf');

    var dd = {
      content: [
        { text: 'Tables', style: 'header' },
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
        'The following table has nothing more than a body array',
        {
          style: 'tableExample',
          table: {
            body: [
              ['Column 1', 'Column 2',],
              ['One value goes here', 'Another one here',]
            ]
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
        },
        tableExample: {
        }
      },
      layout: {
        hLineWidth: function () { return .7; },
        vLineWidth: function () { return .7; },
        hLineColor: function () { return 'black'; },
        vLineColor: function () { return 'black'; }
      },
    };
    return dd



  }
  
  toBase64Image(url: string, callback: (dataUrl: string) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  

  }
}