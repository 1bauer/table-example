import { Component } from '@angular/core';
import { FakestoreapiService } from '../services/fakestoreapi/fakestoreapi.service';
import { Product } from '../services/fakestoreapi/models/product';
import { RandomuserapiService } from '../services/randomuserapi/randomuserapi.service';
import { Observable } from 'rxjs';
import { User } from '../services/randomuserapi/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  products: Observable<Product[]>;
  productsColumns: string[] = ["id", "title", "category", "price"];
  users: Observable<User[]>;
  usersColumns: string[] = ["uid","username", "first_name", "last_name"]

  constructor(fakestore: FakestoreapiService, randomuserapi: RandomuserapiService) {
    this.products = fakestore.getProducts();
    this.users = randomuserapi.getUsers();

  }
}
