import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CountryPickListService } from './country-pick-list.service';
import { FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { startWith, switchMap, map, tap } from 'rxjs/operators';

export interface Country {
  name: string,
  code: string
}


@Component({
  selector: 'app-country-pick',
  templateUrl: './country-pick.component.html',
  styleUrls: ['./country-pick.component.scss']
})

export class CountryPickComponent implements OnInit {

  @Input() placeholder: string = new Input();
  @Output() countrySelected: EventEmitter<any> = new EventEmitter;

  countryCtrl = new FormControl();
  inputNotEmpty: boolean = false;
  countryInput: string;
  countriesFound = []
  filteredCountries: Observable<Country[]>
  selectedCountry = { id: '' };
  countryNotSelected = true;

  constructor(private countryPickListService: CountryPickListService) { }

  ngOnInit() {
    this.filteredCountries = this.countryCtrl.valueChanges.pipe(
      startWith(' '),
      tap(v => this.inputNotEmpty = v.trim() ? true : false),
      map(value => value.trim()),
      switchMap(value => from(this.countryPickListService.onLoadList(value)))
    );

  }

  onClearInput() {
    if (this.inputNotEmpty) {
      this.countryCtrl.setValue(' ');
      this.countryCtrl.setValue('');
    }
  }

  onDeleteInput() {
    this.onClearInput();
    this.countrySelected.emit(false);
  }

  onSelect(countryCode, countryName, e) {
    if (e.source.selected) {
      this.countrySelected.emit({ code: countryCode, name: countryName })
    }
  }
}
