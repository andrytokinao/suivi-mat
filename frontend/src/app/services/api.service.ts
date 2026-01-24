import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected apiUrl = environment.apiUrl;
  protected isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    this.isLoading$.next(true);
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params })
      .pipe(
        finalize(() => this.isLoading$.next(false)),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    this.isLoading$.next(true);
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body)
      .pipe(
        finalize(() => this.isLoading$.next(false)),
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    this.isLoading$.next(true);
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body)
      .pipe(
        finalize(() => this.isLoading$.next(false)),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    this.isLoading$.next(true);
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        finalize(() => this.isLoading$.next(false)),
        catchError(this.handleError)
      );
  }

  /**
   * Handle errors
   */
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
