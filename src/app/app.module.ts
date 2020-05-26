import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CciframeComponent } from './cc/cciframe/cciframe.component';
import { EmbeddedComponent } from './cc/embedded/embedded.component';

import { DesignEditorIframeModule } from 'projects/design-editor-iframe/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    CciframeComponent,
    EmbeddedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DesignEditorIframeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
