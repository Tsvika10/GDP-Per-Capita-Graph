import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CountriesDataService } from '../countries-data-service/countries-data.service';
import { CountryGdpDataList, CountryCode } from '../country-data';
import { Subscription } from 'rxjs';
import { CountryPickComponent } from '../country-pick/country-pick.component';
import { DatabaseService } from '../database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { post } from 'selenium-webdriver/http';
import { map, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-gdp-graph',
  templateUrl: './gdp-graph.component.html',
  styleUrls: ['./gdp-graph.component.scss']
})
export class GdpGraphComponent implements OnInit, OnDestroy {

  @ViewChild(CountryPickComponent) private pickComponent: CountryPickComponent;
  @ViewChild('startYear') startYearComponent: ElementRef;
  @ViewChild('endYear') endYearComponent: ElementRef;

  countriesCodesList = [];
  editMode = false;
  selectedCountryCode = '';
  selectedCountryName = '';
  headline = '';
  error = false;
  startYear = 1968;
  endYear = 2017;
  selectedStartYear = 1968;
  selectedEndYear = 2017;
  startYearsRange = [];
  endYearsRange = [];
  countryList: CountryCode[] = [];
  countryGdpDataList: CountryGdpDataList = { startYear: this.startYear, endYear: this.endYear, list: [] };
  isCountrySelected: boolean = false;
  duringUpdate: boolean = true;
  postKey: string;
  savingMode: boolean = false;
  navigateSubscriber: Subscription;
  routeSubscriber: Subscription;

  constructor(private countriesDataService: CountriesDataService, public db: DatabaseService, private route: ActivatedRoute, private user: UserService, private router: Router) { }

  ngOnInit() {
    this.navigateSubscriber = this.user.uid.subscribe(res => { if (!res) { this.router.navigate(['posts']) } })

    for (let i = 1968; i <= 2016; i++) {
      this.startYearsRange.push(i);
    }
    for (let i = 1969; i <= 2017; i++) {
      this.endYearsRange.push(i);
    }

    this.routeSubscriber = this.route.url.pipe(map(v => v[1].path)).subscribe(v => {
      if (v === 'edit') {
        this.editMode = true;
        this.getPost();
      } else {
        this.duringUpdate = false;
      }
    }
    );

  }
  getPost() {
    this.postKey = this.route.snapshot.paramMap.get('id');

    setTimeout(() => {
      this.db.getPost(this.postKey).pipe(take(1)).subscribe(res => {
        this.headline = res.headline;
        this.selectedStartYear = res.startYear;
        this.selectedEndYear = res.endYear;
        this.countryList = res.countryCodeList;
        this.onUpdateGdp()
      });

    }, 100);
  }

  countrySelected(e) {
    if (e) {
      this.selectedCountryCode = e.code;
      this.selectedCountryName = e.name;
      let tempCheck: boolean = true;
      if (!e.code.trim()) {
        tempCheck = false
      } else if (this.countryList.find(v => v.code === e.code)) {
        tempCheck = false;
      }
      this.isCountrySelected = tempCheck;
    }
    else {
      this.isCountrySelected = false;
      this.selectedCountryCode = '';
      this.selectedCountryName = '';
    }

  }

  onUpdateGdp() {
    this.onReadyData();
    setTimeout(() => {
      this.countriesDataService.onFetchGdpData(this.countryList, this.selectedStartYear, this.selectedEndYear).then(
        (v) => {
          this.onUpdateGraph(v)
        }
      ).catch(error => {
        this.countryList.pop();
        this.duringUpdate = false;
        this.error = true;
      })
    }, 100)

  }

  onUpdateYear() {
    this.startYearsRange = [];
    this.endYearsRange = [];

    for (let i = 1968; i <= this.selectedEndYear - 1; i++) {
      this.startYearsRange.push(i);
    }
    for (let i = this.selectedStartYear + 1; i <= (new Date).getFullYear() - 1; i++) {
      this.endYearsRange.push(i);
    }

    if (this.countryList.length > 0) {
      this.onUpdateGdp();
    }
  }

  onUpdateGraph(value) {
    this.countryGdpDataList.startYear = this.selectedStartYear;
    this.countryGdpDataList.endYear = this.selectedEndYear;
    this.countryGdpDataList.list = value;
    this.duringUpdate = false;
  }

  onReadyData() {
    this.error = false
    this.duringUpdate = true;
    this.isCountrySelected = false;
  }

  onSaveGraph(headline) {
    this.savingMode = true;
    this.duringUpdate = true;
    if (!this.editMode) {
      this.db.pushGraph(this.countryList, headline, this.selectedStartYear, this.selectedEndYear).then(res => {
        // this.savingMode = false;
        this.router.navigate(['posts'])
      })
    } else {
      this.db.updateGraph(this.postKey, this.countryList, headline, this.selectedStartYear, this.selectedEndYear).then(res => {
        // this.savingMode = false;
        this.router.navigate(['posts'])
      })
    }
  }

  onAddCountry() {
    this.pickComponent.onClearInput();
    this.countryList.push({ code: this.selectedCountryCode, label: this.selectedCountryName });
    this.onUpdateGdp();
  }

  onRemoveCountry(country) {
    this.duringUpdate = true;
    this.countryGdpDataList.list.splice(this.countryGdpDataList.list.indexOf(this.countryGdpDataList.list.find(v => v.label === country.label)), 1);
    this.countriesCodesList.splice(this.countriesCodesList.indexOf(country.code), 1);
    this.countryList.splice(this.countryList.indexOf(country.code), 1);
    if (country.code == this.selectedCountryCode) {
      this.isCountrySelected = true;
    }
    setTimeout(() => {
      this.duringUpdate = false
    }, 200);
  }

  ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
    this.navigateSubscriber.unsubscribe();
  }
}
