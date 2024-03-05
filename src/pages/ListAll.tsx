import { PokemonCard } from "../components/PokemonCard";

export function ListAll() {
  return (
    <div className="w-full h-full bg-gray-100">
      <div className="p-10 grid grid-cols-4 gap-6 mx-auto max-w-[1100px]">
        <PokemonCard name="charizard" />
        <PokemonCard name="charizard" />
        <PokemonCard name="charizard" />
        <PokemonCard name="charizard" />
        <PokemonCard name="charizard" />
        <PokemonCard name="charizard" />
      </div>
    </div>
  );
}
