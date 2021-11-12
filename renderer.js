function _classPrivateFieldGet(receiver, privateMap) {
	if (!privateMap.has(receiver)) {
		throw new TypeError("attempted to get private field on non-instance");
	}
	return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
	if (!privateMap.has(receiver)) {
		throw new TypeError("attempted to set private field on non-instance");
	}
	var descriptor = privateMap.get(receiver);
	if (!descriptor.writable) {
		throw new TypeError("attempted to set read only private field");
	}
	descriptor.value = value;
	return value;
}
if (typeof Array.prototype.at !== "function") {
	Array.prototype.at = function(index) {
		return index < 0 ? this[this.length - Math.abs(index)] : this[index];
	};
}
const Events = {
	CREATE: "CREATE",
	LENGTH_CHANGE: "LENGTH_CHANGE",
	PUSH: "PUSH",
	LOADED: "LOADED"
};
class WebpackModule {
	get id() {
		return "kernel-req" + Math.random().toString().slice(2, 5);
	}
	dispatch(event4, ...args1) {
		if (!(event4 in _classPrivateFieldGet(this, _events)))
			throw new Error(`Unknown Event: ${event4}`);
		_classPrivateFieldGet(this, _events)[event4].forEach((callback) => {
			try {
				callback(...args1);
			} catch (err) {
				console.error(err);
			}
		});
	}
	on(event1, callback) {
		if (!(event1 in _classPrivateFieldGet(this, _events)))
			throw new Error(`Unknown Event: ${event1}`);
		return _classPrivateFieldGet(this, _events)[event1].add(callback), () => this.off(event1, callback);
	}
	off(event2, callback1) {
		if (!(event2 in _classPrivateFieldGet(this, _events)))
			throw new Error(`Unknown Event: ${event2}`);
		return _classPrivateFieldGet(this, _events)[event2].delete(callback1);
	}
	once(event3, callback2) {
		const unlisten = this.on(event3, (...args) => {
			unlisten();
			callback2(...args);
		});
	}
	get webpackLength() {
		return this.webpackNamespace ? this.webpackNamespace.flat(10).length : 0;
	}
	get webpackNamespace() {
		return window.webpackJsonp || window.webpackChunkdiscord_app;
	}
	wait(callback3) {
		return new Promise((resolve) => {
			this.once(Events.LOADED, () => {
				resolve();
				typeof callback3 === "function" && callback3();
			});
		});
	}
	get whenReady() {
		return this.wait();
	}
	request(cache) {
		if (cache && _classPrivateFieldGet(this, __cache$1)) return _classPrivateFieldGet(this, __cache$1);
		let req1 = void 0;
		if ("webpackJsonp" in window && !webpackJsonp.__polyfill) {
			req1 = window.webpackJsonp.push([
				[],
				{
					[this.id]: (module, exports, req) => module.exports = req
				},
				[
					[
						this.id
					]
				]
			]);
		} else if ("webpackChunkdiscord_app" in window) {
			window.webpackChunkdiscord_app.push([
				[
					this.id
				],
				{
				},
				(__webpack_require__) => req1 = __webpack_require__
			]);
		}
		_classPrivateFieldSet(this, __cache$1, req1);
		return req1;
	}
	findModule(filter2, all = false, cache1 = true) {
		const __webpack_require__ = this.request(cache1);
		const found = [];
		const wrapFilter = (module) => {
			try {
				return filter2(module);
			} catch (e) {
				return false;
			}
		};
		for (let i in __webpack_require__.c) {
			var m = __webpack_require__.c[i].exports;
			if ((typeof m == "object" || typeof m == "function") && wrapFilter(m)) found.push(m);
			if (m === null || m === void 0 ? void 0 : m.__esModule) {
				for (let j in m)
					if ((typeof m[j] == "object" || typeof m[j] == "function") && wrapFilter(m[j])) found.push(m[j]);
			}
		}
		return all ? found : found.at(0);
	}
	findModules(filter1) {
		return this.findModule(filter1, true);
	}
	bulk(...filters) {
		const hasOptions = typeof filters.at(-1) === "boolean";
		const found = new Array(filters.length - (hasOptions ? -1 : 0));
		const cache = hasOptions && filters.pop();
		this.findModule((module) => {
			const matches = filters.filter((filter) => {
				try {
					return filter(module);
				} catch (e) {
					return false;
				}
			});
			if (!matches.length) return false;
			for (const filter3 of matches) {
				found[filters.indexOf(filter3)] = module;
			}
			return false;
		}, false, cache);
		return found;
	}
	findByProps(...props1) {
		const hasOptions = typeof props1.at(-1) === "object" && props1.at(-1) != null && props1.at(-1);
		const {bulk =false, cache =true} = hasOptions && props1.pop() || {
		};
		const filter = (props, module) => module && props.every((prop) => prop in module
		);
		return bulk ? this.bulk(...props1.map((props) => filter.bind(null, props)
		).concat(cache)) : this.findModule(filter.bind(null, props1), false, cache);
	}
	findByDisplayName(...displayName) {
		const hasOptions = typeof displayName.at(-1) === "object" && displayName.at(-1) != null;
		const {bulk =false, default: defaultExport = false, cache =true} = hasOptions && displayName.pop() || {
		};
		const filter = (name, module) => {
			var ref;
			return defaultExport ? (module === null || module === void 0 ? void 0 : (ref = module.default) === null || ref === void 0 ? void 0 : ref.displayName) === name : (module === null || module === void 0 ? void 0 : module.displayName) === name;
		};
		return bulk ? this.bulk(...[
			...displayName.map((name) => filter.bind(null, name)
			),
			cache
		]) : this.findModule(filter.bind(null, displayName[0]), false, cache);
	}
	constructor() {
		__cache$1.set(this, {
			writable: true,
			value: null
		});
		_events.set(this, {
			writable: true,
			value: Object.fromEntries(Object.keys(Events).map((key) => [
				key,
				new Set()
			]
			))
		});
		Object.defineProperty(window, "webpackChunkdiscord_app", {
			get() {
				return void 0;
			},
			set: (value) => {
				this.dispatch(Events.CREATE);
				const originalPush = value.push;
				value.push = (...values) => {
					this.dispatch(Events.LENGTH_CHANGE, value.length + values.length);
					this.dispatch(Events.PUSH, values);
					return Reflect.apply(originalPush, value, values);
				};
				Object.defineProperty(window, "webpackChunkdiscord_app", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			configurable: true
		});
		let listener = (shouldUnsubscribe, Dispatcher, ActionTypes, event) => {
			if ((event === null || event === void 0 ? void 0 : event.event) !== "app_ui_viewed") return;
			if (shouldUnsubscribe) {
				Dispatcher.unsubscribe(ActionTypes.CONNECTION_OPEN, listener);
			}
			this.dispatch(Events.LOADED);
		};
		const unlisten = this.on(Events.LENGTH_CHANGE, (length) => {
			if (length < 25) return;
			unlisten();
			const [Dispatcher, Constants] = this.findByProps([
				"dirtyDispatch"
			], [
				"API_HOST",
				"ActionTypes"
			], {
				cache: false,
				bulk: true
			});
			Dispatcher.subscribe(Constants.ActionTypes.TRACK, listener = listener.bind(null, true, Dispatcher, Constants.ActionTypes));
		});
	}
}
var __cache$1 = new WeakMap();
var _events = new WeakMap();
var _Webpack;
const Webpack = (_Webpack = window.Webpack) !== null && _Webpack !== void 0 ? _Webpack : window.Webpack = new WebpackModule;

// Main
const COMPILE_SASS = "pccompat-compile-sass";
const COMPILE_JSX = "pccompat-compile-jsx";
// Preload
const EXPOSE_PROCESS_GLOBAL = "pccompat-expose-process-global";

class fs {
	static readFileSync(path, options = "utf8") {
		return PCCompatNative.executeJS(`require("fs").readFileSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
	}
	static writeFileSync(path1, data, options1) {
		return PCCompatNative.executeJS(`require("fs").writeFileSync(${JSON.stringify(path1)}, ${JSON.stringify(data)}, ${JSON.stringify(options1)})`);
	}
	static writeFile(path2, data1, options2, callback) {
		if (typeof options2 === "function") {
			callback = options2;
			options2 = null;
		}
		const ret = {
			error: null
		};
		try {
			this.writeFileSync(path2, data1, options2);
		} catch (error) {
			ret.error = error;
		}
		callback(ret.error);
	}
	static readdirSync(path3, options3) {
		return PCCompatNative.executeJS(`require("fs").readdirSync(${JSON.stringify(path3)}, ${JSON.stringify(options3)});`);
	}
	static existsSync(path4) {
		return PCCompatNative.executeJS(`require("fs").existsSync(${JSON.stringify(path4)});`);
	}
	static mkdirSync(path5, options4) {
		return PCCompatNative.executeJS(`require("fs").mkdirSync(${JSON.stringify(path5)}, ${JSON.stringify(options4)});`);
	}
	static statSync(path6, options5) {
		return PCCompatNative.executeJS(`
            const stats = require("fs").statSync(${JSON.stringify(path6)}, ${JSON.stringify(options5)});
            const ret = {
                ...stats,
                isFile: () => stats.isFile(),
                isDirectory: () => stats.isDirectory()
            };
            ret
        `);
	}
	static watch(path7, options6, callback1) {
		if (typeof options6 === "function") {
			callback1 = options6;
			options6 = null;
		}
		const eventId = "bdcompat-watcher-" + Math.random().toString(36).slice(2, 10);
		PCCompatNative.IPC.on(eventId, (event, filename) => {
			callback1(event, filename);
		});
		return PCCompatNative.executeJS(`
            require("fs").watch(${JSON.stringify(path7)}, ${JSON.stringify(options6)}, (event, filename) => {
                PCCompatNative.IPC.dispatch(${JSON.stringify(eventId)}, event, filename);
            });
        `);
	}
}

const path = PCCompatNative.executeJS(`require("path")`);

function memoize(target, key, getter) {
	const value = getter();
	Object.defineProperty(target, key, {
		value: value,
		configurable: true
	});
	return value;
}

class DiscordModules {
	static get React() {
		return memoize(this, "React", () => Webpack.findByProps("createElement", "createContext")
		);
	}
	static get ReactDOM() {
		return memoize(this, "ReactDOM", () => Webpack.findByProps("findDOMNode", "render", "createPortal")
		);
	}
	static get Flux() {
		return memoize(this, "Flux", () => Webpack.findByProps([
			"Store",
			"Dispatcher"
		], [
			"connectStores"
		], {
			bulk: true
		}).reduce((modules, module) => Object.assign(modules, module)
			, {
			})
		);
	}
	static get Dispatcher() {
		return memoize(this, "Dispatcher", () => Webpack.findByProps("dirtyDispatch")
		);
	}
	static get TextInput() {
		return memoize(this, "TextInput", () => Webpack.findByDisplayName("TextInput")
		);
	}
	static get Forms() {
		return memoize(this, "Forms", () => Webpack.findByProps("FormItem")
		);
	}
	static get ContextMenuActions() {
		return memoize(this, "ContextMenuActions", () => Webpack.findByProps("openContextMenu")
		);
	}
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time)
	);
}
function random(length = 10) {
	return Math.random().toString(36).slice(2, length + 2);
}
function getProps(obj, path) {
	if (!path) return obj;
	return path.split(".").reduce((value, key) => value && value[key]
		, obj);
}
const createUpdateWrapper = (Component, valueProp = "value", changeProp = "onChange", valueProps = "0", valueIndex = 0) => (props) => {
	const [value1, setValue] = DiscordModules.React.useState(props[valueProp]);
	return DiscordModules.React.createElement(Component, {
		...props,
		[valueProp]: value1,
		[changeProp]: (...args) => {
			const value = getProps(args, valueProps);
			if (typeof props[changeProp] === "function") props[changeProp](args[valueIndex]);
			setValue(value);
		}
	});
};

class DOM {
	static get head() {
		return memoize(this, "head", () => document.head.appendChild(this.createElement("pc-head"))
		);
	}
	static createElement(type, options = {
		}, ...children) {
		const node = Object.assign(document.createElement(type), options);
		node.append(...children);
		return node;
	}
	static injectCSS(id, css) {
		const element = this.createElement("style", {
			id,
			textContent: css
		});
		this.head.appendChild(element);
		this.elements[id] = element;
		return element;
	}
	static getElement(id1) {
		return this.elements[id1] || this.head.querySelector(`style[id="${id1}"]`);
	}
	static clearCSS(id2) {
		const element = this.getElement(id2);
		if (element) element.remove();
		delete this.elements[id2];
	}
}
DOM.elements = {
};

function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
	_classCheckPrivateStaticAccess(receiver, classConstructor);
	return method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
	if (receiver !== classConstructor) {
		throw new TypeError("Private static access of wrong provenance");
	}
}
class Logger {
	static _log(type1, module, ...message) {
		console[_classStaticPrivateMethodGet(this, Logger, parseType).call(Logger, type1)](`%c[Powercord:${module}]%c`, "color: #7289da; font-weight: 700;", "", ...message);
	}
	static log(module1, ...message1) {
		this._log("log", module1, ...message1);
	}
	static info(module2, ...message2) {
		this._log("info", module2, ...message2);
	}
	static warn(module3, ...message3) {
		this._log("warn", module3, ...message3);
	}
	static error(module4, ...message4) {
		this._log("error", module4, ...message4);
	}
}
function parseType(type) {
	switch (type) {
		case "info":
		case "warn":
		case "error":
			return type;
		default:
			return "log";
	}
}

class Store {
	has(event) {
		return event in this.events;
	}
	on(event1, listener) {
		if (!this.has(event1))
			this.events[event1] = new Set();
		this.events[event1].add(listener);
		return () => void this.off(event1, listener);
	}
	off(event2, listener1) {
		if (!this.has(event2)) return;
		return this.events[event2].delete(listener1);
	}
	emit(event3, ...args) {
		if (!this.has(event3)) return;
		for (const listener of this.events[event3]) {
			try {
				listener(...args);
			} catch (error) {
				Logger.error(`Store:${this.constructor.name}`, error);
			}
		}
	}
	useEvent(event4, listener2) {
		const [state, setState] = DiscordModules.React.useState(listener2());
		DiscordModules.React.useEffect(() => {
			return this.on(event4, () => setState(listener2())
			);
		}, [
			event4,
			listener2
		]);
		return state;
	}
	constructor() {
		this.events = {
		};
	}
}

const ipcRenderer = PCCompatNative.executeJS(`Object.keys(require("electron").ipcRenderer)`).slice(3).reduce((newElectron, key) => {
	newElectron[key] = PCCompatNative.executeJS(`require("electron").ipcRenderer[${JSON.stringify(key)}].bind(require("electron").ipcRenderer)`);
	return newElectron;
}, {
});
const shell = PCCompatNative.executeJS(`require("electron").shell`);
const electron = {
	ipcRenderer,
	shell
};

const DataStore = new class DataStore extends Store {
	tryLoadData(name) {
		try {
			const location = path.resolve(this.configFolder, `${name}.json`);
			if (!fs.existsSync(location)) return {
				};
			return Require(location);
		} catch (error) {
			Logger.error("DataStore", `Data of ${name} corrupt:`, error);
		}
	}
	trySaveData(name1, data, emit) {
		try {
			fs.writeFileSync(path.resolve(this.configFolder, `${name1}.json`), JSON.stringify(data, null, "\t"), "utf8");
		} catch (error) {
			Logger.error("DataStore", `Failed to save data of ${name1}:`, error);
		}
		if (emit) this.emit("data-update", name1, data);
	}
	getMisc(misc = "", def) {
		var ref;
		return (ref = getProps(this.tryLoadData("misc"), misc)) !== null && ref !== void 0 ? ref : def;
	}
	setMisc(misc1 = this.getMisc("", {
		}), prop, value) {
		this.trySaveData("misc", _.set(misc1, prop.split("."), value));
		this.emit("misc");
	}
	constructor(...args) {
		super(...args);
		this.baseDir = path.resolve(PCCompatNative.executeJS("__dirname"));
		this.configFolder = path.resolve(this.baseDir, "config");
	}
};

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
	if (receiver !== classConstructor) {
		throw new TypeError("Private static access of wrong provenance");
	}
	return descriptor.value;
}
class Components$1 {
	static byProps(...props) {
		const name = props.join(":");
		if (_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name]) return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
		_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name] = Webpack.findModule((m) => props.every((p) => p in m
			) && ("default" in m ? true : typeof m === "function")
		);
		return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
	}
	static get(name, filter = (_) => _
	) {
		if (_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name]) return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
		_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name] = Webpack.findModule((m) => m.displayName === name && filter(m)
		);
		return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
	}
}
var __cache = {
	writable: true,
	value: {
	}
};

class Modals {
	static get ModalsAPI() {
		return memoize(this, "ModalsAPI", () => Webpack.findByProps("openModal", "useModalsStore")
		);
	}
	static get ModalComponents() {
		return memoize(this, "ModalComponents", () => Webpack.findByProps("ModalRoot", "ModalHeader")
		);
	}
	static get Forms() {
		return memoize(this, "Forms", () => Webpack.findByProps("FormTitle", "FormItem")
		);
	}
	static get Button() {
		return memoize(this, "Button", () => Webpack.findByProps("DropdownSizes")
		);
	}
	static get ConfirmationModal() {
		return memoize(this, "ConfirmationModal", () => Webpack.findByDisplayName("ConfirmModal")
		);
	}
	static get Text() {
		return memoize(this, "Text", () => Webpack.findByDisplayName("Text")
		);
	}
	static showConfirmationModal(title, content, options = {
		}) {
		const {confirmText ="Okay", cancelText ="Cancel", onConfirm =() => {}, onCancel =() => {}} = options;
		return this.ModalsAPI.openModal((props) => DiscordModules.React.createElement(this.ConfirmationModal, Object.assign({
			header: title,
			confirmText: confirmText,
			cancelText: cancelText,
			onConfirm,
			onCancel
		}, props), DiscordModules.React.createElement(this.Text, null, content))
		);
	}
	static alert(title1, content1) {
		return this.showConfirmationModal(title1, content1, {
			cancelText: null
		});
	}
}

function _extends$4() {
	_extends$4 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	return _extends$4.apply(this, arguments);
}
function Icon({name, ...props}) {
	const Component = Components$1.get(name);
	if (!Components$1) return null;
	return ( /*#__PURE__*/ React.createElement(Component, _extends$4({
	}, props)));
}
function ToolButton({label, icon, onClick, danger =false, disabled =false}) {
	const Button = Components$1.byProps("DropdownSizes");
	const Tooltip = Components$1.get("Tooltip");
	return ( /*#__PURE__*/ React.createElement(Tooltip, {
		text: label,
		position: "top"
	}, (props) => /*#__PURE__*/ React.createElement(Button, _extends$4({
	}, props, {
		className: "pc-settings-toolbutton",
		look: Button.Looks.BLANK,
		size: Button.Sizes.NONE,
		onClick: onClick,
		disabled: disabled
	}), /*#__PURE__*/ React.createElement(Icon, {
		name: icon,
		color: danger ? "#ed4245" : void 0,
		width: "20",
		height: "20"
	}))
	));
}
function ButtonWrapper({value, onChange, disabled =false}) {
	const [isChecked, setChecked] = React.useState(value);
	const Switch = Components$1.get("Switch");
	return ( /*#__PURE__*/ React.createElement(Switch, {
		checked: isChecked,
		disabled: disabled,
		onChange: () => {
			onChange(!isChecked);
			setChecked(!isChecked);
		}
	}));
}
function AddonCard({addon, manager, openSettings, hasSettings, type}) {
	var ref,
		ref1;
	const Markdown = Components$1.get("Markdown", (e) => "rules" in e
	);
	const [, forceUpdate] = React.useReducer((n) => n + 1
		, 0);
	React.useEffect(() => {
		manager.on("toggle", (name) => {
			if (name !== addon.entityID) return;
			forceUpdate();
		});
	}, [
		addon,
		manager
	]);
	var ref2;
	return ( /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-addon-card " + ((ref = addon.manifest.name) === null || ref === void 0 ? void 0 : ref.replace(/ /g, "-"))
	}, /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-card-tools"
	}, /*#__PURE__*/ React.createElement(ToolButton, {
		label: "Reload",
		icon: "Replay",
		onClick: () => manager.reload(addon),
		disabled: true
	}), /*#__PURE__*/ React.createElement(ToolButton, {
		label: "Open Path",
		icon: "Folder",
		onClick: () => {
			PCCompatNative.executeJS(`require("electron").shell.showItemInFolder(${JSON.stringify(addon.path)})`);
		},
		disabled: true
	}), /*#__PURE__*/ React.createElement(ToolButton, {
		label: "Delete",
		icon: "Trash",
		danger: true,
		onClick: () => {
			Modals.showConfirmationModal("Are you sure?", `Are you sure that you want to delete the ${type} "${addon.manifest.name}"?`, {
				onConfirm: () => {
					PCCompatNative.executeJS(`require("electron").shell.trashItem(${JSON.stringify(addon.path)})`);
				}
			});
		}
	})), /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-card-header"
	}, /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-card-field pc-settings-card-name"
	}, addon.manifest.name), "version" in addon.manifest && /*#__PURE__*/ React.createElement("div", {
			className: "pc-settings-card-field"
		}, "v", addon.manifest.version), "author" in addon.manifest && /*#__PURE__*/ React.createElement("div", {
			className: "pc-settings-card-field"
		}, " by ", addon.manifest.author)), addon.manifest.description && /*#__PURE__*/ React.createElement("div", {
			className: "pc-settings-card-desc"
		}, /*#__PURE__*/ React.createElement(Markdown, null, addon.manifest.description)), /*#__PURE__*/ React.createElement("div", {
			className: "pc-settings-card-footer"
		}, /*#__PURE__*/ React.createElement(ButtonWrapper, {
			value: (ref2 = (ref1 = manager.isEnabled) === null || ref1 === void 0 ? void 0 : ref1.call(manager, addon)) !== null && ref2 !== void 0 ? ref2 : false,
			onChange: () => {
				manager.toggle(addon);
			}
		}))));
}

function _extends$3() {
	_extends$3 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
const sortLabels = [
	"name",
	"author",
	"version",
	"description",
	"added"
];
const searchLabels = [
	"name",
	"author",
	"description"
];
const orderLabels = [
	"ascending",
	"descending"
];
async function sortAddons(addons, order, query, searchOptions, sortBy) {
	console.log({
		order,
		query,
		searchOptions
	});
	return addons.filter((addon) => {
		if (!query) return true;
		const {manifest} = addon;
		var _type;
		// Use String() wrapper for clever escaping
		return [
			"name",
			"author",
			"description"
		].some((type) => searchOptions[type] && ~String((_type = manifest[type]) !== null && _type !== void 0 ? _type : "").toLowerCase().indexOf(query)
		);
	}).sort((a, b) => {
		var _sortBy;
		const first = (_sortBy = a.manifest[sortBy]) !== null && _sortBy !== void 0 ? _sortBy : "";
		var _sortBy1;
		const second = (_sortBy1 = b.manifest[sortBy]) !== null && _sortBy1 !== void 0 ? _sortBy1 : "";
		if (typeof first === "string") return String(first).toLowerCase().localeCompare(String(second).toLowerCase());
		if (first > second) return 1;
		if (second > first) return -1;
		return 0;
	})[order === "ascending" ? "reverse" : "slice"](0);
}
function OverflowContextMenu({type: addonType}) {
	const {default: ContextMenu, MenuRadioItem, MenuCheckboxItem, MenuControlItem, MenuSeparator, MenuGroup} = Components$1.byProps("MenuItem", "default");
	const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
		DataStore.getMisc(`${addonType}.sortBy`, "name"),
		DataStore.getMisc(`${addonType}.searchOption`, {
		}),
		DataStore.getMisc(`${addonType}.order`, "descending")
	]
	);
	var _type1;
	return ( /*#__PURE__*/ React.createElement(ContextMenu, {
		navId: "OverflowContextMenu"
	}, /*#__PURE__*/ React.createElement(MenuControlItem, {
		id: "order-header",
		control: () => /*#__PURE__*/ React.createElement("h5", {
			className: "pc-settings-overflow-header"
		}, "Order")
	}), /*#__PURE__*/ React.createElement(MenuSeparator, {
		key: "separator"
	}), /*#__PURE__*/ React.createElement(MenuGroup, null, orderLabels.map((type) => /*#__PURE__*/ React.createElement(MenuRadioItem, {
		key: "order-" + type,
		label: type[0].toUpperCase() + type.slice(1),
		checked: order === type,
		id: "sortBy-" + type,
		action: () => {
			DataStore.setMisc(void 0, `${addonType}.order`, type);
		}
	})
	)), /*#__PURE__*/ React.createElement(MenuSeparator, {
		key: "separator"
	}), /*#__PURE__*/ React.createElement(MenuControlItem, {
		id: "sort-header",
		control: () => /*#__PURE__*/ React.createElement("h5", {
			className: "pc-settings-overflow-header"
		}, "Sort Options")
	}), /*#__PURE__*/ React.createElement(MenuSeparator, {
		key: "separator"
	}), /*#__PURE__*/ React.createElement(MenuGroup, null, sortLabels.map((type) => /*#__PURE__*/ React.createElement(MenuRadioItem, {
		key: "sortBy-" + type,
		label: type[0].toUpperCase() + type.slice(1),
		checked: sortBy === type,
		id: "sortBy-" + type,
		action: () => {
			DataStore.setMisc(void 0, `${addonType}.sortBy`, type);
		}
	})
	)), /*#__PURE__*/ React.createElement(MenuSeparator, {
		key: "separator"
	}), /*#__PURE__*/ React.createElement(MenuControlItem, {
		id: "search-header",
		control: () => /*#__PURE__*/ React.createElement("h5", {
			className: "pc-settings-overflow-header"
		}, "Search Options")
	}), /*#__PURE__*/ React.createElement(MenuSeparator, {
		key: "separator"
	}), /*#__PURE__*/ React.createElement(MenuGroup, null, searchLabels.map((type) => /*#__PURE__*/ React.createElement(MenuCheckboxItem, {
		key: "search-" + type,
		id: "search-" + type,
		label: type[0].toUpperCase() + type.slice(1),
		checked: (_type1 = searchOptions[type]) !== null && _type1 !== void 0 ? _type1 : true,
		action: () => {
			var _type;
			DataStore.setMisc(void 0, `${addonType}.searchOption.${type}`, !((_type = searchOptions[type]) !== null && _type !== void 0 ? _type : true));
		}
	})
	))));
}
function AddonPanel({manager, type}) {
	const {React: React1} = DiscordModules;
	const [query, setQuery] = React1.useState("");
	const [addons1, setAddons] = React1.useState(null);
	const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
		DataStore.getMisc(`${type}.sortBy`, "name"),
		DataStore.getMisc(`${type}.searchOption`, {
		}),
		DataStore.getMisc(`${type}.order`, "descending")
	]
	);
	const {ContextMenuActions} = DiscordModules;
	const SearchBar = Components$1.get("SearchBar");
	const Spinner = Components$1.get("Spinner");
	const OverflowMenu = Components$1.get("OverflowMenu");
	const Tooltip = Components$1.get("Tooltip");
	const Button = Components$1.byProps("DropdownSizes");
	// const classes = Components.byProps("");
	React1.useEffect(() => {
		sortAddons(Array.from(manager.addons), order !== null && order !== void 0 ? order : "descending", query, searchOptions !== null && searchOptions !== void 0 ? searchOptions : {
			author: true,
			name: true,
			description: true
		}, sortBy).then((addons) => setAddons(addons)
		);
	}, [
		query,
		manager,
		type,
		order,
		searchOptions,
		sortBy
	]);
	return ( /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-addons"
	}, /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-addons-controls"
	}, /*#__PURE__*/ React.createElement(SearchBar, {
		// @ts-ignore
		onQueryChange: (value) => setQuery(value),
		onClear: () => setQuery(""),
		placeholder: `Search ${type}s...`,
		size: SearchBar.Sizes.SMALL,
		query: query,
		className: "pc-settings-addons-search"
	}), /*#__PURE__*/ React.createElement(Tooltip, {
		text: "Options",
		position: "bottom"
	}, (props) => /*#__PURE__*/ React.createElement(Button, _extends$3({
	}, props, {
		size: Button.Sizes.NONE,
		look: Button.Looks.BLANK,
		className: "pc-settings-overflow-menu",
		onClick: (e) => {
			ContextMenuActions.openContextMenu(e, () => /*#__PURE__*/ React.createElement(OverflowContextMenu, {
				type: type
			})
			);
		}
	}), /*#__PURE__*/ React.createElement(OverflowMenu, null))
	)), /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-card-scroller"
	}, addons1 ? addons1.map((addon) => /*#__PURE__*/ React.createElement(AddonCard, {
		addon: addon,
		hasSettings: false,
		manager: manager,
		type: type,
		key: addon.manifest.name,
		openSettings: () => {}
	})
	) : /*#__PURE__*/ React.createElement(Spinner, {
		type: Spinner.Type.WANDERING_CUBES
	}))));
}

class Patcher {
	static getPatchesByCaller(id) {
		if (!id) return [];
		const patches = [];
		for (const patch of this._patches)
			for (const childPatch of patch.children)
				if (childPatch.caller === id) patches.push(childPatch);
		return patches;
	}
	static unpatchAll(caller) {
		const patches = this.getPatchesByCaller(caller);
		if (!patches.length) return;
		for (const patch of patches) patch.unpatch();
	}
	static makeOverride(patch) {
		return function() {
			var ref;
			let returnValue;
			if (!(patch === null || patch === void 0 ? void 0 : (ref = patch.children) === null || ref === void 0 ? void 0 : ref.length)) return patch.originalFunction.apply(this, arguments);
			for (const beforePatch of patch.children.filter((e) => e.type === "before"
			)) {
				try {
					const tempReturn = beforePatch.callback(this, arguments, patch.originalFunction.bind(this));
					if (tempReturn != undefined)
						returnValue = tempReturn;
				} catch (error) {
					console.error("Patch:" + patch.functionName, error);
				}
			}
			const insteadPatches = patch.children.filter((e) => e.type === "instead"
			);
			if (!insteadPatches.length)
				returnValue = patch.originalFunction.apply(this, arguments);
			else
				for (const insteadPatch of insteadPatches) {
					try {
						const tempReturn = insteadPatch.callback(this, arguments, patch.originalFunction.bind(this));
						if (tempReturn != undefined)
							returnValue = tempReturn;
					} catch (error) {
						console.error("Patch:" + patch.functionName, error);
					}
			}
			for (const afterPatch of patch.children.filter((e) => e.type === "after"
			)) {
				try {
					const tempReturn = afterPatch.callback(this, arguments, returnValue, (ret) => returnValue = ret
					);
					if (tempReturn != undefined)
						returnValue = tempReturn;
				} catch (error) {
					console.error("Patch:" + patch.functionName, error);
				}
			}
			return returnValue;
		};
	}
	static pushPatch(caller1, module, functionName) {
		const patch = {
			caller: caller1,
			module,
			functionName,
			originalFunction: module[functionName],
			undo: () => {
				patch.module[patch.functionName] = patch.originalFunction;
				patch.children = [];
			},
			count: 0,
			children: []
		};
		module[functionName] = this.makeOverride(patch);
		return this._patches.push(patch), patch;
	}
	static doPatch(caller2, module1, functionName1, callback, type = "after", options = {
		}) {
		let {displayName} = options;
		var ref;
		const patch = (ref = this._patches.find((e) => e.module === module1 && e.functionName === functionName1
		)) !== null && ref !== void 0 ? ref : this.pushPatch(caller2, module1, functionName1);
		if (typeof displayName !== "string") displayName || module1.displayName || module1.name || module1.constructor.displayName || module1.constructor.name;
		const child = {
			caller: caller2,
			type,
			id: patch.count,
			callback,
			unpatch: () => {
				patch.children.splice(patch.children.findIndex((cpatch) => cpatch.id === child.id && cpatch.type === type
				), 1);
				if (patch.children.length <= 0) {
					const patchNum = this._patches.findIndex((p) => p.module == module1 && p.functionName == functionName1
					);
					this._patches[patchNum].undo();
					this._patches.splice(patchNum, 1);
				}
			}
		};
		patch.children.push(child);
		patch.count++;
		return child.unpatch;
	}
	static before(caller3, module2, functionName2, callback1) {
		return this.doPatch(caller3, module2, functionName2, callback1, "before");
	}
	static after(caller4, module3, functionName3, callback2) {
		return this.doPatch(caller4, module3, functionName3, callback2, "after");
	}
	static instead(caller5, module4, functionName4, callback3) {
		return this.doPatch(caller5, module4, functionName4, callback3, "instead");
	}
}
Patcher._patches = [];

function SettingsPanel({store, name, children, header =null}) {
	const [, forceUpdate] = DiscordModules.React.useReducer((n) => n + 1
		, 0);
	DiscordModules.React.useEffect(() => {
		store.addChangeListener(forceUpdate);
		return () => {
			store.removeChangeListener(forceUpdate);
		};
	}, [
		store
	]);
	return ( /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-panel"
	}, /*#__PURE__*/ React.createElement("div", {
		className: "pc-settings-title"
	}, name, header), children()));
}

let SettingsModule;
Webpack.once("LOADED", () => {
	SettingsModule = class SettingsModule extends DiscordModules.Flux.Store {
		connectStore() {
			return DiscordModules.Flux.connectStores([
				this
			], () => this.makeProps()
			);
		}
		makeProps() {
			return {
				settings: this.settings,
				getSetting: this.get.bind(this),
				updateSetting: this.set.bind(this),
				toggleSetting: this.toggle.bind(this)
			};
		}
		constructor(id1) {
			super(DiscordModules.Dispatcher, {
			});
			this.getKeys = () => {
				return Reflect.ownKeys(this.settings);
			};
			this.get = (id, defaultValue) => {
				var _id;
				return (_id = this.settings[id]) !== null && _id !== void 0 ? _id : defaultValue;
			};
			this.toggle = (id) => {
				this.set(id, !this.get(id));
			};
			this.set = (id, value) => {
				if (value === void 0) {
					this.toggle(id);
				} else {
					this.settings[id] = value;
				}
				DataStore.trySaveData(this.id, this.settings);
				this.emitChange();
			};
			this.settings = DataStore.tryLoadData(id1);
			this.id = id1;
		}
	}
	;
});
const cache$1 = new Map();
function getSettings(id) {
	if (!cache$1.has(id)) {
		const Settings = new SettingsModule(id);
		cache$1.set(id, Settings);
		return Settings;
	}
	return cache$1.get(id);
}

class SettingsRenderer {
	static registerPanel(id, options) {
		const {label, render} = options;
		const tab = this.panels.find((e) => e.id === id
		);
		if (tab)
			throw new Error(`Settings tab ${id} is already registered!`);
		var _header;
		const panel = {
			section: "PCCompat-" + label,
			label: label,
			id: id,
			className: `pccompat-settings-${id}-item`,
			element: () => DiscordModules.React.createElement(SettingsPanel, {
				name: label,
				store: getSettings(id),
				children: render,
				header: (_header = options.header) !== null && _header !== void 0 ? _header : null
			})
		};
		this.panels.push(panel);
		return () => {
			const index = this.panels.indexOf(panel);
			if (index < 0) return false;
			this.panels.splice(index, 1);
			return true;
		};
	}
	static unregisterPanel(id1) {
		const panel = this.panels.findIndex((e) => e.id === id1
		);
		if (panel < 0) return;
		this.panels.splice(panel, 1);
	}
	static patchSettingsView() {
		const SettingsView = Webpack.findByDisplayName("SettingsView");
		Patcher.after("PCSettings", SettingsView.prototype, "getPredicateSections", (_, __, res) => {
			if (!Array.isArray(res) || !res.some((e) => {
					var ref;
					return (e === null || e === void 0 ? void 0 : (ref = e.section) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === "changelog";
				}) || res.some((s) => {
					return (s === null || s === void 0 ? void 0 : s.id) === "pc-settings";
				})) return;
			const index = res.findIndex((s) => {
					var ref;
					return (s === null || s === void 0 ? void 0 : (ref = s.section) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === "changelog";
				}) - 1;
			if (index < 0) return;
			res.splice(index, 0, ...SettingsRenderer.panels);
		});
	}
}
SettingsRenderer.panels = [
	{
		section: "DIVIDER"
	},
	{
		section: "HEADER",
		label: "Powercord"
	},
];

class Emitter {
	static has(event) {
		return event in this.events;
	}
	static on(event1, listener) {
		if (!this.has(event1))
			this.events[event1] = new Set();
		this.events[event1].add(listener);
		return this.off.bind(this, event1, listener);
	}
	static off(event2, listener1) {
		if (!this.has(event2)) return;
		return this.events[event2].delete(listener1);
	}
	static emit(event3, ...args) {
		if (!this.has(event3)) return;
		for (const listener of this.events[event3]) {
			try {
				listener(...args);
			} catch (error) {
				Logger.error(`Store:${this.constructor.name}`, "Could not fire callback:", error);
			}
		}
	}
}
Emitter.events = {
};

class PluginManager extends Emitter {
	static get addons() {
		return Array. from (this.plugins, (e) => e[1]
		);
	}
	static initialize() {
		SettingsRenderer.registerPanel("plugins", {
			label: "Plugins",
			render: () => DiscordModules.React.createElement(AddonPanel, {
				type: "plugin",
				manager: this
			})
		});
		this.states = DataStore.tryLoadData("plugins");
		this.loadAllPlugins();
	}
	static loadAllPlugins() {
		if (!fs.existsSync(this.folder)) {
			try {
				fs.mkdirSync(this.folder);
			} catch (error) {
				return void Logger.error("PluginsManager", `Failed to create plugins folder:`, error);
			}
		}
		if (!fs.statSync(this.folder).isDirectory()) return void Logger.error("PluginsManager", `Plugins dir isn't a folder.`);
		Logger.log("PluginsManager", "Loading plugins...");
		for (const file of fs.readdirSync(this.folder, "utf8")) {
			const location = path.resolve(this.folder, file);
			if (!fs.statSync(location).isDirectory()) continue;
			if (!fs.existsSync(path.join(location, "manifest.json"))) continue;
			if (!fs.statSync(path.join(location, "manifest.json")).isFile()) continue;
			if (!this.mainFiles.some((f) => fs.existsSync(path.join(location, f))
				)) continue;
			try {
				this.loadPlugin(location);
			} catch (error) {
				Logger.error("PluginsManager", `Failed to load ${file}:`, error);
			}
		}
	}
	static clearCache(plugin) {
		if (!path.isAbsolute(plugin))
			plugin = path.resolve(this.folder, plugin);
		let current;
		while (current = Require.resolve(plugin)) {
			delete NodeModule.cache[current];
		}
	}
	static resolve(pluginOrName) {
		if (typeof pluginOrName === "string") return this.plugins.get(pluginOrName);
		return pluginOrName;
	}
	static saveData() {
		DataStore.trySaveData("plugins", this.states);
	}
	static isEnabled(addon) {
		const plugin = this.resolve(addon);
		if (!plugin) return;
		return Boolean(this.states[plugin.entityID]);
	}
	static loadPlugin(location, log = true) {
		const _path = path.resolve(location, this.mainFiles.find((f) => fs.existsSync(path.resolve(location, f))
		));
		const manifest = Require(path.resolve(location, "manifest.json"));
		if (this.plugins.get(manifest.name))
			throw new Error(`Plugin with name ${manifest.name} already exists!`);
		let exports = {
		};
		try {
			this.clearCache(location);
			const data = Require(_path);
			exports = new data(path.basename(location), location);
			Object.assign(exports, {
				manifest,
				path: location
			});
		} catch (error) {
			return void Logger.error("PluginsManager", `Failed to compile ${manifest.name || path.basename(location)}:`, error);
		}
		if (log) {
			Logger.log("PluginsManager", `${manifest.name} was loaded!`);
		}
		this.plugins.set(path.basename(location), exports);
		if (this.isEnabled(path.basename(location))) {
			this.startPlugin(exports);
		}
	}
	static unloadAddon(addon1, log1 = true) {
		const plugin = this.resolve(addon1);
		if (!addon1) return;
		this.stopPlugin(plugin);
		this.plugins.delete(plugin.entityID);
		if (log1) {
			Logger.log("PluginsManager", `${plugin.displayName} was unloaded!`);
		}
	}
	static reloadPlugin(addon2) {
		const plugin = this.resolve(addon2);
		if (!addon2) return;
		const success = this.stopPlugin(plugin, false);
		if (!success) {
			return Logger.error("PluginsManager", `Something went wrong while trying to enable ${plugin.displayName}:`);
		}
		this.startPlugin(plugin, false);
		Logger.log("PluginsManager", `Finished reloading ${plugin.displayName}.`);
	}
	static startPlugin(addon3, log2 = true) {
		const plugin = this.resolve(addon3);
		if (!plugin) return;
		try {
			if (typeof plugin.startPlugin === "function") plugin.startPlugin();
			if (log2) {
				Logger.log("PluginsManager", `${plugin.displayName} has been started!`);
			}
		} catch (error) {
			Logger.error("PluginsManager", `Could not start ${plugin.displayName}:`, error);
		}
		return true;
	}
	static stopPlugin(addon4, log3 = true) {
		const plugin = this.resolve(addon4);
		if (!plugin) return;
		try {
			if (typeof plugin.pluginWillUnload === "function") plugin.pluginWillUnload();
			if (log3) {
				Logger.log("PluginsManager", `${plugin.displayName} has been stopped!`);
			}
		} catch (error) {
			Logger.error("PluginsManager", `Could not stop ${plugin.displayName}:`, error);
			return false;
		}
		return true;
	}
	static enablePlugin(addon5, log4 = true) {
		const plugin = this.resolve(addon5);
		if (!plugin) return;
		this.states[plugin.entityID] = true;
		DataStore.trySaveData("plugins", this.states);
		this.startPlugin(plugin, false);
		if (log4) {
			Logger.log("PluginsManager", `${plugin.displayName} has been enabled!`);
			this.emit("toggle", plugin.entityID, true);
		}
	}
	static disablePlugin(addon6, log5 = true) {
		const plugin = this.resolve(addon6);
		if (!plugin) return;
		this.states[plugin.entityID] = false;
		DataStore.trySaveData("plugins", this.states);
		this.stopPlugin(plugin, false);
		if (log5) {
			Logger.log("PluginsManager", `${plugin.displayName} has been disabled!`);
			this.emit("toggle", plugin.entityID, false);
		}
	}
	static toggle(addon7) {
		const plugin = this.resolve(addon7);
		if (!plugin) return;
		if (this.isEnabled(plugin.entityID)) this.disable(plugin);
		else this.enable(plugin);
	}
	static get enable() {
		return this.enablePlugin;
	}
	static get disable() {
		return this.disablePlugin;
	}
	static get reload() {
		return this.reloadPlugin;
	}
}
PluginManager.folder = path.resolve(DataStore.baseDir, "plugins");
PluginManager.mainFiles = [
	"index.js",
	"index.jsx"
];
PluginManager.plugins = new Map();

class Plugin {
	loadStylesheet(_path) {
		const stylePath = path.isAbsolute(_path) ? _path : path.resolve(this.path, _path);
		try {
			if (!fs.existsSync(stylePath))
				throw new Error(`Stylesheet not found at ${stylePath}`);
			const content = Require(stylePath);
			const id = `${this.entityID}-${random()}`;
			this.stylesheets[id] = DOM.injectCSS(id, content);
		} catch (error) {
			console.error(`Could not load stylesheet:`, error);
		}
	}
	log(...messages) {
		console.log(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
	}
	debug(...messages1) {
		console.debug(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages1);
	}
	warn(...messages2) {
		console.warn(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages2);
	}
	error(...messages3) {
		console.error(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages3);
	}
	// "Internals" :zere_zoom:
	_load() {
		PluginManager.startPlugin(this);
	}
	_unload() {
		PluginManager.stopPlugin(this);
	}
	// Getters
	get displayName() {
		return this.manifest.name;
	}
	constructor(id, _path1) {
		this.stylesheets = {
		};
		this.color = "#7289da";
		this.entityID = id;
		this.path = _path1;
		this.settings = getSettings(id);
	}
}

var entities = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	Plugin: Plugin
});

var index$3 = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	plugins: PluginManager
});

function registerSettings(id, options) {
	SettingsRenderer.registerPanel(id, {
		label: options.label,
		render: typeof options.render ? () => DiscordModules.React.createElement(options.render, cache$1.get(id).makeProps())
			: options.render
	});
}
function unregisterSettings(id) {
	SettingsRenderer.unregisterPanel(id);
}

var settings = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	registerSettings: registerSettings,
	unregisterSettings: unregisterSettings
});

const commands = new Map();
const section = {
	id: "powercord",
	type: 1,
	name: "Powercord",
	icon: "__POWERCORD__"
};
function initialize() {
	const [AssetUtils, CommandUtils] = Webpack.findByProps([
		"getApplicationIconURL"
	], [
		"useApplicationCommandsDiscoveryState"
	], {
		bulk: true
	});
	Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props]) => {
		if (props.icon === "__POWERCORD__") return "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png";
	});
	Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, __, returnValue) => {
		returnValue.applicationCommandSections.unshift(section);
		returnValue.discoveryCommands.unshift(...commands.values());
		returnValue.commands.unshift(...[
			...commands.values()
		].filter((cmd) => !returnValue.commands.some((e) => e.name === cmd.name
		)
		));
		returnValue.discoverySections.unshift({
			data: [
				...commands.values()
			],
			key: section.id,
			section
		});
	});
}
function registerCommand(options) {
	var ref,
		ref1;
	const {command, executor, ...cmd} = options;
	if (cmd.autocomplete) return Logger.warn("Commands", "Custom autocomplete is not supported yet!");
	var ref2;
	commands.set(command, {
		type: 1,
		target: 1,
		id: command,
		name: command,
		execute: (result) => {
			try {
				executor(Object.values(result).map((e) => e[0].text
				));
			} catch (error) {
				Logger.error("Commands", error);
			}
		},
		applicationId: section.id,
		options: (ref2 = (ref1 = (ref = cmd.usage) === null || ref === void 0 ? void 0 : ref.match(/"(.+?)"/g)) === null || ref1 === void 0 ? void 0 : ref1.map((name) => ({
			type: 3,
			name: name.slice(1, -1)
		})
		)) !== null && ref2 !== void 0 ? ref2 : [],
		...cmd
	});
}
function unregisterCommand(id) {
	commands.delete(id);
}

var commands$1 = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	commands: commands,
	section: section,
	initialize: initialize,
	registerCommand: registerCommand,
	unregisterCommand: unregisterCommand
});

var index$2 = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	settings: settings,
	commands: commands$1
});

function findInTree(tree = {
	}, filter = (_) => _
	, {ignore =[], walkable =[], maxProperties =100} = {
	}) {
	let stack = [
		tree
	];
	const wrapFilter = function(...args) {
		try {
			return Reflect.apply(filter, this, args);
		} catch (e) {
			return false;
		}
	};
	while (stack.length && maxProperties) {
		const node = stack.shift();
		if (wrapFilter(node)) return node;
		if (Array.isArray(node)) stack.push(...node);
		else if (typeof node === "object" && node !== null) {
			if (walkable.length) {
				for (const key in node) {
					const value = node[key];
					if (~walkable.indexOf(key) && !~ignore.indexOf(key)) {
						stack.push(value);
					}
				}
			} else {
				for (const key in node) {
					const value = node[key];
					if (node && ~ignore.indexOf(key)) continue;
					stack.push(value);
				}
			}
		}
		maxProperties--;
	}
}
function findInReactTree(tree, filter, options = {
	}) {
	return findInTree(tree, filter, {
		...options,
		walkable: [
			"props",
			"children"
		]
	});
}
function getReactInstance(node) {
	return node["__reactFiber$"];
}
function getOwnerInstance(node) {
	if (!node) return null;
	const fiber = getReactInstance(node);
	let current = fiber;
	while (!((current === null || current === void 0 ? void 0 : current.stateNode) instanceof DiscordModules.React.Component)) {
		current = current.return;
	}
	return current === null || current === void 0 ? void 0 : current.stateNode;
}
function forceUpdateElement(selector) {
	const instance = getOwnerInstance(document.querySelector(selector));
	if (instance) instance.forceUpdate();
}

var util = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	findInTree: findInTree,
	findInReactTree: findInReactTree,
	getReactInstance: getReactInstance,
	getOwnerInstance: getOwnerInstance,
	forceUpdateElement: forceUpdateElement
});

var components = {
	SwitchItem: {
		updater: true,
		filter: "SwitchItem"
	}
};

function _extends$2() {
	_extends$2 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
function TextInput({children, note, ...rest}) {
	const {React: React1, TextInput: TextInput1, Forms} = DiscordModules;
	return ( /*#__PURE__*/ React.createElement(Forms.FormItem, {
		title: children
	}, /*#__PURE__*/ React.createElement(TextInput1, _extends$2({
	}, rest)), note && /*#__PURE__*/ React.createElement(Forms.FormText, {
			type: "description"
		}, note)));
}

function _extends$1() {
	_extends$1 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function AsyncComponent({_provider, _fallback, ...props}) {
	const [Component, setComponent] = DiscordModules.React.useState(() => _fallback !== null && _fallback !== void 0 ? _fallback : () => null
	);
	DiscordModules.React.useEffect(() => {
		_provider().then((comp) => setComponent(() => comp
		)
		);
	}, [
		_provider,
		_fallback
	]);
	return ( /*#__PURE__*/ React.createElement(Component, _extends$1({
	}, props)));
}

function _extends() {
	_extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function RadioGroup({children, note, value: value1, onChange, ...props}) {
	const {React: React1, Forms} = DiscordModules;
	const RadioGroup1 = Components$1.get("RadioGroup");
	console.log({
		value: value1
	});
	const [state, setValue] = React1.useState(value1);
	return ( /*#__PURE__*/ React.createElement(Forms.FormItem, {
		title: children
	}, note && /*#__PURE__*/ React.createElement(Forms.FormText, {
			type: "description"
		}, note), /*#__PURE__*/ React.createElement(RadioGroup1, _extends({
		}, props, {
			value: state,
			onChange: ({value}) => (setValue(value), onChange(value))
		}))));
}

let Components = {
	TextInput,
	RadioGroup
};
(() => {
	const cache = new Map();
	for (const id in components) {
		const options = components[id];
		Components[id] = (props) => {
			if (!cache.has(id)) {
				const module = typeof options.filter === "function" ? Webpack.findModule(options.filter) : typeof options.filter === "string" ? Webpack.findByDisplayName(options.filter) : Array.isArray(options.filter) ? Webpack.findByProps(options.filter) : null;
				if (!module) return null;
				cache.set(id, createUpdateWrapper(module, void 0, void 0, options.valueProps));
			}
			const Component = cache.get(id);
			return DiscordModules.React.createElement(Component, props);
		};
	}
})();
var index$1 = {
	settings: Components,
	AsyncComponent
};

var modules = {
	messages: [
		"sendMessage",
		"editMessage",
		"deleteMessage"
	],
	typing: [
		"startTyping"
	],
	http: [
		"getAPIBaseURL",
		"get",
		"put",
		"post"
	],
	constants: [
		"Endpoints",
		"AuditLogActionTypes",
		"AutoCompleteResultTypes",
		"BITRATE_DEFAULT"
	],
	channels: [
		"getChannelId",
		"getLastSelectedChannelId",
		"getVoiceChannelId"
	],
	spotify: [
		"play",
		"pause",
		"fetchIsSpotifyProtocolRegistered"
	],
	spotifySocket: [
		"getActiveSocketAndDevice",
		"getPlayerState",
		"hasConnectedAccount"
	],
	React: [
		"createRef",
		"createElement",
		"Component",
		"PureComponent"
	],
	ReactDOM: [
		"render",
		"createPortal"
	],
	contextMenu: [
		"openContextMenu",
		"closeContextMenu"
	],
	modal: [
		"push",
		"update",
		"pop",
		"popWithKey"
	],
	Flux: [
		"Store",
		"connectStores"
	],
	FluxDispatcher: [
		"_currentDispatchActionType",
		"_processingWaitQueue"
	],
	Router: [
		"BrowserRouter",
		"Router"
	],
	hljs: [
		"initHighlighting",
		"highlight"
	],
	i18n: [
		"Messages",
		"getLanguages",
		(m) => m.Messages.CLOSE
	]
};

function getModule(filter, retry = true, forever = false) {
	if (Array.isArray(filter)) {
		const props = filter;
		filter = (m) => m && props.every((key) => typeof key === "function" ? key(m) : key in m
		)
		;
	}
	if (typeof filter !== "function") return retry ? Promise.resolve(null) : null;
	if (!retry) return Webpack.findModule(filter, false, true);
	return new Promise(async (resolve) => {
		for (let i = 0; i < (forever ? 666 : 21); i++) {
			const found = Webpack.findModule(filter, false, true);
			if (found) {
				return resolve(found);
			}
			await sleep(100);
		}
	});
}
function getModuleByDisplayName(displayName, retry, forever) {
	return getModule((m) => {
		var ref;
		return ((ref = m.displayName) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === displayName.toLowerCase();
	}, retry, forever);
}
function getAllModules(filter) {
	if (Array.isArray(filter)) {
		const props = filter;
		filter = (m) => m && props.every((key) => key in m
		)
		;
	}
	return Webpack.findModules(filter);
}
async function init() {
	for (const [moduleId, props] of Object.entries(modules)) {
		webpack[moduleId] = await getModule(props);
	}
	Object.freeze(webpack);
}
const webpack = {
	getModule,
	getAllModules,
	getModuleByDisplayName
};

function inject(id, module, functionName, callback, pre = false) {
	if (!module || typeof module[functionName] !== "function")
		throw new Error(`Failed to patch ${id}; module or functionName was invalid.`);
	if (pre) {
		Patcher.before(id, module, functionName, (_this, args) => {
			return Reflect.apply(callback, _this, [
				args
			]);
		});
	} else {
		Patcher.after(id, module, functionName, (_this, args, ret) => {
			return Reflect.apply(callback, _this, [
				args,
				ret
			]);
		});
	}
}
function uninject(id) {
	return Patcher.unpatchAll(id);
}
function isInjected(id) {
	return Patcher.getPatchesByCaller(id).length > 0;
}
const injector = {
	inject,
	uninject,
	isInjected
};

var powercord$1 = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	entities: entities,
	managers: index$3,
	api: index$2,
	util: util,
	components: index$1,
	webpack: webpack,
	injector: injector
});

class SASS {
	static compile(file) {
		return electron.ipcRenderer.sendSync(COMPILE_SASS, file);
	}
}

class JSXCompiler {
	static compile(file) {
		return electron.ipcRenderer.sendSync(COMPILE_JSX, file);
	}
}

const cache = {
};
const extensions = {
	".js": (module, filename) => {
		const fileContent = fs.readFileSync(filename, "utf8");
		module.filecontent = fileContent;
		module._compile(fileContent);
		return module.exports;
	},
	".json": (module, filename) => {
		const filecontent = fs.readFileSync(filename, "utf8");
		module.filecontent = filecontent;
		module.exports = JSON.parse(filecontent);
		return module.exports;
	},
	".jsx": (module, filename) => {
		const code = JSXCompiler.compile(filename);
		module.filecontent = code;
		module._compile(code);
		return module.exports;
	},
	".scss": (module, filename) => {
		const content = SASS.compile(filename);
		module.filecontent = content;
		module.exports = content;
		return content;
	},
	".css": (module, filename) => {
		const content = fs.readFileSync(filename, "utf8");
		module.filecontent = content;
		module.exports = content;
		return module.exports;
	},
	// I haven't tested this - I assume it works.
	// TODO: Make this not shitty
	".node": (module, filename) => {
		const thing = PCCompatNative.executeJS(`require(${JSON.stringify(filename)})`);
		module.exports = thing;
		return thing;
	}
};
class Module {
	_compile(code) {
		const wrapped = eval(`((${[
			"require",
			"module",
			"exports",
			"__filename",
			"__dirname",
			"global"
		].join(", ")}) => {
            ${code}
            //# sourceURL=${JSON.stringify(this.filename).slice(1, -1)}
        })`);
		wrapped(this.require, this, this.exports, this.filename, this.path, window);
	}
	constructor(id, parent1, require1) {
		this.id = id;
		this.path = path.dirname(id);
		this.exports = {
		};
		this.parent = parent1;
		this.filename = id;
		this.loaded = false;
		this.children = [];
		this.require = require1;
		if (parent1) parent1.children.push(this);
	}
}
function resolve(path) {
	for (const key in cache) {
		if (key.startsWith(path)) return key;
	}
}
function getExtension(mod) {
	return path.extname(mod) || Object.keys(extensions).find((ext) => fs.existsSync(mod + ext)
		) || "";
}
function createRequire(_path) {
	const require = (mod) => {
		if (typeof mod !== "string") return;
		switch (mod) {
			case "powercord":
				return powercord$1;
			case "path":
				return path;
			case "fs":
				return fs;
			case "module":
				return NodeModule;
			default: {
				if (mod.startsWith("powercord/")) {
					const value1 = mod.split("/").slice(1).reduce((value, key) => value[key]
						, powercord$1);
					if (value1) return value1;
				}
				return load(_path, mod);
			}
		}
	};
	Object.assign(require, {
		cache,
		resolve
	});
	// @ts-ignore
	return require;
}
function resolveMain(_path, mod) {
	const parent = path.extname(_path) ? path.dirname(_path) : _path;
	if (!fs.existsSync(parent))
		throw new Error(`Cannot find module ${mod}`);
	const files = fs.readdirSync(parent, "utf8");
	for (const file of files) {
		const ext = path.extname(file);
		if (file === "package.json") {
			const pkg = JSON.parse(fs.readFileSync(path.resolve(parent, file), "utf8"));
			if (!Reflect.has(pkg, "main")) continue;
			return path.resolve(parent, pkg.main);
		}
		if (file.slice(0, -ext.length) === "index" && extensions[ext]) return path.resolve(parent, mod + ext);
	}
}
function getFilePath(_path, mod) {
	mod = path.resolve(_path, mod);
	const pth = mod + getExtension(mod);
	if (fs.existsSync(pth)) return pth;
	if (!path.extname(mod)) return resolveMain(_path, mod);
	return mod;
}
function load(_path, mod, req = null) {
	const file = getFilePath(_path, mod);
	if (!fs.existsSync(file))
		throw new Error(`Cannot find module ${mod}`);
	if (cache[file]) return cache[file].exports;
	const stats = fs.statSync(file, "utf8");
	if (stats.isDirectory())
		mod = resolveMain(_path, mod);
	const ext = getExtension(file);
	const loader = extensions[ext];
	if (!loader)
		throw new Error(`Cannot find module ${file}`);
	const module = cache[file] = new Module(file, req, createRequire(path.dirname(file)));
	loader(module, file);
	return module.exports;
}
// TODO: Add globalPaths support
const NodeModule = {
	_extensions: extensions,
	cache,
	_load: load,
	globalPaths: []
};

var Require = createRequire(path.resolve(PCCompatNative.executeJS("__dirname"), "plugins"));

if (!("process" in window)) {
	PCCompatNative.IPC.dispatch(EXPOSE_PROCESS_GLOBAL);
}
var index = new class PCCompat {
	start() {
		Webpack.wait(this.onStart.bind(this));
	}
	async onStart() {
		this.expose("React", DiscordModules.React);
		this.expose("powercord", Require("powercord"));
		await init();
		powercord.api.commands.initialize();
		Object.defineProperty(window, "powercord_require", {
			value: Require,
			configurable: false,
			writable: false
		});
		DOM.injectCSS("core", Require(path.resolve(PCCompatNative.executeJS("__dirname"), "src/renderer/styles", "index.scss")));
		SettingsRenderer.patchSettingsView();
		PluginManager.initialize();
	}
	expose(name, namespace) {
		Object.defineProperty(window, name, {
			value: namespace,
			configurable: true,
			writable: true
		});
	}
	stop() {}
};

export { index as default };
