// THIS IS QUICK AND DIRTY, but it does the job

const fs = require("fs");
const path = require("path");

/**
 * Converts bytes to kilobytes and formats as string
 */
const toKB = (b) => {
  const v = Number(b / 1000).toFixed(1);

  if (v === "0.0" || v === "-0.0") {
    return `0 kB`;
  }

  return `${v} kB`;
};

/**
 * Loads a file by given path and parses it to JSON
 */
const loadJsonFile = (path) => JSON.parse(fs.readFileSync(path, "utf-8"));

/**
 * Converts bytes to kilobytes and formats as string
 *
 * @see https://github.com/vercel/next.js/blob/canary/packages/next/src/build/utils.ts#L339
 */
const getPrettySize = (size) => {
  // green for 0-130kb
  if (size < 130 * 1000) return `:green_circle: ${toKB(size)}`;
  // yellow for 130-170kb
  if (size < 170 * 1000) return `:orange_circle: ${toKB(size)}`;
  // red for >= 170kb
  return `:red_circle: ${toKB(size)}`;
};

/**
 * Sums up the sizes of all routes and middleware
 */
const getPageSizes = ({
  routes,
  buildManifest,
  clientSizesJson,
  edgeSizesJson,
}) => {
  const { rootMainFiles } = buildManifest;
  const sharedByAllSize = rootMainFiles
    .map((file) => clientSizesJson.find(({ label }) => label === file).gzipSize)
    .reduce((a, b) => a + b, 0);

  const pageSizes = Object.keys(routes).map((route) => {
    const size = clientSizesJson
      .filter(({ isInitialByEntrypoint }) =>
        Object.keys(isInitialByEntrypoint).includes(`app${route}`)
      )
      .map((item) => (item ? item.gzipSize : 0))
      .reduce((a, b) => a + b, 0);

    return {
      route,
      size,
      firstLoadJs: size + sharedByAllSize,
    };
  });

  const middlewareSize = edgeSizesJson
    .filter(({ isInitialByEntrypoint }) =>
      Object.keys(isInitialByEntrypoint).includes(`src/middleware`)
    )
    .map((item) => (item ? item.gzipSize : 0))
    .reduce((a, b) => a + b, 0);

  return {
    sharedByAllSize,
    pageSizes,
    middlewareSize,
  };
};

/**
 * Produces a markdown table with the JS sizes per route
 */
const produceMarkdownTable = (sizes, compareSizes, label) => {
  const routeSizes = sizes.pageSizes
    .map(({ route, size }, i) => {
      const cur = size + sizes.sharedByAllSize;
      const comparisonSize = compareSizes?.pageSizes?.find(
        ({ route: cmpRoute }) => cmpRoute === route
      )?.size;

      const cmp = comparisonSize
        ? comparisonSize + compareSizes.sharedByAllSize
        : undefined;

      const diff = cur - cmp;
      const cmpStr = () => {
        const diffKB = toKB(diff);

        if (cmp === undefined) {
          return "-";
        }

        if (diffKB === "0 kB") {
          return diffKB;
        }

        if (diff > 500) {
          return `${diffKB} :warning:`;
        }

        if (diff > 0) {
          return diffKB;
        }

        return `${diffKB} :purple_heart:`;
      };

      return `| ${route} | ${toKB(size)} | ${getPrettySize(
        cur
      )} | ${cmpStr()} |`;
    })
    .join("\n");

  const output = `# ${label}
First Load JS shared by all: ${toKB(sizes.sharedByAllSize)}
Middleware: ${getPrettySize(sizes.middlewareSize)}

| Route (app) | Size | First Load JS | Diff |
| --- | --- | --- | --- |
${routeSizes}

<!-- GH-BOT-${label} -->`;

  return output;
};

/**
 * Start here.
 */
const main = () => {
  const args = process.argv.slice(2);
  const label = args[1];
  const nextDir = `${process.cwd()}/${args[0] ?? "./.next"}`;

  // Bundle size analyzer has a bug which causes json output to be stored with an .html extension
  const clientJson = path.join(nextDir, "analyze", "client.html");
  const edgeJson = path.join(nextDir, "analyze", "edge.html");
  const compareJson = path.join(
    nextDir,
    "analyze",
    "comparision",
    `bundle-sizes.json`
  );

  const routes = loadJsonFile(
    path.join(nextDir, "app-path-routes-manifest.json")
  );
  const buildManifest = loadJsonFile(path.join(nextDir, "build-manifest.json"));
  const clientSizesJson = loadJsonFile(clientJson);
  const edgeSizesJson = loadJsonFile(edgeJson);

  const sizes = getPageSizes({
    routes,
    buildManifest,
    clientSizesJson,
    edgeSizesJson,
  });

  const compareSizesJson = fs.existsSync(compareJson)
    ? loadJsonFile(compareJson)
    : undefined;

  const table = produceMarkdownTable(sizes, compareSizesJson, label);

  fs.writeFileSync(path.join(nextDir, "analyze", "bundle-sizes.txt"), table);
  fs.writeFileSync(
    path.join(nextDir, "analyze", "bundle-sizes.json"),
    JSON.stringify(sizes)
  );
};

main();
