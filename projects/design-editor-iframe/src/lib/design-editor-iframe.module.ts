import { NgModule } from '@angular/core';
import { DesignEditorIframeComponent } from './design-editor-iframe.component';
import { DesignEditorComponent } from './design-editor/design-editor.component';

@NgModule({
  declarations: [DesignEditorIframeComponent, DesignEditorComponent],
  imports: [
  ],
  exports: [DesignEditorIframeComponent, DesignEditorComponent]
})
export class DesignEditorIframeModule { }
