import { highlight } from "sugar-high";
import { DemoButtons } from "./demos";
import { Tweet } from "react-tweet";
import { Question } from "./question";
import Link from "next/link";
import { Github } from "lucide-react";

import { Elephant, SourceIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="px-5 md:px-10 md:py-5 max-w-3xl">
      <div className="my-5">
        <Link href="/">
          <Elephant />
        </Link>
      </div>

      <h1 className="text-xl font-semibold my-5">
        <Link href="/">React Postgres Components</Link>
      </h1>

      <div className="text-base">
        <p className="my-5 font-mono">
          An experiment on deploying remote functions that run <em>inside</em>{" "}
          Postgres using v8, run React SSR, and are easily defined in a{" "}
          <code className="bg-gray-100 rounded-md p-1">rpc/</code> directory:
        </p>

        <pre className="my-5 bg-gray-100 p-5 pt-4 rounded-md overflow-auto">
          <p className="text-gray-500 text-sm mb-2">
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

        <pre className="my-5 bg-gray-100 p-5 pt-4 rounded-md overflow-auto">
          <p className="text-gray-500 text-sm mb-2">
            <SourceIcon />
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
            <pre className="bg-gray-100 p-5 pt-4 rounded-md overflow-auto">
              <p className="text-gray-500 text-sm mb-2">
                <SourceIcon />
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

        <h1 className="text-xl font-semibold my-5">
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
          <code className="bg-gray-100 rounded-md p-1">rpc/</code> folder are
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

        <p className="my-5 font-mono">
          While experimental, this example is a good illustration of{" "}
          <a
            className="link whitespace-nowrap"
            href="https://vercel.com/blog/framework-defined-infrastructure"
            target="_blank"
          >
            Framework-defined Infrastructure
          </a>
          . In local dev, the functions are executed in the Node.js runtime and
          exist in a unified codebase. Upon{" "}
          <code className="bg-gray-100 rounded-md p-1">git push</code>,
          specialized infrastructure (in this case PLV8 functions) is created.
        </p>

        <p className="my-5 font-mono">
          The function source is extended with a minimalist yet useful runtime:
        </p>

        <ul className="my-5 font-mono list-none list-inside">
          <li className="my-5">
            <span className="text-gray-400">- </span>A{" "}
            <code className="bg-gray-100 rounded-md p-1">sql</code> template tag
            literal that wraps{" "}
            <code className="bg-gray-100 rounded-md p-1">plv8.execute</code>
          </li>
          <li className="my-5 break-words	">
            <span className="text-gray-400">- </span>A{" "}
            <code className="bg-gray-100 rounded-md p-1">TextEncoder</code>{" "}
            polyfill fittingly named{" "}
            <code className="bg-gray-100 rounded-md p-1">
              <a
                href="https://github.com/anonyco/FastestSmallestTextEncoderDecoder"
                target="_blank"
                className="link"
              >
                fastestsmallesttextencoderdecoder
              </a>
            </code>
            , required for React 18+ SSR
            <a
              href="https://github.com/reactjs/React.NET/issues/1309#issuecomment-1246745877"
              className="link no-underline"
              target="_blank"
            >
              <sup>[1]</sup>
            </a>
            .
          </li>

          <li className="my-5">
            <span className="text-gray-400">- </span>A{" "}
            <code className="bg-gray-100 rounded-md p-1">console</code> polyfill
            that buffers logs and returns them as part of the rpc protocol so
            that they end up in the app logging context.
          </li>
        </ul>

        <p className="my-5 font-mono">
          This resulting bundle is inserted into Postgres as follows:
        </p>

        <pre className="my-5 bg-gray-100 p-5 pt-4 rounded-md overflow-y-auto">
          <code
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: highlight(`CREATE OR REPLACE FUNCTION "rpc_hello-world"()
RETURNS text AS $$
  $\{functionSource}
$$ LANGUAGE plv8 IMMUTABLE STRICT;`),
            }}
          />
        </pre>

        <h3 className="text-lg font-semibold my-5">Local development</h3>

        <p className="my-5 font-mono">
          While Node.js and PLV8 are both based in V8, a good local dev
          experience needed to account for important differences:
        </p>

        <ul className="my-5 font-mono list-none list-inside">
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
            <code className="bg-gray-100 rounded-md p-1">isolated-vm</code>
          </a>{" "}
          project transparently during local dev.
        </p>

        <p className="my-5 font-mono">
          For each <code className="bg-gray-100 rounded-md p-1">rpc/</code>{" "}
          function, a V8 Isolate is created without access to Node.js APIs. Our
          runtime is loaded on top (like{" "}
          <code className="bg-gray-100 rounded-md p-1">sql</code> and{" "}
          <code className="bg-gray-100 rounded-md p-1">TextEncoder</code>).
        </p>

        <p className="my-5 font-mono">
          To preserve the synchronous{" "}
          <code className="bg-gray-100 rounded-md p-1">plv8.execute</code> API
          semantics, we use{" "}
          <a
            href="https://github.com/laverdet/isolated-vm?tab=readme-ov-file#referenceapplysyncpromisereceiver-arguments-options"
            target="_blank"
            className="link"
          >
            <code className="bg-gray-100 rounded-md p-1">applySyncPromise</code>
          </a>{" "}
          which pauses the isolate until the promise that dispatches the query
          is resolved outside of it.
        </p>

        <h3 className="text-lg font-semibold my-5">Production</h3>

        <p className="my-5 font-mono">
          To invoke our functions in production,{" "}
          <code className="bg-gray-100 rounded-md p-1">{"<HelloWorld />"}</code>{" "}
          is issuing a{" "}
          <span className="bg-gray-100 rounded-md p-1">
            SELECT helloWorld()
          </span>{" "}
          query to Postgres, which is then streamed to the client via
          React Server Components.
        </p>

        <p className="my-5 font-mono">
          This makes it such that the Postgres functions are not exposed
          automatically, and gives us more control and integration with the
          frontend server side rendering lifecycle.
        </p>

        <h1 className="text-xl font-semibold my-5">
          <a href="#faq" id="faq" className="hover:underline">
            FAQ
          </a>
        </h1>

        <Question id="but-why" title="Why would I use this?">
          <p className="my-5 font-mono">
            This is an experimental project that is not intended for production
            use. However, it is a good illustration of the possibilities of
            Framework-defined Infrastructure.
          </p>
          <p className="my-5 font-mono">
            Deploying functions to Postgres is a great way to reduce latency and
            improve performance by moving computation <em>even closer</em> to
            the data. This is especially true for functions that are called
            often and return small payloads.
          </p>
          <p className="my-5 font-mono">
            Unlike regular Serverless Functions, most Postgres providers
            don&apos;t offer the necessary automatic scaling and isolation
            guarantees that would make this technique suitable for general
            purpose use.
          </p>
        </Question>

        <Question id="inspo" title="What was the inspiration?">
          <p className="my-5 font-mono">
            After{" "}
            <a
              href="https://blogs.oracle.com/mysql/post/introducing-javascript-support-in-mysql"
              className="link"
              target="_blank"
            >
              Oracle announced
            </a>{" "}
            JavaScript support in MySQL, lots of{" "}
            <a
              href="https://twitter.com/ImSh4yy/status/1743764862855954633"
              className="link"
              target="_blank"
            >
              high quality
            </a>{" "}
            <a
              href="https://twitter.com/tekbog/status/1742244034427428922"
              className="link"
              target="_blank"
            >
              memes
            </a>{" "}
            <a
              href="https://twitter.com/devagrawal09/status/1742302479071445254"
              target="_blank"
              className="link"
            >
              hit
            </a>{" "}
            the scene:
          </p>

          <div className="my-5">
            <Tweet id="1743292902766207175" />
          </div>

          <p className="my-5 font-mono">
            Given Postgres already had a V8 extension (and prior art like{" "}
            <a
              href="https://github.com/divyenduz/plv8ify"
              target="_blank"
              className="link"
            >
              plv8ify
            </a>
            ), I wanted to see how far I could take this. Turns out: pretty far.
          </p>
        </Question>

        <Question id="just-react" title="Is it exclusive to React?">
          <p className="my-5 font-mono">
            The technique is not exclusive to React. The runtime it implements
            on top of PLV8 is very minimal.
          </p>

          <p className="my-5 font-mono">
            When the function file extension doesn&apos;t end in{" "}
            <code className="bg-gray-100 rounded-md p-1">.tsx</code> or
            <code className="bg-gray-100 rounded-md p-1">.jsx</code>, the React
            runtime could be excluded from the bundle as an optimization.
          </p>
        </Question>

        <Question id="no-async" title="Is it exclusive to Postgres?">
          <p className="my-5 font-mono">
            Per the{" "}
            <a href="#inspo" className="link">
              inspiration
            </a>{" "}
            behind this being MySQL&apos;s JavaScript support, the runtime and
            technique should be trivially portable.
          </p>
        </Question>

        <Question id="0day" title={"What's the security model?"}>
          <p className="my-5 font-mono">
            While not tested or audited, the security model is similar to
            regular Serverless Functions in that the code is executed in an
            isolated environment.
          </p>

          <p className="my-5 font-mono">
            These functions, however, are never exposed directly as API Routes
            or HTTP endpoints. Instead, in the examples above, they are
            themselves invoked from React Server Components like normal SQL.
          </p>
        </Question>

        <h1 className="text-xl font-semibold my-5 mt-7">
          <a href="#get" id="get" className="hover:underline">
            Getting it
          </a>
        </h1>

        <p className="my-5 font-mono">
          The source code is available on{" "}
          <a
            href="https://github.com/rauchg/react-postgres-components"
            target="_blank"
            className="link font-semibold whitespace-nowrap"
          >
            <Github className="inline-block mr-1" size={16} />
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
