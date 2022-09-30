import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseTabComponent } from './close-tab/close-tab.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeoutRoutingModule { }
