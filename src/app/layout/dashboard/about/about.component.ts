import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
