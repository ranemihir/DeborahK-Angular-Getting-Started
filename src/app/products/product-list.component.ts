import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "./product";
import { ProductService } from "./product.service";


@Component({
    selector: 'pm-products',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    sub: Subscription | undefined;
    constructor(private productService: ProductService) { }

    products: Product[] = [];

    pageTitle: string = 'Product List';
    private _listFilter: string = '';

    get listFilter(): string {
        return this._listFilter;
    }

    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredProducts = this.performFilter();
    }

    performFilter(): Product[] {
        return this.products.filter((product: Product) => product.productName.toLowerCase().includes(this.listFilter.toLowerCase()));
    }

    imageWidth: number = 48;
    imageMargin: number = 2;
    showImage: boolean = false;
    filteredProducts: Product[] = [];

    ngOnInit() {
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: error => console.error('Error:', error),
        });

    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    onRatingClicked(message: string) {
        console.log(`From ProductList component: ${message}`);
    }

}