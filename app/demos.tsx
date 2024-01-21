"use client";
import { prefetchDNS, useFormState, useFormStatus } from "react-dom";
import { Loader2, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";

import PostgresVersion from "@/rpc/postgres-version";
import Pokemon from "@/rpc/pokemon";
import { track } from "@vercel/analytics";

export function DemoButtons({
  pokemonFunctionCode,
}: {
  pokemonFunctionCode: React.ReactNode;
}) {
  prefetchDNS("https://raw.githubusercontent.com/");
  const [versionState, versionFormAction] = useFormState(PostgresVersion, null);
  const [pokemonState, pokemonFormAction] = useFormState(Pokemon, null);

  return (
    <>
      <div className="flex items-center gap-2">
        <form action={versionFormAction}>
          <PostgresVersionDemoButton />
        </form>

        <form action={pokemonFormAction}>
          <PokemonDemoButton />
        </form>
      </div>

      {pokemonState ? (
        <div className="p-5 my-5 bg-yellow-100">
          {pokemonState}

          <div className="text-xs text-gray-400 text-center mt-2">
            Images courtesy of PokeAPI – Pokemon is © 1996-2023 Nintendo,
            Creatures, Inc., GAME FREAK
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer">View function code</summary>
            {pokemonFunctionCode}
          </details>
        </div>
      ) : null}

      {versionState ? (
        <div className="p-5 my-5 bg-yellow-100">{versionState}</div>
      ) : null}
    </>
  );
}

function PokemonDemoButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      onClick={() => track("Pokemon demo button clicked")}
      variant="outline"
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Pokeball className="mr-2 h-4 w-4" />
      )}{" "}
      Random Pokémon
    </Button>
  );
}

function PostgresVersionDemoButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      onClick={() => track("Basic demo button clicked")}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Rocket className="mr-2 h-4 w-4" />
      )}{" "}
      Run
    </Button>
  );
}

function Pokeball({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g strokeWidth="0"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
          style={{ fill: "currentColor" }}
        />
      </g>
    </svg>
  );
}
