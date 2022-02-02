export class SmartphoneUsed{
  price: string;
  equipment: string[];
  isWarranty: boolean;


  constructor(price: number, equipment: string[], isWarranty: boolean) {
    this.price = price + 'грн';
    this.equipment = equipment;
    this.isWarranty = isWarranty;
  }
}
