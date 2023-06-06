const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is started");
      process.exit(1);
    });
  } catch (e) {
    console.log(e.message);
  }
};
initializeDBAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;

  const allPLayers = await db.all(getPlayersQuery);
  const listOfPlayers = allPLayers.map((eachPlayer) => {
    convertDbObjectToResponseObject(eachPlayer);
  });
  response.send(listOfPlayers);
});

module.exports = app;
