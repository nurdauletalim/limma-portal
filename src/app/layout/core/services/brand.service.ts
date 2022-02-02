import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private readonly PUBLIC_BRAND = '/v1/public/brands';
  private readonly PRIVATE_BRAND = '/v1/private/brands';

  constructor(private http: HttpClient) {
  }

  // getModelsByBrandDisplayNames(displayNames: string): Observable<any> {
  // tslint:disable-next-line:max-line-length
  //   return this.http.get(`${this.PUBLIC_PRODUCT_MODEL}/get_models_by_property_catalog_value_brand_display_names?property_catalog_value_brand_display_names=${displayNames}`);
  // }

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.PUBLIC_BRAND}/read/iterable`);
  }

  getAllBrandsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_BRAND}/read/category/${categoryId}`);
  }

}
