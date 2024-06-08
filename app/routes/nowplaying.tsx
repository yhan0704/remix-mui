import { Card, CardContent, Typography } from "@mui/material";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import PageMargin from "~/component/PageMargin";
import { MovieResult, MoviesResponse } from "~/types/fetchTypes";
import InfiniteScroll from "react-infinite-scroll-component";

export const itemsAtom = atom<MoviesResponse | null>(null);
export const IndexPageAtom = atom(1);
export const IndexScrollPositionAtom = atom(0);

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";

  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.SOME_SECRET}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch now playing movies");
  }

  const data = await res.json();
  return json(data);
}

export default function NowPlaying() {
  const nowPlayingMovies = useLoaderData<typeof loader>();
  const fetcher = useFetcher<MoviesResponse>();

  const [items, setItems] = useAtom(itemsAtom);
  const [page, setPage] = useAtom(IndexPageAtom);

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
      const newItems = fetcher.data.results;
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
    fetcher.load(`?index&page=${nextPage}`);
  };

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Now Playing Movies
      </Typography>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        From {items?.dates.minimum}
      </Typography>
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
        <div
          style={{
            display: "flex",
            flexFlow: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {items?.results.map((nowPlayingMovie: MovieResult) => (
            <Card
              key={nowPlayingMovie.id}
              sx={{ width: 300, margin: "40px 20px", textAlign: "center" }}
            >
              <Link to={`/movie/detail/${nowPlayingMovie.id}`}>
                <img
                  alt={nowPlayingMovie.original_title}
                  src={
                    "https://image.tmdb.org/t/p/w185/" +
                    nowPlayingMovie.poster_path
                  }
                />
              </Link>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {nowPlayingMovie.original_title}
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
                  {nowPlayingMovie.overview
                    ? nowPlayingMovie.overview
                    : "No overview for this movie."}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    </PageMargin>
  );
}
