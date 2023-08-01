import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async loadDataJson(url: string) {
    return await fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Lỗi' + response.status);
        }
        return response.json();
      })
      .then(function (json) {
        return json;
      });
  }
}
