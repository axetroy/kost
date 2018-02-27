"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
const fs = require("fs-extra");
const path = require("path");
const path_1 = require("./path");
async function loadConfig() {
    const defaultConfigPath = path.join(path_1.paths.config, "default.config.yaml");
    const envConfigPath = path.join(path_1.paths.config, process.env.NODE_ENV + ".config.yaml");
    const defaultConfig = (await fs.pathExists(defaultConfigPath))
        ? yaml.safeLoad(await fs.readFile(defaultConfigPath, "utf8"))
        : {};
    const envConfig = (await fs.pathExists(envConfigPath))
        ? yaml.safeLoad(fs.readFileSync(envConfigPath, "utf8"))
        : {};
    const config = Object.assign(defaultConfig, envConfig);
    return config;
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=config.js.map