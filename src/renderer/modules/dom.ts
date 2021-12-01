import memoize from "./memoize";

export default class DOM {
    static elements = {};

    static get head() {return memoize(this, "head", document.head.appendChild(this.createElement("pc-head")));}

    static createElement(type: string, options = {}, ...children: (string | Node)[]) {
        const node = Object.assign(document.createElement(type), options);

        node.append(...children);

        return node;
    }

    static injectCSS(id: string, css: string) {
        const element = this.createElement("style", {
            id,
            textContent: css
        });

        this.head.appendChild(element);
        this.elements[id] = element;

        return element;
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