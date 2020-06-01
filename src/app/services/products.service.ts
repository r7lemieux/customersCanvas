import { Injectable } from '@angular/core';
import { Product } from '@aurigma/design-atoms/Model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: { [productId: number]: Product } = {};

  constructor() { }

  addProduct = (product: Product) => {
    const productId = this.generateProductId();
    this.products[productId] = product;
  };

  generateProductId = () => Date.now();
}
