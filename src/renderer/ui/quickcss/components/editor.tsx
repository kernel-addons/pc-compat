import DiscordModules from "@modules/discord";
import {fs, path} from "@node";

export function getLanguage(filename: string) {
    if (!filename) return "";

    switch (path.extname(filename)) {
        case ".js": return "javascript";
        case ".scss":
        case ".sass": return "scss";
        case ".css": return "css";

        default: return filename.slice(1);
    }
};

export const cache = new Map();

export default function Editor({filename, onChange}) {
    const editorRef = DiscordModules.React.useRef();
    const containerRef = DiscordModules.React.useRef();
    const bindings = DiscordModules.React.useRef([]);
    
    DiscordModules.React.useEffect(() => {
        if (!containerRef.current) return;

        const value = (
            fs.existsSync(filename)
                ? cache.has(filename)
                    ? cache.get(filename)
                    : (cache.set(filename, fs.readFileSync(filename, "utf8")), cache.get(filename))
                : ""
        );

        const Editor = editorRef.current = (window as any).monaco.editor.create(containerRef.current, {
            value: value,
            language: getLanguage(filename),
            theme: "vs-dark"
        });

        bindings.current.push(Editor.onDidChangeModelContent(() => {
            const value = Editor.getValue();
            cache.set(filename, value);
            onChange(value);
        }));

        return () => {
            for (const binding of bindings.current) binding.dispose();
            Editor.dispose();
        };
    }, [containerRef, editorRef, filename]);

    DiscordModules.React.useEffect(() => {
        const listener = () => {
            if (!editorRef.current) return;

            editorRef.current.layout();
        };

        DiscordModules.Dispatcher.subscribe("PCCOMPAT_UPDATE_POSITION", listener);

        return () => {
            DiscordModules.Dispatcher.unsubscribe("PCCOMPAT_UPDATE_POSITION", listener);
        };
    });

    return (
        <div className="pc-editor" ref={containerRef} />
    );
}