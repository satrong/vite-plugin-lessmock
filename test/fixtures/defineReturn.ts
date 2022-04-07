export type ReturnType<T> = {
  success: 200 | 201 | 204;
  data: T;
  msg: string;
}
