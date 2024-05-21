import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { json, useLoaderData } from "@remix-run/react";
import { fetchNowPlayingMovies } from "~/apis/fetchNowPlayingMovies";
import PageMargin from "~/component/PageMargin";
import { MovieResult } from "~/types/fetchTypes";

export async function loader() {
  const data = await fetchNowPlayingMovies();
  return json(data);
}
export default function Index() {
  const nowPlayingMovies = useLoaderData<typeof loader>();

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Now Playing Movies
      </Typography>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        From {nowPlayingMovies.dates.minimum}
      </Typography>
      <div
        style={{
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {nowPlayingMovies.results.map((nowPlayingMovie: MovieResult) => (
          <Card
            key={nowPlayingMovie.id}
            sx={{ width: 300, margin: "40px 20px" }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="250"
                src={
                  "https://image.tmdb.org/t/p/w500/" +
                  nowPlayingMovie.poster_path
                }
                alt={nowPlayingMovie.original_title}
              />
            </CardActionArea>
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
    </PageMargin>
  );
}
