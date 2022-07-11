import {path} from "@node";

const constants = {
	WEBSITE: "https://github.com/strencher-kernel/pc-compat",
	I18N_WEBSITE: "https://example.com",
	REPO_URL: "strencher-kernel/pc-compat",

	SETTINGS_FOLDER: path.resolve(PCCompatNative.getBasePath(), "config"),
	CACHE_FOLDER: null,
	LOGS_FOLDER: null,

	DISCORD_INVITE: "8mPTjTZ4SZ",
	GUILD_ID: "891039687785996328",
	SpecialChannels: {
		KNOWN_ISSUES:         "891039688352219198",
		SUPPORT_INSTALLATION: "891053581136982056",
		SUPPORT_PLUGINS:      "891053581136982056",
		SUPPORT_MISC:         "891053581136982056",

		STORE_PLUGINS:        "649571600764633088", //TODO: find Kernel equivalent
		STORE_THEMES:         "649571547350302741", //TODO: find Kernel equivalent
		CSS_SNIPPETS:         "755005803303403570", //TODO: find Kernel equivalent
		JS_SNIPPETS:          "896214131525443635"
	}
};

export default constants;
