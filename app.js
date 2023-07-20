const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// GET API 1 (list of all movies)
app.get("/movies/", async (request, response) => {
  const selectMoviesQuery = `
    select * from movie
    where movie_id;`;
  const moviesArray = await db.all(selectMoviesQuery);
  response.send(moviesArray);
});

// POST API 2
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const createMoviesQuery = `
    INSERT INTO movie(director_id,movie_name,lead_actor)
    VALUES(
        '${directorId}',
        "${movieName}",
        "${leadActor}"
        );`;
  const dbResponse = await db.run(createMoviesQuery);
  response.send("Movie Successfully Added");
});

//  GET API 3 ( get a movieDetails)

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT * 
    FROM movie
    where director_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});
