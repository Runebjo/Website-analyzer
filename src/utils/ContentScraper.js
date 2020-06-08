export function decodeHtml(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

export function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, '');
    str = str.replace(/[ ]{2,}/gi, ' ');
    str = str.replace(/\n /, '\n');
    str = str.replace(/<[^>]*>?/gm, '');
    return str.split(' ').length;
}

export function getOutline(content) {
    var div = document.createElement('div');
    div.innerHTML = content.trim();
    const h2Elements = div.querySelectorAll('h2');
    const outline = Array.from(h2Elements).map(h => h.innerText);
    return outline;
}