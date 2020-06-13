import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { maybe } from 'tsmonad';
import { DesignBrowserService } from './design-browser.service';

@Component({
  selector: 'lib-design-browser',
  templateUrl: './design-browser.component.html',
  styleUrls: ['./design-browser.component.scss']
})
export class DesignBrowserComponent implements OnInit {

  @ViewChild('status') statusDiv: ElementRef;

  constructor(public designService: DesignBrowserService) {
    this.designService.apiUrl = 'https://fedex-poc-ccbackend.azurewebsites.net';
    this.designService.apiKey = '11111';
    this.designService.unitId = 42;
    this.designService.thumbnailProps = {
      width: 400,
      height: 400,
      namespace: 'storefront',
      format: 'Jpeg',
      name: 'thumbnail'
    };
  }

  @Input() designs = [];
  @Output() itemClicked = new EventEmitter<string>();

  ngOnInit(): void {
    this.refresh();
  }

  async handleFileInput(files: FileList) {
    this.statusDiv.nativeElement.innerHTML = 'Loading...';
    await this.designService.import(files);
    this.statusDiv.nativeElement.innerHTML = 'Done';
    await this.refresh();
    this.statusDiv.nativeElement.innerHTML = '';
  }

  getThumbnailByDesign(design: any) {
    return maybe(design)
      .map(d => d.previews)
      .map(pp => pp[`${this.designService.thumbnailProps.namespace}-${this.designService.thumbnailProps.name}`])
      .map(p => p.url)
      .caseOf({
        just: u => u,
        nothing: () => this.designService.buildThumbnailUrl(design.id)
      });
  }

  async refresh() {
    this.designs = await this.designService.listDesigns();
  }

  async itemSelected(design) {
    this.itemClicked.emit(design.id);
  }

  async deleteSelected(design) {
    await this.designService.deleteDesign(design.id);
    await this.refresh();
  }


}
