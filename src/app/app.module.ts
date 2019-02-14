import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { GdpGraphComponent } from './gdp-graph/gdp-graph.component';
import { CountryPickComponent } from './country-pick/country-pick.component';
import { HttpClientModule } from '@angular/common/http';
import { PostsModule } from './posts/posts.module';
import { SharedModule } from './shared/shared.module';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    GdpGraphComponent,
    CountryPickComponent,
    LoginDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    PostsModule,
    SharedModule
  ],
  entryComponents: [
    LoginDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
