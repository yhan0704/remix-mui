import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
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

interface example1111 {
  nowPlayingMovies: MoviesResponse;
  searchQuery: string;
}

export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("query");
  console.log(url);
  const page = url.searchParams.get("page") || "1";
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${page}`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.SOME_SECRET}`,
    },
  });

  if (!res.ok) {
    throw new Response("Failed to fetch data", { status: res.status });
  }
  const nowPlayingMovies = await res.json();
  return json({ nowPlayingMovies, searchQuery });
}

const InfiniteScroller = (props: {
  children: any;
  loading: boolean;
  loadNext: () => void;
}) => {
  const { children, loading, loadNext } = props;
  const scrollListener = useRef(loadNext);
  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDifference = Math.floor(window.innerHeight + window.scrollY);
    const scrollEnded = documentHeight === scrollDifference;

    if (scrollEnded && !loading) {
      scrollListener.current();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <>{children}</>;
};

export default function Search() {
  const { nowPlayingMovies, searchQuery } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<example1111>();
  const navigation = useNavigation();
  const [items, setItems] = useState(nowPlayingMovies);
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [resetPage, setResetPage] = useState(1);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("query");

  const page = fetcher.data
    ? fetcher.data.nowPlayingMovies.page + 1
    : resetPage;

  // useEffect(() => {
  //   if (searchQuery !== currentQuery) {
  //     setItems(nowPlayingMovies);
  //     setCurrentQuery(searchQuery);
  //     setResetPage(1);
  //   }
  // }, [searchQuery, nowPlayingMovies, currentQuery, setResetPage]);

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
  }, [fetcher.data]);

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Result from your search : {searchQuery}
      </Typography>
      <InfiniteScroller
        loadNext={() => {
          fetcher.load(
            `?query=${searchQuery}&page=${
              fetcher.data ? fetcher.data.nowPlayingMovies.page + 1 : page
            }`
          );
        }}
        loading={fetcher.state === "loading"}
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
      </InfiniteScroller>
    </PageMargin>
  );
}
