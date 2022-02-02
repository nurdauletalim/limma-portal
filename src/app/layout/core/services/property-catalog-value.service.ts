import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CatalogPropertyValue} from '../models/catalog-property-value';
import {ServiseCommonConstants} from '../constants/servise-common-constants';

@Injectable({
  providedIn: 'root'
})
export class PropertyCatalogValueService {

  private readonly PUBLIC_PROPERTY_CATALOG_VALUE = ServiseCommonConstants.PUBLIC_PROPERTY_CATALOG_VALUE;
  private readonly PRIVATE_PROPERTY_CATALOG_VALUE = ServiseCommonConstants.PRIVATE_PROPERTY_CATALOG_VALUE;

  constructor(private http: HttpClient) {
  }

  getAllPropertyCatalogs(): Observable<any> {
    return this.http.get(`${this.PUBLIC_PROPERTY_CATALOG_VALUE}/read/all/iterable`);
  }

  getPropertyCatalogById(id): Observable<any> {
    return this.http.get(`${this.PUBLIC_PROPERTY_CATALOG_VALUE}/read/${id}`);
  }

  getExactPropertyCatalogsById(id: number, categoryId: number): Observable<any> {
    return this.http.get(`${this.PUBLIC_PROPERTY_CATALOG_VALUE}/read/${id}/iterable?categoryId=${categoryId}`);
  }

  createPropertyCatalog(catalogPropertyValue: CatalogPropertyValue): Observable<any> {
    return this.http.post(`${this.PRIVATE_PROPERTY_CATALOG_VALUE}/create`, catalogPropertyValue);
  }

  updatePropertyCatalog(catalogPropertyValue: CatalogPropertyValue): Observable<any> {
    return this.http.post(`${this.PUBLIC_PROPERTY_CATALOG_VALUE}/update`, catalogPropertyValue);
  }

  deletePropertyCatalog(id: number): Observable<any> {
    return this.http.delete(`${this.PUBLIC_PROPERTY_CATALOG_VALUE}/delete/${id}`);
  }

}
