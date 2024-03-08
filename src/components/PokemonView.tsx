import { useQueries, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../constants";
import { PokemonCard, PokemonTypes } from "./PokemonCard";
import { useEffect, useState } from "react";
import { getDominantColor } from "../utils";
import { PokeType } from "../types";

export function ViewPokemon({
  name,
  closeModal,
}: {
  name: string;
  closeModal: () => void;
}) {
  const [currentTab, setCurrentTab] = useState<"About" | "Stats" | "Similar">(
    "About"
  );
  const [dominantColor, setDominatColor] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [types, setTypes] = useState<PokeType[]>([]);
  const { isPending, error, data } = useQuery({
    queryKey: ["view", name],
    queryFn: () =>
      fetch(`${BASE_URL}/pokemon/${name}`).then((res) => res.json()),
  });
  if (error) {
    return <p className="text-red-500 text-sm">Something went wrong</p>;
  }
  useEffect(() => {
    if (data) {
      getDominantColor(
        data.sprites.other.dream_world.front_default,
        (color: any) => {
          setDominatColor(color);
        }
      );
    }
  }, [data]);
  const light = dominantColor.map((color) => color + 40);
  const dark = dominantColor.map((color) => color * 0.7);
  const lightRGB = `rgb(${light[0]}, ${light[1]}, ${light[2]})`;
  const darkRGB = `rgb(${dark[0]}, ${dark[1]}, ${dark[2]})`;
  return (
    <div
      className="fixed inset-0 z-[99] bg-gray-400 bg-opacity-70"
      onClick={closeModal}
    >
      <main
        className="h-full min-w-0 w-[min(400px,100vw)] lg:w-1/4 ml-auto bg-white overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full h-full flex flex-col pb-10">
            <div className="p-2 w-full">
              <div
                className="relative w-full rounded-2xl aspect-[2/1]"
                style={{
                  background: `linear-gradient(to bottom, ${lightRGB}, ${darkRGB})`,
                }}
              >
                <button
                  className="absolute top-4 left-4 bg-white shadow rounded px-2"
                  onClick={closeModal}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7001 23.0333C13.9668 22.7667 14.0948 22.4445 14.0841 22.0667C14.0734 21.6889 13.9343 21.3667 13.6668 21.1L9.90009 17.3333H24.7668C25.1445 17.3333 25.4614 17.2053 25.7174 16.9493C25.9734 16.6933 26.101 16.3769 26.1001 16C26.1001 15.6222 25.9721 15.3053 25.7161 15.0493C25.4601 14.7933 25.1436 14.6658 24.7668 14.6667H9.90009L13.7001 10.8667C13.9668 10.6 14.1001 10.2831 14.1001 9.91601C14.1001 9.5489 13.9668 9.23246 13.7001 8.96668C13.4334 8.70001 13.1165 8.56668 12.7494 8.56668C12.3823 8.56668 12.0659 8.70001 11.8001 8.96668L5.70009 15.0667C5.56676 15.2 5.47209 15.3445 5.41609 15.5C5.36009 15.6556 5.33253 15.8222 5.33342 16C5.33342 16.1778 5.36143 16.3445 5.41743 16.5C5.47343 16.6556 5.56765 16.8 5.70009 16.9333L11.8334 23.0667C12.0779 23.3111 12.3832 23.4333 12.7494 23.4333C13.1156 23.4333 13.4325 23.3 13.7001 23.0333Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <img
                  src={data.sprites.other.dream_world.front_default}
                  className="absolute top-[15%] h-[100%] left-1/2 -translate-x-1/2"
                />
              </div>
            </div>
            <h3 className="font-[ClashDisplay-Variable] text-5xl font-semibold mt-10 text-center capitalize">
              {name}
            </h3>
            <PokemonTypes
              name={name}
              liftTypes={(types: PokeType[]) => setTypes(types)}
            />
            <div className="bg-white text-center py-2 mt-8 shadow-3xl">
              <h3 className="font-semibold text-2xl">{currentTab}</h3>
            </div>
            <div
              className="py-8"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgb(241 245 249), white, rgb(241 245 249), transparent)",
              }}
            >
              {currentTab === "About" && !isPending && (
                <About
                  height={data.height}
                  weight={data.weight}
                  abilities={data.abilities}
                />
              )}
              {!isPending && currentTab === "Stats" && (
                <Stats stats={data.stats} />
              )}
              {!isPending && currentTab === "Similar" && (
                <Similar types={types} current={name} />
              )}
            </div>

            <div className="w-full flex justify-center mt-auto">
              <nav className="bg-gray-300 px-4 py-2 rounded-full text-black flex items-center gap-4 [&>*]:w-24 [&>*]:rounded-full [&>*]:text-center [&>*]:py-2">
                <button
                  onClick={() => setCurrentTab("About")}
                  className={currentTab === "About" ? "bg-white" : ""}
                >
                  About
                </button>
                <button
                  onClick={() => setCurrentTab("Stats")}
                  className={currentTab === "Stats" ? "bg-white" : ""}
                >
                  Stats
                </button>
                <button
                  onClick={() => setCurrentTab("Similar")}
                  className={currentTab === "Similar" ? "bg-white" : ""}
                >
                  Similar
                </button>
              </nav>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function About({
  height,
  weight,
  abilities,
}: {
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <span className="w-1/2 text-right">Height</span>
        <span className="w-1/2 text-left font-semibold">{height * 10} cm</span>
      </div>
      <div className="flex items-start gap-4">
        <span className="w-1/2 text-right">Weight</span>
        <span className="w-1/2 text-left font-semibold">{weight / 10} kg</span>
      </div>
      <div className="flex items-start gap-4">
        <span className="w-1/2 text-right">Abilities</span>
        <ul className="w-1/2 text-left pl-5 flex flex-col">
          {abilities.map((ability) => (
            <li
              className="font-semibold list-disc px-0 mx-0"
              key={ability.ability.name}
            >
              {ability.ability.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface StatType {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

function Stats({ stats }: { stats: StatType[] }) {
  return (
    <div>
      {stats.map((stat) => {
        return (
          <div className="flex items-start gap-4 px-2" key={stat.stat.name}>
            <span className="w-1/2 text-right capitalize">
              {stat.stat.name}
            </span>
            <div className="flex items-center gap-2 w-1/2">
              <div className="w-[80%] shrink-1 relative h-2 bg-gray-300">
                <div
                  className={`absolute z-10 top-0 left-0 h-full bg-[var(--primary-color)]`}
                  style={{ width: `${(stat.base_stat / 200) * 100}%` }}
                ></div>
              </div>
              <span>{stat.base_stat}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Similar({ types, current }: { current: string; types: PokeType[] }) {
  const queries = types.map((type) => {
    return {
      queryKey: ["types", type],
      queryFn: () =>
        fetch(`${BASE_URL}/type/${type}`).then((res) => res.json()),
    };
  });
  const result = useQueries({ queries });
  const [similar, setSimilar] = useState([]);
  useEffect(() => {
    const values = result
      .filter((r) => r.data)
      .map((r) => r.data.pokemon.map((p: any) => p.pokemon));

    if (values.length > 0) {
      const baseArray = values[0];
      // similar are pokemons with same types are current pokemon
      const similar = baseArray.filter((item: any) =>
        values.every(
          (v) =>
            v.map((v: any) => v.name).includes(item.name) &&
            item.name !== current
        )
      );

      setSimilar(similar);
    }
  }, [...result.map((r) => r.isPending)]);

  if (result.some((result) => result.isPending)) {
    return <p>Loading...</p>;
  }
  if (result.every((r) => r.isError)) {
    return <p className="text-red-500">Something went wrong</p>;
  }
  return (
    <div className="flex gap-2 px-10">
      {similar
        .slice(0, 2)
        .map(({ name, url }: { name: string; url: string }) => {
          const id = url.split("/")[6];
          return <PokemonCard name={name} key={id} id={id} />;
        })}
    </div>
  );
}
