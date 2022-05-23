exports.up = function (knex) {
  return knex.schema.createTable("movies_theaters", (table) => {
    table.integer("movie_id").unsigned().notNullable();
    table.foreign("movie_id").references("movies_theaters_movie_id_foreign");

    table.integer("theater_id").unsigned().notNullable();
    table
      .foreign("theater_id")
      .references("movies_theaters_theater_id_foreign");
    table.boolean("is_showing");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("movies_theaters");
};