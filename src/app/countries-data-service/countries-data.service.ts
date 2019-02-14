import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CountryGdpData, CountryCode } from '../country-data';



@Injectable({
  providedIn: 'root'
})
export class CountriesDataService implements OnInit {


  constructor(private http: HttpClient) { }

  ngOnInit() {
  }


  onFetchGdpData(countriesCodesList: Array<CountryCode>, startYear: number, endYear: number): Promise<any> {
    return new Promise<any>(
      (res, rej) => {
        let list = [];
        (async function f() {
          for (let country of countriesCodesList) {
            list.push(
              await this.http.get(`https://api.worldbank.org/v2/countries/${country.code}/indicators/NY.GDP.PCAP.CD?date=${startYear}:${endYear}&format=json`).pipe(
                map(value => {
                  if (value[1]) {
                    let newList = [];
                    for (let obj of value[1]) {
                      if (obj['value'] != null) {
                        newList.unshift(obj['value'])
                      } else {
                        newList.unshift('NaN')

                      }
                    }
                    if (newList.length > 0) {
                      let countryGdpData: CountryGdpData = { label: country.label, code: country.code, data: newList };
                      return countryGdpData;
                    } else {
                      throw ('(onFetchGdpData) No data was found on ' + country.label)
                    }

                  } else {
                    throw ('(onFetchGdpData) caught error message on ' + country.label)
                  }
                })
              ).toPromise()
            )
          }
        }).bind(this)().then(_ => { res(list) })
          .catch(e => {
            rej('Caught error on onFetchGdpData() on countriesDataService ' + e)
          });
      }
    )
  }


}
