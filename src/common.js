const action = require("@actions/core");
const process = require("node:process");

/**
 * @returns {string}
 */

function getRepo() {
    return action.getInput("repo").trim() || process.env.GITHUB_REPOSITORY;
}

module.exports.getRepo = getRepo;

/**
 * @returns {string}
 */
module.exports.getTag = () => action.getInput("tag").trim() || "latest";

/**
 * @returns {string[] | undefined}
 */
module.exports.getInclude = () =>
    action.getMultilineInput("include", { required: true });

/**
 * @returns {string[] | undefined}
 */
module.exports.getExclude = () =>
    action.getMultilineInput("exclude") || undefined;

/**
 * @returns {string | undefined}
 */
module.exports.writeToFile = () =>
    action.getInput("write-to-file") || undefined;

/**
 * Sets github actions output, key = "url", url = value
 *
 * @param {string} value
 */
function setUrlOutput(value) {
    return action.setOutput("url", value);
}

module.exports.setOutput = setUrlOutput;

/**
 * @returns {string}
 */
module.exports.filePath = () =>
    `.__${getRepo()?.replaceAll(/[^a-zA-Z0-9]/g, "_")}_tmp_gh_2024.json`;
