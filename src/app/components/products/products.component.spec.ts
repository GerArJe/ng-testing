import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { defer, of } from 'rxjs';

import { ProductsService } from '../../services/product.service';
import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { generateManyProducts } from '../../models/product.mock';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      imports: [],
      providers: [{ provide: ProductsService, useValue: productServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('tests for getAllProducts', () => {
    it('should return product list from service', () => {
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(of(productsMock));
      const countPrev = component.products.length;

      component.getAllProducts();
      fixture.detectChanges();

      expect(component.products.length).toEqual(
        productsMock.length + countPrev
      );
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock))
      );

      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();

      expect(component.status).toEqual('success');
    }));

    it('should change the status "loading" => "error"', fakeAsync(() => {
      productService.getAll.and.returnValue(
        defer(() => Promise.reject('error'))
      );

      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(4000);
      fixture.detectChanges();

      expect(component.status).toEqual('error');
    }));
  });
});
