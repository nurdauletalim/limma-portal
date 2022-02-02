import {Product} from "../layout/core/models/product";

export class ProductApplication{
  id: number;
  contact: string;
  registered: string;
  taken: string;
  closed: string;
  name: string;
  email: string;
  productId: number;
  managerId: number;
  comment: string;
  status: string;
  product: Product;


  constructor(id: number, contact: string, registered: string, taken: string, closed: string, name: string, email: string, productId: number, managerId: number, comment: string, status: string) {
    this.id = id;
    this.contact = contact;
    this.registered = registered;
    this.taken = taken;
    this.closed = closed;
    this.name = name;
    this.email = email;
    this.productId = productId;
    this.managerId = managerId;
    this.comment = comment;
    this.status = status;
  }
}
