import Webpack from "@modules/webpack";

export const cache = new Map();

export default function DiscordIcon({name, ...props}) {
    const IconComponent = cache.get(name)
        ?? (cache.set(name, Webpack.findByDisplayName(name)), cache.get(name))
        ?? (() => null);

    return (
        <IconComponent {...props} />
    );
};