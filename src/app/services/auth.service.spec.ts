import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { Auth } from '../models/auth.model';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TokenService, AuthService],
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be create', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return a token', (doneFn) => {
      const mockData: Auth = {
        access_token: '123',
      };
      const email = 'email@example.com';
      const password = 'password';

      authService.login(email, password).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      const token = '123';
      const mockData: Auth = {
        access_token: token,
      };
      const email = 'email@example.com';
      const password = 'password';
      spyOn(tokenService, 'saveToken').and.callThrough();

      authService.login(email, password).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledOnceWith(token);
          doneFn();
        },
      });

      //   http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpTestingController.expectOne(url);
      req.flush(mockData);
    });
  });
});
