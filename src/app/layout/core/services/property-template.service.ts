import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ServiseCommonConstants} from '../constants/servise-common-constants';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyTemplateService {
  private readonly PUBLIC_PROPERTY_TEMPLATE = '/v1/public/property/templates';
  private readonly PRIVATE_PROPERTY_TEMPLATE = ServiseCommonConstants.PRIVATE_PROPERTY_TEMPLATE;

  constructor(private http: HttpClient) { }

  getPropertyTemplateByCategoryId(id: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PROPERTY_TEMPLATE}/read/category/${id}`);
  }

  getPropertiesByTemplateId(id: number): Observable<any> {
    console.log(id);
    return this.http.get(`/v1/public/properties/read/all/template/${id}`);
  }

}
