import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../shared/generic-validator';
import { NumberValidators } from '../shared/number.validator';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  productForm!: FormGroup;
  sub?: Subscription;
  errorMessage: string = '';
  product!: Product;
  pageTitle: string = 'Product Edit';

  displayMessage: { [key: string]: string; } = {};

  private validationMessages: { [key: string]: { [key: string]: string; }; } = {
    productName: {
      required: 'Product name is required.',
      minlength: 'Product name must be at least three characters.',
      maxlength: 'Product name cannot exceed 50 characters.'
    },
    productCode: {
      required: 'Product code is required.'
    },
    starRating: {
      range: 'Rate the product between 1 (lowest) and 5 (highest).'
    }
  };

  private genericValidator!: GenericValidator;

  get tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.genericValidator = new GenericValidator(this.validationMessages);
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

    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description
    });

    this.productForm.setControl('tags', this.fb.array(this.product.tags || []));
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productCode: ['', [Validators.required]],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: ''
    });

    this.sub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.getProduct(id);
    });
  };

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.productForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.productForm);
    });
  }


  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }


  deleteProduct(): void {
    if (this.product.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Do you really want to delete ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(),
          error: (err) => this.errorMessage = err
        });
      }
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        const p = {
          ...this.product,
          ...this.productForm.value
        };

        if (p.id === 0) {
          this.productService.createProduct(p).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        } else {
          this.productService.updateProduct(p).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors';
    }
  }

  onSaveComplete() {
    this.productForm.reset();
    this.router.navigate(['/products']);
  }
}
