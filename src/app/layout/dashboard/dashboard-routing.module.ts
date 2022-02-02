import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardDetailComponent} from './dashboard-detail/dashboard-detail.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {AgreementComponent} from './agreement/agreement.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {AboutComponent} from './about/about.component';
import {PartnersComponent} from './partners/partners.component';
import {ContactsComponent} from './contacts/contacts.component';
import {PromotionsComponent} from './promotions/promotions.component';
import {PromotionDetailComponent} from './promotions/promotion-detail/promotion-detail.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: ':parentSubCategoryId',
    component: DashboardComponent
  },
  {
    path: 'dashboard/:childSubCategoryId',
    component: DashboardComponent
  },
  {
    path: 'dashboard/detail/:id',
    component: DashboardDetailComponent
  },
  {
    path: 'product/detail',
    component: ProductDetailComponent
  },
  {
    path: 'dashboard/product/detail/:id',
    component: ProductDetailComponent
  },
  {
    path: 'a/agreement',
    component: AgreementComponent
  },
  {
    path: 'd/delivery',
    component: DeliveryComponent
  },
  {
    path: 'a/about',
    component: AboutComponent
  },
  {
    path: 'p/partners',
    component: PartnersComponent
  },
  {
    path: 'c/contacts',
    component: ContactsComponent
  },
  {
    path: 'p/promotions',
    component: PromotionsComponent
  },
  {
    path: 'p/promotions/detail/:id',
    component: PromotionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
