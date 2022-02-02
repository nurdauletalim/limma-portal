import {Component, OnInit, Renderer2} from '@angular/core';
import {CategoryService} from '../../core/services/category.service';
import {Category} from '../../core/models/Category';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../core/services/product.service';
import {ProductDTO} from '../../../model/productDTO';
import {PromotionService} from '../../core/services/promotion.service';
import {Promotion} from '../../core/models/promotion';
import {Product} from '../../core/models/product';
import {CategoryImageService} from '../../core/services/category-image.service';
import {ProductViewInfoDto} from '../../core/models/product-view-info-dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  parentSubCategoryId: number;
  childSubCategoryId: number;

  allCategories: any[] = [];
  sortedCategories: any[] = [];
  childCategories: any[] = [];
  parentCategory: Category;
  currentCategory: Category;
  tree = [];
  promotions: Promotion[];
  lastProducts: ProductViewInfoDto[] = [];

  isGlobalLoaded = false;
  isLoaded = false;
  pageSize = 10;

  constructor(private categoryService: CategoryService,
              private categoryImageService: CategoryImageService,
              private activateRoute: ActivatedRoute,
              private renderer: Renderer2,
              private router: Router,
              private productService: ProductService,
              private promotionService: PromotionService) {

    this.parentSubCategoryId = parseInt(activateRoute.snapshot.params.parentSubCategoryId);
    this.childSubCategoryId = parseInt(activateRoute.snapshot.params.childSubCategoryId);
    if (isNaN(this.parentSubCategoryId) && isNaN(this.childSubCategoryId)) {
      this.productService.getLastProductsByPublishedDate(8).subscribe(res => {
        this.lastProducts = res.data;
        console.log(this.lastProducts);
        this.isGlobalLoaded = true;
      });
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getAllCategories();
    if (!this.parentSubCategoryId && !this.childSubCategoryId) {
      this.promotionService.getAllActiveCount(3).subscribe(res => {
        this.promotions = res.data;
      });
    }
  }

  arrayNumbers(n?: number): any[] {
    if (!n) {
      return Array(this.pageSize);
    }
    return Array(n);
  }

  showPriceWithSpace(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  navigateToComponent(id: number, path: string): void {
    this.router.navigate([path, id]).then(() => {
      window.location.reload();
    });
  }

  async getAllCategories() {
    this.categoryService.getAllActiveCategories().subscribe(res => {
      this.allCategories = res.data;
      console.log('this.allCategories', this.allCategories);
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < this.allCategories.length; i++) {
      //   if (this.allCategories[i].id){
      //     this.categoryImageService.getCategoryImagesByCategoryId(this.allCategories[i].id).subscribe(result=>{
      //       console.log('result', result);
      //       this.allCategories[i].images = result.data;
      //     });
      //   }
      // }
      this.sortCategories();
      this.isGlobalLoaded = true;
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
    console.log(this.sortedCategories);
    this.findTemporary(this.parentSubCategoryId, this.childSubCategoryId);
  }

  findTemporary(parentCategoryId: number, childCategoryId: number) {
    for (let i = 0; i < this.sortedCategories.length; i++) {
      if (this.sortedCategories[i].id === parentCategoryId) {
        this.parentCategory = this.sortedCategories[i];
        console.log('parentCategory T: ', this.parentCategory);
        this.categoryImageService.getAllByParentId(this.parentCategory.id).subscribe(result => {
          this.parentCategory.children.forEach(category => {
            category.children.forEach(child => {
              result.data.forEach(image => {
                if (image.categoryId === child.id) {
                  child.images = image;
                }
              });
            });
          });
        });
        break;
      }
      for (let j = 0; j < this.sortedCategories[i].children.length; j++) {
        if (this.sortedCategories[i].children[j].id === childCategoryId) {
          this.parentCategory = this.sortedCategories[i];
          console.log('parentCategory: ', this.parentCategory);
          this.childCategories = this.sortedCategories[i].children[j].children;
          console.log('childCategories: ', this.childCategories);
          break;
        }
      }
    }
    this.getAllParentsById(childCategoryId);
    this.getFirstFourProductsByCategoryId();
  }

  getFirstFourProductsByCategoryId() {
    for (let i = 0; i < this.childCategories.length; i++) {
      this.productService.getFirstFourProductsByIdForChilds(this.childCategories[i].id).subscribe(result => {
        console.log('result', result);
        this.childCategories[i].products = result.data;
      });
    }
  }

  getAllParentsById(id: number) {
    if (id) {
      this.categoryService.getAllParentCategoriesByParentId(id).subscribe(res => {
        this.tree = res;
        this.tree.reverse();
        for (let i = 0; i < this.tree.length; i++) {
          if (i === 0) {
            this.tree[i].path = '/' + this.tree[i].id;
          } else if (i === 1) {
            this.tree[i].path = '/dashboard/' + this.tree[i].id;
          } else {
            this.tree[i].path = '/detail/' + this.childSubCategoryId;
          }
        }
      });
    }
  }
}
