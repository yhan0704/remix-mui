import { json, useLoaderData } from "@remix-run/react";
import PageMargin from "~/component/PageMargin";

export default function Index() {
  const nowPlayingMovies = useLoaderData<typeof loader>();
  console.log(nowPlayingMovies);

  return <PageMargin>aewfwafef</PageMargin>;
}
