import { Entity } from "./entity";

export class Soloon extends Entity {
  constructor(row: number, column: number, private color: string) {
    super(row, column, "soloons", { color });
  }
}
