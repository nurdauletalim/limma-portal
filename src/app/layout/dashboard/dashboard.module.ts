import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardDetailComponent} from './dashboard-detail/dashboard-detail.component';
import {RouterModule} from '@angular/router';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from '../core/services/category.service';
import {Ng5SliderModule} from 'ng5-slider';
import {SkeletonLoaderModule} from '../../core/skeleton-loader/skeleton-loader.module';
import {AgreementComponent} from './agreement/agreement.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {AboutComponent} from './about/about.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {PartnersComponent} from './partners/partners.component';
import {ContactsComponent} from './contacts/contacts.component';
import {PromotionsComponent} from './promotions/promotions.component';
import {PromotionDetailComponent} from './promotions/promotion-detail/promotion-detail.component';

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [DashboardComponent, DashboardDetailComponent, ProductDetailComponent, AgreementComponent, DeliveryComponent, AboutComponent, PartnersComponent, ContactsComponent, PromotionsComponent, PromotionDetailComponent],
    imports: [
      CommonModule,
      DashboardRoutingModule,
      FormsModule,
      Ng5SliderModule,
      SkeletonLoaderModule,
      ReactiveFormsModule,
      IvyCarouselModule
    ],
  providers: [CategoryService]
})
export class DashboardModule {
}
