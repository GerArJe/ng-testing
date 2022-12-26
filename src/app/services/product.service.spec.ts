import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './product.service';
import { Product } from '../models/product.model';
import { environment } from './../../environments/environment';
import {
  generateManyProducts,
  generateOneProduct,
} from '../models/product.mock';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    productsService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be create', () => {
    expect(productsService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts();

      productsService.getAllSimple().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data.length).toBe(mockData.length);
        doneFn();
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
      httpTestingController.verify();
    });
  });

  describe('Tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);

      productsService.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
      httpTestingController.verify();
    });

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        { ...generateOneProduct(), price: 100 },
        { ...generateOneProduct(), price: 200 },
      ];

      productsService.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
      httpTestingController.verify();
    });
  });
});
