import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { maybe } from 'tsmonad';
import { Product } from '@aurigma/design-atoms/Model/Product';
import { JsonProductSerializer } from '@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer';

@Component({
  selector: 'lib-design-browser',
  templateUrl: './design-browser.component.html',
  styleUrls: ['./design-browser.component.scss']
})
export class DesignBrowserComponent implements OnInit {

  @ViewChild('status') statusDiv: ElementRef;

  constructor() { }

  /**
   * The URL to the new CC backend platform.
   *
   * We have deployed an instance especially for your POC. If you would like to see
   * a list of endpoints, here is the Swagger client:
   *
   * https://fedex-poc-ccbackend.azurewebsites.net/swagger/ui/index#
   *
   * The API Key is 11111. It is intentionally weak (to be easy to operate with).
   * In this demo, we will pass it from the frontend, however, apparently it is
   * bad idea to do it in the real app. You will have to create a proxy API in your
   * backend.
   *
   * Right now, API Key protection is the only way to authorize requests. The OAuth2
   * support is on the roadmap.
   *
   * It is deployed as Azure Web App on the weakest possible plan (B1)
   * with a free tier of Atlas (cloud version of MongoDB). So you may find
   * the performance issues related to it.
   */
  private apiUrl = 'https://fedex-poc-ccbackend.azurewebsites.net';
  private apiKey = '11111';

  /**
   * A number of a "tenant" (= unit).
   *
   * The backend is designed to be "multi-tenant". In other words, all assets (state files,
   * images, fonts, etc) are stored in separate "accounts".
   *
   * It is not necessary in this POC, so we have pre-created a unit and we will use its ID in all our calls.
   */
  private unitId = 42;

  @Input() designs = [];
  @Output() itemClicked = new EventEmitter<Product>();

  ngOnInit(): void {
    this.refresh();
  }

  async handleFileInput(files: FileList) {
    const formData = new FormData();
    formData.append('sourceFile', files.item(0));
    formData.append('title', files.item(0).name);
    formData.append('makePreview', 'true');
    formData.append('previewNamespace', 'storefront');
    formData.append('previewName', 'thumbnail');
    formData.append('previewWidth', '400');
    formData.append('previewHeight', '400');
    formData.append('previewStub', 'true');
    formData.append('previewFormat', 'Jpeg');
    this.statusDiv.nativeElement.innerHTML = 'Loading...';
    await fetch(`${this.apiUrl}/api/processor/v1/units/${this.unitId}/designs/import`, {
      body: formData,
      method: 'POST',
      headers: {
        'X-ExternalStateStorageApiKey': this.apiKey.toString()
      }
    });
    this.statusDiv.nativeElement.innerHTML = 'Done';
    await this.refresh();
    this.statusDiv.nativeElement.innerHTML = '';
  }

  getThumbnailByDesign(design: any) {
    return maybe(design)
      .map(d => d.previews)
      .map(pp => pp['storefront-thumbnail'])
      .map(p => p.url)
      .caseOf({
        just: u => u,
        nothing: () => `${this.apiUrl}/api/processor/v1/units/${this.unitId}/designs/${design.id}/preview/storefront/thumbnail/400x400`
      });
  }

  async refresh() {
    const response = await fetch(`${this.apiUrl}/api/v1/units/${this.unitId}/states`, {
      method: 'GET',
      headers: {
        'X-ExternalStateStorageApiKey': this.apiKey.toString()
      }
    });
    this.designs = (await response.json()).items;
  }

  async itemSelected(design) {

    // GET /api/atoms/v1/units/{unitId}/designs/{id}/model
    const response = await fetch(`${this.apiUrl}/api/atoms/v1/units/${this.unitId}/designs/${design.id}/model`, {
      method: 'GET',
      headers: {
        'X-ExternalStateStorageApiKey': this.apiKey.toString()
      }
    });

    const product = new JsonProductSerializer().deserialize(await response.json());

    this.itemClicked.emit(product);
  }

  async deleteSelected(design) {

    // GET /api/atoms/v1/units/{unitId}/designs/{id}/model
    await fetch(`${this.apiUrl}/api/v1/units/${this.unitId}/states/${design.id}`, {
      method: 'DELETE',
      headers: {
        'X-ExternalStateStorageApiKey': this.apiKey.toString()
      }
    });
    await this.refresh();
  }


}
