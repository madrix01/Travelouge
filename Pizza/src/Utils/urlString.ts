const strUrl = (s : string) : string => {
    s = s.replace(/[^a-zA-Z ]/g, "");
    let lst = s.split(" ");
    lst = lst.filter(Boolean)
    lst = lst.slice(0, 10)
    s = lst.join("_")
    return s;
}

export default strUrl