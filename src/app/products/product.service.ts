import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Product } from "./product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productUrl = 'api/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productUrl);
    }

    getProduct(id: number): Observable<Product> {
        if (id === 0) {
            return of(this.initializeProduct());
        }

        const url = `${this.productUrl}/${id}`;

        return this.http.get<Product>(url).pipe(
            tap(data => console.log('getProduct: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage = '';

        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);

        return throwError(errorMessage);
    }

    private initializeProduct(): Product {
        return {
            id: 0,
            productName: '',
            productCode: '',
            tags: [''],
            releaseDate: '',
            price: 0,
            description: '',
            starRating: 1,
            imageUrl: ''
        };
    }

}
