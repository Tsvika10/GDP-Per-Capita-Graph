import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { UserService } from '../user.service';
import { CountriesDataService } from '../countries-data-service/countries-data.service';
import { CountryGdpDataList } from '../country-data';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  notUpdating: boolean = true;
  postSelected: boolean = false;
  postLoaded: boolean = false;
  countryGdpDataList: CountryGdpDataList;
  currentPost: any = { key: null };
  postsChanges: Observable<any[]>[];
  postSubscribers: Subscription[] = [];
  postsGroup: any[] = [];
  lastPostTimeStamp: number = 0;
  postsLoaded: boolean = false;
  routeSubscriber: Subscription;



  constructor(public database: DatabaseService, public user: UserService, private countriesDataService: CountriesDataService) { }

  ngOnInit() {
    this.initFirstPosts();
  }

  initFirstPosts() {
    for (const subscriber of this.postSubscribers) {
      subscriber.unsubscribe()
    }
    this.postSubscribers = [];
    this.postsChanges = [];
    this.postSubscribers.push(this.database.getThreePosts(0).subscribe(res => {
      this.postsLoaded = true; this.postsGroup = []; for (let item of res) { this.postsGroup.push(item) };
    }))
  }

  onLoadPost(event) {
    if ((this.postLoaded || !this.postSelected) && event.key !== this.currentPost.key) {
      this.postLoaded = false;
      setTimeout(() => {
        this.currentPost = event;
        const data = event.payload.val().data;
        this.postSelected = true;
        this.countriesDataService.onFetchGdpData(data.countryCodeList, data.startYear, data.endYear).then(res => {
          this.countryGdpDataList = { list: res, startYear: data.startYear, endYear: data.endYear };
          this.postLoaded = true;
        })
      }, 100);
    }
  }

  onLoadMore() {
    this.lastPostTimeStamp = this.postsGroup[this.postsGroup.length - 1].payload.val().dateStamp;
    this.database.getThreePosts(this.lastPostTimeStamp).subscribe(res => {
      res.shift();
      for (let item of res) { this.postsGroup.push(item) }
    });
  }


  onDelete() {
    this.postsGroup = [];
    this.notUpdating = false;
    this.database.removePost(this.currentPost.key).then(() => {
      this.initFirstPosts();
      this.notUpdating = true;
      this.postSelected = false;

    }).catch(err => {
      console.log(err)
    });
  }

}
