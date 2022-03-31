const { runTypeChain, glob } = require("typechain");

async function main() {
  const cwd = process.cwd();
  // find all files matching the glob
  const allFiles = glob(cwd, ["./build/+([a-zA-Z0-9_]).json"]);
  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: "typings/",
    target: "web3-v1",
  });
}

main().catch(console.error);
