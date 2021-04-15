const strUrl = (s : string) => {
    s = s.replace(/[^a-zA-Z ]/g, "");
    var lst = s.split(" ");
    lst = lst.filter(Boolean)
    lst = lst.slice(0, 10)
    s = lst.join("_")
    return s;
}

export default strUrl