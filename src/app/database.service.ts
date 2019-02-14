import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { CountryCode } from './country-data';
import { UserService } from './user.service';
import { take, map, catchError, tap, switchMap } from "rxjs/operators";
import { Post } from './shared/post.model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  postsChanges: Observable<any[]>[] = [];
  postsCounter: Observable<number>;
  getCount: Observable<any>;

  getThreePosts(lastStamp): Observable<any> {
    if (lastStamp > 0) {
      return this.db.list('posts', ref => ref.orderByChild('/dateStamp').endAt(lastStamp).limitToLast(3)).snapshotChanges()
        .pipe(map(arr => {
          const newArr = [];
          for (let item of arr) {
            newArr.unshift(item);
          }
          return newArr
        }))
    } else {
      return this.db.list('posts', ref => ref.orderByChild('/dateStamp').limitToLast(3)).snapshotChanges()
        .pipe(map(arr => {
          const newArr = [];
          for (let item of arr) {
            newArr.unshift(item);
          }
          return newArr
        }))
    }
  }


  constructor(private db: AngularFireDatabase, private user: UserService) {
    this.postsCounter = db.object('/postsCount').valueChanges().pipe(map(res => +res["count"]));
    this.getCount = this.db.object('/postsCount/count').valueChanges();

  }

  updateGraph(postKey: string, countryCodeList: CountryCode[], headline: any, selectedStartYear: number, selectedEndYear: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const post = { edited: true, countryCodeList: countryCodeList, endYear: selectedEndYear, startYear: selectedStartYear, headline: headline };
      this.db.object('/posts/' + postKey + '/data').set(post).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  pushGraph(ctryCodeList, hl, startYear, endYear): Promise<any> {
    return new Promise((resolve, reject) => {
      let userID = '';
      this.user.uid.pipe(take(1), tap(uid => { userID = uid }), switchMap(_ => this.user.userName), take(1), map(userName => {
        const currentDate = (new Date());
        const tempDateStamp = (new Date).getTime();
        const tempDate = formatDate(currentDate, 'd/MM/yyyy HH:mm', 'en');
        const item: Post = { dateStamp: tempDateStamp, userID: userID, displayName: userName, postDate: tempDate, data: { edited: false, headline: hl, countryCodeList: ctryCodeList, startYear: startYear, endYear: endYear } }
        this.db.list('/posts/').push(item).then(res => resolve(res));
      }),
        switchMap(_ => this.db.object('/postsCount/count').valueChanges().pipe(take(1))), take(1),
        switchMap(res => this.db.object('/postsCount').update({ count: Number(res) + 1 })), take(1),
        catchError(err => { reject('error'); return of(err) })).subscribe(_ => { })
    })
  }


  getPost(key) {
    return this.db.object('posts/' + key + '/data').snapshotChanges().pipe(map(res => {
      return { headline: null, startYear: null, endYear: null, userID: null, countryCodeList: [], ...res.payload.val() }
    }))
  }


  removePost(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object('posts/' + key).remove().then(_ => {
        this.db.object('/postsCount/count').valueChanges().pipe(
          take(1),
          switchMap(res => this.db.object('/postsCount').update({ count: Number(res) - 1 }))
        ).subscribe(_ => resolve(null))
      }).catch(err => reject(err));
    })
  }
}

