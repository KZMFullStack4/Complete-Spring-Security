import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import { NiopdcBankAccount } from './niopdc-bank-account.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<NiopdcBankAccount>;

@Injectable({ providedIn: 'root' })
export class NiopdcBankAccountService {

    private resourceUrl = 'niopdcpayment/api/niopdc-bank-accounts';

    constructor(private http: HttpClient) { }

    create(niopdcBankAccount: NiopdcBankAccount): Observable<EntityResponseType> {
            const copy = this.convert(niopdcBankAccount);
        return this.http.post<NiopdcBankAccount>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(niopdcBankAccount: NiopdcBankAccount): Observable<EntityResponseType> {
        const copy = this.convert(niopdcBankAccount);
        return this.http.put<NiopdcBankAccount>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<NiopdcBankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response'})
        .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<NiopdcBankAccount[]>> {
        const options = createRequestOption(req);
        return this.http.get<NiopdcBankAccount[]>(this. resourceUrl ,  { params: options, observe: 'response' })
            .map((res: HttpResponse<NiopdcBankAccount[]>) => this.convertArrayResponse(res));
    }

    findAll(): Observable<HttpResponse<NiopdcBankAccount[]>> {
        return this.http.get<NiopdcBankAccount[]>(this. resourceUrl + '/find-all' ,  { observe: 'response' })
            .map((res: HttpResponse<NiopdcBankAccount[]>) => this.convertArrayResponse(res));
    }

    findAllByLocationId(locationId: number): Observable<HttpResponse<NiopdcBankAccount[]>> {
        return this.http.get<NiopdcBankAccount[]>(this. resourceUrl + `/location/${locationId}` ,  { observe: 'response' })
            .map((res: HttpResponse<NiopdcBankAccount[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: NiopdcBankAccount = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<NiopdcBankAccount[]>): HttpResponse<NiopdcBankAccount[]> {
        const jsonResponse: NiopdcBankAccount[] = res.body;
        const body: NiopdcBankAccount[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to NiopdcBankAccount.
     */
    private convertItemFromServer(niopdcBankAccount: NiopdcBankAccount): NiopdcBankAccount {
        const copy: NiopdcBankAccount = Object.assign(new NiopdcBankAccount(), niopdcBankAccount);
        return copy;
    }

    /**
     * Convert a NiopdcBankAccount to a JSON which can be sent to the server.
     */
    private convert(niopdcBankAccount: NiopdcBankAccount): NiopdcBankAccount {
        const copy: NiopdcBankAccount = Object.assign({}, niopdcBankAccount);

        return copy;
    }
}
