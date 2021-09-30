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
    const h2Elements = div.querySelectorAll('h2, h3');
    const outline = Array.from(h2Elements).map(h => `${h.nodeName}: ${h.innerText}`);
    return outline;
}

export function getLinkData(content) {
    let div = document.createElement('div');
    div.innerHTML = content.trim();
    const links = div.querySelectorAll('a');
    const hrefs = Array.from(links).map(a => a.href);
    const amazonData = hrefs
        .filter(href => {
            const amazonLink = href.includes('amazon.com');
             return amazonLink;
        })
        .map(al => {
            const indexStart = al.indexOf('tag=');
            let tag = null;
            if (indexStart > 0) {
                tag = al.substr(indexStart + 4);
                const indexEnd = tag.indexOf('&');
                tag = tag.substr(0, indexEnd);
            }

            return {
                link: al,
                tag: tag
            }
        })
    return amazonData;
}