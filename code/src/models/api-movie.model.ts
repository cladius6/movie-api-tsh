import { DbMovie } from './db-movie.model';

export class ApiMovie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;

  constructor(dbMovie: DbMovie) {
    this.id = dbMovie.id;
    this.title = dbMovie.title;
    this.year = parseInt(dbMovie.year);
    this.runtime = parseInt(dbMovie.runtime);
    this.genres = dbMovie.genres;
    this.director = dbMovie.director;
    this.actors = dbMovie.actors;
    this.plot = dbMovie.plot;
    this.posterUrl = dbMovie.posterUrl;
  }
}
