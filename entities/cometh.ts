import { Entity } from "./entity";

export class Cometh extends Entity {
  constructor(row: number, column: number, private direction: string) {
    super(row, column, "comeths", { direction });
  }
}
