
import SearchPosts from "../components/SearchPosts";

export default function Page({ searchParams }: any) {
  const q = searchParams?.q || "";

  return <SearchPosts q={q} />;
}
