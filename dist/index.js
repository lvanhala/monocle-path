"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monocle_ts_1 = require("monocle-ts");
const Option_1 = require("fp-ts/lib/Option");
const isLens = (p) => p._tag === 'Lens';
const compose = (l1, l2) => {
    if (isLens(l1)) {
        return isLens(l2) ?
            l1.compose(l2) :
            l1.composeOptional(l2);
    }
    else {
        return isLens(l2) ?
            l1.composeLens(l2) :
            l1.compose(l2);
    }
};
function find(f) {
    return new monocle_ts_1.Optional((items) => {
        const index = items.findIndex(f);
        if (index >= 0) {
            return Option_1.some(items[index]);
        }
        else {
            return Option_1.none;
        }
    }, (item) => (items) => {
        const clone = items.slice(0);
        const index = items.findIndex(f);
        if (index >= 0) {
            clone[index] = item;
        }
        return clone;
    });
}
exports.find = find;
function byIndex(n) {
    return new monocle_ts_1.Optional((items) => n >= 0 && n < items.length ? Option_1.some(items[n]) : Option_1.none, (item) => (items) => {
        if (n >= 0 && n < items.length) {
            const clone = items.slice(0);
            clone[n] = item;
            return clone;
        }
        else {
            return items;
        }
    });
}
exports.byIndex = byIndex;
const createLensFromPathItem = (pathItem) => {
    if (typeof pathItem === 'string') {
        return monocle_ts_1.Lens.fromProp(pathItem);
    }
    else if (typeof pathItem === 'number') {
        return byIndex(pathItem);
    }
    else if (typeof pathItem === 'function') {
        return find(pathItem);
    }
    else {
        throw new Error('path item type not supported');
    }
};
class PathItem {
    constructor(currentPath) {
        this.currentPath = currentPath;
    }
    prop(field) {
        return new PathItem(this.currentPath.concat(field));
    }
    byIndex(index) {
        return new PathItem(this.currentPath.concat(index));
    }
    find(f) {
        return new PathItem(this.currentPath.concat(f));
    }
    toOptional() {
        const first = createLensFromPathItem(this.currentPath[0]);
        const path = this.currentPath.slice(1).reduce((lens, selector) => compose(lens, createLensFromPathItem(selector)), first);
        return isLens(path) ? path.asOptional() : path;
    }
}
function monoclePath() {
    return new PathItem([]);
}
exports.monoclePath = monoclePath;
//# sourceMappingURL=index.js.map