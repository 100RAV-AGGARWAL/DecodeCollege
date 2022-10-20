import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth-guard.service';
import { PlagiarismRemoverComponent } from './plagiarism-remover/plagiarism-remover.component';

const routes: Routes = [
  {path: 'plagiarism-remover', component: PlagiarismRemoverComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlagiarismRemoverRoutingModule { }
