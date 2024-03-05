import { useQuery } from "@tanstack/react-query";

import { BASE_URL } from "../constants";
interface PokemonCardT {
  name: string;
}

export function PokemonCard({ name }: PokemonCardT) {
  return (
    <article className="relative group  w-full rounded-xl p-2 h-max bg-white">
      <div className="rounded-lg bg-gray-200 w-full aspect-[3/1.8]">
        <img
          src="./poke.png"
          className="absolute -mt-[10%] left-1/2 -translate-x-1/2 w-2/3"
        />
      </div>
      <h3 className="font-[ClashDisplay-Variable] text-2xl mt-4 text-center capitalize">
        {name}
      </h3>
      <PokemonTypes name={name} />
      <div className="mx-2 my-4 hidden group-hover:block">
        <button className="flex w-full items-center rounded-[12px] bg-[var(--primary-color)] text-white px-4 py-2 justify-between">
          View pokemon
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75ZM9.99992 14.1667C7.69992 14.1667 5.83325 12.3 5.83325 10C5.83325 7.7 7.69992 5.83333 9.99992 5.83333C12.2999 5.83333 14.1666 7.7 14.1666 10C14.1666 12.3 12.2999 14.1667 9.99992 14.1667ZM9.99992 7.5C8.61659 7.5 7.49992 8.61667 7.49992 10C7.49992 11.3833 8.61659 12.5 9.99992 12.5C11.3833 12.5 12.4999 11.3833 12.4999 10C12.4999 8.61667 11.3833 7.5 9.99992 7.5Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}

export function PokemonTypes({ name }: { name: string }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["pokemon_type", name],
    queryFn: () =>
      fetch(`${BASE_URL}/pokemon/${name}`).then((res) => res.json()),
  });
  if (error) {
    return <p className="text-red-500 text-sm">Something went wrong</p>;
  }
  console.log(data);
  return (
    <div className="flex gap-2 w-full justify-center my-2">
      {isPending ? (
        <p>Loading...</p>
      ) : (
        data.types.map((type: any) => <PokemonType type={type.type.name} />)
      )}
    </div>
  );
}

function PokemonType({ type }: { type: string }) {
  return (
    <div className="rounded-full bg-gray-200 flex items-center text-sm px-2 py-[2px]">
      <span>❤️‍🔥</span>
      <span className="capitalize">{type}</span>
    </div>
  );
}
