import DiscordModules, {promise} from "../../modules/discord";

promise.then(() => {
    const {LocaleManager, Dispatcher, Constants: {ActionTypes}} = DiscordModules;

    locale = LocaleManager.getLocale();

    Dispatcher.subscribe(ActionTypes.USER_SETTINGS_UPDATE, () => {
        const partialLocale = LocaleManager.getLocale();

        if (partialLocale !== locale) {
            locale = partialLocale;
            LocaleManager.loadPromise.then(injectStrings);
        }
    });
});

export let messages = {};

export let locale = null;


export function loadAllStrings(strings: any) {
    for (let locale in strings) {
        loadStrings(locale, strings[locale]);
    }
};

export function loadStrings(locale: string, strings: any) {
    if (!messages[locale]) messages[locale] = {};

    Object.assign(messages[locale], strings);
    injectStrings();
};

export function injectStrings() {
    if (!DiscordModules.LocaleManager) return;

    const context = DiscordModules.LocaleManager._provider._context;

    Object.assign(context.messages, messages[locale]);
    Object.assign(context.defaultMessages, messages["en-US"]);
};