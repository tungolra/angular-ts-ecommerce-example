import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  category: string | undefined;
  rowHeight = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productsSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productsSubscription = this.storeService
      .getAllProducts(this.count, this.sort)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
  }

  onItemsCountChange(newCount: number): void {
    // update the count and re-fetch the products
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    // update the sort and re-fetch the products
    this.sort = newSort;
    this.getProducts();
  }
  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }


  // avoid creating multiple subscriptions to avoid memory leaks
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}
