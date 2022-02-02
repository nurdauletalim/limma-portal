import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private readonly PUBLIC_PRODUCT_PROMOTION = '/v1/public/promotions';
  private readonly PRIVATE_PRODUCT_PROMOTION = '/v1/private/promotions';

  constructor(private http: HttpClient) {
  }

  getAllActive(): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_PROMOTION}/read/all/iterable`);
  }

  getAllActiveCount(count: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_PROMOTION}/count/active/iterable?count=${count}`);
  }

  getAllActiveDTO(count: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_PROMOTION}/dto/count/active/iterable?count=${count}`);
  }

  getPromotionById(id: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_PROMOTION}/read/${id}`);
  }



}
