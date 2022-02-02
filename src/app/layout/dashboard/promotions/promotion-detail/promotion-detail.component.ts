import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PromotionService} from '../../../core/services/promotion.service';
import {Promotion} from '../../../core/models/promotion';


@Component({
  selector: 'app-dashboard',
  templateUrl: './promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss']
})

export class PromotionDetailComponent implements OnInit {
  promotion: Promotion;
  private id: number;
  constructor(private activateRoute: ActivatedRoute,
              private promotionService: PromotionService) {
    // tslint:disable-next-line:radix
    this.id = parseInt(activateRoute.snapshot.params.id);
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.promotionService.getPromotionById(this.id).subscribe(res => {
      console.log('res res', res);
      this.promotion = res.data;
      console.log('this.promotion', this.promotion);
    });
  }
}
