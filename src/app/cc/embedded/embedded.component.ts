import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product, Surface, SafetyLine, PdfBox } from "@aurigma/design-atoms/Model/Product";
import { SurfaceContainer} from "@aurigma/design-atoms/Model/Product";
import { PrintArea } from "@aurigma/design-atoms/Model/Product";
import { ImageItem, PlaceholderItem, PlainTextItem, BaseTextItem } from "@aurigma/design-atoms/Model/Product/Items";
import { PointF } from "@aurigma/design-atoms/Math";
import { MockupContainer } from "@aurigma/design-atoms/Model/Product";
import { RectangleF } from "@aurigma/design-atoms/Math";
import { RgbColor } from '@aurigma/design-atoms/Colors';

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss']
})
export class EmbeddedComponent implements OnInit {
  placeholder: PlaceholderItem;
  mainContainer: SurfaceContainer;
  product: Product;
  mockupImg: ImageItem;
  safetyLine: SafetyLine;

  constructor() { }

  ngOnInit() {
    this.product = new Product([new Surface(800, 800)]);

    // Create an image placeholder.
    this.placeholder = new PlaceholderItem();
    this.placeholder.content = new ImageItem(null, new PointF(100, 100), 200, 200);
    this.placeholder.name = "photo";

    // Create a main container with the placeholder.
    this.mainContainer = new SurfaceContainer([this.placeholder]);
    this.mainContainer.name = "main";

    // Add a text item to the main container.
    const nameItem = new PlainTextItem("Cristopher Bennett", new PointF(100, 400), "Roboto-Bold", 25);
    nameItem.name = "employee";
    this.mainContainer.items.add(nameItem);

    // Add the main container to the surface.
    const surface = this.product.surfaces.get(0);
    surface.containers.setRange([this.mainContainer]);

    this.mockupImg = new ImageItem();
    this.mockupImg.sourceRectangle = new RectangleF(0, 0, surface.width, surface.height);
    this.mockupImg.source = new ImageItem.ImageSource(null, "https://example.com/mugmockup.png");
    surface.mockup.overContainers.add(new MockupContainer([this.mockupImg]));

    const textItem = surface.containers.first().items.first(i => i.name === "employee") as BaseTextItem;
    textItem.text = "John Wood";
  }

  ngAfterViewInit() {

  }

  setPrintArea() {
    this.safetyLine = new SafetyLine();
    this.safetyLine.margin = 10;
    this.safetyLine.pdfBox = PdfBox.Bleed;
    this.safetyLine.color = new RgbColor("lime");
    const surface = this.product.surfaces.get(0);  // ?
    const printArea = new PrintArea(new RectangleF(0, 0, surface.width, surface.height));
    printArea.safetyLines.add(this.safetyLine);
    surface.printAreas.add(printArea);
  }
}
