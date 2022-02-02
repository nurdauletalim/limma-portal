import {Component, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges} from '@angular/core';
import {CategoryService} from '../../layout/core/services/category.service';
import {Category} from '../../layout/core/models/Category';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {ProductService} from '../../layout/core/services/product.service';
import {ProductApplication} from '../../model/ProductApplication';
import {ProductApplicationService} from '../../layout/core/services/product-application.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Product} from '../../layout/core/models/product';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  allCategories: any[] = [];
  sortedCategories: any[] = [];
  test = false;
  marginIndex = 0;
  i = 0;
  globalCategory: Category;

  searchString: string;
  isActive = false;

  products = new BehaviorSubject([]);
  searchProducts = [];
  resultsLength = 0;
  pageIndex = 0;
  pageSize = 0;


  productApplications: ProductApplication[];
  contact: string;
  contactForm = new FormGroup({
    contactNumber: new FormControl('', [Validators.required,
      Validators.pattern('([+][7])[ ]{1}[7]{1}[0-9]{2}[ ]{1}[0-9]{3}[ ]{1}[0-9]{2}[ ]{1}[0-9]{2}')]),
  });
  product: Product;
  image: any;


  // public searchTermArr = new Subject<any>();
  // public searchTerms: Observable<string> = this.searchTermArr.asObservable();

  constructor(private categoryService: CategoryService,
              private renderer: Renderer2,
              private router: Router,
              private route: ActivatedRoute,
              private productService: ProductService,
              private productAppService: ProductApplicationService) {
  }

  ngOnInit(): void {
    console.log(this.searchString);
    this.getAllCategories();
    this.contactForm.get('contactNumber').setValue('+7 7');
  }

  updateSearchTerm(term?: string) {
    this.searchString = term;
    console.log(term);
    console.log(`searchString ` + this.searchString);
    this.getAllSearchProducts();
  }

  getAllSearchProducts() {
    let params = '';
    if (this.searchString && this.searchString !== '') {
      params += '&searchString=' + this.searchString.toLowerCase();
    }
    console.log('params: ' + params);

    this.productService.getAllActiveProductsList(params).subscribe(result => {
      console.log('result', result);
      if (result.data.length > 0) {
        this.searchProducts = result.data;
      } else {
        this.searchProducts = [];
        this.searchProducts[0] = new Product();
        this.searchProducts[0].id = '';
        this.searchProducts[0].name = 'К сожалению, ничего не найдено';
      }
      console.log('this.searchProducts', this.searchProducts);
    });
  }

  navigateToComponent(id: number): void {
    this.router.navigate(['/', id]).then(() => {
      window.location.reload();
    });
  }

  navigateToComponentDashboard(id: number): void {
    this.router.navigate(['/dashboard/', id]).then(() => {
      window.location.reload();
    });
  }

  navigateToComponentDashboardDetail(id: number): void {
    this.router.navigate(['/dashboard/detail/', id]).then(() => {
      window.location.reload();
    });
  }


  searchItem(id: number): void {
    this.router.navigate(['/dashboard/product/detail/', id]).then(() => {
      window.location.reload();
    });
  }

  getAllCategories() {
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
    // console.log('Sorted');
    // console.log(this.sortedCategories);
  }

  mobileMenuOpen() {
    const accordion: HTMLElement = document.getElementById('mobile-catalog-menu');
    const catalogBackground: HTMLElement = document.getElementById('catalog-background');
    this.renderer.setStyle(accordion, 'left', '0');

    this.renderer.removeClass(catalogBackground, 'background-non-active');
    this.renderer.addClass(catalogBackground, 'background-active');
  }

  get phoneNumberValidation(){
    const phonenumber = this.contactForm.get('contactNumber').value;
    if (phonenumber.length < 4){
      this.contactForm.get('contactNumber').setValue('+7 7');
    }
    // tslint:disable-next-line:max-line-length
    else if (phonenumber.substr(phonenumber.length - 1) !== ' ' && (phonenumber.length === 7 || phonenumber.length === 11 || phonenumber.length === 14)){
      const num = phonenumber.substring(0, phonenumber.length - 1) + ' ' + phonenumber.substring(phonenumber.length - 1);
      this.contactForm.get('contactNumber').setValue(num);
    }
    return this.contactForm.get('contactNumber');
  }

  mobileMenuClose() {
    const accordion: HTMLElement = document.getElementById('mobile-catalog-menu');
    const catalogBackground: HTMLElement = document.getElementById('catalog-background');
    this.renderer.setStyle(accordion, 'left', '-70%');

    this.renderer.removeClass(catalogBackground, 'background-active');
    this.renderer.addClass(catalogBackground, 'background-non-active');
    this.test = false;
    this.marginIndex = 0;
  }

  nextShow(category: Category) {
    if (this.marginIndex !== 2) {
      this.test = true;
      this.marginIndex += 1;
      console.log(category);
      this.globalCategory = category;
    } else {
      this.mobileMenuClose();
      this.router.navigate(['../../detail/', category.id]).then(() => {
        window.location.reload();
      });
    }
  }

  prevShow() {
    if (this.marginIndex !== 0) {
      this.test = false;
      this.marginIndex = 0;
    }
  }

  getApplicationsByPhoneNumber() {
    this.productAppService.getApplicationsByPhoneNumber(this.contactForm.get('contactNumber').value).subscribe(res => {
      this.productApplications = res.data;
      for (const applicationItem of this.productApplications) {
        this.productService.getProductById(applicationItem.productId).subscribe(result => {
          this.product = result.data;
          applicationItem.product = this.product;
          console.log('product applications: ', this.productApplications);
        });
      }
    });
  }

  timestamptToDate(application: ProductApplication) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(application.registered, 'dd/MM/yyyy');
  }

  redirectToProduct(id: number) {
    this.router.navigate(['../dashboard/product/detail', id]).then(() => {
      window.location.reload();
    });
  }
}
