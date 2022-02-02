import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private readonly PUBLIC_PRODUCT_MODEL = '/v1/public/models';
  private readonly PRIVATE_PRODUCT_MODEL = '/v1/private/models';

  constructor(private http: HttpClient) {
  }

  getAllModelsByBrandDisplayName(brandDisplayName: string): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_MODEL}/read/brand?brandDisplayName=${brandDisplayName}`);
  }

  getAllModelsByBrandDisplayNameAndCategoryId(brandDisplayName: string, categoryId: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_MODEL}/read/brand?brandDisplayName=${brandDisplayName}&categoryId=${categoryId}`);
  }

  getAllModelsByBrand(id: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_MODEL}/read/brand/${id}`);
  }

  getAllModels(): Observable<any> {
    return this.http.get(`${this.PUBLIC_PRODUCT_MODEL}/read/all/iterable`);
  }

}
