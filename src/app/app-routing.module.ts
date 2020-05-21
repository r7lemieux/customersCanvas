import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CciframeComponent } from './cc/cciframe/cciframe.component';
import { EmbeddedComponent } from './cc/embedded/embedded.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: 'customerCanvasIframe',
    component: CciframeComponent
  },
  {
    path: 'customerCanvasEmbedded',
    component: EmbeddedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
