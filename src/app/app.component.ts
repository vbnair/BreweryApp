import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Beer } from '../assets/models/beer.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'beer';

  @Input()
  key: string = '';
  limit: number = 10;
  recentKeys: string[] = [];
  url = `https://api.punkapi.com/v2/beers?per_page=${this.limit}&beer_name=`;
  suggestions: string[] = [];
  beers: Beer[] = [];
  searched: boolean = false;
  currentPage: number = 1;
  searchURL: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.loadSearchKey();
    this.searchURL = this.getURL();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params?.['search'] != undefined) {
        this.key = params['search'];
        this.search();
      }
    });
  }

  search() {
    if (this.key == '') {
      return;
    }
    this.searchURL = this.getURL();
    this.searched = true;
    this.saveSearchKey();
    this.loadSearchKey();
    this.http
      .get(`${this.url}${this.key}&page=${this.currentPage}`)
      .subscribe((data: any) => {
        this.beers = data;
      });
  }

  gotoSearch(key: string) {
    console.log(key);
    this.key = key;
    this.search();
  }

  handleKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.search();
    }
  }

  saveSearchKey() {
    this.loadSearchKey();
    if (!this.recentKeys.includes(this.key)) {
      this.recentKeys.push(this.key);
    }
    if (this.recentKeys.length > 5) {
      this.recentKeys.shift();
    }
    localStorage.setItem('search-keys', JSON.stringify(this.recentKeys));
  }

  loadSearchKey() {
    this.recentKeys = JSON.parse(localStorage.getItem('search-keys') || '[]');
  }

  isSuggestionActive(text: string) {
    return ['suggestion', text.startsWith(this.key) ? 'active' : 'hidden'];
  }

  previous() {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.search();
  }

  next() {
    if (this.beers.length < this.limit) {
      return;
    }
    this.currentPage++;
    this.search();
  }

  hasPrevious() {
    let cls = [];
    if (this.currentPage <= 1) {
      cls.push('inactive');
    }
    return cls;
  }

  hasNext() {
    let cls = [];
    if (this.beers.length < this.limit) {
      cls.push('inactive');
    }
    return cls;
  }

  getURL() {
    let url = window.location.href.split('?')[0];
    if (this.key != '') {
      url += `?search=${this.key}`;
    }
    return url;
  }

  copyURL() {
    navigator.clipboard
      .writeText(this.searchURL)
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  }
}
