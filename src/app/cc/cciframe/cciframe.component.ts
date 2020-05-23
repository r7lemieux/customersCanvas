import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface Window {
  CustomersCanvas?: any;
}

@Component({
  selector: 'app-cciframe',
  templateUrl: './cciframe.component.html',
  styleUrls: ['./cciframe.component.scss']
})
export class CciframeComponent implements OnInit, AfterViewInit {
  customersCanvasBaseUrl = 'https://h.customerscanvas.com/Users/1f4b75ac-b0c2-46e5-88ed-d7f88c613250/SimplePolygraphy';
  editor = null;
  productDefinition;
  scriptCreated;

  constructor( @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit() {
    this.productDefinition = {
      // This safety line is applied to all surfaces of the product.
      defaultSafetyLines: [{
        margin: 8.5,
        color: 'rgba(0,255,0,1)',
        altColor: 'rgba(255,255,255,0)',
        stepPx: 5,
        widthPx: 1
      }],
      surfaces: [
        // The first surface - a front side of the business card.
        {
          printAreas: [{ designFile: 'samples/name-photo' }]
        },
        // The second surface - a back side of the business card.
        {
          printAreas: [{ designFile: 'samples/test-page' }]
        }]
    };
  }

  async ngAfterViewInit() {
    await this.iframeApiReady();

    // Getting the iframe element to display the editor in.
    const iframe = document.getElementById('editorFrame');
    // Loading the editor.
    const config = {
      initalMode: 'Advanced'
     };
    this.editor = await (window as Window).CustomersCanvas.IframeApi.loadEditor(iframe, this.productDefinition, config);
  }

  async iframeApiReady() {
    return new Promise((resolve, reject) => {
      if (this.document.getElementById('CcIframeApiScript')) {
        resolve();
      } else {
        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${this.customersCanvasBaseUrl}/Resources/Generated/IframeApi.js`;
        script.onload = resolve;
        script.onerror = reject;
        script.onabort = reject;
        script.id = 'CcIframeApiScript';
        this.document.body.appendChild(script);
      }
    });
  }

}
