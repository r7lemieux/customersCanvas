import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product, Surface, SafetyLine, PdfBox } from '@aurigma/design-atoms/Model/Product';
import { SurfaceContainer } from '@aurigma/design-atoms/Model/Product';
import { PrintArea } from '@aurigma/design-atoms/Model/Product';
import { ImageItem, PlaceholderItem, PlainTextItem, BaseTextItem, EllipseItem, BaseItem, BoundedTextItem, Item, RectangleItem } from '@aurigma/design-atoms/Model/Product/Items';
import { PointF } from '@aurigma/design-atoms/Math';
import { RectangleF } from '@aurigma/design-atoms/Math';
import { RgbColor, CmykColor, ColorFactory } from '@aurigma/design-atoms/Colors';
import { Viewer, IOptions } from '@aurigma/design-atoms/Viewer';
import { Configuration } from '@aurigma/design-atoms/Configuration';
import { ProductsService } from '../../services/products.service';
import { assignProperties } from '@aurigma/design-atoms/Utils/Utils';

import {
  DesignBrowserComponent
} from 'projects/cc-newapp-client/src/public-api';
import { DesignBrowserService } from 'projects/cc-newapp-client/src/lib/design-browser/design-browser.service';
import { CreateItemCommand, ICreateItemCommandArgs, ItemType } from '@aurigma/design-atoms/Commands/ItemsCommands/CreateItemCommand';
import { ItemsCommand } from '@aurigma/design-atoms/Commands/CommandManager';
import { Transform } from '@aurigma/design-atoms/Transform';
import { HistoryUpdateMode } from '@aurigma/design-atoms/Commands/ModelUpdateCommand';


@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss']
})
export class EmbeddedComponent implements AfterViewInit, OnInit {
  ItemType: typeof ItemType = ItemType;
  product: Product;
  currentDesignId: string;
  viewer: Viewer;
  profileData = {
    'first name': 'Andrew',
    'last name': 'Simontsev',
    'address': '901 N Pitt St, Suite 325\nAlexandria VA, 22314',
    'avatar': 'https://ru.gravatar.com/userimage/16369644/206e77c101a071dc0b192ce71c846d62.jpg?size=600'
  };

  @ViewChild(DesignBrowserComponent) private browser: DesignBrowserComponent;
  @ViewChild('viewerParent') viewerParent: ElementRef;

  constructor(private productsService: ProductsService, private designService: DesignBrowserService) {
    // this.product = this.getIframeProduct();
  }

  async itemClicked(clickedDesignId: string) {
    this.currentDesignId = clickedDesignId;
    this.product = await this.browser.designService.getDesignModel(this.currentDesignId);
    this.viewer.surface = this.product.surfaces.get(0);

    console.log(this.viewer.surface.getAllItems().toArray());
  }

  private getIframeProduct(): Product {
    const products = Object.values(this.productsService.products);
    if (products.length) {
      return products[products.length - 1];
    }
    return null;
  }

  async save() {
    await this.browser.designService.putDesignModel(this.currentDesignId, this.product);
    await this.browser.refresh();
  }

  populate(data: any) {

    // If you compare it with the populate() in cciframe.component, you will
    // notice that it is almost completely copy-pasted from there.
    this.product
      .getAllItems()
      .forEach(async (x) => {
        const value = data[x.name.toLowerCase()];
        if (typeof value === 'string') {
          switch (x.type) {
            case 'PlaceholderItem':
              const placeholder = x as PlaceholderItem;
              const content = new ImageItem();
              content.source = new ImageItem.ImageSource(null, value);
              placeholder.content = content;
              break;
            default:
              const text = x as BaseTextItem;
              text.text = value;
              break;
          }
        }
      });

  }

  private async buildAtom(props: ICreateItemCommandArgs): Promise<Item> {
    return this.viewer.commandManager.execute(ItemsCommand.createItem, props, HistoryUpdateMode.Update);
  }

  async add(props: ICreateItemCommandArgs) {
    const item = await this.buildAtom(props);
    this
      .viewer
      .surface
      .containers
      .first(x => x.name === Configuration.MAIN_CONTAINER_NAME)
      .items
      .add(item);
  }

  private initProduct() {

    const width = 800;
    const height = 800;

    // Prepare a print area which will specify what portion of an image will be a part of a print file. Also, it contains
    // the safety lines (bleed/trim zone)
    const printarea = new PrintArea(new RectangleF(0, 0, width, height));
    printarea.safetyLines.add(
      new SafetyLine({
        margin: 9,
        pdfBox: PdfBox.Trim,
        color: new RgbColor('lime'),
        altColor: new RgbColor({a: 0, r: 0, b: 0, g: 0})}));

    // Create a blank surface (page) with a single "layer" (container)
    const page = new Surface(width, height, null, [printarea], 'Page 1', 'Page 1');
    page.containers.add(new SurfaceContainer([], Configuration.MAIN_CONTAINER_NAME));

    // Create an image placeholder.
    const placeholder = new PlaceholderItem(new RectangleF(100, 100, 200, 200));
    placeholder.name = 'avatar';

    // Create a text item to the main container.
    const firstNameItem = new PlainTextItem('Cristopher', new PointF(400, 100), 'Roboto-Bold', 25);
    firstNameItem.locked = false;
    firstNameItem.name = 'First name';
    const lastNameItem = new PlainTextItem('Bennett', new PointF(400, 140), 'Roboto-Bold', 25);
    lastNameItem.locked = false;
    lastNameItem.name = 'Last name';

    const ellipse = new EllipseItem(new RectangleF(400, 200, 300, 200));
    ellipse.fillColor = new RgbColor('rgb(255, 195, 0)');

    const image = new ImageItem();
    image.sourceRectangle = new RectangleF(10, 10, 800, 1024);
    image.source = new ImageItem.ImageSource(null, 'https://placeimg.com/640/480/any');
    // image.source = new ImageItem.ImageSource(null, 'https://storage.googleapis.com/customerscanvas/form1.pdf');

    // Add these items to the main container
    //
    // Note, the collections in Design Atoms are implemented via the linq package. It brings to JavaScript the
    // LINQ-like syntax of C# (AFAIK, the equivalent of LINQ in Java is Streams).
    page.containers
      .first(x => x.name === Configuration.MAIN_CONTAINER_NAME)
      .items
      .setRange([placeholder, image, firstNameItem, lastNameItem, ellipse]);

    // Create a product based on the page we have created
    this.product = new Product([page]);
    // console.log(`==> embedded.component.ts:86 initProduct this.product `, this.product);

  }

  ngOnInit() {
    this.initProduct();
  }

  ngAfterViewInit() {
    (this.viewerParent.nativeElement as HTMLDivElement).innerHTML = '';

    const options: IOptions = {
      /*
        You need the backend to render various graphics elements (like texts, images, etc), do color conversion if
        are working with CMYK elements, etc.

        All necessary endpoints are available in the standard Design Editor which we embed through cciframe. However,
        in a real-life usage, most likely you will want to create a simpler backend app using the Aurigma.DesignAtoms
        Nuget package (ASP.NET). We can help you with this part.
      */
      backendUrl: 'https://fedex-poc-ccbackend.azurewebsites.net/api/atoms/v1/units/42',
      holderElement: this.viewerParent.nativeElement,
      rulerEnabled: true,
      canvasBackground: { color: 'white' }
    };

    this.viewer = new Viewer(options);
    this.viewer.clearSelectionOnDocumentClick = true;
    this.viewer.clearSelectionOnViewerClick = true;
    this.viewer.rulerScale = 1 / 72; // points

    this.viewer.canvas.rotationGripColor = 'rgb(255, 255, 255)';
    this.viewer.canvas.rotationGripLineColor = 'rgb(48, 194, 255)';
    this.viewer.canvas.rotationGripLineLength = 10;
    this.viewer.canvas.rotationGripSize = 24;
    this.viewer.canvas.selectionColor = 'rgb(48, 194, 255)';
    this.viewer.canvas.selectionWidth = 1;

    this.viewer.canvas.resizeGripLineColor = 'rgb(48, 194, 255)';
    this.viewer.canvas.resizeGripColor = 'rgb(255, 255, 255)';
    this.viewer.canvas.resizeGripSize = 8;

    this.viewer.canvas.simpleMode = false;
    this.viewer.canvas.canvasItemHoverEnabled = true;

    // Specify the surface you want to display. If you have a multi-page product,
    // you need to update this property when the user chooses another page.
    this.viewer.surface = this.product.surfaces.get(0);
    // const embeddedSurface = this.product.surfaces;
    // const iframeSurface = this.getIframeProduct().surfaces;
    // console.log(`==> embedded.component.ts:133 ngAfterViewInit embeddedSurface `, embeddedSurface);
    // console.log(`==> embedded.component.ts:134 ngAfterViewInit iframeSurface `, iframeSurface);
    // Make safety lines visible
    this.viewer.safetyLinesHandler.visible = true;
  }

}
