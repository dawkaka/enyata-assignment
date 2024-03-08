import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="relative h-full w-full flex flex-col">
      <div className="absolute h-full w-full bg-white bg-[url('./noise.png')] opacity-[0.06]"></div>
      <div className="mx-auto w-max flex flex-col items-center gap-2 mt-16">
        <img src="./home_image.png" className="w-[382px]" alt="" />
        <h4 className="font-bold text-5xl font-[ClashDisplay-Variable]">
          Poké <span className="text-[var(--primary-color)]">book</span>
        </h4>
        <p className="text-lg text-center max-w-96 leading-6">
          Largest Pokémon index with information about every Pokemon you can
          think of.
        </p>
      </div>
      <div className="w-max mx-auto flex flex-col gap-4 my-10">
        <div className="relative rounded-full border-8 border-[var(--primary-color)] overflow-hidden">
          <input
            type="text"
            className="w-[400px] text-2xl px-6 py-4 bg-transparent outline-none"
            placeholder="Enter pokemon name"
          />
          <Link
            to={"/list-view"}
            className="h-12 w-12 top-1/2 -translate-y-1/2 flex justify-center items-center absolute right-4 bg-[var(--primary-color)] rounded-full"
          >
            <img src="./search.svg" className="h-5 w-5" />
          </Link>
        </div>
        <div className="w-full z-10 text-center">
          <Link to={"/list-view"} className="underline">
            View all
          </Link>
        </div>
      </div>
    </main>
  );
}
