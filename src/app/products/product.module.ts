import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './product-detail.component';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';
import { ProductDetailGuard } from './product-detail.guard';
import { SharedModule } from '../shared/shared.module';
import { ProductEditComponent } from './product-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductEditGuard } from './product-edit.guard';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './product-data';

@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductListComponent,
    ProductEditComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'products',
        component: ProductListComponent
      },
      {
        path: 'products/:id',
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent
      },
      {
        path: 'products/:id/edit',
        canDeactivate: [ProductEditGuard],
        component: ProductEditComponent
      }
    ]),
    InMemoryWebApiModule.forRoot(ProductData),
    SharedModule
  ]
})
export class ProductModule { }
