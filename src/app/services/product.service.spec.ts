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
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    productsService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
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
      spyOn(tokenService, 'getToken').and.returnValue('123');

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
      const header = req.request.headers;
      expect(header.get('Authorization')).toEqual(`Bearer 123`);
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
    it('should update a product', (doneFn) => {
      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new Product',
      };
      const productId = '1';

      productsService.update(productId, { ...dto }).subscribe({
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
    it('should delete a product', (doneFn) => {
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

  describe('Tests for getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData = generateOneProduct();
      const productId = '1';

      productsService.getOne(productId).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when status code is 404', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockError, mockError);
    });

    it('should return the right msg when status code is 409', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };

      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockError, mockError);
    });

    it('should return the right msg when status code is 401', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };

      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockError, mockError);
    });

    it('should return the right msg when status code is undefined', (doneFn) => {
      const productId = '1';
      const msgError = 'Error message';
      const mockError = {
        status: HttpStatusCode.BadRequest,
        statusText: msgError,
      };

      productsService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockError, mockError);
    });
  });
});
