export function GetFirstToken() {
    const token1 = localStorage.getItem('firstToken');
    if (token1 != "undefined") {
        return JSON.parse(token1);
    }

    return false
}

export function GetSecondToken() {
    const token2 = localStorage.getItem('secondToken');
    if (token2 != "undefined") {
        return JSON.parse(token2);
    }

    return false
}