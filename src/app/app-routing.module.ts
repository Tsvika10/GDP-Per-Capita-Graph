import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GdpGraphComponent } from './gdp-graph/gdp-graph.component';
import { PostsComponent } from './posts/posts.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'gdpData', redirectTo: 'gdpData/new', pathMatch: 'full' },
  { path: 'posts', component: PostsComponent },
  { path: 'posts/:id', component: PostsComponent },
  { path: 'gdpData/new', component: GdpGraphComponent },
  { path: 'gdpData/edit/:id', component: GdpGraphComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
