export type TsMockType = {
  name: string;
  age: number;
  status: boolean;
  /**
   * @maxLength 20
   */
  friends: {
    name: string;
    age?: number;
  }[];
}
