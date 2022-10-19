import { Component, OnInit, Input } from '@angular/core';
import { Beer } from '../../../assets/models/beer.model'

@Component({
  selector: 'beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.css']
})
export class BeerComponent implements OnInit {

  constructor() { }

  @Input()
  data: Beer | null = null

  ngOnInit(): void {
  }

}
