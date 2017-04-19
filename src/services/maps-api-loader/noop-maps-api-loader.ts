import {MapsAPILoader} from './maps-api-loader';

/**
 * When using the NoOpMapsAPILoader, the Daum Maps API must be added to the page via a `<script>`
 * Tag.
 * It's important that the Daum Maps API script gets loaded first on the page.
 */
export class NoOpMapsAPILoader implements MapsAPILoader {
  load(): Promise<void> {
    if (!(<any>window).daum || !(<any>window).daum.maps) {
      throw new Error(
          'Daum Maps API not loaded on page. Make sure window.daum.maps is available!');
    }
    return Promise.resolve();
  };
}
