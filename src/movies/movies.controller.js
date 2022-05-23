const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function list(req, res, next) {
  const movieShowing = req.query.is_showing;
  if (movieShowing === "true") {
    const data = await service.listMoviesShowing();
    res.json({ data });
  }
  res.json({ data: await service.list() });
}

function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function listTheatersShowingMovie(req, res, next) {
  const theaters = await service.listTheatersShowingMovie(
    res.locals.movie.movie_id
  );
  res.json({ data: theaters });
}

async function listMovieReviews(req, res, next) {
  const reviews = await service.listMovieReviews(res.locals.movie.movie_id);
  res.json({ data: reviews });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersShowingMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersShowingMovie),
  ],
  listMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listMovieReviews),
  ],
};