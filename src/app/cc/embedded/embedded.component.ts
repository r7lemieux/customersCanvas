import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product, Surface, SafetyLine, PdfBox } from '@aurigma/design-atoms/Model/Product';
import { SurfaceContainer } from '@aurigma/design-atoms/Model/Product';
import { PrintArea } from '@aurigma/design-atoms/Model/Product';
import { ImageItem, PlaceholderItem, PlainTextItem, BaseTextItem, EllipseItem } from '@aurigma/design-atoms/Model/Product/Items';
import { PointF } from '@aurigma/design-atoms/Math';
import { MockupContainer } from '@aurigma/design-atoms/Model/Product';
import { RectangleF } from '@aurigma/design-atoms/Math';
import { RgbColor, CmykColor, ColorFactory } from '@aurigma/design-atoms/Colors';
import { Viewer, IOptions } from '@aurigma/design-atoms/Viewer';
import { Configuration } from '@aurigma/design-atoms/Configuration';
import { SelectionHandler } from '@aurigma/design-atoms/SelectionHandler';


@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss']
})
export class EmbeddedComponent implements AfterViewInit, OnInit {
  product: Product;
  viewer: Viewer;

  @ViewChild('viewerParent') viewerParent: ElementRef;

  constructor() { }

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
    placeholder.name = 'photo';

    // Create a text item to the main container.
    const nameItem = new PlainTextItem('Cristopher Bennett', new PointF(400, 100), 'Roboto-Bold', 25);
    nameItem.locked = false;
    nameItem.name = 'employee';

    const ellipse = new EllipseItem(new RectangleF(400, 200, 300, 200));
    ellipse.fillColor = new RgbColor('rgb(255, 195, 0)');

    const image = new ImageItem();
    image.sourceRectangle = new RectangleF(100, 400, 640, 480);
    image.source = new ImageItem.ImageSource(null, 'https://placeimg.com/640/480/any');

    // Add these items to the main container
    //
    // Note, the collections in Design Atoms are implemented via the linq package. It brings to JavaScript the
    // LINQ-like syntax of C# (AFAIK, the equivalent of LINQ in Java is Streams).
    page.containers
      .first(x => x.name === Configuration.MAIN_CONTAINER_NAME)
      .items
      .setRange([placeholder, image, nameItem, ellipse]);

    // Create a product based on the page we have created
    this.product = new Product([page]);
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
      backendUrl: 'https://h.customerscanvas.com/Users/1f4b75ac-b0c2-46e5-88ed-d7f88c613250/SimplePolygraphy',
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

    // Make safety lines visible
    this.viewer.safetyLinesHandler.visible = true;

  }

}
