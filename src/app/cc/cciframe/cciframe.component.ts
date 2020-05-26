import { AfterViewInit, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DesignEditorIframeComponent, LoadEditorFunction } from 'projects/design-editor-iframe/src/public-api';

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

  @ViewChild(DesignEditorIframeComponent) private designEditorIFrame: DesignEditorIframeComponent;

  constructor(@Inject(DOCUMENT) private document: any,
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

  ngAfterViewInit() {
  }

  onError(msg: string) {
    throw new Error(`Customer's Canvas IFrame API failed with this message:\n${msg}`);
  }

  async onIFrameReady(loadEditor: LoadEditorFunction) {
    const config = {
      initialMode: 'Advanced'
    };
    this.editor = await loadEditor(this.productDefinition, config);
  }

  // See for details:
  // https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm

  async setName() {
    if (!this.editor) { return; }

    const product = await this.editor.getProduct();
    const model = await product.getProductModel();

    model
      .getAllItems()
      .forEach(async (x) => {
        switch (true) {
          case x.name.toLowerCase() === 'first name':
            x.text = 'Richard';
            await product.setItem(x);
            break;
          case x.name.toLowerCase() === 'last name':
            x.text = 'Lemieux';
            await product.setItem(x);
            break;
        }
      });

    // This is an easy way to set multiple changes to the editor, however, it would cause flickering of the editor.
    // To avoid it, you can use `await product.setItem()` as in the switch/case above.
    //
    // await product.setProductModel(model);
  }

  async deleteSelection() {
    if (!this.editor) { return; }

    const selection = (await this.editor.getSelectedItems())
      .map(x => x.name);

    const product = await this.editor.getProduct();
    const model = await product.getProductModel();

    const currentPageMainContainer = model
      .surfaces
      .get(product.currentSurfaceIndex)
      .containers
      .first(x => x.name === 'Main');

    currentPageMainContainer.items.setRange(currentPageMainContainer
      .items
      .where(x => selection.indexOf(x.name) === -1)
      .toArray());

    await product.setProductModel(model);
  }

  async addElement() {
    if (!this.editor) { return; }

    // Until we add IFrame API as an npm package, you have to use
    // a namespace from IFrameApi.js instead of imported Design Atoms.
    const Model = (window as any).CustomersCanvas.DesignAtoms.ObjectModel;

    // See for details:
    // https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm
    const product = await this.editor.getProduct();

    const rect = new Model.RectangleItem(new Model.RectangleF(50, 50, 100, 150));
    rect.name = `Item ${Math.random().toString(36).substr(2, 5)}`;
    rect.fillColor = new Model.ColorFactory.createColor('#DAF7A6');

    product.currentSurface.insertItem(rect);
  }
}
