import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { AuthGuard } from './auth-guard.service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserRoutingModule,

  ],
  providers: [
    // UserService,
    AuthGuard
  ]
})
export class UserModule { }
