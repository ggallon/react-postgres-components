import Link from "next/link";
import { Github } from "lucide-react";
import { highlight } from "sugar-high";

import { Elephant, SourceIcon } from "@/components/icons";

import { DemoButtons } from "./demos";
import { FAQ } from "./faq";

export default function Home() {
  return (
    <main className="max-w-3xl px-5 md:px-10 md:py-5">
      <div className="my-5">
        <Link href="/">
          <Elephant />
        </Link>
      </div>

      <h1 className="my-5 text-xl font-semibold">
        <Link href="/">React Postgres Components</Link>
      </h1>

      <div className="text-base">
        <p className="my-5 font-mono">
          An experiment on deploying remote functions that run <em>inside</em>{" "}
          Postgres using v8, run React SSR, and are easily defined in a{" "}
          <code className="rounded-md bg-gray-100 p-1">rpc/</code> directory:
        </p>

        <pre className="my-5 overflow-auto rounded-md bg-gray-100 p-5 pt-4">
          <p className="mb-2 text-sm text-gray-500">
            <SourceIcon className="mr-1 inline-block" />
            rpc/hello-world.tsx
          </p>
          <code
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: highlight(`export default function helloWorld () => {
  const [{version}] = sql\`SELECT version()\`; // no \`await\` needed!
  return <h1>Hello from <em>inside</em> Postgres: {version}</h1>;
}`),
            }}
          />
        </pre>

        <p className="my-5 font-mono">
          And then using them in frontend SSR like this:
        </p>

        <pre className="my-5 overflow-auto rounded-md bg-gray-100 p-5 pt-4">
          <p className="mb-2 text-sm text-gray-500">
            <SourceIcon className="mr-1 inline-block" />
            app/page.tsx
          </p>
          <code
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: highlight(`import HelloWorld from "@/rpc/hello-world";
export default function Page() {
  return <Suspense fallback={"Loading…"}>
    <HelloWorld />
  </Suspense>;
}`),
            }}
          />
        </pre>

        <DemoButtons
          pokemonFunctionCode={
            <pre className="overflow-auto rounded-md bg-gray-100 p-5 pt-4">
              <p className="mb-2 text-sm text-gray-500">
                <SourceIcon className="mr-1 inline-block" />
                rpc/pokemon.tsx
              </p>
              <code
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlight(`export default function Pokemon() {
  const list = sql\`SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12\`;
  return (
    <ul className="flex flex-wrap justify-center gap-4">
      {list.map((row: any) => {
        return (
          <li className="inline-flex flex-col items-center justify-center border bg-white border-gray-400 dark:bg-gray-700 dark:border-gray-500 p-3">
            <img
              alt={row.name}
              width={96}
              height={96}
              src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$\{row.id}.png\`}
            />
            \{row.name}
          </li>
        );
      })}
    </ul>
  );
}
`),
                }}
              />
            </pre>
          }
        />

        <h1 className="my-5 text-xl font-semibold">
          <a href="#how" id="how" className="hover:underline">
            How does it work?
          </a>
        </h1>

        <p className="my-5 font-mono">
          Using esbuild and{" "}
          <a href="https://plv8.github.io/" className="link" target="_blank">
            PLV8
          </a>{" "}
          (a Postgres extension that embeds{" "}
          <a href="https://v8.dev/" target="_blank" className="link">
            V8
          </a>
          ), the functions in the{" "}
          <code className="rounded-md bg-gray-100 p-1">rpc/</code> folder are
          bundled and inserted into Postgres as part of the{" "}
          <a
            href="https://vercel.com/products/managed-infrastructure"
            target="_blank"
            className="link"
          >
            Vercel
          </a>{" "}
          deployment process.
        </p>

        <h3 className="my-5 text-lg font-semibold">Local development</h3>

        <p className="my-5 font-mono">
          While Node.js and PLV8 are both based in V8, a good local dev
          experience needed to account for important differences:
        </p>

        <ul className="my-5 list-inside list-none font-mono">
          <li className="my-2">
            <span className="text-gray-400">- </span>Different runtime APIs
          </li>

          <li className="my-2">
            <span className="text-gray-400">- </span>Sync vs async I/O
          </li>
        </ul>

        <p className="my-5 font-mono">
          Both of these were solved by leveraging the{" "}
          <a
            href="https://github.com/laverdet/isolated-vm"
            className="link"
            target="_blank"
          >
            <code className="rounded-md bg-gray-100 p-1">isolated-vm</code>
          </a>{" "}
          project transparently during local dev.
        </p>

        <p className="my-5 font-mono">
          For each <code className="rounded-md bg-gray-100 p-1">rpc/</code>{" "}
          function, a V8 Isolate is created without access to Node.js APIs. Our
          runtime is loaded on top (like{" "}
          <code className="rounded-md bg-gray-100 p-1">sql</code> and{" "}
          <code className="rounded-md bg-gray-100 p-1">TextEncoder</code>).
        </p>

        <p className="my-5 font-mono">
          To preserve the synchronous{" "}
          <code className="rounded-md bg-gray-100 p-1">plv8.execute</code> API
          semantics, we use{" "}
          <a
            href="https://github.com/laverdet/isolated-vm?tab=readme-ov-file#referenceapplysyncpromisereceiver-arguments-options"
            target="_blank"
            className="link"
          >
            <code className="rounded-md bg-gray-100 p-1">applySyncPromise</code>
          </a>{" "}
          which pauses the isolate until the promise that dispatches the query
          is resolved outside of it.
        </p>

        <h3 className="my-5 text-lg font-semibold">Production</h3>

        <p className="my-5 font-mono">
          To invoke our functions in production,{" "}
          <code className="rounded-md bg-gray-100 p-1">{"<HelloWorld />"}</code>{" "}
          is issuing a{" "}
          <span className="rounded-md bg-gray-100 p-1">
            SELECT helloWorld()
          </span>{" "}
          query to Postgres, which is then streamed to the client via React
          Server Components.
        </p>

        <p className="my-5 font-mono">
          This makes it such that the Postgres functions are not exposed
          automatically, and gives us more control and integration with the
          frontend server side rendering lifecycle.
        </p>

        <FAQ />

        <h1 className="my-5 mt-7 text-xl font-semibold">
          <a href="#get" id="get" className="hover:underline">
            Getting it
          </a>
        </h1>

        <p className="my-5 font-mono">
          The source code is available on{" "}
          <a
            href="https://github.com/rauchg/react-postgres-components"
            target="_blank"
            className="link whitespace-nowrap font-semibold"
          >
            <Github className="mr-1 inline-block" size={16} />
            rauchg/react-postgres-components
          </a>{" "}
          and released under the MIT license. Elephant icon by{" "}
          <a
            href="https://dribbble.com/limastd"
            target="_blank"
            className="link"
          >
            Lima Studio
          </a>
          .
        </p>

        <p className="my-5 font-mono">
          To deploy it, you&apos;ll need a{" "}
          <a href="https://vercel.com/storage/postgres" className="link">
            Vercel Postgres
          </a>{" "}
          or{" "}
          <a href="https://neon.tech/" target="_blank" className="link">
            Neon
          </a>{" "}
          database linked to the project.
        </p>
      </div>
    </main>
  );
}
