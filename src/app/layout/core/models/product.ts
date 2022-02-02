import {Model} from './model';
import {Property} from './Property';

export class Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  publishedDate: Date;
  condition: string;
  organizationId: number;
  state: number;
  images: any[];
  model: Model;
  capacity: string;
  properties: Property[];
  keys: any[];

  constructor(product?: Product) {
    if (product) {
      this.id = product.id;
      this.categoryId = product.categoryId;
      this.condition = product.condition;
      this.description = product.description;
      this.name = product.name;
      this.organizationId = product.organizationId;
      this.price = product.price;
      this.state = product.state;
      this.images = product.images;
      this.model = product.model;
      this.capacity = product.capacity;
      this.publishedDate = product.publishedDate;
      this.properties = product.properties;
      this.keys = product.keys;
    }
  }
}
