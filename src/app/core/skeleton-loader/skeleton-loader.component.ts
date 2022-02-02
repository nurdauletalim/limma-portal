import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() Cwidth;
  @Input() Cheight;

  constructor() { }

  ngOnInit(): void {
  }

  getMyStyles() {
    const myStyles = {
      'width.': this.Cwidth ? this.Cwidth : '',
      'height.': this.Cheight ? this.Cheight : ''
    };
    return myStyles;
  }

}
