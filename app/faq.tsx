import { Tweet } from "react-tweet";

import { Question } from "./question";

export function FAQ(): JSX.Element {
  return (
<h1 className="my-5 text-xl font-semibold">
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
    <code className="rounded-md bg-gray-100 p-1">.tsx</code> or
    <code className="rounded-md bg-gray-100 p-1">.jsx</code>, the React
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

  )
}
