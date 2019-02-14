import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  allLoaded: boolean;


  constructor(public user: UserService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.allLoaded = true;


  }
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, { width: '250px' })
  }


  openSnackBar() {
    let snackBarRef = this.snackBar.open('You must log in in order to do that', null, { duration: 2000 });
  }



}

