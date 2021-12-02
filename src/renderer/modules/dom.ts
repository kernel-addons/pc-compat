import memoize from "./memoize";

export default class DOM {
    static elements = {};

    static get head() {return memoize(this, "head", document.head.appendChild(this.createElement("pc-head")));}

    static createElement(type: string, options = {}, ...children: (string | Node)[]) {
        const node = Object.assign(document.createElement(type), options);

        node.append(...children);

        return node;
    }

    static injectCSS(id: string, cssOrURL: string, options?: {type: "PLAIN" | "URL", documentHead?: boolean}) {
        switch (options?.type ?? "PLAIN") {
            case "PLAIN":
                var element = this.createElement("style", {
                    id,
                    textContent: cssOrURL
                });
                break;
            case "URL":
                var element = this.createElement("link", {
                    rel: "stylesheet",
                    href: cssOrURL
                });
                break;
        }

        (options?.documentHead ? document.head : this.head).appendChild(element);
        this.elements[id] = element;

        return element;
    }

    static injectJS(id: string, url: string, options?: {documentHead: boolean}) {
        return new Promise((resolve, reject) => {
            const script = this.createElement("script", {id, src: url, onload: resolve, onerror: reject});
            (options?.documentHead ? document.head : this.head).appendChild(script);
            this.elements[id] = script;
        });
    }

    static getElement(id: string) {
        return this.elements[id] || this.head.querySelector(`style[id="${id}"]`);
    }

    static clearCSS(id: string) {
        const element = this.getElement(id);
        
        if (element) element.remove();
        delete this.elements[id];
    }
}