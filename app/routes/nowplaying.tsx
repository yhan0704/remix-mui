import { Card, CardContent, Typography } from "@mui/material";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import PageMargin from "~/component/PageMargin";
import { MovieResult, MoviesResponse } from "~/types/fetchTypes";

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

const InfiniteScroller = (props: {
  children: React.ReactNode;
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

export default function NowPlaying() {
  const nowPlayingMovies = useLoaderData<typeof loader>();
  const fetcher = useFetcher<MoviesResponse>();

  const [items, setItems] = useAtom(itemsAtom);
  const [page, setPage] = useAtom(IndexPageAtom);
  const [scrollPosition, setScrollPosition] = useAtom(IndexScrollPositionAtom);

  useEffect(() => {
    if (items === null) {
      setItems(nowPlayingMovies);
      setPage(nowPlayingMovies.page);
    }
  }, [nowPlayingMovies, items, setItems, setPage]);

  useEffect(() => {
    if (fetcher.data && fetcher.state !== "loading") {
      const newItems = fetcher.data.results;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setItems((prevItems) => {
        if (prevItems === null) return fetcher.data;
        return {
          ...prevItems,
          results: [...prevItems.results, ...newItems],
        };
      });
      setPage(fetcher.data.page);
    }
  }, [fetcher.data, fetcher.state, setItems, setPage]);

  useEffect(() => {
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }
  }, [scrollPosition]);

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Now Playing Movies
      </Typography>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        From {items?.dates.minimum}
      </Typography>
      <InfiniteScroller
        loadNext={() => {
          const nextPage = page + 1;
          fetcher.load(`?index&page=${nextPage}`);
        }}
        loading={fetcher.state === "loading"}
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
              <Link
                to={`/movie/detail/${nowPlayingMovie.id}`}
                onClick={saveScrollPosition}
              >
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
      </InfiniteScroller>
    </PageMargin>
  );
}
