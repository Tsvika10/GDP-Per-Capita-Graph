import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, switchMap, first, filter } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userName: Observable<any> = this.afAuth.user.pipe(
    filter(user => !!user),
    switchMap(user => {
      if (user.displayName) {
        return of(user.displayName)
      } else {
        return this.db.object('/users/' + user.uid + '/username').valueChanges().pipe(first())
      }
    })
  );


  // uid = of('123');
  uid = this.afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return null
      } else {
        return authState.uid
      }
    })
  );
  isAdmin: Observable<boolean> = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        return of(false);
      } else {
        return this.db.object<boolean>('/admin/' + uid).valueChanges();
      }
    })
  );
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
  }

  register(username: string, email: string, password: string): Observable<any> {
    return from(this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password)).pipe(
      switchMap(user => this.db.list('users').set(user.user.uid, { username: username })))
  }

  login(email, password) {
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password)
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
