import {Product} from '../layout/core/models/product';
import {Model} from '../layout/core/models/model';
import {Property} from '../layout/core/models/Property';

export class ProductDTO {
  id: number;
  categoryId: number;
  condition: string;
  description: string;
  name: string;
  organizationId: number;
  price: number;
  state: number;
  images: any[];
  products: Product[];
  model: Model;
  properties: Property[];
  keys: any[];


  constructor(currentProduct?: ProductDTO) {
    if (currentProduct) {
      this.id = currentProduct.id;
      this.categoryId = currentProduct.categoryId;
      this.condition = currentProduct.condition;
      this.description = currentProduct.description;
      this.name = currentProduct.name;
      this.organizationId = currentProduct.organizationId;
      this.price = currentProduct.price;
      this.state = currentProduct.state;
      this.images = currentProduct.images;
      this.products = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < currentProduct.products.length; i++) {
        this.products.push(new Product(currentProduct.products[i]));
        this.products[i].properties = currentProduct.products[i].properties;
      }
      this.model = currentProduct.model;
    }
  }
}
