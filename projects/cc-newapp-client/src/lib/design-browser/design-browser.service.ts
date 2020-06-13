import { Injectable } from '@angular/core';
import { JsonProductSerializer } from '@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer';
import { Product } from '@aurigma/design-atoms/Model/Product';


@Injectable({
    providedIn: 'root'
})
export class DesignBrowserService {

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
    apiUrl: string;
    apiKey: string;

    /**
     * An ID of a "tenant" (= unit).
     *
     * The backend is designed to be "multi-tenant". In other words, all assets (state files,
     * images, fonts, etc) are stored in separate "accounts".
     *
     * It is not necessary in this POC, so we have pre-created a unit and we will use its ID in all our calls.
     */
    unitId: number;

    thumbnailProps: {
        width: number;
        height: number;
        format: string;
        namespace: string;
        name: string;
    };

    private async requestToUnit(method: string, service: string, relativeUrl: string, body?: any) {
        const isNil = (prop: string) => typeof this[prop] === 'undefined';
        const propsToGuard = ['apiKey', 'apiUrl', 'unitId'];
        if (propsToGuard.some(isNil)) {
            throw new Error(`A property ${propsToGuard.find(isNil)} is not optional!`);
        }

        // At this moment, the backend offers three services:
        // - storage (no its own subpath after api)
        // - processor
        // - atoms
        if (service === 'storage') { service = ''; }
        if (service !== '') { service = `/${service}`; }

        let realBody = body;
        const headers = {
            'X-ExternalStateStorageApiKey': this.apiKey.toString()
        };
        switch (true) {
            case body instanceof FormData:
                break;
            case typeof body === 'string':
                headers['Content-Type'] = 'text/plain';
                break;
            default:
                headers['Content-Type'] = 'application/json';
                realBody = JSON.stringify(body);
        }

        const url = `${this.apiUrl}/api${service}/v1/units/${this.unitId}/${relativeUrl}`;
        const response = await fetch(url, {
            body: realBody,
            method,
            headers
        });

        if (response.status >= 400) {
            throw new Error(`${method} ${url} resulted ${response.status} HTTP code (${response.statusText})`);
        }

        return response;
    }

    /**
     * Uploads an IDML or PSD file to the backend which converts them to a state file. Note, make sure that the
     * fonts used in these designs are also imported!
     *
     * @param files A {@link FileList} instance received from a form or drag-and-drop. Note! At this moment only
     * single file uploads are supported!
     */
    async import(files: FileList) {
        const formData = new FormData();
        formData.append('sourceFile', files.item(0));
        formData.append('title', files.item(0).name);
        formData.append('makePreview', 'true');
        formData.append('previewNamespace', this.thumbnailProps.namespace);
        formData.append('previewName', this.thumbnailProps.name);
        formData.append('previewWidth', this.thumbnailProps.width.toString());
        formData.append('previewHeight', this.thumbnailProps.height.toString());
        formData.append('previewStub', 'true');
        formData.append('previewFormat', this.thumbnailProps.format);
        await this.requestToUnit('POST', 'processor', 'designs/import', formData);
    }

    async getDesignModel(designId: string) {
        const response = await this.requestToUnit('GET', 'atoms', `designs/${designId}/model`);
        return (new JsonProductSerializer()).deserialize(await response.json());
    }

    async putDesignModel(designId: string, model: Product) {
        const serializedData = JSON.parse((new JsonProductSerializer()).serialize(model));
        return await this.requestToUnit('PUT', 'atoms', `designs/${designId}/model`, serializedData);
    }

    async deleteDesign(designId: string) {
        return await this.requestToUnit('DELETE', 'storage', `states/${designId}`);
    }

    async listDesigns() {
        const response = await this.requestToUnit('GET', 'storage', 'states');
        return (await response.json()).items;
    }

    buildThumbnailUrl = (designId: string) => `${this.apiUrl}/api/processor/v1/units/${this.unitId}/designs/${designId}/preview/${this.thumbnailProps.namespace}/${this.thumbnailProps.name}/${this.thumbnailProps.width}x${this.thumbnailProps.height}`;


}
