import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    private readonly PUBLIC_ACCOUNT = '/v1/public/accounts';
    private readonly PRIVATE_ACCOUNT = '/v1/private/accounts';

    constructor(private http: HttpClient) {
    }

    getAllAccounts(): Observable<any> {
        return this.http.get(`${this.PUBLIC_ACCOUNT}/read/all/iterable`);
    }

    getAccountById(id): Observable<any> {
        return this.http.get(`${this.PUBLIC_ACCOUNT}/read/${id}`);
    }

    getAccountByUsername(username: string): Observable<any> {
        return this.http.get(`${this.PUBLIC_ACCOUNT}/read?username=${username}`);
    }

    getAllAccountsByOrganizationId(organizationId: number): Observable<any> {
        return this.http.get(`${this.PUBLIC_ACCOUNT}/read/organization/${organizationId}`);
    }

    createAccount(account: Account): Observable<any> {
        return this.http.post(`${this.PRIVATE_ACCOUNT}/create`, account);
    }

    updateAccount(account: Account): Observable<any> {
        return this.http.post(`${this.PUBLIC_ACCOUNT}/update`, account);
    }

    deleteAccount(id: number): Observable<any> {
        return this.http.delete(`${this.PUBLIC_ACCOUNT}/delete/${id}`);
    }
}
