import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Options, LabelType} from 'ng5-slider';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../core/services/category.service';
import {ProductService} from '../../core/services/product.service';
import {Category} from '../../core/models/Category';
import {Product} from '../../core/models/product';
import {ProductApplicationService} from '../../core/services/product-application.service';
import {ProductApplication} from '../../core/models/ProductApplication';
import {PropertyTemplateService} from '../../core/services/property-template.service';
import {Property} from '../../core/models/Property';
import {PropertyCatalogValueService} from '../../core/services/property-catalog-value.service';
import {BehaviorSubject, of} from 'rxjs';
import {ModelService} from '../../core/services/model.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Brand} from '../../core/models/brand';
import {BrandService} from '../../core/services/brand.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  isOpen = true;
  isGlobalLoaded = false;
  isLoaded = false;
  value = 0;
  highValue = 1000000;
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
  minValue = 0;
  maxValue = 1000000;

  productApplication = new ProductApplication();
  mobileFilterOpen = false;

  id: number;
  allCategories: any[] = [];
  sortedCategories: any[] = [];
  allProducts: Product[] = [];
  exactCategoryProducts: Product[] = [];
  productToApply: Product;
  tree = [];
  properties: Property[] = [];
  propertyTemplate;
  currentCategory: Category;
  filters = [];
  brands: Brand[] = [];
  filterBrands = [];
  // filtersToDisplay = {};
  active = false;
  filteredProducts = {};
  filteredProductsToDisplay: Product[] = [];

  pageableProducts: any;
  page = 0;
  pageSize = 16;

  config: any;
  // allProducts = new BehaviorSubject([]);
  search = '';
  lastFourProducts: Product[] = [];
  hideCount = 0;
  tempFilter = {};

  applicationForm = new FormGroup({
    clientName: new FormControl('', [Validators.required,
      Validators.pattern('^(?![\\s.]+$)[a-zA-Z\\s.]*(?![\\s.]+$)[а-яА-Я\\s.]*')]),
    clientContact: new FormControl('', [Validators.required,
      Validators.pattern('([+][7]|[8])[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}')]),
    clientEmail: new FormControl('', [Validators.required, Validators.email])
  });
  number;

  get name() {
    return this.applicationForm.get('clientName');
  }

  get contact() {
    return this.applicationForm.get('clientContact');
  }

  get email() {
    return this.applicationForm.get('clientEmail');
  }

  getFormControlValue(controlName: string) {
    return this.applicationForm.get(controlName).value;
  }

  constructor(private activateRoute: ActivatedRoute,
              private categoryService: CategoryService,
              private productApplicationService: ProductApplicationService,
              private productService: ProductService,
              private modelService: ModelService,
              private propertyTemplateService: PropertyTemplateService,
              private brandService: BrandService,
              private propertyCatalogValueService: PropertyCatalogValueService,
              private renderer: Renderer2) {
    // tslint:disable-next-line:radix
    this.id = parseInt(activateRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.isLoaded = false;
    this.hideCount = 0;
    this.getAllCategories();
    setTimeout(() => {
      this.getProductsByCategoryId();
    }, 10);
    this.getAllParentsById(this.id);
    this.categoryService.getCategoryById(this.id).subscribe(res => {
      this.currentCategory = res.data;
      this.getPropertyTemplate();
    });
    console.log('this.filters', this.filters);
  }

  async getAllCategories() {
    this.categoryService.getAllActiveCategories().subscribe(res => {
      this.allCategories = res.data;
      this.sortCategories();
    });
  }

  sortCategories() {
    for (const category of this.allCategories) {
      const temp = new Category();
      if (category.parentCategoryId == null) {
        temp.id = category.id;
        temp.name = category.name;
        temp.children = [];
      }
      if (category.parentCategoryId == null) {
        for (const subcategory of this.allCategories) {
          if (subcategory.parentCategoryId === category.id) {

            const temp2 = new Category();

            temp2.id = subcategory.id;
            temp2.name = subcategory.name;
            temp2.children = [];

            for (const subSubcategory of this.allCategories) {
              if (subSubcategory.parentCategoryId !== null) {
                if (subSubcategory.parentCategoryId === temp2.id) {
                  temp2.children.push(subSubcategory);
                }
              }
            }
            temp.children.push(temp2);
          }
        }
        if (temp.id) {
          this.sortedCategories.push(temp);
        }

      }
    }
  }

  nextPage() {
    if (!this.pageableProducts.last) {
      this.page++;
      this.getProductsByCategoryId();
    }
  }

  prevPage() {
    if (!this.pageableProducts.first) {
      this.page--;
      this.getProductsByCategoryId();
    }
  }

  getProductsByCategoryId() {
    this.isLoaded = false;
    let params = '';

    if (this.page) {
      params += '&page=' + this.page;
    }

    if (this.pageSize) {
      params += '&size=' + this.pageSize;
    }

    this.productService.getProductGroupByProperties(this.id, params).subscribe(res => {
      this.allProducts = res.data.content;
      this.pageableProducts = res.data;
      this.page = res.data.number;
      this.isLoaded = true;
      this.isGlobalLoaded = true;
    });
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }


  getAllParentsById(id: number) {
    this.categoryService.getAllParentCategoriesByParentId(id).subscribe(res => {
      console.log(res);
      this.tree = res;
      this.tree.reverse();
      for (let i = 0; i < this.tree.length; i++) {
        if (i === 0) {
          this.tree[i].path = '/' + this.tree[i].id;
        } else if (i === 1) {
          this.tree[i].path = '/dashboard/' + this.tree[i].id;
        } else {
          this.tree[i].path = '/detail/' + this.id;
        }
      }
    });
  }

  showPriceWithSpace(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }


  getPropertyTemplate() {
    this.propertyTemplateService.getPropertyTemplateByCategoryId(this.currentCategory.id).subscribe(res => {
      this.propertyTemplate = res.data;
      if (this.propertyTemplate) {
        this.getProperties(this.propertyTemplate.id);
      }
    });
  }

  getProperties(id: number) {
    this.propertyTemplateService.getPropertiesByTemplateId(id).subscribe(res => {
      this.properties = res.data;
      for (let i = 0; i < this.properties.length; i++) {
        this.propertyCatalogValueService.getExactPropertyCatalogsById(this.properties[i].catalogId, this.id).subscribe(result => {
          this.tempFilter = {};
          // @ts-ignore
          this.tempFilter.key = this.properties[i].key;
          // @ts-ignore
          this.tempFilter.data = result.data;
          // @ts-ignore
          this.tempFilter.active = true;
          // @ts-ignore
          this.tempFilter.displayName = this.properties[i].displayName;

          // this.filters[this.properties[i].key] = {};
          // this.filters[this.properties[i].key].data = result.data;
          // this.filters[this.properties[i].key].active = true;
          // console.log('this.filters this filters', this.filters);
          // if (this.filters.length > 0) {
          //   console.log('this.filters this filters 0000', this.filters[0].key);
          // }
          this.filters[this.filters.length] = this.tempFilter;
          // this.filtersToDisplay[this.properties[i].key] = this.properties[i].displayName;
          this.filteredProducts[this.properties[i].key] = [];
          // console.log('this.properties[i].key', this.properties[i].key);
          // console.log('this.properties[i].displayName', this.properties[i].displayName);
          // console.log('-------------------------------');
        });
      }
      this.getBrandsByCategoryId();
    });
  }


  isEmpty() {
    let empty = true;
    if (this.filteredProductsToDisplay.length !== 0 || (this.value !== this.minValue || this.highValue !== this.maxValue)) {
      empty = false;
    }
    return empty;
  }

  setProductIdToApplication(id: number) {
    this.productApplication.productId = id;
    this.getProductToSend(id);
  }

  createApplication() {
    if (this.getFormControlValue('clientName') != null && this.getFormControlValue('clientContact') != null
      && this.getFormControlValue('clientEmail')) {
      this.productApplication.name = this.getFormControlValue('clientName');
      this.productApplication.contact = this.getFormControlValue('clientContact');
      this.productApplication.email = this.getFormControlValue('clientEmail');
      this.productApplication.registered = new Date();
      this.productApplicationService.createApplication(this.productApplication).subscribe(res => {
        // alert('Ваш заказ принят. Номер заказа - ' + res.data.id + '. В ближайшее время с вами свяжутся');
        this.productApplication = new ProductApplication();
        this.productService.changeProductState(this.id, 2).subscribe(result => {
          document.getElementById('exampleModal').click();
        });
      });
    } else {
      alert('Заполните все поля');
    }
  }

  getProductToSend(id) {
    this.productService.getProductById(id).subscribe(res => {
      this.productToApply = res.data;
    });
  }

  addToFilteredProducts(displayName?: string, key?: string, id?: number) {
    this.isLoaded = false;
    let params = '';

    if (this.pageSize) {
      params += '&size=' + this.pageSize;
    }

    let temp = [];
    if (displayName && key) {
      console.log('displayName', 'key');
      console.log(displayName, key);
      if (this.filteredProducts[key]) {
        temp = this.filteredProducts[key];
      }
      if (!temp.includes(displayName)) {
        temp.push(displayName);
        if (key === 'Brand') {
          this.modelService.getAllModelsByBrand(id).subscribe(result => {
            for (let i = 0; i < this.filters.length; i++) {
              if (this.filters[i].key === 'Model') {
                if (this.filters[i].data) {
                  this.filters[i].data = this.filters[i].data.concat(result.data);
                } else {
                  this.filters[i].data = result.data;
                }
                this.filters[i].active = true;
                this.filters[i].displayName = 'Модель';
                // this.filtersToDisplay['Model'] = 'Модель';
                break;
              }
            }
            // if (this.filters['Model'].data) {
            //   this.filters['Model'].data = this.filters['Model'].data.concat(result.data);
            // } else {
            //   this.filters['Model'].data = result.data;
            // // }
            // this.filters['Model'].active = true;
            // this.filtersToDisplay['Model'] = 'Модель';
          });
        }
      } else {
        if (key === 'Brand') {
          this.modelService.getAllModelsByBrand(id).subscribe(result => {
            for (const i in result.data) {
              for (let j = 0; j < this.filters.length; j++) {
                if (this.filters[j].key === 'Model') {
                  for (let k = 0; k < this.filters[j].data.length; k++) {
                    if (result.data[i].id === this.filters[j].data[k].id) {
                      this.filters[j].data.splice(k, 1);
                      break;
                    }
                  }
                }
              }
              // for (let j in this.filters['Model'].data) {
              //   if (result.data[i].id === this.filters['Model'].data[j].id) {
              //     this.filters['Model'].data.splice(j, 1);
              //     break;
              //   }
              // }
            }
          });
        }
        const index = temp.indexOf(displayName);
        temp.splice(index, 1);
      }
      this.filteredProducts[key] = temp;
      for (const i in this.filteredProducts) {
        if (this.filteredProducts[i].length === 0) {
          delete this.filteredProducts[i];
        }
      }
      if (this.filteredProducts) {
        console.log('this.filteredProducts', this.filteredProducts);
        const now = new Date();
        const item = {
          value: this.filteredProducts,
          expiry: now.getTime() + 1000 * 60*10,
        };
        localStorage.setItem('filters' + this.currentCategory.id, JSON.stringify(item));
        this.productService.getFilteredProducts(this.filteredProducts, this.currentCategory.id, this.value, this.highValue, params,).subscribe(res => {
          this.pageableProducts = res.data;
          this.page = res.data.number;
          this.isLoaded = true;
        });
      }
    } else {
      // console.log(this.value, this.highValue);
      let contain = false;
      for (const key in this.filteredProducts) {
        if (this.filteredProducts[key].length !== 0) {
          contain = true;
        }
      }
      let newFilters = {};
      if (contain) {
        newFilters = this.filteredProducts;
      }
      const now = new Date();
      const item = {
        value: this.filteredProducts,
        expiry: now.getTime() + 1000 * 60*10,
      };
      localStorage.setItem('filters' + this.currentCategory.id, JSON.stringify(item));
      this.productService.getFilteredProducts(newFilters, this.currentCategory.id, this.value, this.highValue, params).subscribe(res => {
        this.pageableProducts = res.data;
        this.page = res.data.number;
        this.isLoaded = true;
      });
    }
  }

  accordionFilterOpen() {
    const accordion: HTMLElement = document.getElementById('accordion');
    this.renderer.setStyle(accordion, 'left', '0');
  }

  accordionFilterClose() {
    const accordion: HTMLElement = document.getElementById('accordion');
    this.renderer.setStyle(accordion, 'left', '-100%');
  }

  getIndex() {
    return Array.from({length: this.pageableProducts.totalPages}, (v, k) => k + 1);
  }

  arrayNumbers(n?: number): any[] {
    if (!n) {
      return Array(this.pageSize);
    }
    return Array(n);
  }

  getBrandsByCategoryId() {
    this.brandService.getAllBrandsByCategoryId(this.currentCategory.id).subscribe(res => {
      this.brands = res.data;
      // this.filters['Brand'] = {};
      // this.filters['Model'] = {};
      // this.filters['Brand'].active = true;
      // this.filters['Brand'].data = this.brands;
      this.tempFilter = {};
      // @ts-ignore
      this.tempFilter.key = 'Brand';
      // @ts-ignore
      this.tempFilter.displayName = 'Бренд';
      // @ts-ignore
      this.tempFilter.data = this.brands;
      // @ts-ignore
      this.tempFilter.active = true;
      // this.filters[this.filters.length] = this.tempFilter;
      this.filters.splice(0, 0, this.tempFilter);
      this.tempFilter = {};
      // @ts-ignore
      this.tempFilter.key = 'Model';
      // this.filters[this.filters.length] = this.tempFilter;
      this.filters.splice(1, 0, this.tempFilter);
      // this.filtersToDisplay['Brand'] = 'Бренд';
      this.filteredProducts['Brand'] = [];
      this.setPreviousFilters();
    });
  }

  setPreviousFilters() {
    console.log('this.currentCategory.id', this.currentCategory.id);
    console.log('here hre rre', JSON.parse(localStorage.getItem('filters' + this.currentCategory.id)));
    var item = JSON.parse(localStorage.getItem('filters' + this.currentCategory.id));
    const now = new Date();
    if (item) {
      if (item.expiry > now.getTime()) {
        item = item.value;
        for (let key in item) {
          for (let elem of item[key]) {
            this.isLoaded = false;
            let params = '';

            if (this.pageSize) {
              params += '&size=' + this.pageSize;
            }

            let temp = [];
            if (elem && key) {
              var index = null;
              console.log(key);
              if (key === 'Brand') {
                for (let a = 0; a < this.filters.length; a++) {
                  console.log('this.filters[a]');
                  console.log(this.filters[a]);
                  if (this.filters[a].data) {
                    for (let i = 0; i < this.filters[a].data.length; i++) {
                      if (elem === this.filters[a].data[i].displayName) {
                        index = i;
                      }
                    }
                    if (this.filters[a].key === key) {
                      this.filters[a].data[index].checked = true;
                    }
                  }
                }
                // this.filters[key].data[index].checked = true;
              }
              if (this.filteredProducts[key]) {
                temp = this.filteredProducts[key];
              }
              if (!temp.includes(elem)) {
                temp.push(elem);
                if (key === 'Brand') {
                  this.modelService.getAllModelsByBrandDisplayNameAndCategoryId(elem, this.currentCategory.id).subscribe(result => {
                    for (let i = 0; i < this.filters.length; i++) {
                      if (this.filters[i].key === 'Model') {
                        if (this.filters[i].data) {
                          this.filters[i].data = this.filters[i].data.concat(result.data);
                        } else {
                          this.filters[i].data = result.data;
                        }
                        this.filters[i].active = true;
                        this.filters[i].displayName = 'Модель';
                        // this.filtersToDisplay['Model'] = 'Модель';
                      }
                    }
                  });
                }
              } else {
                if (key === 'Brand') {
                  this.modelService.getAllModelsByBrandDisplayNameAndCategoryId(elem, this.currentCategory.id).subscribe(result => {
                    for (const i in result.data) {
                      for (let a = 0; a < this.filters.length; a++) {
                        if (this.filters[a].key === 'Model') {
                          for (let j in this.filters[a].data) {
                            if (result.data[i].id === this.filters[a].data[j].id) {
                              this.filters[a].data.splice(j, 1);
                              break;
                            }
                          }
                        }
                      }
                    }
                  });
                }
                const index = temp.indexOf(elem);
                temp.splice(index, 1);
              }
              this.filteredProducts[key] = temp;
              for (const i in this.filteredProducts) {
                if (this.filteredProducts[i].length === 0) {
                  delete this.filteredProducts[i];
                }
              }
              if (this.filteredProducts) {
                this.productService.getFilteredProducts(this.filteredProducts, this.currentCategory.id, this.value, this.highValue, params,).subscribe(res => {
                  this.pageableProducts = res.data;
                  this.page = res.data.number;
                  this.isLoaded = true;
                });
              }
            } else {
              let contain = false;
              for (const key in this.filteredProducts) {
                if (this.filteredProducts[key].length !== 0) {
                  contain = true;
                }
              }
              let newFilters = {};
              if (contain) {
                newFilters = this.filteredProducts;
              }
              this.productService.getFilteredProducts(newFilters, this.currentCategory.id, this.value, this.highValue, params).subscribe(res => {
                this.pageableProducts = res.data;
                this.page = res.data.number;
                this.isLoaded = true;
              });
            }
          }
        }
      }
    } else {
      localStorage.removeItem('filters' + this.currentCategory.id);
    }
    this.getLastFourProducts(this.currentCategory.id);
  }

  getLastFourProducts(categoryId: number) {
    this.productService.getFirstFourProductsByIdForChilds(categoryId).subscribe(res => {
      this.lastFourProducts = res.data;
    });
  }

  updateSearchTerm(term?: string) {
    term.toLowerCase();
    this.hideCount = 0;
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].key === 'Model') {
        for (let j in this.filters[i].data) {
          this.filters[i].data[j].hide = false;
          if (!this.filters[i].data[j].displayName.toLowerCase().includes(term)) {
            this.filters[i].data[j].hide = true;
          }
        }
      }
    }
  }

  increaseHideCount() {
    this.hideCount++;
  }
}
