"use client";

import { track } from "@vercel/analytics";
import { prefetchDNS, useFormState, useFormStatus } from "react-dom";
import { Loader2, Rocket } from "lucide-react";

import { Pokeball } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Pokemon from "@/rpc/pokemon";
import PostgresVersion from "@/rpc/postgres-version";

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
        <div className="my-5 bg-yellow-100 p-5">
          {pokemonState}

          <div className="mt-2 text-center text-xs text-gray-400">
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
        <div className="my-5 bg-yellow-100 p-5">{versionState}</div>
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
