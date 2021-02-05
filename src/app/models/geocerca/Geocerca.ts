export interface Geocerca {
  center_point: Point;
  test_point: Point;
  radius: number;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface Route {
  initPoint: Point;
  finishPoint: Point;
}
