import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { Product, Surface } from '@aurigma/design-atoms/Model/Product';
import { Viewer } from '@aurigma/design-atoms/Viewer/Viewer';
import { DOCUMENT } from '@angular/common';

  interface Window {
    CustomersCanvas?: any;
  }


@Component({
  selector: 'app-cciframe',
  templateUrl: './cciframe.component.html',
  styleUrls: ['./cciframe.component.scss']
})
export class CciframeComponent  implements OnInit, AfterViewInit {
  productDefinition;
  scriptCreated;

  constructor( @Inject(DOCUMENT) private document: any,
  ) {
    // (window as Window).CustomersCanvas = {
    //   IframeApi: {
    //     editorUrl: "http://localhost:4200/customerCanvasIframe"
    //   }
    // };
    this.createScript();
  }

  ngOnInit() {
    this.productDefinition = {
      //This safety line is applied to all surfaces of the product.
      defaultSafetyLines: [{
        margin: 8.5,
        color: 'rgba(0,255,0,1)',
        altColor: 'rgba(255,255,255,0)',
        stepPx: 5,
        widthPx: 1
      }],
      surfaces: [
        //The first surface - a front side of the business card.
        {
          printAreas: [{ designFile: "BusinessCard2_side1" }]
        },
        //The second surface - a back side of the business card.
        {
          printAreas: [{ designFile: "BusinessCard2_side2" }]
        }]
    };
  }

  ngAfterViewInit() {
    //Getting the iframe element to display the editor in.
    var iframe = document.getElementById("editorFrame");
    //Loading the editor.
    var config = { tokenId: "1f4b75ac-b0c2-46e5-88ed-d7f88c613250" };
    var editor = null;
    (window as Window).CustomersCanvas.IframeApi.loadEditor(iframe, this.productDefinition, config).then(function(e) {editor = e});
  }

  createScript() {
    (window as Window).customersCanvasReady = () => {
      if (!this.scriptCreated) {
        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = `http://example.com/Resources/Generated/IframeApi.js`;
        this.scriptCreated = true;
        this.document.body.appendChild(script);
        return;
      }
    }
  }}
