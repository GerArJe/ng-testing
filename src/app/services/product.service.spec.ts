import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './product.service';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
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

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be create', () => {
    expect(productsService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts();

      productsService.getAllSimple().subscribe({
        next: (data) => {
          expect(data.length).toEqual(mockData.length);
          expect(data.length).toBe(mockData.length);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
    });
  });

  describe('Tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);

      productsService.getAll().subscribe({
        next: (data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        { ...generateOneProduct(), price: 100 },
        { ...generateOneProduct(), price: 200 },
        { ...generateOneProduct(), price: 0 },
        { ...generateOneProduct(), price: -100 },
      ];

      productsService.getAll().subscribe({
        next: (data) => {
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          expect(data[2].taxes).toEqual(0);
          expect(data[3].taxes).toEqual(0);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;

      productsService.getAll(limit, offset).subscribe({
        next: (data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('Tests for create', () => {
    it('should return a new product', (doneFn) => {
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        categoryId: 12,
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
      };

      productsService.create({ ...dto }).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Tests for update', () => {
    it('should return a new product', (doneFn) => {
      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new Product',
      };
      const productId = '1';

      productsService.update(productId, {...dto}).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('Tests for delete', () => {
    it('should return a new product', (doneFn) => {
      const mockData = true;
      const productId = '1';

      productsService.delete(productId).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });
});
