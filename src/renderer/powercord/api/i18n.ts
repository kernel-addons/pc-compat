import DiscordModules, {promise} from "@modules/discord";
import Events from "@modules/events";

promise.then(() => {
    const {LocaleManager, LocaleStore} = DiscordModules;
    if (!LocaleManager || !LocaleStore) return;

    locale = LocaleManager.getLocale() ?? 'en-US';

    const listener = () => {
        if (LocaleStore.locale !== locale) {
            locale = LocaleStore.locale;
            LocaleManager.loadPromise.then(injectStrings);
        }
    };

    LocaleStore.addChangeListener(listener);

    injectStrings();

    Events.addEventListener("reload-core", () => {
        LocaleStore.removeChangeListener(listener);
    });
});

export let messages = {};

export let locale = null;

export function loadAllStrings(strings: any) {
    if (!locale) return;
    for (let locale in strings) {
        loadStrings(locale, strings[locale]);
    }
};

export function loadStrings(locale: string, strings: any) {
    if (!locale) return;
    if (!messages[locale]) messages[locale] = {};

    Object.assign(messages[locale], strings);
    injectStrings();
};

export function injectStrings() {
    if (!locale || !DiscordModules.LocaleManager) return;

    const context = DiscordModules.LocaleManager._provider._context;

    Object.assign(context.messages, messages[locale]);
    Object.assign(context.defaultMessages, messages["en-US"]);
};