import type { ReturnType } from './defineReturn'

type User = {
  /**
   * @format faker.name.firstName()
   */
  name: string;
  /**
   * @maximum 100
   * @minimum 1
   */
  age: number;
}

export type UserType = 'admin' | 'member' | 'guest'

/**
 * @maxLength 13
 */
export type TList = {
  /**
   * @maxLength 10
   */
  title: string;
  count: number;
  users: User[];
  sex?: string;
  tags: UserType | number;
}[]

export type TLessMock = {
  method: 'get';
  path: '/a/b';
  data: ReturnType<TList>;
}
