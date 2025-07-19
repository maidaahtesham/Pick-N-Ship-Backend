export interface Response {
  success: boolean;
  message: string;
  result: any;
  httpResponseCode: number | null;
  customResponseCode: string;
  count: number;
}