import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  center = { latitude: 0, longitude: 0 };

  constructor() {}

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((response) => {
      const { latitude, longitude } = response.coords;
      this.center = {
        latitude,
        longitude,
      };
    });
  }
}
