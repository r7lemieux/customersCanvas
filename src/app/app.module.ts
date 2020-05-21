import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CciframeComponent } from './cc/cciframe/cciframe.component';
import { EmbeddedComponent } from './cc/embedded/embedded.component';

@NgModule({
  declarations: [
    AppComponent,
    CciframeComponent,
    EmbeddedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
