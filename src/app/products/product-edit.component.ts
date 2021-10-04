import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NumberValidators } from '../shared/number.validator';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  productForm?: FormGroup;
  sub?: Subscription;
  errorMessage: string = '';
  product?: Product;
  pageTitle: string = 'Product Edit';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.sub = this.route.params.subscribe(params => {
      const id = +params.get('id');
      this.getProduct(id);
    });
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => this.displayProduct(product),
      error: err => this.errorMessage = err
    });
  }
  displayProduct(product: Product): void {
    if (this.productForm) {
      this.productForm.reset();
    }

    this.product = product;

    if (this.product.id === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
    }

    this.productForm?.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description
    });

    this.productForm?.setControl('tags', this.fb.array(this.product.tags || []));
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productCode: ['', [Validators.required]],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: ''
    });
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };

}
