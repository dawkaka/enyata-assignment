import { useEffect, useMemo, useState } from "react";
import { PokemonCard } from "../components/PokemonCard";
import { ViewPokemon } from "../components/PokemonView";
import { BASE_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

type NumPerPage = 8 | 12 | 16 | 20;

export function ListAll() {
  const [view, setView] = useState<string | undefined>(undefined);
  const [numPerPage, setNumPerPage] = useState<NumPerPage>(8);
  const [pages, setPages] = useState<{ name: string; url: string }[][]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ["view", name],
    queryFn: () =>
      fetch(`${BASE_URL}/pokemon?offset=0&limit=500`).then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      let pokemons = data.results;
      const result = [];
      for (let i = 0; i < pokemons.length; i += numPerPage) {
        result.push(pokemons.slice(i, i + numPerPage));
      }
      setPages(result);
    }
  }, [data, numPerPage]);

  function handleNumPerPage(option: NumPerPage) {
    const inView = (currentPage - 1) * numPerPage;
    setNumPerPage(option);
    setCurrentPage(Math.floor(inView / option) + 1);
  }

  if (error) {
    return <p className="text-red-500 text-sm">Something went wrong</p>;
  }

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div className="absolute z-0 h-full w-full bg-[url('./noise.png')] opacity-[0.1]"></div>
      <header className="fixed top-0 left-0 w-full bg-white bg-opacity-70 z-50 shadow-lg">
        <nav className="flex items-center justify-between py-2 px-4 z-[999] overflow-y-visible h-20 max-w-[1300px] mx-auto">
          <div className="flex gap-1 items-center z-50">
            <img src="./home_image.png" className="w-28 mt-6" />
            <h4 className="font-bold text-3xl hidden sm:block font-[ClashDisplay-Variable]">
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
              className="min-w-0 w-[min(500px,50vw)] pl-10 text-xl shadow-md rounded-full border border-[#E1E1E1] outline-none bg-transparent py-2"
            />
          </div>
          <button
            onClick={() => setShowThemeModal(true)}
            className="rounded-full h-[45px] w-[45px] z-50 outline-1 outline outline-[#868686] border-[4px] border-white bg-[var(--primary-color)] p-1"
          ></button>
          {showThemeModal && (
            <ThemeModal closeModal={() => setShowThemeModal(false)} />
          )}
        </nav>
      </header>
      {view && (
        <ViewPokemon name={view} closeModal={() => setView(undefined)} />
      )}
      <main className="absolute top-20 left-0 py-6 w-full h-[calc(100%-80px)] pb-20 bg-gray-200 bg-opacity-30 overflow-y-auto z-1">
        <div className="p-10 max-w-[1100px] mx-auto h-full">
          {isPending && <p>Loading...</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
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
          <div className="flex flex-col sm:flex-row gap-8 sm:justify-between mt-16 pb-32">
            <Pagination
              numPages={pages.length}
              currentPage={currentPage}
              onChanged={(page: number) => setCurrentPage(page)}
            />
            <CustomSelect onChanged={(option) => handleNumPerPage(option)} />
          </div>
        </div>
      </main>
    </div>
  );
}

function CustomSelect({
  onChanged,
}: {
  onChanged: (option: NumPerPage) => void;
}) {
  const options = [8, 12, 16, 20] as const;
  const [selected, setSelected] = useState(8);
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="relative">
      <button
        className="px-2 py-1  bg-gray-200 flex items-center gap-4 rounded"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="bg-white rounded w-10 text-center">{selected}</span>
        <svg
          width="11"
          height="8"
          viewBox="0 0 11 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.488447 2.14669L5.24199 6.91438C5.29858 6.97097 5.35988 7.01115 5.42591 7.03491C5.49193 7.05868 5.56266 7.07038 5.63812 7.07C5.71357 7.07 5.78431 7.05811 5.85033 7.03435C5.91635 7.01058 5.97766 6.97059 6.03425 6.91438L10.8019 2.14669C10.934 2.01465 11 1.84959 11 1.65153C11 1.45346 10.9293 1.28369 10.7878 1.14222C10.6463 1.00074 10.4813 0.930008 10.2926 0.930008C10.104 0.930008 9.93894 1.00074 9.79747 1.14222L5.63812 5.30157L1.47877 1.14222C1.34673 1.01018 1.18394 0.944155 0.990399 0.944155C0.796863 0.944155 0.629544 1.01489 0.488447 1.15637C0.346973 1.29784 0.276236 1.46289 0.276236 1.65153C0.276236 1.84016 0.346973 2.00521 0.488447 2.14669Z"
            fill="black"
          />
        </svg>
      </button>
      {showOptions && (
        <div className="absolute top-[35px] -translate-x-4 rounded flex flex-col gap-1 items-center w-full p-1 bg-white">
          {options
            .filter((option) => option !== selected)
            .map((option) => (
              <button
                key={option}
                className="hover:bg-gray-100 rounded w-full text-center"
                onClick={() => {
                  setSelected(option);
                  onChanged(option);
                  setShowOptions(false);
                }}
              >
                {option}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function Pagination({
  numPages,
  currentPage,
  onChanged,
}: {
  numPages: number;
  currentPage: number;
  onChanged: (page: number) => void;
}) {
  const { leftPages, middlePages, rightPages } = useMemo(() => {
    const l = currentPage > 4 ? [1] : [1, 2, 3, 4];
    const m =
      currentPage <= 4
        ? []
        : currentPage + 3 >= numPages
        ? []
        : [currentPage - 1, currentPage, currentPage + 1];
    const r =
      currentPage + 3 < numPages
        ? [numPages]
        : [numPages - 3, numPages - 2, numPages - 1, numPages];
    return { leftPages: l, middlePages: m, rightPages: r };
  }, [numPages, currentPage]);
  return (
    <div className="flex gap-4 items-center [&>button]:min-w-7 [&>button]:h-7">
      <button
        className="rounded bg-gray-200 flex justify-center items-center active:bg-gray-300"
        onClick={() =>
          onChanged(currentPage > 1 ? currentPage - 1 : currentPage)
        }
      >
        <span className="rotate-180">
          <PrevSVG />
        </span>
      </button>
      {leftPages.map((page) => {
        return (
          <button
            key={page}
            className={`rounded ${
              currentPage === page
                ? "bg-[var(--primary-color)] text-white "
                : "bg-gray-200 "
            }  text-sm font-medium flex justify-center items-center active:opacity-70`}
            onClick={() => onChanged(page)}
          >
            {page}
          </button>
        );
      })}
      {currentPage > 4 ? <span>...</span> : null}
      {middlePages.map((page) => {
        return (
          <button
            key={page}
            className={`rounded ${
              currentPage === page
                ? "bg-[var(--primary-color)] text-white "
                : "bg-gray-200 "
            }  text-sm font-medium flex justify-center items-center active:opacity-70`}
            onClick={() => onChanged(page)}
          >
            {page}
          </button>
        );
      })}
      {currentPage + 3 < numPages ? <span>...</span> : null}
      {rightPages.map((page) => {
        return (
          <button
            key={page}
            className={`rounded ${
              currentPage === page
                ? "bg-[var(--primary-color)] text-white "
                : "bg-gray-200 "
            }  text-sm font-medium flex justify-center items-center active:opacity-70`}
            onClick={() => onChanged(page)}
          >
            {page}
          </button>
        );
      })}
      <button
        className="rounded bg-gray-200 flex justify-center items-center active:bg-gray-300"
        onClick={() =>
          onChanged(currentPage < numPages ? currentPage + 1 : currentPage)
        }
      >
        <PrevSVG />
      </button>
    </div>
  );
}

function PrevSVG() {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      className="rotate-180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.45629 14.825L1.13754 8.52499C1.06254 8.44999 1.00929 8.36874 0.977786 8.28124C0.946286 8.19374 0.930786 8.09999 0.931286 7.99999C0.931286 7.89999 0.947036 7.80624 0.978536 7.71874C1.01004 7.63124 1.06304 7.54999 1.13754 7.47499L7.45629 1.15624C7.63129 0.981238 7.85004 0.893738 8.11254 0.893738C8.37504 0.893738 8.60004 0.987488 8.78754 1.17499C8.97504 1.36249 9.06879 1.58124 9.06879 1.83124C9.06879 2.08124 8.97504 2.29999 8.78754 2.48749L3.27504 7.99999L8.78754 13.5125C8.96254 13.6875 9.05004 13.9032 9.05004 14.1597C9.05004 14.4162 8.95629 14.638 8.76879 14.825C8.58129 15.0125 8.36254 15.1062 8.11254 15.1062C7.86254 15.1062 7.64379 15.0125 7.45629 14.825Z"
        fill="black"
      />
    </svg>
  );
}

function ThemeModal({ closeModal }: { closeModal: () => void }) {
  const handleThemeChange = (cls: `${"yellow" | "blue" | "pink"}-theme`) => {
    document.body.className = cls;
    closeModal();
  };
  const [theme, setTheme] = useState("pink-theme");
  useEffect(() => {
    const cls = document.querySelector("body")?.className;
    if (cls) {
      setTheme(cls);
    }
  }, []);
  return (
    <div
      className="fixed flex justify-center items-center inset-0  bg-[rgba(39, 39, 39, 0.5)] backdrop-blur-sm z-50"
      onClick={closeModal}
    >
      <div
        className="relative min-w-0 w-96 h-44 bg-gray-100 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 z-0 h-full w-full bg-[url('./noise.png')] opacity-[0.06]"></div>
        <div className="absolute top-0 left-0  z-1 w-full h-full">
          <div className="w-full bg-white px-4 py-2 text-2xl text-center font-semibold font-[ClashDisplay-Variable]">
            Choose Theme
          </div>
          <div className="w-full px-2 py-8 flex justify-center gap-4 [&>button]:h-14 [&>button]:w-14">
            <button
              onClick={() => handleThemeChange("pink-theme")}
              className={`rounded-full  bg-[#E85382] p-1 ${
                theme === "pink-theme"
                  ? "outline-1 outline outline-[#868686] border-[4px] border-white"
                  : ""
              }`}
            ></button>
            <button
              onClick={() => handleThemeChange("blue-theme")}
              className={`rounded-full bg-[#39BADF] p-1 ${
                theme === "blue-theme"
                  ? "outline-1 outline outline-[#868686] border-[4px] border-white"
                  : ""
              }`}
            ></button>
            <button
              onClick={() => handleThemeChange("yellow-theme")}
              className={`rounded-full bg-[#E1A725] p-1 ${
                theme === "yellow-theme"
                  ? "outline-1 outline outline-[#868686] border-[4px] border-white"
                  : ""
              }`}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
