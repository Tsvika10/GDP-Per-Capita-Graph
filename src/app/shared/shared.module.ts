import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialElementsModule } from './../material-elements/material-elements.module';
import { ChartsModule } from 'ng2-charts';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { GdpGraphCanvasComponent } from "../gdp-graph-canvas/gdp-graph-canvas.component";

@NgModule({
  exports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialElementsModule,
    GdpGraphCanvasComponent

  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyARQgd8xnT3Fmf91I23JjM80JyQCSimkXI",
      authDomain: "world-bank-data-app.firebaseapp.com",
      databaseURL: "https://world-bank-data-app.firebaseio.com",
      projectId: "world-bank-data-app",
      storageBucket: "world-bank-data-app.appspot.com",
      messagingSenderId: "312460408133"
    }),
    ChartsModule,
    CommonModule
  ],
  declarations: [GdpGraphCanvasComponent]
})
export class SharedModule { }
