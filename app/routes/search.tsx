import { ActionFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import SearchPage from "~/component/SearchPage";

export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  console.log(url);
  const searchQuery = url.searchParams.get("query");
  const page = url.searchParams.get("page") || "1";
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${page}`;

  console.log(page);

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
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  const [hi, setHi] = useState<string | null>(null);

  useEffect(() => {
    setHi(data.searchQuery);
  }, [data.searchQuery]);

  const bye = data.searchQuery;

  const example = hi === bye ? true : false;

  return <SearchPage key={location.key} data={data} example={example} />;
}
