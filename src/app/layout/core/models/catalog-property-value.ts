export class CatalogPropertyValue {
  id: number;
  name: string;
  categoryId: number;

  constructor(id: number, name: string, categoryId: number) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
  }
}
