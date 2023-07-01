const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

  /* @param
   * StyleText ( text )
  */

module.exports = async(text) => {
    let res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
    let html = await res.text()
    let dom = new JSDOM(html)
    let table = dom.window.document.querySelector('table').children[0].children
    let obj = {}
    for (let tr of table) {
        let name = tr.querySelector('.aname').innerHTML
        let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
        obj[name + (obj[name] ? ' Reversed' : '')] = content
    }
    return obj
    console.log(obj)
}