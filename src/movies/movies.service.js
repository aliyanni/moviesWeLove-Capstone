const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

function list() {
  return knex("movies").select("*");
}

function read(movie_id) {
  return knex("movies as m").select("*").where({ movie_id }).first();
}

function listMoviesShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .distinct("m.movie_id");
}

function listTheatersShowingMovie(movie_id) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.*")
    .where({ "mt.movie_id": movie_id });
}

const addCritics = reduceProperties("review_id", {
  critic_id: ["critic", "critic_id"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

function listMovieReviews(movie_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movie_id })
    .then(addCritics);
}

module.exports = {
  list,
  listMoviesShowing,
  read,
  listTheatersShowingMovie,
  listMovieReviews,
};