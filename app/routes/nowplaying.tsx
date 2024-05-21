import { Typography } from "@mui/material";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchNowPlayingMovies } from "~/apis/fetchNowPlayingMovies";
import PageMargin from "~/component/PageMargin";
import { MovieResult } from "~/types/fetchTypes";

export async function loader() {
  const data = await fetchNowPlayingMovies();
  return json(data);
}
export default function NowPlaying() {
  const nowPlayingMovies = useLoaderData<typeof loader>();

  return (
    <PageMargin>
      <Typography>Now Playing Movies</Typography>
      <Typography>From {nowPlayingMovies.dates.minimum}</Typography>
      {nowPlayingMovies.results.map((nowPlayingMovie: MovieResult) => (
        <div key={nowPlayingMovie.id}>{nowPlayingMovie.original_title}</div>
      ))}
    </PageMargin>
  );
}
