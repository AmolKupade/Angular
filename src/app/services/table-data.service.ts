// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import { BehaviorSubject, Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class TableDataService {

//   private itemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

//   constructor(private http: HttpClient) {
//     this.fetchItems(); // Fetch items initially when the service is instantiated
//   }

//   getItems(): Observable<any[]> {
//     return this.itemsSubject.asObservable();
//   }

//   fetchItems(): void {
//     this.http.get<any[]>(this.apiUrl).subscribe(items => {
//       this.itemsSubject.next(items);
//     });
//   }

//   getItemById(id: number): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`);
//   }

//   createItem(item: any): Observable<any> {
//     return this.http.post<any>(this.apiUrl, item);
//   }

//   updateItem(data:any,item: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/${item.id}`, data);
//   }

//   deleteItem(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private items: any[] = [];
  private itemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.fetchItems(); // Fetch items initially when the service is instantiated
  }

  getItems(): Observable<any[]> {
    return this.itemsSubject.asObservable();
  }

  fetchItems(): void {
    this.http.get(this.apiUrl).subscribe((res: any) => {
      this.items = res;
      this.itemsSubject.next(this.items);
    })

  }

  getItemById(id: number): Observable<any> {
    const item = this.items.find(item => item.id === id);
    return item ? of(item) : throwError('Item not found');
  }

  createItem(item: any): Observable<any> {
    const newItem = { ...item, id: this.getNextId() };
    this.items.push(newItem);
    this.itemsSubject.next(this.items);
    return of(newItem);
  }

  updateItem(data: any, item: any): Observable<any> {
    // const index = this.items.findIndex(i => i.id === item.id);
    // if (index !== -1) {
    //   this.items[index] = { ...item, ...data };
    //   this.itemsSubject.next(this.items);
    //   return of(this.items[index]);
    // } else {
    //   return throwError('Item not found');
    // }
    //
    // const index = this.items.findIndex(obj => obj.id === data);
    // if (index !== -1) {
    //   return this.items[index] = { ...this.items[index], ...item };
    // } else {
    //   console.error('Object not found');
    // }
    //
    const index = this.items.findIndex(obj => obj.id === data);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...item };
      console.log(this.items)
      return of(this.items[index]);
    } else {
      return throwError('Object not found');
    }
  }

  deleteItem(id: number): Observable<void> {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.itemsSubject.next(this.items);
      return of(undefined);
    } else {
      return throwError('Item not found');
    }
  }

  private getNextId(): number {
    const maxId = this.items.reduce((max, item) => (item.id > max ? item.id : max), 0);
    return maxId + 1;
  }
}
