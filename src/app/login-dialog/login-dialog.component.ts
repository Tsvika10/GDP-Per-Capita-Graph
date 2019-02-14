import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginMode: boolean = true;
  submitted: boolean = true;
  submittedRegeistered: boolean = true;
  loading: boolean = false;
  errorMessage: string = null;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private formBuilder: FormBuilder,
    public user: UserService,
    private snackbar: MatSnackBar) { }

  onChangeLoginMode(): void {
    this.loginMode = !this.loginMode;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  public get fl(): any {
    return this.loginForm.controls
  }

  public get fr(): any {
    return this.registerForm.controls
  }
  public get flInvalid(): any {
    return this.loginForm.status === "INVALID"
  }

  public get frInvalid(): any {
    return this.registerForm.status === "INVALID"
  }

  onSubmit() {
    this.submitted = true;


    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.user.login(this.fl.email.value, this.fl.password.value).then(() => { this.dialogRef.close() }).catch(err => {
      this.snackbar.open(err.message, 'ok', {
        duration: 10000
      });
      this.loading = false;
    })
  }

  onSubmitRegister() {
    this.loading = true;
    this.submittedRegeistered = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.user.register(this.fr.username.value, this.fr.email.value, this.fr.password.value).subscribe(() => { this.dialogRef.close() }, err => {
      this.snackbar.open(err.message, 'ok', {
        duration: 10000
      });
      this.loading = false;
    });
  }

  onSignGoogle() {
    this.loading = true;
    this.user.loginGoogle().then(() => this.dialogRef.close()).catch(err => {
      this.snackbar.open(err.message, 'ok', {
        duration: 10000
      });
      this.loading = false;
    });
  }
}
