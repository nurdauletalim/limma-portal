import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly PUBLIC_PRODUCT = '/v1/public/products';
  private readonly PRIVATE_PRODUCT = '/v1/private/products';

  constructor(private http: HttpClient) {
  }

  getAllActiveProductsList(params?: string): Observable<any> {
    params += '&state=0';
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/all/active?${params}`);
  }

  getProductDTOById(id): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/group/${id}`);
  }

  getProductById(id): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/${id}`);
  }

  getProductProperties(categoryId): Observable<any> {

    return this.http.get(`${this.PUBLIC_PRODUCT}/read/properties/${categoryId}`);
  }

  getProductMainPropertyValues(productId): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/property/values/main/${productId}`);
  }

  getProductNotMainPropertyValues(productId): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/property/values/notmain/${productId}`);
  }

  getFilteredProducts(map, categoryId: number, minPrice: number, maxPrice: number, params?: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post(`${this.PUBLIC_PRODUCT}/filter?categoryId=${categoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&${params}`, map);
  }

  changeProductState(id: number, state: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/state?id=${id}&state=${state}`);
  }

  getFirstFourProductsByIdForChilds(id: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/category?categoryId=${id}`);
  }

  getProductGroupByProperties(categoryId: number, params?: string): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/group/properties/category/${categoryId}?${params}`);
  }

  getProductDTOGroupByProperties(categoryId: number, params?: string): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/dto/group/properties/category/${categoryId}?${params}`);
  }

  getProductOrganizationById(id: number): Observable<any> {
    return this.http.get(`/v1/public/organizations/read/${id}`);
  }

  getLastProductsByPublishedDate(count: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT}/read/group/date?count=${count}`);
  }

}
