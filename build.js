import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import { createServer } from "http";

const isProd = process.argv.includes("--prod");

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  outfile: "./public/build/bundle.js",
  plugins: [
    esbuildSvelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  banner: {
    js: ' (() => new EventSource("http://localhost:8082").onmessage = () => location.reload())();',
  },
  ...(isProd
    ? {}
    : {
        watch: {
          onRebuild(error) {
            clients.forEach((res) => res.write("data: update\n\n"));
            clients.length = 0;
            console.log(error ? error : "...");
          },
        },
      }),
};

esbuild.build(config).catch((err) => {
  console.error(err);
  process.exit(1);
});

if (!isProd) {
  esbuild.serve(
    {
      servedir: "./public",
      port: 3000,
    },
    {}
  );
}

const clients = [];

if (!isProd) {
  createServer((req, res) => {
    return clients.push(
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
      })
    );
  }).listen(8082);
}
