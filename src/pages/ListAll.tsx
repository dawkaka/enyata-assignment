import { useEffect, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import { ViewPokemon } from "../components/PokemonView";
import { BASE_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

export function ListAll() {
  const [view, setView] = useState<string | undefined>(undefined);
  const [numPerPage, setNumPerPage] = useState<8 | 12 | 20>(8);
  const [pages, setPages] = useState<{ name: string; url: string }[][]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isPending, error, data } = useQuery({
    queryKey: ["view", name],
    queryFn: () =>
      fetch(`${BASE_URL}/pokemon?offset=0&limit=500`).then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      let pokemons = data.results;
      const result = [];
      for (let i = 0; i < pokemons.length; i += numPerPage) {
        result.push(pokemons.slice(i, i + numPerPage));
      }
      console.log(result);
      setPages(result);
    }
  }, [data, numPerPage]);

  if (error) {
    return <p className="text-red-500 text-sm">Something went wrong</p>;
  }

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div className="absolute z-0 h-full w-full bg-[url('./noise.png')] opacity-[0.06]"></div>
      <header className="w-full bg-white shadow-lg">
        <nav className="flex items-center justify-between py-2 px-4 z-[999] overflow-y-visible h-20 max-w-[1300px] mx-auto">
          <div className="flex gap-1 items-center z-50">
            <img src="./home_image.png" className="w-28 mt-6" />
            <h4 className="font-bold text-3xl font-[ClashDisplay-Variable]">
              Poké <span className="text-[var(--primary-color)]">book</span>
            </h4>
          </div>
          <div className="relative">
            <div className="h-12 w-12 top-1/2 -translate-y-1/2 flex justify-center items-center absolute left-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2939 12.5786H13.3905L13.0703 12.2699C14.2297 10.9251 14.8669 9.20834 14.8656 7.43282C14.8656 5.96275 14.4297 4.52569 13.613 3.30337C12.7963 2.08105 11.6354 1.12837 10.2772 0.565793C8.91907 0.00322052 7.42457 -0.143974 5.98275 0.142823C4.54092 0.42962 3.21652 1.13753 2.17702 2.17702C1.13753 3.21652 0.42962 4.54092 0.142823 5.98275C-0.143974 7.42457 0.00322052 8.91907 0.565793 10.2772C1.12837 11.6354 2.08105 12.7963 3.30337 13.613C4.52569 14.4297 5.96275 14.8656 7.43282 14.8656C9.27387 14.8656 10.9663 14.191 12.2699 13.0703L12.5786 13.3905V14.2939L18.2962 20L20 18.2962L14.2939 12.5786ZM7.43282 12.5786C4.58548 12.5786 2.28702 10.2802 2.28702 7.43282C2.28702 4.58548 4.58548 2.28702 7.43282 2.28702C10.2802 2.28702 12.5786 4.58548 12.5786 7.43282C12.5786 10.2802 10.2802 12.5786 7.43282 12.5786Z"
                  fill="#E1E1E1"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter pokemon name"
              className="w-[400px] pl-10 text-xl shadow-md rounded-full border border-[#E1E1E1] outline-none bg-transparent py-2"
            />
          </div>
          <button className="rounded-full h-[45px] w-[45px] z-50 outline-1 outline outline-[#868686] border-[4px] border-white bg-[var(--primary-color)] p-1"></button>
        </nav>
      </header>
      {view && (
        <ViewPokemon name={view} closeModal={() => setView(undefined)} />
      )}
      <main className="w-full h-full bg-gray-200 bg-opacity-30">
        <div className="p-10 grid grid-cols-4 gap-12 mx-auto max-w-[1100px]">
          {isPending && <p>Loading...</p>}
          {pages[currentPage - 1] &&
            pages[currentPage - 1].map((pokemon) => {
              const id = pokemon.url.split("/")[6];
              return (
                <PokemonCard
                  name={pokemon.name}
                  key={pokemon.name}
                  id={id}
                  handleView={(name: string) => setView(name)}
                />
              );
            })}
        </div>
      </main>
    </div>
  );
}
