import axios from "axios";

export class Entity {
  constructor(
    protected row: number,
    protected column: number,
    protected type: string,
    protected additionalData: Record<string, any> = {}
  ) {}

  async create(): Promise<boolean> {
    const data = JSON.stringify({
      candidateId: process.env.CANDIDATE_ID as string,
      row: this.row,
      column: this.column,
      ...this.additionalData,
    });

    try {
      const response = await axios.post(
        `https://challenge.crossmint.io/api/${this.type}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(
        `Created ${this.type.toUpperCase()} at Row ${this.row}, Column ${
          this.column
        }`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error(`Error creating ${this.type.toUpperCase()}:`);
      console.error(error);
      return false;
    }
  }
}
