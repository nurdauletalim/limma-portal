export class Category {
  public id: number;
  public name: string;
  public parentCategoryId: number;
  public children: any[];
  public images: any[];

  constructor() {
  }
}
