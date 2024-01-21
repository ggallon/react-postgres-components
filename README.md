## react-postgres-components

<a href="https://react-postgres-components.vercel.app/">
<img src="https://github.com/rauchg/react-postgres-components/assets/13041/7b3b83ec-15b5-4aa5-a61c-3f5e6257e424" width="300" />
</a>

An experiment on deploying remote functions that run inside Postgres using v8, run React SSR, and are easily defined in a `rpc/` directory.

```js
export default function helloWorld () => {
  const [{version}] = sql`SELECT version()`; // no `await` needed!
  return <h1>Hello from <em>inside</em> Postgres: {version}</h1>;
}
```

Check out the [demos & how it works](https://react-postgres-components.vercel.app/).

## Deployment

### Setting it up

1. Create a Vercel Postgres (Neon) database and link it to your project
2. Go to its settings and copy the `psql` command
3. Add `-f sql/init.sql` like so to populate the database with some data:
   ```sh
   psql "postgres://{user}:{password}@{name}.{location}.postgres.vercel-storage.com:5432/verceldb" -f init.sql
   ```
4. Install plv8 extention:
   ```sql
   CREATE EXTENSION IF NOT EXISTS plv8;
   ```
5. Deploy!

### Local dev

- Run `vc env pull` to get a `.env.local` file with the `POSTGRES_URL` credential
- Run `pnpm dev` to start developing

### Check the list of installed extensions

```sql
SELECT * FROM pg_extension;
```

### Check plv8 extention version

```sql
SELECT plv8_version();
```

### Install plv8 extention

```sql
CREATE EXTENSION IF NOT EXISTS plv8;
```

### Check the list of installed functions

```sql
SELECT
    n.nspname AS function_schema,
    p.proname AS function_name
FROM
    pg_proc p
    LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE
    n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY
    function_schema,
    function_name;
```

### License & Credit

- MIT licensed
- Elephant icon by [Lima Studio](https://www.svgrepo.com/svg/423868/elephant-origami-paper) (CC Attribution)
- Pokeball icon by [Tiny Brand Icons](https://www.svgrepo.com/svg/315521/pokemon) (MIT)
