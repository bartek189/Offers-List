import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {KinguinOffer, OfferResponse} from '../models/offer.model';

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private apiUrl = 'https://gateway.kinguin.net/offer/api/v2/offers/findActiveOffers';

    private http = inject(HttpClient);

    getOffers(id: string): Observable<KinguinOffer[]> {
        const fullUrl = `${this.apiUrl}/${id}`;

        return this.http.get<OfferResponse>(fullUrl).pipe(
            map(response => {
                if (response._embedded && response._embedded.kinguinOffer) {
                    return response._embedded.kinguinOffer;
                }
                return [];
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('API request failed:', error);
                throw error;
            })
        );
    }
}

