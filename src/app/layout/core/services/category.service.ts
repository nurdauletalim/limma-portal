import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ServiseCommonConstants} from '../constants/servise-common-constants';
import {Category} from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly PUBLIC_CATEGORY = ServiseCommonConstants.PUBLIC_CATEGORY;
  private readonly PRIVATE_CATEGORY = ServiseCommonConstants.PRIVATE_CATEGORY;

  constructor(private http: HttpClient) {

  }

  getAllCategoriesIterable(): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY}/read/all/iterable`);
  }

  getAllActiveCategories(): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY}/read/all/active`);
  }

  getCategoryById(id): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY}/read/${id}`);
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post(`${this.PRIVATE_CATEGORY}/create`, category);
  }

  updateCategory(category: Category): Observable<any> {
    return this.http.post(`${this.PUBLIC_CATEGORY}/update`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.PUBLIC_CATEGORY}/delete/${id}`);
  }



  getAllParentCategoriesByParentId(id: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_CATEGORY}/read/parents/category/${id}`);
  }

}
