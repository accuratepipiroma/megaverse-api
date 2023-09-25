import { Cometh } from "./entities/cometh";
import { Polyanet } from "./entities/polyanet";
import { Soloon } from "./entities/soloon";
import { config } from "dotenv";
import express from "express";
import axios from "axios";

config();
const app = express();
const port = process.env.PORT || 3000;
const candidateId = process.env.CANDIDATE_ID as string;

app.use(express.json());

/**
 * Handles incoming POST requests to retrieve the goal map and create entities based on it.
 */
app.post("/get-goal-and-create", async (req, res) => {
  try {
    const goalMap = await getGoalMap();
    if (goalMap) {
      const rows = goalMap.goal.length;
      const columns = goalMap.goal[0].length;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const entity = goalMap.goal[row][column];
          const entityInstance = createEntityInstance(entity, row, column);
          if (entityInstance) {
            await entityInstance.create();
          }
        }
      }

      res.json({
        message: "Entities created successfully based on the goal map.",
      });
    } else {
      res.status(500).json({ error: "Error accessing the endpoint." });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Creates an instance of a specific entity based on its type.
 * @param type - The type of the entity to create.
 * @param row - The row coordinate of the entity.
 * @param column - The column coordinate of the entity.
 * @returns An instance of the entity or null if the type is unknown.
 */
function createEntityInstance(type: string, row: number, column: number) {
  if (type === "POLYANET") {
    return new Polyanet(row, column);
  } else if (type === "RED_SOLOON") {
    return new Soloon(row, column, "red");
  } else if (type === "BLUE_SOLOON") {
    return new Soloon(row, column, "blue");
  } else if (type === "PURPLE_SOLOON") {
    return new Soloon(row, column, "purple");
  } else if (type === "WHITE_SOLOON") {
    return new Soloon(row, column, "white");
  } else if (type === "UP_COMETH") {
    return new Cometh(row, column, "up");
  } else if (type === "DOWN_COMETH") {
    return new Cometh(row, column, "down");
  } else if (type === "LEFT_COMETH") {
    return new Cometh(row, column, "left");
  } else if (type === "RIGHT_COMETH") {
    return new Cometh(row, column, "right");
  }
  return null;
}

/**
 * Retrieves the goal map from the external API.
 * @returns The goal map data or null if there was an error.
 * @throws An error if there was an issue accessing the endpoint.
 */
async function getGoalMap() {
  try {
    const response = await axios.get(
      `https://challenge.crossmint.io/api/map/${candidateId}/goal`
    );
    return response.data;
  } catch (error) {
    console.error("Error accessing the endpoint:", error);
    throw error;
  }
}

/**
 * Error handling middleware for the application.
 */
app.use((err, res) => {
  console.error("Error in the application:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`The Megaverse API is listening on port ${port}`);
});
