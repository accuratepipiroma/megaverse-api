const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const candidateId = "24030811-4ac1-4229-bdd3-d1fb7587905d";

async function createPolyanet(row, column) {
  return createEntity("polyanets", row, column);
}

async function createSoloon(row, column, color) {
  return createEntity("soloons", row, column, { color });
}

async function createCometh(row, column, direction) {
  return createEntity("comeths", row, column, { direction });
}

async function createEntity(type, row, column, params = {}) {
  const data = JSON.stringify({
    row,
    column,
    candidateId,
    ...params,
  });

  try {
    const response = await axios.post(
      `https://challenge.crossmint.io/api/${type}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      `Created ${type.toUpperCase()} at Row ${row}, Column ${column}`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error(`Error creating ${type.toUpperCase()}:`);
    console.error(error);
    return false;
  }
}

app.post("/get-goal-and-create", async (req, res) => {
  const goalMap = await getGoalMap();
  if (goalMap) {
    const rows = goalMap.goal.length;
    const columns = goalMap.goal[0].length;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const entity = goalMap.goal[row][column];
        switch (entity) {
          case "POLYANET":
            await createPolyanet(row, column);
            break;
          case "RED_SOLOON":
            await createSoloon(row, column, "red");
            break;
          case "BLUE_SOLOON":
            await createSoloon(row, column, "blue");
            break;
          case "PURPLE_SOLOON":
            await createSoloon(row, column, "purple");
            break;
          case "WHITE_SOLOON":
            await createSoloon(row, column, "white");
            break;
          case "UP_COMETH":
            await createCometh(row, column, "up");
            break;
          case "DOWN_COMETH":
            await createCometh(row, column, "down");
            break;
          case "LEFT_COMETH":
            await createCometh(row, column, "left");
            break;
          case "RIGHT_COMETH":
            await createCometh(row, column, "right");
            break;
          default:
            break;
        }
      }
    }

    res.json({
      message: "Entities created successfully based on the goal map.",
    });
  } else {
    res.status(500).json({ error: "Error accessing the endpoint." });
  }
});

async function getGoalMap() {
  try {
    const response = await axios.get(
      `https://challenge.crossmint.io/api/map/${candidateId}/goal`
    );
    return response.data;
  } catch (error) {
    console.error("Error accessing the endpoint:");
    console.error(error);
    return null;
  }
}

app.listen(port, () => {
  console.log(`The Megaverse API is listening on port ${port}`);
});
