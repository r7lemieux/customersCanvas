import { Component, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { EditorBuilder } from '@aurigma/design-editor-iframe/EditorBuilder';
import { IProductDefinition } from '@aurigma/design-editor-iframe/ObjectModel/ObjectModel';
import { IConfiguration } from '@aurigma/design-editor-iframe/Configuration/ConfigurationInterfaces';
import { Editor } from '@aurigma/design-editor-iframe/Editor';
import { Events } from '@aurigma/design-editor-iframe/PostMessage/RpcTypes';
import { BaseItem } from '@aurigma/design-atoms/Model/Product/Items';

@Component({
  selector: 'lib-design-editor',
  templateUrl: './design-editor.component.html',
  styleUrls: ['./design-editor.component.less']
})
export class DesignEditorComponent implements AfterViewInit {

  constructor() { }

  public inProgress: boolean = null;
  public cc: Editor;
  @Input() backendUrl: string;
  @Input() productDefinition: IProductDefinition;
  @Input() config: IConfiguration;

  @Output() ready = new EventEmitter<Editor>();
  @Output() selectedItemsChanged = new EventEmitter<BaseItem[]>();

  @ViewChild('designEditorFrame') iframeElement: ElementRef;

  async _load(productDefinition: IProductDefinition, config: IConfiguration) {
    this.inProgress = true;
    if (!productDefinition) {
      throw new Error('The productDefinition is not optional! Make sure that you pass a state id or IProductDefinition.');
    }

    this.cc = await EditorBuilder
      .for(this.backendUrl)
      .build(
        this.iframeElement.nativeElement,
        productDefinition,
        config || {});

    this.cc.subscribe(Events.SelectedItemsChanged, (args) => {
      this.selectedItemsChanged.emit(args);
    });

    this.inProgress = null;
    this.ready.emit(this.cc);
  }

  async reload(productDefinition: IProductDefinition) {
    await this._load(productDefinition, this.config);
  }

  async ngAfterViewInit() {
    await this._load(this.productDefinition, this.config);

  }

}
