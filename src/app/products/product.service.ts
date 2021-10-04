import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Product } from "./product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsUrl = 'api/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productsUrl);
    }

    getProduct(id: number): Observable<Product> {
        if (id === 0) {
            return of(this.initializeProduct());
        }

        const url = `${this.productsUrl}/${id}`;

        return this.http.get<Product>(url).pipe(
            tap(data => console.log('getProduct: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    createProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        product.id = null;

        return this.http.post<Product>(this.productsUrl, product, { headers }).pipe(
            tap(() => console.log('createProduct: ' + JSON.stringify(product))),
            catchError(this.handleError)
        );
    }

    updateProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.productsUrl}/${product.id}`;

        return this.http.put<Product>(url, product, { headers }).pipe(
            tap(() => console.log('updateProduct: ' + product.id)),
            map(() => product),
            catchError(this.handleError)
        );
    }

    deleteProduct(id: number): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.productsUrl}/${id}`;

        return this.http.delete<Product>(url, { headers });
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
            productName: null,
            productCode: null,
            tags: [''],
            releaseDate: null,
            price: null,
            description: null,
            starRating: null,
            imageUrl: null
        };
    }

}
