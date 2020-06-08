import { NgModule } from '@angular/core';
import { CcNewappClientComponent } from './cc-newapp-client.component';
import { DesignBrowserComponent } from './design-browser/design-browser.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [CcNewappClientComponent, DesignBrowserComponent],
  imports: [
    CommonModule
  ],
  exports: [CcNewappClientComponent, DesignBrowserComponent]
})
export class CcNewappClientModule { }
