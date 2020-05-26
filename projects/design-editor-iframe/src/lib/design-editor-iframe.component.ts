import { curry, pipe, lensProp, set, __ } from 'ramda';
import { maybe } from 'tsmonad';
import { DOCUMENT } from '@angular/common';

import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output, Renderer2, Inject } from '@angular/core';

// TODO: We will add typings for IFrame API when a public npm package is available
type ExternalLoadEditorFunction = (iframeElem: HTMLElement, productDefinition: any, editorConfig: any, deprecated: any) => Promise<any>;
export type LoadEditorFunction = (productDefinition: any, editorConfig: any) => Promise<any>;

@Component({
  selector: 'lib-design-editor-iframe',
  templateUrl: './design-editor-iframe.component.html',
  styleUrls: ['./design-editor-iframe.component.less']
})

export class DesignEditorIframeComponent implements OnInit {

  @Input() url: string;
  @ViewChild('designEditorFrame') iframeElement: ElementRef;

  @Output() ready = new EventEmitter<LoadEditorFunction>();
  @Output() failed = new EventEmitter<string>();

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document) { }

  private createElementFromObject(elementType: string, objProps: object) {
    const result = this.renderer.createElement(elementType);
    for (const [key, value] of Object.entries(objProps)) {
      result[key] = value;
    }
    return result;
  }

  ngOnInit(): void {
    /*
      In case if you are not familiar with a functional approach (tsmonad and ramda),
      this code creates a <script> element, initializes its properties, adds onload which
      emits the ready event.
     */
    maybe(this.url)
      .map(u => pipe(
        set(lensProp('src'), `${u}/Resources/Generated/IframeApi.js`),
        set(lensProp('id'), 'CcIframeApiScript'),
        set(lensProp('onload'), () => {
          maybe((window as any).CustomersCanvas)
            .map(cc => cc.IframeApi)
            .map(i => curry<ExternalLoadEditorFunction>(i.loadEditor)(this.iframeElement.nativeElement, __, __, null))
            .do({
              just: f => this.ready.emit(f),
              nothing: () => this.failed.emit('For some reasons, Customer\'s Canvas IFrame API is not available!')
            });
        }),
        set(lensProp('onabort'), () => this.failed.emit('IFrame API script loading was aborted.')),
        set(lensProp('onerror'), (msg: string) => this.failed.emit(msg))
      )({}))
      .map(p => this.createElementFromObject('script', p))
      .do({
        just: elem => this.renderer.appendChild(this.document.head, elem),
        nothing: () => { throw new Error('You should provide the base URL of your Design Editor back end.'); }
      });
  }

}
