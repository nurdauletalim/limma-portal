import {Component, OnInit, Renderer2} from '@angular/core';
import {Promotion} from '../../core/models/promotion';
import {CategoryService} from '../../core/services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../core/services/product.service';
import {PromotionService} from '../../core/services/promotion.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[];
  constructor(
              private promotionService: PromotionService) {}
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.promotionService.getAllActive().subscribe(res => {
      console.log('res res', res);
      this.promotions = res.data;
    });
  }
}
