import { Typography, useMediaQuery } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { fetchMovieDatail } from "~/apis/fetchMovieDatail";
import PageMargin from "~/component/PageMargin";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");
  const fetchMovieDatails = `https://api.themoviedb.org/3/movie/${params.movieId}?language=en-US`;
  const fetchMovieReviews = `https://api.themoviedb.org/3/movie/${params.movieId}/reviews?language=en-US&page=1`;
  const details = await fetchMovieDatail(fetchMovieDatails);
  const reviews = await fetchMovieDatail(fetchMovieReviews);

  return json({ details, reviews });
}

export default function MovideDetail() {
  const { details, reviews } = useLoaderData<typeof loader>();

  const isSmallScreen = useMediaQuery("(max-width:850px)");
  return (
    <PageMargin>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "calc(100vh - 100px)",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <div>
          <img
            alt={details.poster_path}
            src={"https://image.tmdb.org/t/p/w342/" + details.poster_path}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "700px",
            marginLeft: isSmallScreen ? "0" : "50px",
            marginTop: isSmallScreen ? "20px" : "0",
            padding: isSmallScreen ? "0 30px" : "0",
          }}
        >
          <Typography style={{ lineHeight: 2.5 }}>
            Title: {details.original_title}
          </Typography>
          <Typography style={{ lineHeight: 2 }}>
            Relase Date: {details.release_date}
          </Typography>
          <Typography style={{ lineHeight: 2.5 }}>
            Genres:
            {details.genres.map((genre: any, index: number) => (
              <span key={genre.id}>
                {genre.name}
                {index < details.genres.length - 1 ? ", " : ""}
              </span>
            ))}
            <br />
          </Typography>
          <Typography style={{ lineHeight: 2.5 }}>Overview:</Typography>
          <Typography style={{ lineHeight: 2 }}>
            {details.overview}
          </Typography>{" "}
        </div>
      </div>
    </PageMargin>
  );
}
