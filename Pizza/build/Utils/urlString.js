"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strUrl = (s) => {
    s = s.replace(/[^a-zA-Z ]/g, "");
    var lst = s.split(" ");
    lst = lst.filter(Boolean);
    lst = lst.slice(0, 10);
    s = lst.join("_");
    return s;
};
exports.default = strUrl;
