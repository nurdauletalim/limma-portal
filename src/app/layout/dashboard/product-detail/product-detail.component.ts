import {Component, OnInit} from '@angular/core';
import {SmartphoneUsed} from '../../../model/SmartphoneUsed';
import {LabelType, Options} from 'ng5-slider';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../core/services/product.service';
import {Product} from '../../core/models/product';
import {Property} from '../../core/models/Property';
import {PropertyCatalogValueService} from '../../core/services/property-catalog-value.service';
import {CategoryService} from '../../core/services/category.service';
import {Category} from '../../core/models/Category';
import {ProductApplication} from '../../core/models/ProductApplication';
import {ProductApplicationService} from '../../core/services/product-application.service';
import {ProductDTO} from '../../../model/productDTO';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {max} from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  value = 0;
  highValue = 1000000;
  raM = true;
  came = true;
  mem = true;
  productApplication = new ProductApplication();
  productApplicationForDelete = new ProductApplication();
  correctApplicationForDelete: boolean;
  equipmentCheck = true;
  smartphones = [
    new SmartphoneUsed(2920, ['Зарядное устройство', 'Документы'], false),
    new SmartphoneUsed(1999, ['Зарядное устройство', 'Коробка', 'Чехол/Сумка'], true),
    new SmartphoneUsed(3000, ['Чехол/Сумка'], true),
    new SmartphoneUsed(5000, ['Коробка', 'Документы'], false)
  ];
  // filteredSmartphones = [];
  // equipmentFilter = [];
  // camFilter = [];
  filterProperties = [];
  isValidFilter = false;

  options: Options = {
    floor: 0,
    ceil: 1000000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '₸';
        case LabelType.High:
          return value + '₸';
        default:
          return value + '₸';
      }
    }
  };

  equipmentList = [
    {name: 'Зарядное устройство'},
    {name: 'Документы'},
    {name: 'Коробка'},
    {name: 'Чехол/сумка'},
    {name: 'Без комплектации'}
  ];

  conditionList = [
    {name: 'по состоянию'},
    {name: 'сначала дешёвые'},
    {name: 'сначала дорогие'},
    // {name: 'по популярности'},
    // {name: 'акционные'},
  ];
  // Рахматулла's part

  id: number;
  modelId: number;
  currentProduct: ProductDTO;
  currentProductFiltered: ProductDTO;
  properties: Property[];
  propertiesToDisplay = {};
  propertyCatalogs = {};
  propertyValuesMap = {};
  parentCategory;
  similarProducts: any[] = [];
  tree = [];
  productToApply: Product;
  productOrganization: any;
  productOrganizationMap: Map<number, string> = new Map<number, string>();
  page = 0;
  pageSize = 16;

  applicationForm = new FormGroup({
    clientName: new FormControl('', [Validators.required,
      Validators.pattern('^(?![\\s.]+$)[a-zA-Z\\s.]*(?![\\s.]+$)[а-яА-Я\\s.]*')]),
    clientContact: new FormControl('', [Validators.required,
      Validators.pattern('([+][7])[ ]{1}[7]{1}[0-9]{2}[ ]{1}[0-9]{3}[ ]{1}[0-9]{2}[ ]{1}[0-9]{2}')]),
    clientEmail: new FormControl('', [Validators.email])
  });
  private productTemp: Product;

  formSubmitted = false;
  conditionNew: boolean;
  conditionGood: boolean;
  conditionUsed: boolean;
  private products: Product[];

  get name() {
    return this.applicationForm.get('clientName');
  }

  get contact() {
    const phonenumber = this.applicationForm.get('clientContact').value;
    if (phonenumber.length < 4) {
      this.applicationForm.get('clientContact').setValue('+7 7');
    }
    // tslint:disable-next-line:max-line-length
    else if (phonenumber.substr(phonenumber.length - 1) !== ' ' && (phonenumber.length === 7 || phonenumber.length === 11 || phonenumber.length === 14)) {
      const num = phonenumber.substring(0, phonenumber.length - 1) + ' ' + phonenumber.substring(phonenumber.length - 1);
      this.applicationForm.get('clientContact').setValue(num);
    }
    return this.applicationForm.get('clientContact');
  }

  get email() {
    return this.applicationForm.get('clientEmail');
  }

  showPriceWithSpace(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  constructor(private activateRoute: ActivatedRoute,
              private productService: ProductService,
              private productApplicationService: ProductApplicationService,
              private propertyCatalogValueService: PropertyCatalogValueService,
              private categoryService: CategoryService,
              private router: Router) {
    // tslint:disable-next-line:radix
    this.id = parseInt(activateRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getProductById(this.id);
    this.correctApplicationForDelete = true;
    this.applicationForm.get('clientContact').setValue('+7 7');
  }

  getCategoryName(id: number) {
    this.categoryService.getCategoryById(id).subscribe(res => {
      this.parentCategory = res.data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.currentProduct.products.length; i++) {
        this.productService.getProductOrganizationById(this.currentProduct.products[i].organizationId).subscribe(resOrg => {
          this.productOrganization = resOrg.data;
          this.productOrganizationMap.set(this.currentProduct.products[i].id, this.productOrganization.name);
          this.productService.getProductNotMainPropertyValues(this.currentProduct.products[i].id).subscribe(result => {
            // console.log('result result', result);
            const keys = [];
            // tslint:disable-next-line:forin
            for (const k in result.data) {
              keys.push({key: k, value: result.data[k]});
            }
            // console.log('keys', keys);
            this.currentProductFiltered.products[i].properties = result.data;
            this.currentProduct.products[i].properties = result.data;
            this.currentProductFiltered.products[i].keys = keys;
            this.currentProduct.products[i].keys = keys;
          });
        });
      }
      this.loadCurrentProductFiltered();
    });
  }

  getProductById(id: number) {
    this.productService.getProductDTOById(id).subscribe(res => {
      if (res.data == null){
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      this.currentProduct = res.data;
      this.currentProductFiltered = res.data;
      // this.getModelImage(this.currentProduct.model.id);
      this.getCurrentProperties();
    });
  }

  // getModelImage(id: number) {
  //   console.log('id', id);
  // }

  getCurrentProperties() {
    this.productService.getProductMainPropertyValues(this.currentProduct.id).subscribe(result => {
      const keys = [];
      // tslint:disable-next-line:forin
      for (const k in result.data) {
        keys.push({key: k, value: result.data[k]});
      }
      this.currentProduct.properties = result.data;
      this.currentProductFiltered.properties = result.data;
      this.currentProduct.keys = keys;
      this.currentProductFiltered.keys = keys;
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < this.currentProduct.keys; i++) {
      //   console.log('propertiestodisplay', this.propertiesToDisplay);
      //   this.propertiesToDisplay[this.currentProduct.properties[i].key] = this.currentProduct.properties[i].displayName;
      // }
      this.productService.getProductProperties(this.currentProduct.categoryId).subscribe(res => {
        this.properties = res.data;
        if (this.properties) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.properties.length; i++) {
            this.propertiesToDisplay[this.properties[i].key] = this.properties[i].displayName;
          }
        }
        this.getAllParentsById(this.currentProduct.categoryId);
      });
    });
  }

  loadCurrentProductFiltered() {
    this.currentProductFiltered = new ProductDTO(this.currentProduct);
    this.conditionNew = false;
    this.conditionGood = false;
    this.conditionUsed = false;
    this.value = 0;
    this.highValue = 1000000;
  }

  createApplication(event) {
    event.preventDefault();
    this.formSubmitted = true;
    if (this.applicationForm.valid) {
      document.getElementById('openSuccessfulWindow').click();
      this.productApplication.name = this.applicationForm.get('clientName').value;
      this.productApplication.contact = this.applicationForm.get('clientContact').value;
      this.productApplication.email = this.applicationForm.get('clientEmail').value;
      this.productApplicationService.createApplication(this.productApplication).subscribe(res => {
        // alert('Ваш заказ принят. Номер заказа - ' + res.data.id + '. В ближайшее время с вами свяжутся');
        this.productApplication = new ProductApplication();
        this.productService.changeProductState(this.id, 2).subscribe(result => {
          document.getElementById('exampleModal').click();
          // window.location.href = 'http://localhost:4200/#/dashboard/detail/' + this.parentCategory.id;
          // this.router.navigate(['dashboard/detail/', this.parentCategory.id]).then(() => {
          //   window.location.reload();
          // });
        });
      });
    }
  }

  rejectApplication(event) {
    event.preventDefault();
    this.formSubmitted = true;
    if (this.applicationForm.valid) {
      this.productApplicationForDelete.name = this.applicationForm.get('clientName').value;
      this.productApplicationForDelete.contact = this.applicationForm.get('clientContact').value;
      this.productApplicationForDelete.productId = this.productToApply.id;
      // tslint:disable-next-line:max-line-length
      this.productApplicationService.checkApplication(this.productApplicationForDelete.name, this.productApplicationForDelete.contact, this.productApplicationForDelete.productId).subscribe(result => {
        if (result.data) {
          this.router.navigate(['dashboard/product/detail', this.productToApply.id]).then(() => {
            window.location.reload();
          });
        } else {
          this.correctApplicationForDelete = false;
        }
      });
    }
  }

  redirectToPreviousPage() {
    this.router.navigate(['dashboard/detail/', this.parentCategory.id]).then(() => {
      window.location.reload();
    });
  }

  filterProducts(displayName?: string, key?: string, minPrice?: number, maxPrice?: number) {
    this.currentProductFiltered = new ProductDTO(this.currentProduct);
    if (displayName && key) {
      if (displayName === 'condition') {
        if (key === 'good') {
          this.conditionGood = !this.conditionGood;
        } else if (key === 'new') {
          this.conditionNew = !this.conditionNew;
        } else if (key === 'used') {
          this.conditionUsed = !this.conditionUsed;
        }
      }
    }
    this.products = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.currentProductFiltered.products.length; i++) {
      if (this.conditionGood) {
        if (this.currentProductFiltered.products[i].condition === 'Хорошое') {
          // this.currentProductFiltered.products.splice(i, 1);
          this.products.push(this.currentProductFiltered.products[i]);
        }
      }
      if (this.conditionNew) {
        if (this.currentProductFiltered.products[i].condition === 'Новое') {
          this.products.push(this.currentProductFiltered.products[i]);
        }
      }
      if (this.conditionUsed) {
        if (this.currentProductFiltered.products[i].condition === 'Удовлетворительное') {
          this.products.push(this.currentProductFiltered.products[i]);
        }
      }
    }
    if (this.conditionUsed || this.conditionNew || this.conditionGood) {
      this.currentProductFiltered.products = this.products;
    }
    if (displayName && key) {
      if (displayName === 'filter') {
        if (key === 'по состоянию') {
          console.log('123');
        } else if (key === 'сначала дешёвые') {
          for (let i = 0; i < this.currentProductFiltered.products.length - 1; i++) {
            for (let j = 0; j < this.currentProductFiltered.products.length; j++) {
              if (this.currentProductFiltered.products[i].price > this.currentProductFiltered.products[j].price) {
                this.productTemp = this.currentProductFiltered.products[i];
                this.currentProductFiltered.products[i] = this.currentProductFiltered.products[j];
                this.currentProductFiltered.products[j] = this.productTemp;
              }
            }
          }
        } else if (key === 'сначала дорогие') {
          for (let i = 0; i < this.currentProductFiltered.products.length - 1; i++) {
            for (let j = 0; j < this.currentProductFiltered.products.length; j++) {
              if (this.currentProductFiltered.products[i].price < this.currentProductFiltered.products[j].price) {
                this.productTemp = this.currentProductFiltered.products[i];
                this.currentProductFiltered.products[i] = this.currentProductFiltered.products[j];
                this.currentProductFiltered.products[j] = this.productTemp;
              }
            }
          }
        } else if (key === 'по популярности') {
          console.log('10');
        } else if (key === 'акционные') {
          console.log('20');
        }
      }
    }
    if (maxPrice && (minPrice !== 0 || maxPrice !== 1000000)) {
      for (let i = 0; i < this.currentProductFiltered.products.length; i++) {
        if (this.currentProductFiltered.products[i].price >= minPrice && this.currentProductFiltered.products[i].price <= maxPrice) {
        } else {
          this.currentProductFiltered.products.splice(i, 1);
          i = i - 1;
          if (this.currentProductFiltered.products.length === 0) {
            this.currentProductFiltered.products = [];
          }
        }
      }
    }
  }

  // filterProducts(key?: string, value?: any, additionalValue?: any) {
  //   const tempFilter = {
  //     name: key,
  //     filterValue: value
  //   };
  //
  //   if (additionalValue) {
  //     tempFilter.filterValue = value + '-' + additionalValue;
  //   }
  //
  //   this.isValidFilter = true;
  //
  //   // Check if key already exists
  //   if (this.filterProperties.length !== 0) {
  //     for (const filter of this.filterProperties) {
  //       if (filter.name === tempFilter.name) {
  //         filter.filterValue = tempFilter.filterValue;
  //         this.isValidFilter = false;
  //         break;
  //       }
  //     }
  //   } else {
  //     this.filterProperties.push(tempFilter);
  //     this.isValidFilter = false;
  //   }
  //
  //   if (this.isValidFilter) {
  //     this.filterProperties.push(tempFilter);
  //   }
  //
  //   console.log(this.filterProperties);tempFilter.filterValue.split("-")[0]
  //   console.log(this.currentProduct.products.filter(
  //     a => this.filterProperties.some(b =>
  //       b.filterValue === a.condition ||
  //       (Number(b.filterValue.split("-")[0]) <= a.price && Number(b.filterValue.split("-")[1] >= a.price)))
  //   ));
  // this.currentProduct.products = this.currentProduct.products.filter(a => this.filterProperties.some(b => b.condition === a.condition));
  // }

  getAllParentsById(id: number) {
    this.categoryService.getAllParentCategoriesByParentId(id).subscribe(res => {
      this.tree = res;
      this.tree.reverse();
      for (let i = 0; i < this.tree.length; i++) {
        if (i === 0) {
          this.tree[i].path = '/' + this.tree[i].id;
        } else if (i === 1) {
          this.tree[i].path = '/dashboard/' + this.tree[i].id;
        } else {
          this.tree[i].path = '/dashboard/detail/' + this.currentProduct.categoryId;
        }
      }
      this.getCategoryName(this.currentProduct.categoryId);
    });
  }

  setProductIdToApplication(id: number) {
    this.productApplication.productId = id;
    this.getProductToSend(id);
  }

  getProductToSend(id) {
    this.productService.getProductById(id).subscribe(res => {
      this.productToApply = res.data;
    });
  }


  scroll(el: HTMLElement) {
    el.scrollIntoView({block: 'end', behavior: 'smooth'});
  }

  isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  addFilter(name: string, filter: any[]) {
    const index = filter.indexOf(name, 0);
    if (index > -1) {
      filter.splice(index, 1);
    } else {
      filter.push(name);
    }
  }

  // showFilter() {
  //   this.filteredSmartphones = [];
  //   for (const s of this.smartphones) {
  //     if (!this.isEmpty(this.camFilter)) {
  //       if (this.equipmentFilter.indexOf(s.equipment) > -1) {
  //         this.equipmentCheck = true;
  //       } else if (this.camFilter.indexOf(s.equipment) === -1) {
  //         this.equipmentCheck = false;
  //       }
  //     }
  //     if (this.raM && this.came && this.mem && this.equipmentCheck) {
  //       this.filteredSmartphones.push(s);
  //     }
  //   }
  // }

  redirectToSimilarProduct(id: number) {
    this.router.navigate(['dashboard/product/detail/', id]).then(() => {
      window.location.reload();
    });
  }

  changeState(image, images: any[]) {
    if (image.state === 1) {
      return;
    }
    for (let i = 0; i < images.length; i++) {
      if (image.id === images[i].id) {
        images[i].state = 1;
      } else {
        images[i].state = 0;
      }
    }
  }

  setState(similarPhone: Product) {
    if (similarPhone && similarPhone.images)
      similarPhone.images[0].state = 1;
  }

  changeStateOfNext(images: any[]) {
    for (let i = 0; i < images.length; i++) {
      if (images[i].state == 1) {
        images[i].state = 0;
        images[(i+1)%images.length].state = 1;
        break;
      }
    }
  }

  changeStateOfPrev(images: any[]) {
    for (let i = 0; i < images.length; i++) {
      if (images[i].state == 1) {
        images[i].state = 0;
        if (i==0){
          images[images.length-1].state = 1;
        }
        else{
          images[(i-1)].state = 1;
        }
        break;
      }
    }
  }
}
