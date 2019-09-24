import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './users/auth.guard';
import { SelectiveStrategy } from './selective-strategy.service';

const routes = [
  { path: '', component: HomeComponent },
  {
    path: 'characters',
    canActivate: [AuthGuard],
    data: { preload: true },
    //asynchronously load the specified file on demand
    loadChildren: () =>
      //import returns a promise, when the request is complete, the promise is resolved and we
      //specify the angular module to load from that file
      import('./characters/character.module').then(m => m.CharacterModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { preloadingStrategy: SelectiveStrategy })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
