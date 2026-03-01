import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";

actor {
  type MovieId = Nat;

  type Genre = {
    #Action;
    #Comedy;
    #Drama;
    #Horror;
    #SciFi;
    #Thriller;
    #Romance;
    #Documentary;
    #Animation;
    #Other;
  };

  type Rating = {
    #_1; #_2; #_3; #_4; #_5;
  };

  type WatchStatus = {
    #Watched; #Unwatched; #Watchlist;
  };

  type Movie = {
    id : MovieId;
    title : Text;
    year : Nat;
    genre : Genre;
    director : Text;
    rating : ?Rating;
    description : ?Text;
    watchStatus : WatchStatus;
    createdAt : Int;
  };

  var nextId = 7;
  let movies = Map.empty<MovieId, Movie>();

  public shared ({ caller }) func addMovie(
    title : Text,
    year : Nat,
    genre : Genre,
    director : Text,
    rating : ?Rating,
    description : ?Text,
    watchStatus : WatchStatus,
  ) : async Movie {
    let movie : Movie = {
      id = nextId;
      title;
      year;
      genre;
      director;
      rating;
      description;
      watchStatus;
      createdAt = 0;
    };
    movies.add(nextId, movie);
    nextId += 1;
    movie;
  };

  public shared ({ caller }) func updateMovie(id : MovieId, updatedMovie : Movie) : async ?Movie {
    switch (movies.get(id)) {
      case (null) { null };
      case (?_) {
        movies.add(id, updatedMovie);
        ?updatedMovie;
      };
    };
  };

  public shared ({ caller }) func deleteMovie(id : MovieId) : async () {
    if (movies.containsKey(id)) {
      movies.remove(id);
    };
  };

  public query ({ caller }) func getMovie(id : MovieId) : async ?Movie {
    movies.get(id);
  };

  public query ({ caller }) func getAllMovies() : async [Movie] {
    let movieList = List.empty<Movie>();
    for ((_, movie) in movies.entries()) {
      movieList.add(movie);
    };
    movieList.toArray();
  };
};
