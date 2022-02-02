export class Smartphone{
  ram: string;
  storage: string;
  cam: string;


  constructor(ram: number, storage: number, cam: number) {
    this.ram = ram + 'GB';
    this.storage = storage + 'GB';
    this.cam = cam + 'Мп';
  }
}
