import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }
  onClearCart() {
    this.cartService.clearCart();
  }

  onRemoveItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }
  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }
  onCheckout(): void {
    // post request to server to make request to stripe
    // returns a session id to open up a stripe checkout modal
    let key =
      "pk_test_51MccdNK76mSmSLUU0u0DwcQBXrLBRM5xCViCnUjTsXVQixTcPS5bO0CW9UeY3gxju2B1tnqBPaIyJPodSRxKuggt00QOLJc0Gc";
    this.http
      .post(
        "https://e-commerce-mystore.herokuapp.com/checkout",
        // "http://localhost:4242/checkout"
        {
          items: this.cart.items,
        }
      )
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(key);
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
