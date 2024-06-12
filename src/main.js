const common = require("../dist/index.js");
const fs = require("node:fs");
const { env } = require("node:process");
const filePath = common.filePath();

const https = require("node:https");

const repo = common.getRepo();
console.info("repo:", repo);

const tag = common.getTag();
console.info("tag:", tag);

console.info("filePath:", filePath);

const releasesApi = `https://api.github.com/repos/${repo}/releases/${tag}`;
console.info("api:", releasesApi);

const gh_token = env.INPUT_TOKEN || env.GITHUB_TOKEN || "";
const options = {
    headers: {
        "User-Agent": "curl/8.8",
        Authorization: `Bearer ${gh_token}`,
        Accept: "application/vnd.github+json",
        // "X-GitHub-Api-Version": "2022-11-28",
    },
};

https
    .get(releasesApi, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            fs.writeFileSync(filePath, data);
            console.info(`[INFO] The ${filePath} has been saved.`);
            fs.readFile(filePath, "utf8", (_e, data) => {
                const json = JSON.parse(data);
                fs.unlink(filePath, (e) => console.warn(e));
                if (json.message?.includes("Bad credentials")) {
                    throw Error(data);
                }

                const url = json.assets
                    .map((x) => x.browser_download_url)
                    .find(
                        (x) =>
                            common
                                .getInclude()
                                .every((str) => x.includes(str)) &&
                            (!common.getExclude() ||
                                common
                                    .getExclude()
                                    .every((str) => !x.includes(str))),
                    );

                const outputFile = common.writeToFile();
                if (outputFile) {
                    fs.writeFile(outputFile, url, (err) => {
                        if (err) throw err;
                    });
                    console.info("The url has been written to", outputFile);
                    return;
                }
                console.log(url);
                console.info(
                    'You can use ${{steps."step-id".outputs.url}} to get the output (please replace "step-id" with the specific id)',
                );

                common.setOutput(url);
            });
        });
    })
    .on("error", (err) => {
        console.error(`[ERROR] Pre Stage Error: ${err.message}`);
    });
