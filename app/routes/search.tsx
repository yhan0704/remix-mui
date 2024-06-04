import { Card, CardContent, Typography } from "@mui/material";
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import PageMargin from "~/component/PageMargin";
import {
  FetcherMovieResponse,
  MovieResult,
  MoviesResponse,
} from "~/types/fetchTypes";
import InfiniteScroll from "react-infinite-scroll-component";
import { atom, useAtom } from "jotai";

export const itemsAtom = atom<MoviesResponse | null>(null);
export const IndexPageAtom = atom(1);

export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("query") || "";
  const resultPage = url.searchParams.get("page") || "1";
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${resultPage}`;
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

export default function Search() {
  const { nowPlayingMovies, searchQuery } = useLoaderData<typeof loader>();
  const [items, setItems] = useAtom(itemsAtom);
  const [page, setPage] = useAtom(IndexPageAtom);
  const fetcher = useFetcher<FetcherMovieResponse>();
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("query");

  useEffect(() => {
    if (items === null) {
      setItems(nowPlayingMovies);
    }
  }, [items]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.nowPlayingMovies.results;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setItems((prevItems: any) => ({
        ...prevItems,
        results: [...prevItems.results, ...newItems],
      }));
    }
  }, [fetcher.data, fetcher.state]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetcher.load(`?query=${searchQuery}&page=${nextPage}`);
  };

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Result from your search : {searchQuery}
      </Typography>
      <div>
        <InfiniteScroll
          next={loadMore}
          dataLength={items ? items.results.length : 0}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
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
                <Card
                  key={movie.id}
                  sx={{ width: 300, margin: "40px 20px", textAlign: "center" }}
                >
                  <Link to={`/movie/detail/${movie.id}`}>
                    <img
                      alt={movie.original_title}
                      src={
                        "https://image.tmdb.org/t/p/w185/" + movie.poster_path
                      }
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
      </div>
    </PageMargin>
  );
}
