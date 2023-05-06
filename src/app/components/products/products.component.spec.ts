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
import { ValueService } from '../../services/value.service';
import { By } from '@angular/platform-browser';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', [
      'getPromiseValue',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      imports: [],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: ValueService, useValue: valueServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
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
      const btnDebug = fixture.debugElement.query(By.css('.btn-get-all'));
      
      btnDebug.triggerEventHandler('click', null);
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
      const btnDebug = fixture.debugElement.query(By.css('.btn-get-all'));
      
      btnDebug.triggerEventHandler('click', null);
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
      const btnDebug = fixture.debugElement.query(By.css('.btn-get-all'));
      
      btnDebug.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(4000);
      fixture.detectChanges();

      expect(component.status).toEqual('error');
    }));
  });

  describe('test for callPromise', () => {
    it('should call promise', async () => {
      const mockMsg = 'My mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));

      await component.callPromise();
      fixture.detectChanges();

      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock string in <p> when btn was clicked"',  fakeAsync(() => {
      const mockMsg = 'My mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      const btnDebug = fixture.debugElement.query(By.css('.btn-promise'));

      btnDebug.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      const rtaDebug = fixture.debugElement.query(By.css('p.rta'));

      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(rtaDebug.nativeElement.textContent).toEqual(mockMsg);
    }));
  });
});
