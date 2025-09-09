// common/response.ts
export class Response<T = any> {
  result?: T;
  httpResponseCode: number;
  customResponseCode?: string;
  message?: string;
  success: boolean;
  count?: number;

  constructor(init?: Partial<Response<T>>) {
    Object.assign(this, init);
  }
}

export class PaginatedResponse<T> {
  page!: number;
  total!: number;
  per_page!: number;
  items!: T[];
}
