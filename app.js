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
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
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

app.get("/players/", async (request, response) => {
  const getCricketTeam = `SELECT * FROM cricket_team`;

  const playerData = await db.all(getCricketTeam);
  const playersArray = playerData.map((eachPlayer) =>
    convertDbObjectToResponseObject(eachPlayer)
  );
  response.send(playersArray);
});

//post the playerDetails

app.post("/players/", async (request, response) => {
  const bodyDetails = request.body;
  const { playerName, jerseyNumber, role } = bodyDetails;
  const addDetails = `
    INSERT INTO 
    cricket_team (player_name, jersey_number,role)
    VALUES(
        ${playerName},
        ${jerseyNumber},
        ${role})
    `;
  const addPlayer = await db.run(addDetails);
  response.send("Player Added to Team");
});

//get player based on given playerID

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayer = `
    SELECT * FROM cricket_team WHERE player_id = ${playerId}`;

  const playerInfo = await db.get(getPlayer);
  response.send(playerInfo);
});
// put player based on playerID

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updateQuery = `
    UPDATE cricket_team SET 
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${playerId}`;

  const updatedPlayer = await db.run(updateQuery);
  response.send("Player Details Updated");
});

// delete the player based on given playerId

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deleteQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId}`;

  const deleted = await db.run(deleteQuery);
  response.send("Player Removed");
});
module.exports = app;
