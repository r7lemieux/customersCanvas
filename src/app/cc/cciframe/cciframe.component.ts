import { AfterViewInit, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DesignEditorIframeComponent,
  LoadEditorFunction
} from 'projects/design-editor-iframe/src/public-api';
import { ProductsService } from '../../services/products.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Editor } from '@aurigma/design-editor-iframe/Editor';
import { DesignEditorComponent } from 'projects/design-editor-iframe/src/lib/design-editor/design-editor.component';
import { ImageItem, PlaceholderItem, BaseTextItem, RectangleItem } from '@aurigma/design-atoms/Model/Product/Items';
import { RectangleF } from '@aurigma/design-atoms/Math';
import { ColorFactory } from '@aurigma/design-atoms/Colors';

interface Window {
  CustomersCanvas?: any;
}

@Component({
  selector: 'app-cciframe',
  templateUrl: './cciframe.component.html',
  styleUrls: ['./cciframe.component.scss']
})

export class CciframeComponent {
  profileData = {
    'first name': 'Andrew',
    'last name': 'Simontsev',
    'address': '901 N Pitt St, Suite 325\nAlexandria VA, 22314',
    'avatar': 'https://ru.gravatar.com/userimage/16369644/206e77c101a071dc0b192ce71c846d62.jpg?size=600'
  };

  customersCanvasBaseUrl = 'https://h.customerscanvas.com/Users/1f4b75ac-b0c2-46e5-88ed-d7f88c613250/SimplePolygraphy';
  projectForm: FormGroup;

  @ViewChild(DesignEditorComponent) designEditor: DesignEditorComponent;

  constructor(@Inject(DOCUMENT) private document: any,
              private fb: FormBuilder,
              private productService: ProductsService
  ) {
    this.projectForm = this.fb.group({
      projectName: [
        null,
        [Validators.required]
      ]
    });
  }

  async createBlankDesign(width: number, height: number) {
    this.designEditor.reload({surfaces: [{width, height}]});
  }

  /**
   * A recommended way to populate a design with the custom content when you are using
   * the IFrame API approach.
   */
  async populate() {
    await this.designEditor.cc.loadUserInfo(this.profileData);
  }

  // See for details:
  // https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm

  /**
   * An alternative way to populate a design with a custom content - can be transferred to
   * the embedded component.
   */
  async populate2() {

    if (!this.designEditor.cc) { return; }

    const product = await this.designEditor.cc.getProduct();
    const model = await product.getProductModel();

    model
      .getAllItems()
      .forEach(async (x) => {
        const value = this.profileData[x.name.toLowerCase()];
        if (typeof value === 'string') {
          switch (x.type) {
            case 'PlaceholderItem':
              const img = new ImageItem();
              img.source = new ImageItem.ImageSource(null, value);
              (x as PlaceholderItem).content = img;
              break;
            default:
              (x as BaseTextItem).text = value;
              break;
          }
          await product.setItem(x);
        }
      });
  }

  async deleteSelection() {
    if (!this.designEditor.cc) { return; }

    const selection = (await this.designEditor.cc.getSelectedItems())
      .map(x => x.name);

    const product = await this.designEditor.cc.getProduct();
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

  /*
  async saveProduct() {
    if (!this.designEditor.cc) { return; }
    const Model = (window as any).CustomersCanvas.DesignAtoms.ObjectModel;
    // const product = await this.editor.getProduct();
    // this.productService.addProduct(product);
    // const result = await this.editor.saveProduct(this.projectName);
    const saveOptions = {
      fileName: this.projectName.value,
      stateId: this.projectName.value
    };
    const saveResult = await this.designEditor.cc.finishProductDesign(saveOptions);
    console.log(`==> cciframe.component.ts:219 saveProduct saveResult `, saveResult);

  }*/
}
