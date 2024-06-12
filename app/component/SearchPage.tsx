import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PageMargin from "~/component/PageMargin";
import { MovieResult } from "~/types/fetchTypes";

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Dates {
  maximum: string;
  minimum: string;
}

interface MoviesResponse {
  dates: Dates;
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface FetcherMovies {
  nowPlayingMovies: MoviesResponse;
  searchQuery: string;
}

export const itemsAtom = atom<MoviesResponse | null>(null);
export const IndexPageAtom = atom(1);
export default function SearchPage({ data, example }: any) {
  const { nowPlayingMovies, searchQuery } = data;
  const fetcher = useFetcher<FetcherMovies>();
  const navigation = useNavigation();
  const [items, setItems] = useAtom(itemsAtom);

  useEffect(() => {
    if (example === false) {
      setItems(null);
    }
  }, [example]);

  useEffect(() => {
    if (items === null) {
      setItems(nowPlayingMovies);
    }
  }, [items]);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("query");

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.nowPlayingMovies.results;
      setItems((prevItems) => ({
        ...prevItems,
        results: [...prevItems.results, ...newItems],
      }));
    }
  }, [fetcher.data, fetcher.state]);

  const loadMore = () => {
    if (example === false) return;
    const nextPage = fetcher.data
      ? fetcher.data?.nowPlayingMovies.page + 1
      : nowPlayingMovies.page + 1;
    fetcher.load(`?query=${searchQuery}&page=${nextPage}`);
  };

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Result from your search : {searchQuery}
      </Typography>
      <InfiniteScroll
        next={loadMore}
        dataLength={items ? items.results.length : 0}
        loader={<div className="loader" key={0}></div>}
        hasMore={true}
      >
        {searching ? (
          "loading..."
        ) : (
          <div
            style={{
              display: "flex",
              flexFlow: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            {items?.results.map((movie: MovieResult) => (
              <Card key={movie.id} sx={{ width: 300, margin: "40px 20px" }}>
                <Link to={`/movie/detail/${movie.id}`}>
                  <CardMedia
                    component="img"
                    height="250"
                    src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
                    alt={movie.original_title}
                  />
                </Link>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.original_title}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {movie.overview
                      ? movie.overview
                      : "No overview for this movie."}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </InfiniteScroll>
    </PageMargin>
  );
}
