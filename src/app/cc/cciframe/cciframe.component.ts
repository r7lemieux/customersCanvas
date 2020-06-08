import { AfterViewInit, Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DesignEditorIframeComponent,
  DesignEditorIframeService,
  LoadEditorFunction
} from 'projects/design-editor-iframe/src/public-api';
import { ProductsService } from '../../services/products.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

interface Window {
  CustomersCanvas?: any;
}

@Component({
  selector: 'app-cciframe',
  templateUrl: './cciframe.component.html',
  styleUrls: ['./cciframe.component.scss']
})

export class CciframeComponent implements OnInit, AfterViewInit {
  profileData = {
    'first name': 'Andrew',
    'last name': 'Simontsev',
    'address': '901 N Pitt St, Suite 325\nAlexandria VA, 22314',
    'avatar': 'https://ru.gravatar.com/userimage/16369644/206e77c101a071dc0b192ce71c846d62.jpg?size=600'
  };

  loadEditor = null;
  customersCanvasBaseUrl = 'https://h.customerscanvas.com/Users/1f4b75ac-b0c2-46e5-88ed-d7f88c613250/SimplePolygraphy';
  editor: any;
  productDefinition;
  config = {
    initialMode: 'Advanced',
    canvas: {
      shadowEnabled: true,
      canvasItemHoverEnabled: true
    },
    violationWarningsSettings: {
      safetyLineViolationWarningEnabled: false
    },
    widgets: {
      Toolbox: {
        buttons: [
          {
            translationKey: 'Toolbox.TEXT',
            translationKeyTitle: 'Toolbox.TITLE_ADD_TEXT',
            iconClass: 'cc-icon-add-text',
            buttons: ['Text', 'BoundedText', 'RichText']
          },
          'Image',
          {
            translationKey: 'Placeholder',
            translationKeyTitle: 'Add a placeholder',
            iconClass: 'cc-icon-select-image-top-toolbar',
            action: 'CustomPlaceholder'
          },
          'Background',
          'QrCode'
        ]
      },
      ObjectInspector: {
        showItemName: true
      },
      ItemMenu: {
        renameEnabled: true
      }
    }
  };
  projectForm: FormGroup;



  @ViewChild(DesignEditorIframeComponent) private designEditorIFrame: DesignEditorIframeComponent;

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
      surfaces: {
        file: 'fedex/FedexSample2'
      }
    };
  }

  ngAfterViewInit() {
  }

  onError(msg: string) {
    throw new Error(`Customer's Canvas IFrame API failed with this message:\n${msg}`);
  }

  async onIFrameReady(loadEditor: LoadEditorFunction) {
    this.loadEditor = loadEditor;
    this.editor = await loadEditor(this.productDefinition, this.config);
  }

  async createBlankDesign(width: number, height: number) {
    this.editor = await this.loadEditor({surfaces: [{width, height}]}, this.config);
  }

  /**
   * A recommended way to populate a design with the custom content when you are using
   * the IFrame API approach.
   */
  async populate() {
    await this.editor.loadUserInfo(this.profileData);
  }

  // See for details:
  // https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm

  /**
   * An alternative way to populate a design with a custom content - can be transferred to
   * the embedded component.
   */
  async populate2() {

    const Model = (window as any).CustomersCanvas.DesignAtoms.ObjectModel;

    if (!this.editor) { return; }

    const product = await this.editor.getProduct();
    const model = await product.getProductModel();

    model
      .getAllItems()
      .forEach(async (x) => {
        const value = this.profileData[x.name.toLowerCase()];
        if (typeof value === 'string') {
          switch (x.type) {
            case 'PlaceholderItem':
              x.content = new Model.ImageItem();
              x.content.source = new Model.ImageItem.ImageSource(null, value);
              break;
            default:
              x.text = value;
              break;
          }
          await product.setItem(x);
        }
      });
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

  get projectName(): AbstractControl {
    return this.projectForm.get('projectName');
  }

  async saveProduct() {
    if (!this.editor) { return; }
    const Model = (window as any).CustomersCanvas.DesignAtoms.ObjectModel;
    // const product = await this.editor.getProduct();
    // this.productService.addProduct(product);
    // const result = await this.editor.saveProduct(this.projectName);
    const saveOptions = {
      fileName: this.projectName.value,
      stateId: this.projectName.value
    };
    const saveResult = await this.editor.finishProductDesign(saveOptions);
    console.log(`==> cciframe.component.ts:219 saveProduct saveResult `, saveResult);

  }
}
