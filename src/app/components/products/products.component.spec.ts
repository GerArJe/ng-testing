import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsService } from '../../services/product.service';
import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { generateManyProducts } from '../../models/product.mock';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      imports: [],
      providers: [
        ProductsService,
        { provide: ProductsService, useValue: productServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
   
  });

  it('should create', () => {
    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(of(productsMock));

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });
});
