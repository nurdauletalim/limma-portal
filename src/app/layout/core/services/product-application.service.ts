import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductApplication} from '../models/ProductApplication';

@Injectable({
  providedIn: 'root'
})
export class ProductApplicationService {
  private readonly PUBLIC_APPLICATION = '/v1/public/applications';
  private readonly PRIVATE_APPLICATION = '/v1/private/applications';

  constructor(private http: HttpClient) {
  }

  getAllApplications(): Observable<any> {
    return this.http.get(`${this.PUBLIC_APPLICATION}/read/all/iterable`);
  }

  getAllActiveApplications(): Observable<any> {
    return this.http.get(`${this.PUBLIC_APPLICATION}/read/all/active`);
  }

  getApplicationById(id): Observable<any> {
    return this.http.get(`${this.PUBLIC_APPLICATION}/read/${id}`);
  }

  createApplication(application: ProductApplication): Observable<any> {
    return this.http.post(`${this.PUBLIC_APPLICATION}/create`, application);
  }

  updateApplication(application: ProductApplication): Observable<any> {
    return this.http.post(`${this.PUBLIC_APPLICATION}/update`, application);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete(`${this.PUBLIC_APPLICATION}/delete/${id}`);
  }

  getApplicationsByPhoneNumber(contact: string): Observable<any> {
    return this.http.get(`${this.PUBLIC_APPLICATION}/read/all/${contact}`);
  }

  checkApplication(name: string, contact: string, productId: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_APPLICATION}/check?name=${name}&contact=${contact}&productId=${productId}`);
  }
}
