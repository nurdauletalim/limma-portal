import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ServiseCommonConstants} from '../constants/servise-common-constants';
import {Category} from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryImageService {

  private readonly PUBLIC_CATEGORY_IMAGE = ServiseCommonConstants.PUBLIC_CATEGORY_IMAGE;
  private readonly PRIVATE_CATEGORY_IMAGE = ServiseCommonConstants.PRIVATE_CATEGORY_IMAGE;

  constructor(private http: HttpClient) {

  }

  getCategoryImagesByCategoryId(categoryId): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY_IMAGE}/readByCategoryId/${categoryId}`);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY_IMAGE}/read/all`);
  }

  getAllByParentId(parentId: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY_IMAGE}/read/all/parentId/${parentId}`);
  }
}
