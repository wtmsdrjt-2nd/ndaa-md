const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const fs = require('fs')
const fetch = require('node-fetch')
// const scrapy = require('node-scrapy')
const request = require('request')
const fakeUa = require('fake-useragent')
const qs = require('qs')
// const puppeter = require("puppeteer");
const _url = require('url')
const _math = require('mathjs')
const path = require('path');
const { color } = require('../lib/color.js')
const { JSDOM } = require('jsdom')

__path = process.cwd()

const randomJson = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
const replaceAll = (string, find, replace) => {
    return string.replace(new RegExp(find, 'g'), replace);
}
const Tanggal = (tanggal) => {
    const tgl = tanggal.replace(/-.*/, "")
    const bln = tanggal.replace(/-([^-?]+)(?=(?:$|\?))/, "").replace(/.*?-/, "")
    const thn = tanggal.replace(/.*\-/, "")
    const result = {
        tanggal: tgl,
        bulan: bln,
        tahun: thn
    }
    return result
}
exports.upload = async (path) => {
    return new Promise((resolve, reject) => {
        const bodyForm = new FormData();
        bodyForm.append('file', fs.createReadStream(path))
        axios(`https://upload-xfar05.herokuapp.com/upload`, {
            method: 'POST',
            data: bodyForm,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": `multipart/form-data; boundary=${bodyForm._boundary}`
            }
        }).then(({ data }) => {
            resolve(data)
        })
    })
}
exports.makeZombie = (path) => {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeter.launch()
        const page = await browser.newPage()
        await page.goto('https://m.photofunia.com/categories/all_effects/zombie')
        await page.click('div.field.imagelist-field > div > div:nth-child(4)')
        await page.waitForSelector('div.field.image-field > input')
        const input = await page.$('div.field.image-field > input')
        input.uploadFile(path)
        await page.click('div.button-container > button')
        await page.waitForTimeout(2000)
        const bodyHandle = await page.$('body');
        const html = await page.evaluate(body => body.innerHTML, bodyHandle);
        const $ = cheerio.load(html)
        const data = $('div.image-container > div > img').attr('src')
        await browser.close()
        if (data)
            resolve({
                link: data
            })
        else resolve({
            status: 'err'
        })
    })
}
exports.kiryu = (q) => {
    return new Promise((resolve, reject) => {
        axios(`https://kiryuu.id/?s=${q}`, {
            method: "GET",
            cookie: '_ga=GA1.1.785595671.1630245632; HstCfa4535336=1630245632670; HstCmu4535336=1630245632670; HstCnv4535336=1; HstCns4535336=1; c_ref_4535336=https://kiryuu.co/; __viCookieActive=true; _pbjs_userid_consent_data=3524755945110770; _ga_62TWKN8BP6=GS1.1.1630245631.1.1.1630245838.0; HstCla4535336=1630245838784; HstPn4535336=5; HstPt4535336=5; cto_bidid=q4a1ml93MjJaZGJwcFZHb3FScjFYbUJHb0JaUEJLdjJ0S2gzWjBIMXp5OXlrTk9qYkhHNDRZS0tIcjZhc0dOam8xNVdHTEVkWGMwVlAySzRzMTB2bTM4YUs5b3g5NHJFYTVMVGpDbmpNRDZlYVZSUSUzRA; cto_bundle=FQXTu19ZV21UblBkVWxrblRHZTR5cmkzJTJCV054OXVKWE5rM05EQTVDcUtIeVhCeFR1U1dobWJWdHp5d2hFeG4lMkJFRlc5dWF3SFRyckhMMEZWMERDbGdTSnJmdSUyQjJFTkZqazU1N29zYlJlRVVaREdDSW1WJTJGRHZLWUdFQnpSbXd6OVdzJTJGZWFsUFlRRkJ3RlFMWWFaVTh4RUNSNHF3JTNEJTNE',
        }).then(({ data }) => {
            let thumbnail = []
            const $ = cheerio.load(data)
            for (let ab = 1; ab < 10; ab++) {
                let result = {
                    "title": $(`#content > div.wrapper > div.postbody > div > div.listupd > div:nth-child(${ab}) > div > a > div.bigor > div.tt`).text().replace('\n', ''),
                    "score": $(`#content > div.wrapper > div.postbody > div > div.listupd > div:nth-child(${ab}) > div > a > div.bigor > div.adds > div.rt > div > div.numscore`).text(),
                    "last_capter": $(`#content > div.wrapper > div.postbody > div > div.listupd > div:nth-child(${ab}) > div > a > div.bigor > div.adds > div.epxs`).text(),
                    "url": $(`#content > div.wrapper > div.postbody > div > div.listupd > div:nth-child(2) > div > a`).attr("href"),
                    "thumb": $(`#content > div.wrapper > div.postbody > div > div.listupd > div:nth-child(${ab}) > div > a > div.limit > img`).attr("src")

                }
                thumbnail.push(result)
            }
            resolve(thumbnail)
        })

    })
}
exports.searchgore = async (query) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://seegore.com/?s=' + query).then(dataa => {
            const $$$ = cheerio.load(dataa)
            pagina = $$$('#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a').text();
            rand = Math.floor(Math.random() * pagina) + 1
            if (rand === 1) {
                slink = 'https://seegore.com/?s=' + query
            } else {
                slink = `https://seegore.com/page/${rand}/?s=${query}`
            }
            axios.get(slink)
                .then(({ data }) => {
                    const $ = cheerio.load(data)
                    const link = [];
                    const judul = [];
                    const uploader = [];
                    const format = [];
                    const thumb = [];
                    $('#post-items > li > article > div.content > header > h2 > a').each(function (a, b) {
                        link.push($(b).attr('href'))
                    })
                    $('#post-items > li > article > div.content > header > h2 > a').each(function (c, d) {
                        jud = $(d).text();
                        judul.push(jud)
                    })
                    $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(function (e, f) {
                        upl = $(f).text();
                        uploader.push(upl)
                    })
                    $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function (g, h) {
                        thumb.push($(h).attr('src'))
                    })
                    for (let i = 0; i < link.length; i++) {
                        format.push({
                            judul: judul[i],
                            uploader: uploader[i],
                            thumb: thumb[i],
                            link: link[i]
                        })
                    }
                    const result = {
                        data: format
                    }
                    resolve(result)
                })
                .catch(reject)
        })
    })
}
exports.randomgore = async () => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://seegore.com/gore/').then(dataa => {
            const $$$ = cheerio.load(dataa)
            pagina = $$$('#main > div.container.main-container.bb-stretched-full > div > div > div > div > div > div > nav > ul > li:nth-child(4) > a').text();
            rand = Math.floor(Math.random() * pagina) + 1
            randvid = Math.floor(Math.random() * 16) + 1
            if (rand === 1) {
                slink = 'https://seegore.com/gore/'
            } else {
                slink = `https://seegore.com/gore/page/${rand}/`
            }
            axios.get(slink)
                .then(({ data }) => {
                    const $ = cheerio.load(data)
                    const link = [];
                    const result = [];
                    const username = [];
                    const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr('href')
                    const thumbb = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr('src')
                    axios.get(linkp)
                        .then(({ data }) => {
                            const $$ = cheerio.load(data)
                            const format = {
                                judul: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
                                views: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
                                comment: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
                                thumb: thumbb,
                                link: $$('video > source').attr('src')
                            }
                            const result = {
                                data: format
                            }
                            resolve(result)
                        })
                })
                .catch(reject)
        })
    })
}
exports.jalantikusmeme = async () => {
    const JTmeme = JSON.parse(fs.readFileSync('./lib/json/jalantikusmeme.json'));
    return randomJson(JTmeme);
}
exports.jalantikus = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://jalantikus.com/search/articles/${query}/`).then(tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.post-block-with-category").each(function (c, d) {
                title = $(d).find("a.post-block-with-category__link").text()
                category = $(d).find("a.post-info__category-link").text()
                date = $(d).find("time").text()
                link = `https://jalantikus.com${$(d).find("a").attr('href')}`
                const Data = {
                    title: title,
                    category: category,
                    date: date,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    })
}
exports.kodepos = async (kota) => {
    return new Promise(async (resolve, reject) => {
        let postalcode = 'https://carikodepos.com/';
        let url = postalcode + '?s=' + kota;
        await request.get({
            headers: {
                'Accept': 'application/json, text/javascript, */*;',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': postalcode,
                'Referer': postalcode
            },
            url: url,
        }, function (error, response, body) {
            if (error) return reject(error);
            let $ = cheerio.load(body);
            var search = $('tr');
            if (!search.length) return reject('No result could be found');
            var results = [];
            search.each(function (i) {
                if (i != 0) {
                    var td = $(this).find('td');
                    var result = {};
                    td.each(function (i) {
                        var value = $(this).find('a').html();
                        var key = (i == 0) ? 'province' : (i == 1) ? 'city' : (i == 2) ? 'subdistrict' : (i == 3) ? 'urban' : 'postalcode';
                        result[key] = value;
                    })
                    results.push(result);
                }
            });
            return resolve(results);
        });
    });
};
exports.infohoax = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://turnbackhoax.id/`).then(tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("figure.mh-loop-thumb").each(function (a, b) {
                $("div.mh-loop-content.mh-clearfix").each(function (c, d) {
                    link = $(d).find("h3.entry-title.mh-loop-title > a").attr('href');
                    img = $(b).find("img.attachment-mh-magazine-lite-medium.size-mh-magazine-lite-medium.wp-post-image").attr('src');
                    title = $(d).find("h3.entry-title.mh-loop-title > a").text().trim();
                    desc = $(d).find("div.mh-excerpt > p").text().trim();
                    date = $(d).find("span.mh-meta-date.updated").text().trim();
                    const Data = {

                        title: title,
                        thumbnail: img,
                        desc: desc,
                        date: date,
                        link: link
                    }
                    hasil.push(Data)
                })
            })
            resolve(hasil)
        }).catch(reject)
    });
}
exports.gsmarena = async (querry) => {
    const link = await axios.get(`https://www.gsmarena.com/res.php3?sSearch=${querry}`)
    const ch = cheerio.load(link.data)
    let Url = ch('#review-body > div > ul').find('li:nth-child(1) > a').attr('href')
    const Link = await axios.get(`https://www.gsmarena.com/${Url}`)
    let $ = cheerio.load(Link.data)
    let barang = $('#body > div > div.review-header > div').find(' div.article-info-line.page-specs.light.border-bottom > h1').text().trim()
    let rilis = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(1) > span').text().trim()
    let thumb = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > div > a > img').attr('src')
    let ukuran = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(3) > span').text().trim()
    let tipe = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(5) > span').text().trim()
    let storage = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(7) > span').text().trim()
    let display = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-display > div').text().trim()
    let inchi = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-display > strong > span').text().trim()
    let camPix = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > strong > span:nth-child(1)').text().trim()
    let Mp = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > strong > span:nth-child(2)').text().trim()
    let VideoVix = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > div').text().trim()
    let Ram = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > strong > span:nth-child(2)').text().trim()
    let chipset = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > div').text().trim()
    let batre = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > strong > span:nth-child(1)').text().trim()
    let Mah = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > strong > span:nth-child(2)').text().trim()
    let merekBatre = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > div').text().trim()
    let AngkaRam = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > strong > span:nth-child(1)').text().trim()
    let detail = []
    $('#specs-list').each(function (anu, RA) {
        let isi = $(RA).text().trim()
        detail.push(isi)
    })
    const result = {
        status: Link.status,
        result: {
            judul: barang,
            rilis: rilis,
            thumb: thumb,
            ukuran: ukuran,
            type: tipe,
            storage: storage,
            display: display,
            inchi: inchi,
            pixel: camPix + Mp,
            videoPixel: VideoVix,
            ram: AngkaRam + Ram,
            chipset: chipset,
            batrai: batre + Mah,
            merek_batre: merekBatre,
            detail: detail[0]
        }
    }
    return result
}
exports.otakudesu = (judul) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://otakudesu.moe/?s=' + judul + '&post_type=anime')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const result = {};
                let limk = $('#venkonten > div > div.venser > div > div > ul > li:nth-child(1) > h2 > a').attr('href')
                axios.get(limk).then(({ data }) => {
                    const $$ = cheerio.load(data)
                    result.img = $$('#venkonten > div.venser > div.fotoanime').find('img').attr('src')
                    $$('#venkonten > div.venser > div.fotoanime > div.infozin > div').each(function (a, b) {
                        result.judul = $$(b).find('p:nth-child(1)').text().replace('Judul: ', '')
                        result.jepang = $$(b).find('p:nth-child(2)').text().replace('Japanese: ', '')
                        result.rate = $$(b).find('p:nth-child(3)').text().replace('Skor: ', '')
                        result.produser = $$(b).find('p:nth-child(4)').text().replace('Produser: ', '')
                        result.tipe = $$(b).find('p:nth-child(5)').text().replace('Tipe: ', '')
                        result.status = $$(b).find('p:nth-child(6)').text().replace('Status: ', '')
                        result.episode = $$(b).find('p:nth-child(7)').text().replace('Total Episode: ', '')
                        result.durasi = $$(b).find('p:nth-child(8)').text().replace('Durasi: ', '')
                        result.rilis = $$(b).find('p:nth-child(9)').text().replace('Tanggal Rilis: ', '')
                        result.studio = $$(b).find('p:nth-child(10)').text().replace('Studio: ', '')
                        result.genre = $$(b).find('p:nth-child(11)').text().replace('Genre: ', '')
                        result.desc = $$('#venkonten > div.venser > div.fotoanime > div.sinopc').text().replace('.', '\n') + $$(b).find('div.sinopc > p:nth-child(2)').text()
                        result.batch = $$('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href')
                    })
                    const lim = $$('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href')
                    axios.get(lim).then(({ data }) => {
                        const $$$ = cheerio.load(data)
                        result.batchSD = $$$('#venkonten > div:nth-child(6) > ul > li:nth-child(1) > a:nth-child(3)').attr('href')
                        result.batchHD = $$$('#venkonten > div:nth-child(6) > ul > li:nth-child(3) > a:nth-child(3)').attr('href')
                        resolve(result)
                    })
                })
            })
            .catch(reject)
    })
}
/*exports.otakudesuinfo = (URL) => {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield got_1.default.get(URL, {
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9,id;q=0.8",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
                }
            }).then(res => {
                const $ = cheerio.default.load(res.body);
                const hasil = [];
                const thumb = $('#venkonten').find('div.venser > div.fotoanime > img').attr('src');
                const sinopsis = [];
                $('#venkonten > div.venser > div.fotoanime > div.infozin > div').each(function (a, b) {
                    $(b).find('span').each(function (tyu, zu) {
                        const Data = $(zu).text().trim();
                        hasil.push(Data);
                    });
                });
                $('#venkonten > div.venser').find('div.fotoanime > div.sinopc').each(function (c, d) {
                    const Data = $(d).find('p').text().trim();
                    sinopsis.push(Data);
                });
                let Bio = "";
                for (const i of hasil) {
                    Bio += i + "\n";
                }
                const Result = {
                    status: res.statusCode,
                    result: {
                        thumb: thumb,
                        bio: Bio,
                        sinopsis: sinopsis[0]
                    }
                };
                resolve(Result);
            }).catch(reject);
        }));
    });
}*/
exports.otakudesuongoing = async () => {
    const res = await axios.get(`https://otakudesu.moe/ongoing-anime`)
    const $ = cheerio.load(res.data)
    const result = []
    $('.venz').find('li > div.detpost').each(function (c, d) {
        const judul = $(d).find('div.thumb > a > div.thumbz > h2.jdlflm').text()
        const thumb = $(d).find('div.thumb > a > div.thumbz > img').attr('src')
        const eps = $(d).find('div.epz').text()
        const hri = $(d).find('div.epztipe').text()
        const link = $(d).find('div.thumb > a').attr('href')
        const tgl = $(d).find('div.newnime').text()
        result.push({ judul, thumb, eps, hri, tgl, link })
    })
    return result
}
exports.kusonime = (query) => {
    return new Promise((resolve, reject) => {
        fetch('https://kusonime.com/?s=' + query + '&post_type=anime', {
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
            }
        })
            .then(rsp => rsp.text())
            .then((data) => {
                const $ = cheerio.load(data)
                const url = []
                $('div > div > ul > div > div > div').each(function () {
                    url.push($(this).find('a').attr('href'))
                })
                const randomUrl = url[Math.floor(Math.random() * url.length)]
                fetch(randomUrl, {
                    method: 'GET',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
                    }
                })
                    .then(rsp => rsp.text())
                    .then((data) => {
                        const $$ = cheerio.load(data)
                        resolve({
                            status: true,
                            result: {
                                title: $$('.vezone > .venser').find('.jdlz').text(),
                                thumb: $$('.vezone > .venser').find('div > img').attr('src'),
                                views: $$('.vezone > .venser').find('div > div > span').text().trim().replace(' Views', ''),
                                genre: $$('.vezone > .venser').find('.lexot > .info > p').eq(1).text().replace('Genre : ', ''),
                                seasons: $$('.vezone > .venser').find('.lexot > .info > p').eq(2).text().replace('Seasons : ', ''),
                                producers: $$('.vezone > .venser').find('.lexot > .info > p').eq(3).text().replace('Producers: ', ''),
                                type: $$('.vezone > .venser').find('.lexot > .info > p').eq(4).text().replace('Type: ', ''),
                                status: $$('.vezone > .venser').find('.lexot > .info > p').eq(5).text().replace('Status: ', ''),
                                rating: $$('.vezone > .venser').find('.lexot > .info > p').eq(7).text().replace('Score: ', ''),
                                duration: $$('.vezone > .venser').find('.lexot > .info > p').eq(8).text().replace('Duration: ', ''),
                                release: $$('.vezone > .venser').find('.lexot > .info > p').eq(9).text().replace('Released on: ', ''),
                                desc: $$('.vezone > .venser').find('p').eq(10).text(),
                                url: randomUrl
                            }
                        })
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}
exports.anoboy = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://anoboy.media/?s=' + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const format = [];
                const link = [];
                const judul = [];
                const thumb = [];
                const uptime = [];
                $('body > div.wrap > div.container > div.column-content > a > div > div.amvj > h3').each(function (a, b) {
                    jud = $(b).text();
                    judul.push(jud)
                })
                $('body > div.wrap > div.container > div.column-content > a > div > div.jamup').each(function (c, d) {
                    upt = $(d).text();
                    uptime.push(upt)
                })
                $('body > div.wrap > div.container > div.column-content > a > div > amp-img').each(function (e, f) {
                    thumb.push($(f).attr('src'))
                })
                $('body > div.wrap > div.container > div.column-content > a').each(function (g, h) {
                    link.push($(h).attr('href'))
                })
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: judul[i],
                        thumb: thumb[i],
                        link: link[i]
                    })
                }
                const result = {
                    status: data.status,
                    data: format
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.anoboylatest = async () => {
    return new Promise((resolve, reject) => {
        request('https://anoboy.media/', function (err, res, html) {
            if (!err & res.statusCode == 200) {
                var $ = cheerio.load(html)
                var resultanoboylasts = []
                $('div.amv').each((i, el) => {
                    var judullastanoboy = $(el).find('h3').text();
                    var lastupdatenoboy = $(el).find('div.jamup').text();
                    var resultanoboylast = {
                        Judul: judullastanoboy,
                        Waktu: lastupdatenoboy
                    }
                    resultanoboylasts.push(resultanoboylast)
                    resolve(resultanoboylasts)
                })
            }
        })
    })
}
exports.anoboydl = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                resolve({
                    judul: $('body > div.wrap > div.container > div.pagetitle > h1').text(),
                    uptime: $('body > div.wrap > div.container > div.pagetitle > div > div > span > time').text(),
                    direct_link: $('#tontonin > source').attr('src'),
                    mforu: {
                        SD: $('#colomb > p > span:nth-child(1) > a:nth-child(3)').attr('href'),
                        HD: $('#colomb > p > span:nth-child(1) > a:nth-child(5)').attr('href')
                    },
                    zippy: {
                        SD: $('#colomb > p > span:nth-child(3) > a:nth-child(3)').attr('href'),
                        HD: $('#colomb > p > span:nth-child(3) > a:nth-child(5)').attr('href')
                    },
                    mirror: {
                        SD: $('#colomb > p > span:nth-child(5) > a:nth-child(3)').attr('href'),
                        HD: $('#colomb > p > span:nth-child(5) > a:nth-child(5)').attr('href')
                    }
                })
            })
            .catch(reject)
    })
}
exports.tebakgambar = () => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://jawabantebakgambar.net/all-answers/')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const result = [];
                let random = Math.floor(Math.random() * 2836) + 2;
                let link2 = 'https://jawabantebakgambar.net'
                $(`#images > li:nth-child(${random}) > a`).each(function (a, b) {
                    const img = link2 + $(b).find('img').attr('data-src')
                    const jwb = $(b).find('img').attr('alt')
                    result.push({
                        image: img,
                        jawaban: jwb
                    })

                    resolve(result)
                })
            })
            .catch(reject)
    })
}
exports.asahotak = () => {
    return new Promise((resolve, reject) => {
        fetch('https://www.cademedia.com/jawaban-tebak-tebakan-asah-otak')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                go = $('body').find('div.entry-content').text().split('P:')
                for (let i = 2; i < go.length; i++) {
                    x = (go[i].split('J:')[0]).trim()
                    switch (i) {
                        case 229: y = (go[i].split('J:')[1].split('Level')[0].split('Demikian')[0]).trim()
                            break; default: y = (go[i].split('J:')[1].split('Level')[0]).trim()
                    } data.push({ pertanyaan: x, jawaban: y })
                }
                // save json
                // fs.writeFileSync('./asahotak.json', JSON.stringify(data))
                resolve(data)
            }).catch(reject)
    })
}
exports.family100 = () => {
    return new Promise((resolve, reject) => {
        fetch('https://teknologital.com/kunci-jawaban-ica-ica')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                go = $('body').find('div.entry-content').text().split('Jawaban :')
                for (let i = 1; i < go.length; i++) {
                    y = (go[i - 1].split('\n')[1]).trim()
                    z = (go[i].split('\n')[0]).trim()
                    if (i !== 1) {
                        data.push({ pertanyaan: y, jawaban: z })
                    }
                }
                // save json
                // fs.writeFileSync('./ica.json', JSON.stringify(data))
                resolve(data)
            }).catch(reject)
    })
}
exports.siapakah = () => {
    return new Promise((resolve, reject) => {
        fetch('https://tutorialaplikasi.com/kunci-jawaban-tebak-siapakah-aku/')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                let data = []
                $('body').find('li').each(function (index, element) {
                    let x = $(this).html().split('<strong>')[0]
                    let y = $(this).find('strong').text()
                    data.push({ pertanyaan: x, jawaban: y })
                })
                data.splice(0, 11)
                data.splice(100, 131)
                resolve(data)
            }).catch(reject)
    })
}

function siapakah2() {
    return new Promise((resolve, reject) => {
        fetch('https://jagat-nusantara.blogspot.com/2018/01/kunci-jawaban-tebak-siapakah-aku-m.html')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                go = $('article').find('div[id="adsmiddle27044024372030888142"]').text()
                for (let i = 0; i < 534; i++) {
                    x = go.split(i + '.')[1].split('\n')[0].trim()
                    y = go.split(i + '.')[1].split('Jawaban:')[1].split('\n')[0].trim()
                    data.push({ pertanyaan: x, jawaban: y })
                } resolve(data)
            }).catch(reject)
    })
}
exports.susunkata = () => {
    return new Promise((resolve, reject) => {
        fetch('https://www.cademedia.com/jawaban-tebak-tebakan-susun-kata')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                go = $('body').find('article').text()
                for (let i = 2; i < 350; i++) {
                    v = go.split('Level ' + i)[1].split(':')[0]
                    x = go.split('Level ' + i)[1].split(':')[1]
                    if (i !== 21 && i !== 51 && i !== 101 && i !== 151 && i !== 201 && i !== 251 && i !== 301) {
                        if (i == 50 || i == 100 || i == 150 || i == 200 || i == 250 || i == 250 || i == 300) {
                            y = go.split('Level ' + i)[1].split('Jawaban')[1].split('Susun')[0]
                        } else {
                            y = go.split('Level ' + i)[1].split('Jawaban')[1].split('Level')[0]
                        }
                        data.push({ tipe: v.trim(), acak: x.replace(/(Jawaban)/gi, '').trim(), jawaban: y.replace(/:/g, '').trim() })
                        // save json
                        // fs.writeFileSync('./susunkata.json', JSON.stringify(data))
                    }
                }
                data.splice(0, 2)
                resolve(data)
            }).catch(reject)
    })
}
exports.tekateki = () => {
    return new Promise((resolve, reject) => {
        fetch('https://www.kabargames.id/kunci-jawaban-tebak-tebakan-2020')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                go = $('body').find('div.post__content').text()
                for (let i = 1; i < 201; i++) {
                    v = (go.split('Level ' + i + 'Pertanyaan:')[1].split('Jawaban')[0]).trim()
                    switch (i) {
                        case 1: x = go.split('Level ' + i + ' – 20Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 21: x = go.split('Level ' + i + ' – 40Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 41: x = go.split('Level ' + i + ' – 60Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 61: x = go.split('Level ' + i + ' – 80Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 81: x = go.split('Level ' + i + ' – 100Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 101: x = go.split('Level ' + i + ' – 120Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 121: x = go.split('Level ' + i + ' – 140Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 141: x = go.split('Level ' + i + ' – 160Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 161: x = go.split('Level ' + i + ' – 180Level ' + i)[1].split('Jawaban:')[1]
                            break
                        case 181: x = go.split('Level ' + i + ' – 200Level ' + i)[1].split('Jawaban:')[1]
                            break
                        default: x = go.split('Level ' + i)[1].split('Jawaban:')[1]
                    }
                    if (i == 20 || i == 40 || i == 60 || i == 80 || i == 100 || i == 120 || i == 140 || i == 160 || i == 180) {
                        y = (x.split('Kunci')[0]).trim()
                    } else if (i == 200) {
                        y = (x.split('Nah')[0]).trim()
                    } else {
                        y = (x.split('Level')[0]).trim()
                    }
                    data.push({ pertanyaan: v, jawaban: y })
                    // save json
                    // fs.writeFileSync('./tekateki.json', JSON.stringify(data))
                } resolve(data)
            }).catch(reject)
    })
}
exports.pstore = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://p-store.net/search?query=${query}&page=1`).then(async tod => {
            const $ = cheerio.load(tod.data)

            hasil = []

            $("div.col-xs-6.col-md-4.col-cusong").each(function (i, cuk) {
                title = $(cuk).find("p > a").text();
                thumb = $(cuk).find("a > img").attr("src");
                link = $(cuk).find("p > a").attr("href");
                harga = $(cuk).find("div.price").text();
                const Data = {
                    title: title,
                    thumb: thumb,
                    link: link,
                    harga: harga
                }
                hasil.push(Data)

            })
            resolve(hasil)
        });
    });
}
exports.wamods = async (search) => {
    if (!search) return "No Querry Input! Bakaaa >\/\/<";
    try {
        const res = await axios.request(`https://www.whatsappmods.net/search?q=${search}`, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
            }
        });
        let hasil = [];
        const $ = cheerio.load(res.data);
        $('div.gmr-clearfix').each(function (a, b) {
            let apk_name = $(b).find('h2.post-title.entry-title > a').text();
            let apk_url = $(b).find('a').attr('href');
            let apk_image = $(b).find('img.post-thumbnail').attr('src');
            let apk_desc = $(b).find('div.post-item.entry-content').text().split(/[\n]|-|  /g).join("");
            const result = {
                status: res.status,
                apk_name,
                apk_url,
                apk_image,
                apk_desc
            };
            hasil.push(result);
        });
        akhir = hasil.filter(v => v.apk_name !== '');
        return akhir;
    } catch (error404) {
        return "=> Error =>" + error404;
    }
}
exports.aminoapps = async (komu) => {
    if (!komu) {
        return new TypeError("No Querry Input! Bakaaa >\/\/<")
    }
    try {
        const res = await axios.get(`https://aminoapps.com/search/community?q=` + komu, {
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36",
            }
        })
        const hasil = [];
        const $ = cheerio.load(res.data);
        $('li.community-item.list-item').each(function (a, b) {
            let title = $(b).find('h4.name.font-montserrat-black').text()
            let desc = $(b).find('p.tagline').text()
            let url = $(b).find('a').attr('href')
            let member_count = $(b).find('div.desc > div.member-count').text().replace(/\n/g, '').replace(/  /g, '')
            let image = $(b).find('img.logo').attr('src').replace('//', '')
            const result = {
                status: res.status,
                community: title,
                community_link: 'https://aminoapps.com' + url,
                community_thumb: image,
                community_desc: desc,
                member_count
            }
            hasil.push(result)
        })
        return hasil
    } catch (error404) {
        return new Error("=> Error =>" + error404)
    }
}
exports.halah = (text) => {
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "a")
    return text
}
exports.hilih = (text) => {
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "i")
    return text
}
exports.huluh = (text) => {
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "u")
    return text
}
exports.kapital = (text) => {
    const K = "[abcdefghijklmnopqrstuvwxyz]"
    text = text.replace(K, `${["ABCDEFGHIJKLMNOPQRSTUVWXYZ"]}`)
    return text
}
exports.heleh = (text) => {
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "e")
    return text
}
exports.holoh = (text) => {
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "o")
    return text
}
exports.zodiakMingguan = async (querry) => {
    const link = await axios.get(`https://m.fimela.com/zodiak/${querry}/minggu-ini`)
    const $ = cheerio.load(link.data)
    let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
    let judul = $('body > div > div > div').find('div > div > div.zodiak--content-header__text > h5').text().trim()
    let date = $('body > div > div > div').find('div> div.zodiak--content-header__text > span').text().trim()
    let hoki = $('body > div > div > div > div').find('div > div > div:nth-child(1) > div > span').text().trim()
    let umum = $('body > div > div > div > div').find(' div > div > div:nth-child(1) > div > p').text().trim()
    let love = $('body > div > div > div > div').find(' div > div > div:nth-child(2) > div > p').text().trim()
    let keuangan = $('body > div > div > div > div').find(' div > div > div:nth-child(3) > div > p').text().trim()
    const result = {
        status: link.status,
        data: {
            judul: judul,
            thumb: thumb,
            date: date,
            nomer_hoki: hoki,
            isi: {
                umum: umum,
                love: love,
                keuangan: keuangan
            }
        }
    }
    return result
}
exports.zodiakHarian = async (querry) => {
    let Hasil = []
    await axios.request(`https://www.fimela.com/zodiak/${querry}`, {
        method: "GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        }
    }).then(({ data }) => {
        const $ = cheerio.load(data)
        let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
        let judul = $('body > div > div.container-main > div.container-article > div').find('div.zodiak--content-header__right > div.zodiak--content-header__text > h5').text().trim()
        let tanggal = $('body > div > div > div > div > div > div > span').text().trim()
        let nomer_ = $('body > div > div > div > div > div > div').find('div:nth-child(1) > div.zodiak--content__content > span').text().trim()
        let isi = []
        $('body > div > div > div > div > div > div').each(function (anu, RA) {
            let umum = $(RA).find('div:nth-child(1) > div.zodiak--content__content > p').text().trim() || undefined
            let love = $(RA).find('div:nth-child(2) > div.zodiak--content__content > p').text().trim() || undefined
            let keuangan = $(RA).find('div:nth-child(3) > div.zodiak--content__content > p').text().trim() || undefined
            let Data = {
                umum: umum,
                love: love,
                keuangan: keuangan
            }
            isi.push(Data)
        })
        let ramal = []
        isi.map(ryuzin => {
            if (ryuzin.umum === undefined) return
            if (ryuzin.love === undefined) return
            if (ryuzin.keuangan === undefined) return
            ramal.push(ryuzin)
        })
        const result = {
            judul: judul,
            thumb: thumb,
            date: tanggal,
            no_hoki: nomer_,
            teori: ramal[0]
        }
        Hasil.push(result)
    })
    return Hasil[0]
}
exports.covid = () => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://covid19.go.id/')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#case > div > div > div > div > div:nth-child(2)').each(function (a, b) {
                    const pindo = $(b).find('div:nth-child(3) > strong').text()
                    const mindo = $(b).find('div:nth-child(5) > strong').text()
                    const sindo = $(b).find('div:nth-child(4) > strong').text()
                    const upindo = $(b).find('div.pt-4.text-color-black.text-1').text().trim()
                    $('#case > div > div > div > div > div:nth-child(1)').each(function (c, d) {
                        const neg = $(d).find('div:nth-child(3) > strong').text()
                        const pglo = $(d).find('div:nth-child(4) > strong').text()
                        const nglo = $(d).find('div:nth-child(5) > strong').text()
                        const up = $(d).find('div.pt-4.text-color-grey.text-1').text().trim()
                        const result = {
                            indo: {
                                positif_indo: pindo,
                                meninggal_indo: mindo,
                                sembuh_indo: sindo,
                                update_indo: upindo.split(':')[1]
                            },
                            global: {
                                negara: neg,
                                positif: pglo,
                                meninggal: nglo,
                                update: up.split(':')[1].split('\n')[0]

                            }
                        }
                        hasil.push(result)
                    })
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
exports.cariresep = async (query) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://resepkoki.id/?s=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const link = [];
                const judul = [];
                const upload_date = [];
                const format = [];
                const thumb = [];
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function (a, b) {
                    link.push($(b).attr('href'))
                })
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function (c, d) {
                    let jud = $(d).text();
                    judul.push(jud)
                })
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > div.archive-item-author-meta > div > div').each(function (e, f) {
                    let upl = $(f).text();
                    upload_date.push(upl)
                })
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function (g, h) {
                    thumb.push($(h).attr('src'))
                })
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: judul[i],
                        upload_date: upload_date[i],
                        thumb: thumb[i],
                        link: link[i]
                    })
                }
                const result = {
                    data: format
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.ytstalk = async (username) => {
    const browsers = await puppeter.launch();
    const page = await browsers.newPage();
    await page.goto(`https://www.youtube.com/results?search_query=${username}`);
    await page.waitForTimeout(3000)
    const bodyHandler = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandler);
    await bodyHandler.dispose();
    await browsers.close();
    const $ = cheerio.load(html);
    let id = $('#main-link').attr('href')
    let youtube = 'https://www.youtube.com' + id + '/about'
    const browser = await puppeter.launch();
    const site = await browser.newPage();
    await site.goto(youtube)
    await site.waitForTimeout(3000)
    const bodyHandling = await site.$('body');
    const htmldata = await site.evaluate(body => body.innerHTML, bodyHandling);
    await bodyHandling.dispose();
    await browser.close();
    const c = cheerio.load(htmldata)
    let nickname = c('#text').text().trim()
    let subcriber = c('#subscriber-count').text().trim()
    let join = c('#right-column').find('yt-formatted-string:nth-child(2) > span:nth-child(2)').text().trim()
    let viewers = c('#right-column').find(' yt-formatted-string:nth-child(3)').text().trim()
    let thumb = c('#img').attr('src');
    let desc = c('#description').text().trim()
    let result = {
        username: nickname.replace('Skip navigationSign in', ''),
        subcriber: subcriber,
        bergabung: join,
        penonton: viewers,
        thumb: thumb,
        desk: desc
    }
    return result
}
/*exports.sswebpdf = async (url, fpage = false) => {
    const getBrowser = async (opts = {}) => {
        const chromeOptions = {
            headless: true,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            timeout: 120000,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
                "--no-cache"
            ],
            ...opts
        }
        return await require('puppeteer').launch(chromeOptions)
    }
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 300000
    })
    const screenshot = await page.pdf({
        type: 'png',
        fullPage: fpage
    })
    await browser.close()
    return screenshot
}
exports.sswebhp = async (url, fpage = false) => {
    const getBrowser = async (opts = {}) => {
        const chromeOptions = {
            headless: true,
            defaultViewport: {
                width: 720,
                height: 1080
            },
            timeout: 120000,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
                "--no-cache"
            ],
            ...opts
        }
        return await require('puppeteer').launch(chromeOptions)
    }
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; SM-A205F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36')
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 300000
    })
    const screenshot = await page.screenshot({
        type: 'png',
        fullPage: fpage
    })
    await browser.close()
    return screenshot
}
exports.sswebpc = async (url, fpage = false) => {
    const getBrowser = async (opts = {}) => {
        const chromeOptions = {
            headless: true,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            timeout: 120000,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
                "--no-cache"
            ],
            ...opts
        }
        return await require('puppeteer').launch(chromeOptions)
    }
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 300000
    })
    const screenshot = await page.screenshot({
        type: 'png',
        fullPage: fpage
    })
    await browser.close()
    return screenshot
}*/
exports.gempa = async () => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const drasa = [];
                $('table > tbody > tr:nth-child(1) > td:nth-child(6) > span').get().map((rest) => {
                    dir = $(rest).text();
                    drasa.push(dir.replace('\t', ' '))
                })
                teks = ''
                for (let i = 0; i < drasa.length; i++) {
                    teks += drasa[i] + '\n'
                }
                const rasa = teks
                const format = {
                    imagemap: $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
                    magnitude: $('table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
                    kedalaman: $('table > tbody > tr:nth-child(1) > td:nth-child(5)').text(),
                    wilayah: $('table > tbody > tr:nth-child(1) > td:nth-child(6) > a').text(),
                    waktu: $('table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
                    lintang_bujur: $('table > tbody > tr:nth-child(1) > td:nth-child(3)').text(),
                    dirasakan: rasa
                }
                const result = {
                    data: format
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.serverminecraft = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://minecraftpocket-servers.com/country/indonesia/`).then(tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("tr").each(function (c, d) {
                ip = $(d).find("button.btn.btn-secondary.btn-sm").eq(1).text().trim().replace(':19132', '')
                port = '19132'
                versi = $(d).find("a.btn.btn-info.btn-sm").text()
                player = $(d).find("td.d-none.d-md-table-cell > strong").eq(1).text().trim()
                const Data = {
                    ip: ip,
                    port: port,
                    versi: versi,
                    player: player
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    })
}
exports.apkmirror = async (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const nama = [];
                const developer = [];
                const lupdate = [];
                const size = [];
                const down = [];
                const version = [];
                const link = [];
                const format = [];
                $('#content > div > div > div.appRow > div > div > div > h5 > a').each(function (a, b) {
                    nem = $(b).text();
                    nama.push(nem)
                })
                $('#content > div > div > div.appRow > div > div > div > a').each(function (c, d) {
                    dev = $(d).text();
                    developer.push(dev)
                })
                $('#content > div > div > div.appRow > div > div > div > div.downloadIconPositioning > a').each(function (e, f) {
                    link.push('https://www.apkmirror.com' + $(f).attr('href'))
                })
                $('#content > div > div > div.infoSlide > p > span.infoslide-value').each(function (g, h) {
                    data = $(h).text();
                    if (data.match('MB')) {
                        size.push(data)
                    }
                    else if (data.match('UTC')) {
                        lupdate.push(data)
                    }
                    else if (!isNaN(data) || data.match(',')) {
                        down.push(data)
                    }
                    else {
                        version.push(data)
                    }
                })
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: nama[i],
                        dev: developer[i],
                        size: size[i],
                        version: version[i],
                        uploaded_on: lupdate[i],
                        download_count: down[i],
                        link: link[i]
                    })
                }
                const result = {
                    data: format
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.textmakervid = async (text1, style) => {
    if (style == 'poly') {
        var tstyle = 0
    } else if (style == 'bold') {
        var tstyle = 1
    } else if (style == 'glowing') {
        var tstyle = 2
    } else if (style == 'colorful') {
        var tstyle = 3
    } else if (style == 'army') {
        var tstyle = 4
    } else if (style == 'retro') {
        var tstyle = 5
    }
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: "https://photooxy.com/other-design/make-a-video-that-spells-your-name-237.html",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
                optionNumber_0: tstyle,
                text_1: text1,
                login: 'OK'
            }
        };
        request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body)
            const result = {
                url: $('div.btn-group > a').attr('href')
            }
            resolve(result);
        });
    })
}
exports.ghstalk = (username) => {
    url = `https://api.github.com/users/${username}`;
    return axios.get(url)
        .then(data => {
            return data.data
        })
}
exports.xnxx = (query) => {
    return new Promise((resolve, reject) => {
        const baseurl = 'https://www.xnxx.com'
        fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' })
            .then(res => res.text())
            .then(res => {
                let $ = cheerio.load(res, {
                    xmlMode: false
                });
                let title = [];
                let url = [];
                let desc = [];
                let results = [];

                $('div.mozaique').each(function (a, b) {
                    $(b).find('div.thumb').each(function (c, d) {
                        url.push(baseurl + $(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
                    })
                })
                $('div.mozaique').each(function (a, b) {
                    $(b).find('div.thumb-under').each(function (c, d) {
                        desc.push($(d).find('p.metadata').text())
                        $(d).find('a').each(function (e, f) {
                            title.push($(f).attr('title'))
                        })
                    })
                })
                for (let i = 0; i < title.length; i++) {
                    results.push({
                        title: title[i],
                        info: desc[i],
                        link: url[i]
                    })
                }
                resolve({
                    code: 200,
                    status: true,
                    result: results
                })
            })
            .catch(err => reject({ code: 503, status: false, result: err }))
    })
}
exports.xnxxdl = (URL) => {
    return new Promise((resolve, reject) => {
        fetch(`${URL}`, { method: 'get' })
            .then(res => res.text())
            .then(res => {
                let $ = cheerio.load(res, {
                    xmlMode: false
                });
                const title = $('meta[property="og:title"]').attr('content');
                const duration = $('meta[property="og:duration"]').attr('content');
                const image = $('meta[property="og:image"]').attr('content');
                const videoType = $('meta[property="og:video:type"]').attr('content');
                const videoWidth = $('meta[property="og:video:width"]').attr('content');
                const videoHeight = $('meta[property="og:video:height"]').attr('content');
                const info = $('span.metadata').text();
                const videoScript = $('#video-player-bg > script:nth-child(6)').html();
                const files = {
                    low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
                    high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
                    HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
                    thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
                    thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
                    thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
                    thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
                };
                resolve({
                    status: 200,
                    result: {
                        title,
                        URL,
                        duration,
                        image,
                        videoType,
                        videoWidth,
                        videoHeight,
                        info,
                        files
                    }
                })
            })
            .catch(err => reject({ code: 503, status: false, result: err }))
    })
}
exports.sfilesearch = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://sfile.mobi/search.php?q=' + query + '&search=Search')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const result = [];
                const link = [];
                const neme = [];
                $('div.w3-card.white > div.list > a').each(function (a, b) {
                    link.push($(b).attr('href'))
                })
                $('div.w3-card.white > div.list > a').each(function (c, d) {
                    let name = $(d).text();
                    neme.push(name)
                })
                for (let i = 0; i < link.length; i++) {
                    result.push({
                        nama: neme[i],
                        link: link[i]
                    })
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.rexdl = async (query) => {
    return new Promise((resolve) => {
        axios.get('https://rexdl.com/?s=' + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const judul = [];
                const jenis = [];
                const date = [];
                const desc = [];
                const link = [];
                const thumb = [];
                const result = [];
                $('div > div.post-content').each(function (a, b) {
                    judul.push($(b).find('h2.post-title > a').attr('title'))
                    jenis.push($(b).find('p.post-category').text())
                    date.push($(b).find('p.post-date').text())
                    desc.push($(b).find('div.entry.excerpt').text())
                    link.push($(b).find('h2.post-title > a').attr('href'))
                })
                $('div > div.post-thumbnail > a > img').each(function (a, b) {
                    thumb.push($(b).attr('data-src'))
                })
                for (let i = 0; i < judul.length; i++) {
                    result.push({
                        judul: judul[i],
                        kategori: jenis[i],
                        upload_date: date[i],
                        deskripsi: desc[i],
                        thumb: thumb[i],
                        link: link[i]
                    })
                }
                resolve(result)
            })
    })
}
exports.happymod = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.happymod.com/search.html?q=${query}`).then(async tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.pdt-app-box").each(function (c, d) {
                name = $(d).find("a").text().trim();
                icon = $(d).find("img.lazy").attr('data-original');
                link = $(d).find("a").attr('href');
                link2 = `https://www.happymod.com${link}`
                const Data = {

                    icon: icon,
                    name: name,
                    link: link2
                }
                hasil.push(Data)
            })
            resolve(hasil);
        }).catch(reject)
    });
}
exports.happymoddl = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(link)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const link = [];
                const jlink = [];
                const result = [];
                const title = $('body > div > div.container-left > section:nth-child(1) > div > h1').text()
                const info = $('body > div > div.container-left > section:nth-child(1) > div > ul').text()
                $('body > div.container-row.clearfix.container-wrap.pdt-font-container > div.container-left > section:nth-child(1) > div > div:nth-child(3) > div > p > a').each(function (a, b) {
                    deta = $(b).text();
                    jlink.push(deta)
                    if ($(b).attr('href').startsWith('/')) {
                        link.push('https://happymod.com' + $(b).attr('href'))
                    } else {
                        link.push($(b).attr('href'))
                    }
                })
                for (let i = 0; i < link.length; i++) {
                    result.push({
                        title: jlink[i],
                        dl_link: link[i]
                    })
                }
                console.log(link)
                resolve({
                    title: title,
                    info: info.replace(/\t|- /g, ''),
                    download: link
                })
            })
            .catch(reject)
    })
}
exports.zippydl = async (u) => {
    const zippy = await axios({ method: 'GET', url: u })
    const $ = cheerio.load(zippy.data)
    if (!$('#dlbutton').length) {
        return { status: zippy.status, error: true, message: $('#lrbox>div').first().text().trim() }
    }
    const filename0 = $('title').text()
    const filename = filename0.replace('Zippyshare.com - ', '')
    const url = _url.parse($('.flagen').attr('href'), true)
    const urlori = _url.parse(u)
    const key = url.query['key']
    let time;
    let dlurl;
    try {
        time = /var b = ([0-9]+);$/gm.exec($('#dlbutton').next().html())[1]
        dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (2 + 2 * 2 + parseInt(time)) + '3' + '/' + filename
    } catch (error) {
        time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($('#dlbutton').next().html())[1])
        dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (time) + '/' + filename
    }
    return { status: zippy.status, error: false, url: dlurl, name: filename }
}
exports.pinterestdl = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `https://pinterestvideodownloader.com/`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                "cookie": "_ga=GA1.2.894954552.1635394717;"
            },
            formData: {
                url: link
            }
        };

        request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body)
            const link = [];
            const judul = [];
            const result = [];
            $('#content > center > div > div.col-md-4.col-md-offset-4 > table > tbody > tr > td > a').each(function (a, b) {
                deta = $(b).text();
                judul.push(deta)
                link.push($(b).attr('href'))
            })
            for (let i = 0; i < link.length; i++) {
                result.push({
                    dlinfo: judul[i],
                    link: link[i]
                })
            }
            resolve({
                result: result
            });
        });
    })
}
exports.rexdldown = async (link) => {
    return new Promise((resolve) => {
        axios.get(link)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const link = [];
                const url = [];
                const link_name = [];
                const judul = $('#page > div > div > div > section > div:nth-child(2) > article > div > h1.post-title').text();
                const plink = $('#page > div > div > div > section > div:nth-child(2) > center:nth-child(3) > h2 > span > a').attr('href')
                axios.get(plink)
                    .then(({
                        data
                    }) => {
                        const $$ = cheerio.load(data)
                        $$('#dlbox > ul.dl > a > li > span').each(function (a, b) {
                            deta = $$(b).text();
                            link_name.push(deta)
                        })
                        $$('#dlbox > ul.dl > a').each(function (a, b) {
                            url.push($$(b).attr('href'))
                        })
                        for (let i = 0; i < link_name.length; i++) {
                            link.push({
                                link_name: link_name[i],
                                url: url[i]
                            })
                        }
                        resolve({
                            judul: judul,
                            update_date: $$('#dlbox > ul.dl-list > li.dl-update > span:nth-child(2)').text(),
                            version: $$('#dlbox > ul.dl-list > li.dl-version > span:nth-child(2)').text(),
                            size: $$('#dlbox > ul.dl-list > li.dl-size > span:nth-child(2)').text(),
                            download: link
                        })
                    })
            })
    })
}
exports.produkhalal = (produk) => {
    return new Promise((resolve, reject) => {
        fetch('https://www.halalmui.org/mui14/searchproduk/search?kategori=nama_produk&katakunci=' + produk, {
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
            }
        })
            .then(rsp => rsp.text())
            .then((data) => {
                const $ = cheerio.load(data)
                const url = []
                $('tbody > tr > td').get().map((rest) => {
                    url.push($(rest).find('a').attr('href'))
                })
                const randomUrl = url[Math.floor(Math.random() * url.length)]
                fetch(randomUrl, {
                    method: 'GET',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
                    }
                })
                    .then(rsp => rsp.text())
                    .then((data) => {
                        const $$ = cheerio.load(data)
                        resolve({
                            status: true,
                            message: 'X - Far Dev',
                            result: {
                                produk: $$('span').eq(0).text().replace('Nama Produk : ', ''),
                                sertifikat: $$('span').eq(1).text().replace('Nomor Sertifikat :', ''),
                                produsen: $$('span').eq(2).text().replace('Nama Produsen :', ''),
                                expired: $$('span').eq(3).text().replace('Expired Date :', '')
                            }
                        })
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}
exports.igstory = (username) => {
    return new Promise(async (resolve, reject) => {
        axios.request({
            url: 'https://www.instagramsave.com/instagram-story-downloader.php',
            method: 'GET',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
            }
        })
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const token = $('#token').attr('value')
                let config = {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                        "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    },
                    data: {
                        'url': 'https://www.instagram.com/' + username,
                        'action': 'story',
                        'token': token
                    }
                }
                axios.post('https://www.instagramsave.com/system/action.php', qs.stringify(config.data), { headers: config.headers })
                    .then(({ data }) => {
                        resolve(data.medias)
                    })
            })
            .catch(reject)
    })
}
exports.quotesislami = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.brilio.net/wow/40-kata-kata-bijak-islami-kehidupan-inspiratif-dan-menyentuh-hati-200415t.html')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let quotes = []
                $('body > div:nth-child(12) > div.wrapper-col5.col-md-8.relative > div.body-paragraph > div > p').each(function (a, b) {
                    qu = $(b).text().replace(/[0-9]/g, '').split('. ')[1]
                    quotes.push(qu)
                })
                random = quotes[Math.floor(Math.random() * quotes.length)]
                resolve({ status: 200, creator: 'Irfan', quotesislami: random })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.quotesdilan = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.brilio.net/ngakak/40-kata-kata-gombal-dilan-romantis-dan-bikin-baper-191108a.html')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let quotes = []
                $('body > div:nth-child(12) > div.wrapper-col5.col-md-8.relative > div.body-paragraph > div > p').each(function (a, b) {
                    qu = $(b).text().replace(/[0-9]/g, '').split('. ')[1]
                    quotes.push(qu)
                })
                random = quotes[Math.floor(Math.random() * quotes.length)]
                resolve({ status: 200, creator: 'Irfan', quotesdilan: random })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.quotesbucin = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.brilio.net/wow/40-kata-kata-bucin-singkat-terbaik-lucu-dan-bikin-baper-2003053.html')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let quotes = []
                $('body > div:nth-child(12) > div.wrapper-col5.col-md-8.relative > div.body-paragraph > div > p').each(function (a, b) {
                    qu = $(b).text().replace(/[0-9]/g, '').split('. ')[1]
                    quotes.push(qu)
                })
                random = quotes[Math.floor(Math.random() * quotes.length)]
                resolve({ status: 200, creator: 'Irfan', quotesbucin: random })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.quotesbijak = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.brilio.net/wow/60-kata-kata-quote-tentang-hidup-terbaik-simpel-penuh-makna-2006054.html')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let quotes = []
                $('body > div:nth-child(12) > div.wrapper-col5.col-md-8.relative > div.body-paragraph > div > p').each(function (a, b) {
                    qu = $(b).text().replace(/[0-9]/g, '').split('. ')[1]
                    quotes.push(qu)
                })
                random = quotes[Math.floor(Math.random() * quotes.length)]
                resolve({ status: 200, creator: 'Irfan', quotesbijak: random })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.quotessadboy = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.brilio.net/wow/40-kata-kata-galau-cinta-paling-sedih-dan-bikin-baper-191022i.html')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let quotes = []
                $('body > div:nth-child(12) > div.wrapper-col5.col-md-8.relative > div.body-paragraph > div > p').each(function (a, b) {
                    qu = $(b).text().replace(/[0-9]/g, '').split('. ')[1]
                    quotes.push(qu)
                })
                random = quotes[Math.floor(Math.random() * quotes.length)]
                resolve({ status: 200, creator: 'Irfan', quotessadboy: random })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.quotesanime = () => {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184)
        axios.get('https://otakotaku.com/quote/feed/' + page)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const hasil = []
                $('div.kotodama-list').each(function (l, h) {
                    hasil.push({
                        link: $(h).find('a').attr('href'),
                        gambar: $(h).find('img').attr('data-src'),
                        karakter: $(h).find('div.char-name').text().trim(),
                        anime: $(h).find('div.anime-title').text().trim(),
                        episode: $(h).find('div.meta').text(),
                        up_at: $(h).find('small.meta').text(),
                        quotes: $(h).find('div.quote').text().trim()
                    })
                })
                resolve(hasil)
            }).catch(reject)
    })
}
function slineMetadata(id) {
    return new Promise((resolve, reject) => {
        axios.get(`http://dl.stickershop.line.naver.jp/products/0/0/1/${id}/android/productInfo.meta`)
            .then(({ data }) => {
                const id = data.packageId
                const title = data.title.en
                const author = data.author.en
                const ani = data.hasAnimation
                let stickers = []
                data.stickers.forEach((rest) => {
                    stickers.push(rest)
                })
                resolve({
                    id: id,
                    title: title,
                    animate: ani,
                    author: author,
                    stickers: stickers
                })
            }).catch(reject)
    })
}

exports.linesticker = (url) => {
    return new Promise((resolve, reject) => {
        const id = url.match(/[0-9]/g).join('')
        slineMetadata(id)
            .then(async (a) => {
                const id = a.id
                const author = a.author
                const title = a.title
                const stiker = a.stickers
                let urls = []
                if (a.animate) {
                    for (let i = 0; i < stiker.length; i++) {
                        urls.push(`https://sdl-stickershop.line.naver.jp/products/0/0/1/${id}/android/animation/${stiker[0].id}.png`)
                    }
                } else if (!a.animate) {
                    for (let i = 0; i < stiker.length; i++) {
                        urls.push(`http://dl.stickershop.line.naver.jp/stickershop/v1/sticker/${stiker[0].id}/android/sticker.png`)
                    }
                }
                resolve({
                    status: true,
                    result: {
                        author: author,
                        id: id,
                        title: title,
                        animated: a.animate,
                        stickers: urls
                    }
                })
            }).catch(reject)
    })
}
/*exports.kbbi = (kata) => new Promise((resolve, reject) => {
    const url = 'https://kbbi.kemdikbud.go.id/entri/';
    try {
        var model = {
            lema: 'h2',
            arti: ['ol li', 'ul.adjusted-par']
        }
        var kata2 = kata;
        fetch(url + kata)
            .then((res) => res.text())
            .then((body) => {
                var log = scrapy.extract(body, model)
                if (log.arti == null) {
                    model = {
                        lema: 'h2',
                        arti: ['ul.adjusted-par']
                    }
                    fetch(url + kata2)
                        .then((res) => res.text())
                        .then((body) => {
                            log = scrapy.extract(body, model)
                            if (log.arti != null) {
                                var kata3 = log.arti.map(s => s.slice(1).split("  ").join(""));
                                resolve({
                                    lema: log.lema,
                                    arti: kata3
                                })
                            }
                            else { reject("Arti Tidak Ada Atau IP Terkena Limit"); }
                        })
                }
                else {
                    var kata = log.arti.map(s => s.slice(1).split("  ").join(""));
                    resolve({
                        lema: log.lema,
                        arti: kata
                    })
                }
            })
    } catch (err) {
        reject(err)
    }
})*/
exports.infoloker = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.jobstreet.co.id/id/job-search/${query}-jobs/`)
            .then((data) => {
                //console.log(data.data)
                const $ = cheerio.load(data.data)
                const job = [];
                const perusahaan = [];
                const daerah = [];
                const format = [];
                const link = [];
                const upload = [];
                $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a > div').each(function (a, b) {
                    deta = $(b).text();
                    job.push(deta)
                })
                $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > span').each(function (a, b) {
                    deta = $(b).text();
                    perusahaan.push(deta)
                })
                $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > span > span').each(function (a, b) {
                    deta = $(b).text();
                    daerah.push(deta)
                })
                $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a').each(function (a, b) {
                    link.push($(b).attr('href'))
                })
                $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div.sx2jih0.zcydq852.zcydq842.zcydq872.zcydq862.zcydq82a.zcydq832.zcydq8d2.zcydq8cq > div.sx2jih0.zcydq832.zcydq8cq.zcydq8c6.zcydq882 > time > span').each(function (a, b) {
                    deta = $(b).text();
                    upload.push(deta)
                })
                for (let i = 0; i < job.length; i++) {
                    format.push({
                        job: job[i],
                        perusahaan: perusahaan[i],
                        daerah: daerah[i],
                        upload: upload[i],
                        link_Detail: 'https://www.jobstreet.co.id' + link[i]
                    })
                }
                resolve(format)
            })
            .catch(reject)
    })
}
exports.randomcerpen = () => {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const link = yield axios.default.get(`http://cerpenmu.com/`);
            if (link.status !== 200)
                return;
            const $ = cheerio.default.load(link.data);
            const link_input = [];
            $('#sidebar > div:nth-child(9) > ul').each(function (_a, b) {
                $(b).find('li').each(function (_tyu, zu) {
                    const url = $(zu).find('a').attr('href');
                    link_input.push(url);
                });
            });
            const random = link_input[Math.floor(Math.random() * (link_input.length))];
            const Url = yield axios.default.get(random);
            if (Url.status !== 200)
                resolve({ status: Url.status, mess: "ERROR" });
            const ch = cheerio.default.load(Url.data);
            const Data = [];
            ch('#content > article').each(function (_hm, to) {
                ch(to).find('article').each(function (_chu, chuwi) {
                    const Url = ch(chuwi).find('h2 > a').attr('href');
                    Data.push(Url);
                });
            });
            const acak = Data[Math.floor(Math.random() * (Data.length))];
            yield axios.default.get(acak).then(respon => {
                if (respon.status !== 200)
                    return;
                const $ = cheerio.default.load(respon.data);
                const judul = $('#content').find('article > h1').text().trim();
                const kategori = $('#content').find('article > a:nth-child(4)').text().trim();
                const cerita = $('#content').find('article').text().trim();
                const res = {
                    status: respon.status,
                    author: "X - Far Dev",
                    data: {
                        judul: judul,
                        kategori: kategori,
                        cerita: cerita
                    }
                };
                resolve(res);
            }).catch(reject);
        }));
    });
}
exports.wikipedia = async (query) => {
    const res = await axios.get(`https://id.m.wikipedia.org/w/index.php?search=${query}`)
    const $ = cheerio.load(res.data)
    const hasil = []
    let wiki = $('#mf-section-0').find('p').text()
    let thumb = $('#mf-section-0').find('div > div > a > img').attr('src')
    thumb = thumb ? thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
    thumb = 'https:' + thumb
    let judul = $('h1#section_0').text()
    hasil.push({ wiki, thumb, judul })
    return hasil
}
exports.lirik = (judul) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://www.musixmatch.com/search/' + judul)
            .then(async ({ data }) => {
                const $ = cheerio.load(data)
                const hasil = {};
                let limk = 'https://www.musixmatch.com'
                const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
                await axios.get(link)
                    .then(({ data }) => {
                        const $$ = cheerio.load(data)
                        hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
                        $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function (a, b) {
                            hasil.lirik = $$(b).find('span > p > span').text() + '\n' + $$(b).find('span > div > p > span').text()
                        })
                    })
                resolve(hasil)
            })
            .catch(reject)
    })
}
exports.wallpaperhd = (chara) => {
    return new Promise((resolve, reject) => {
        axios.get('https://wall.alphacoders.com/search.php?search=' + chara + '&filter=4K+Ultra+HD')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const result = [];
                $('div.boxgrid > a > picture').each(function (a, b) {
                    result.push($(b).find('img').attr('src').replace('thumbbig-', ''))
                })
                resolve(result)
            })
            .catch(reject)
    })
}
exports.playstore = (name) => {
    return new Promise((resolve, reject) => {
        axios.get('https://play.google.com/store/search?q=' + name + '&c=apps')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let ln = [];
                let nm = [];
                let dv = [];
                let lm = [];
                const result = [];
                $('div.wXUyZd > a').each(function (a, b) {
                    const link = 'https://play.google.com' + $(b).attr('href')
                    ln.push(link);
                })
                $('div.b8cIId.ReQCgd.Q9MA7b > a > div').each(function (d, e) {
                    const name = $(e).text().trim()
                    nm.push(name);
                })
                $('div.b8cIId.ReQCgd.KoLSrc > a > div').each(function (f, g) {
                    const dev = $(g).text().trim();
                    dv.push(dev)
                })
                $('div.b8cIId.ReQCgd.KoLSrc > a').each(function (h, i) {
                    const limk = 'https://play.google.com' + $(i).attr('href');
                    lm.push(limk);
                })
                for (let i = 0; i < ln.length; i++) {
                    result.push({
                        name: nm[i],
                        link: ln[i],
                        developer: dv[i],
                        link_dev: lm[i]
                    })
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.carigroup = (nama) => {
    return new Promise((resolve, reject) => {
        axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=' + nama + '&searchby=name')
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const lnk = [];
                const nm = [];
                $('div.wa-chat-title-container').each(function (a, b) {
                    const limk = $(b).find('a').attr('href');
                    lnk.push(limk)
                })
                $('div.wa-chat-title-text').each(function (c, d) {
                    const name = $(d).text();
                    nm.push(name)
                })
                for (let i = 0; i < lnk.length; i++) {
                    result.push({
                        nama: nm[i].split('. ')[1],
                        link: lnk[i].split('?')[0]
                    })
                }
                resolve(result)
            })
            .catch(reject)
    })
}
exports.igstalk = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            axios.get('https://www.instagram.com/' + username + '/?__a=1', {
                headers: {
                    Cookie: `sessionid=1548633294%3AqTFgHr7mE6tmU8%3A13`
                }
            }).then(({ data }) => {
                const user = data.graphql.user
                resolve({
                    id: user.id,
                    biography: user.biography,
                    subscribersCount: user.edge_followed_by.count,
                    subscribtions: user.edge_follow.count,
                    fullName: user.full_name,
                    highlightCount: user.highlight_reel_count,
                    isBusinessAccount: user.is_business_account,
                    isRecentUser: user.is_joined_recently,
                    accountCategory: user.business_category_name,
                    linkedFacebookPage: user.connected_fb_page,
                    isPrivate: user.is_private,
                    isVerified: user.is_verified,
                    profilePic: user.profile_pic_url,
                    profilePicHD: user.profile_pic_url_hd,
                    username: user.username,
                    postsCount: user.edge_owner_to_timeline_media.count,
                    posts: user.edge_owner_to_timeline_media.edges.map(edge => {
                        let hasCaption = edge.node.edge_media_to_caption.edges[0];
                        return {
                            id: edge.node.id,
                            shortCode: edge.node.shortcode,
                            url: `https://www.instagram.com/p/${edge.node.shortcode}/`,
                            dimensions: edge.node.dimensions,
                            imageUrl: edge.node.display_url,
                            isVideo: edge.node.is_video,
                            caption: hasCaption ? hasCaption.node.text : '',
                            commentsCount: edge.node.edge_media_to_comment.count,
                            commentsDisabled: edge.node.comments_disabled,
                            timestamp: edge.node.taken_at_timestamp,
                            likesCount: edge.node.edge_liked_by.count,
                            location: edge.node.location,
                            children: edge.node.edge_sidecar_to_children ? edge.node.edge_sidecar_to_children.edges.map(edge => {
                                return {
                                    id: edge.node.id,
                                    shortCode: edge.node.shortcode,
                                    dimensions: edge.node.dimensions,
                                    imageUrl: edge.node.display_url,
                                    isVideo: edge.node.is_video,
                                }
                            }) : []
                        }
                    }) || []
                });
            })
        } catch (e) {
            reject(e)
        }
    })
}
exports.soundcloud = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: "https://www.klickaud.co/download.php",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            formData: {
                'value': link,
                '2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37': '710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3'
            }
        };

        request(options, async function (error, response, body) {
            console.log(body)
            if (error) throw new Error(error);
            const $ = cheerio.load(body)
            resolve({
                judul: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)').text(),
                download_count: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)').text(),
                thumb: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img').attr('src'),
                link: $('#dlMP3').attr('onclick').split(`downloadFile('`)[1].split(`',`)[0]
            });
        });
    })
}
exports.igreels = (link) => {
    return new Promise(async (resolve, reject) => {
        let config = {
            'url': link,
            'submit': ''
        }
        axios('https://downloadgram.org/igtv-downloader.php', {
            method: 'POST',
            data: new URLSearchParams(Object.entries(config)),
            headers: {
                "cookie": "_ga=GA1.2.623704211.1625264926; __gads=ID=a078e4fc2781b47b-22330cd520ca006e:T=1625264920:RT=1625264920:S=ALNI_MYS-jyPCjNa94DU8n-sX4aNF-ODOg; __atssc=google%3B3; _gid=GA1.2.1953813019.1625397379; __atuvc=4%7C26%2C6%7C27; __atuvs=60e2ab6d67a322ec003",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
            .then(tod => {
                const $ = cheerio.load(tod.data)
                resolve({
                    link: $('#downloadBox > a').attr('href')
                })
            })
    })
}
exports.stylizeText = async (text) => {
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
}
exports.mediafire = async (url) => {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    const hasil = []
    const link = $('a#downloadButton').attr('href')
    const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
    const seplit = link.split('/')
    const nama = seplit[5]
    mime = nama.split('.')
    mime = mime[1]
    hasil.push({ nama, mime, size, link })
    return hasil
}
exports.twitter = (link) => {
    return new Promise((resolve, reject) => {
        let config = {
            'URL': link
        }
        axios.post('https://twdown.net/download.php', qs.stringify(config), {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        })
            .then(({ data }) => {
                const $ = cheerio.load(data)
                resolve({
                    desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
                    thumb: $('div:nth-child(1) > img').attr('src'),
                    HD: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
                    SD: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
                    audio: 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href')
                })
            })
            .catch(reject)
    })
}
exports.tiktok = (Url) => {
    return new Promise(async (resolve, reject) => {
        await axios.request({
            url: "https://ttdownloader.com/",
            method: "GET",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
                "cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
            }
        }).then(respon => {
            var $ = cheerio.load(respon.data)
            token = $('#token').attr('value')
            axios({
                url: "https://ttdownloader.com/req/",
                method: "POST",
                data: new URLSearchParams(Object.entries({ url: Url, format: "", token: token })),
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,id;q=0.8",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
                    "cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
                }
            }).then(res => {
                ch = cheerio.load(res.data)
                result = {
                    status: res.status,
                    result: {
                        nowm: ch('#results-list > div:nth-child(2)').find('div.download > a').attr('href'),
                        wm: ch('#results-list > div:nth-child(3)').find('div.download > a').attr('href'),
                    }
                }
                resolve(result)
                console.log(result)
            }).catch(reject)
        }).catch(reject)
    })
}
exports.cocofun = (url) => {
    return new Promise((resolve, reject) => {
        axios.request({
            method: "GET",
            url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Cookie": "client_id=3f0dbd37-aa1f-42ef-995e-a410e13d8e48",
                "Set-Cookies": "client_id=3f0dbd37-aa1f-42ef-995e-a410e13d8e48; path=/; expires=Mon, 24 Oct 2022 18:17:26 GMT; secure"
            }
        }).then(({ status, data }) => {
            if (data == (null | undefined)) return;
            $ = cheerio.load(data);
            _ = cheerio.load(data);
            const script = $("script#appState").get();
            let parse;
            for (let anu of script) {
                if ((anu.children && anu.children[0] && anu.children[0].data) !== undefined) {
                    json = anu.children[0].data.split("APP_INITIAL_STATE=")[1];
                    parse = JSON.parse(json);
                }
                const getId = parse.share.post.post.imgs[0].id;
                const getVideo = parse.share.post.post.videos[getId].qualities[0].urls[0];
                const resolusi = parse.share.post.post.videos[getId].qualities[0].resolution;
                const getData = parse.share.post.post;
                const result = {
                    title: getData.content || getData.topic.topic,
                    desc: _("meta[property='og:description']").attr("content"),
                    like: getData.likes,
                    play_count: getData.playCount,
                    shared: getData.share,
                    resolution: resolusi,
                    duration: getData.videos[getId].dur,
                    thumbnail: getData.videos[getId].coverUrls[0],
                    url: getVideo.url
                };
                resolve({ status, creator: "Frhn Gans:v", result });
            }
        }).catch(reject);
    });
}
exports.ghrepo = (repo) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://api.github.com/search/repositories?q=${repo}`)
            .then(response => {
                if (response.status == 200) {
                    const results = response.data.items

                    data = {}
                    data.code = response.status
                    data.message = "ok"
                    data.totalCount = response.data.total_count
                    data.items = []

                    if (data.totalCount != 0) {
                        results.forEach((res) => {
                            data.items.push({
                                id: res.id,
                                nodeId: res.node_id,
                                nameRepo: res.name,
                                fullNameRepo: res.full_name,
                                url_repo: res.html_url,
                                description: res.description,
                                git_url: res.git_url,
                                ssh_url: res.ssh_url,
                                clone_url: res.clone_url,
                                svn_url: res.svn_url,
                                homepage: res.homepage,
                                stargazers: res.stargazers_count,
                                watchers: res.watchers,
                                forks: res.forks,
                                defaultBranch: res.default_branch,
                                language: res.language,
                                isPrivate: res.private,
                                isFork: res.fork,
                                createdAt: res.created_at,
                                updatedAt: res.updated_at,
                                pushedAt: res.pushed_at,
                                author: {
                                    username: res.owner.login,
                                    id_user: res.owner.id,
                                    avatar_url: res.owner.avatar_url,
                                    user_github_url: res.owner.html_url,
                                    type: res.owner.type,
                                    isSiteAdmin: res.owner.site_admin
                                }
                            })
                        })
                    } else {
                        data.items = "Repositories not found"
                    }

                    resolve(data)
                } else {
                    reject({
                        code: 500,
                        success: false,
                        message: "Server Bermasalah"
                    })
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}
exports.gensinchara = (query) => {
    return new Promise(async (resolve, reject) => {
        scraper = JSON.parse(fs.readFileSync(__path + `/lib/json/genshin/character/${query}.json`))
        console.log(scraper)
        const result = {
            name: scraper.name,
            quote: scraper.quote,
            cv: scraper.cv,
            description: scraper.description,
            image: scraper.image,
            city: scraper.city,
            url: scraper.url,
            element: scraper.element,
            weapon: scraper.weapon,
            rating: scraper.rating
        }
        resolve(result)
    }).catch((err) => { resolve(err) })
}
exports.gensinweapon = (query) => {
    return new Promise(async (resolve, reject) => {
        scraper = JSON.parse(fs.readFileSync(__path + `/lib/json/genshin/weapon/${query}.json`))
        const result = {
            name: scraper.name,
            url: scraper.url,
            rating: scraper.rating,
            baseatk: scraper.baseatk,
            secstat: scraper.secstat,
            passive: scraper.passive,
            r1: scraper.r1,
            r2: scraper.r2,
            r3: scraper.r3,
            r4: scraper.r4,
            r5: scraper.r5,
            class: scraper.class
        }
        resolve(result)
    }).catch((err) => { resolve(err) })
}
exports.heromllist = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://mobile-legends.fandom.com/wiki/Mobile_Legends:_Bang_Bang_Wiki')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let data_hero = []
                let url = []
                $('div > div > span > span > a').get().map((result) => {
                    const name = decodeURIComponent($(result).attr('href').replace('/wiki/', ''))
                    const urln = 'https://mobile-legends.fandom.com' + $(result).attr('href')
                    data_hero.push(name)
                    url.push(urln)
                })
                resolve({ status: 200, hero: data_hero })
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.heroml = (name) => {
    return new Promise((resolve, reject) => {
        var splitStr = name.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        const que = splitStr.join(' ')
        axios.get('https://mobile-legends.fandom.com/wiki/' + que)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                let mw = []
                let attrib = []
                let skill = []
                const name = $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > table > tbody > tr > td > font > b').text()
                $('.mw-headline').get().map((res) => {
                    const mwna = $(res).text()
                    mw.push(mwna)
                })
                $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td').get().map((rest) => {
                    const haz = $(rest).text().replace(/\n/g, '')
                    attrib.push(haz)
                })
                $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > div.progressbar-small.progressbar > div').get().map((rest) => {
                    skill.push($(rest).attr('style').replace('width:', ''))
                })
                axios.get('https://mobile-legends.fandom.com/wiki/' + que + '/Story')
                    .then(({ data }) => {
                        const $ = cheerio.load(data)
                        let pre = []
                        $('#mw-content-text > div > p').get().map((rest) => {
                            pre.push($(rest).text())
                        })
                        const story = pre.slice(3).join('\n')
                        const items = []
                        const character = []
                        $('#mw-content-text > div > aside > section > div').get().map((rest) => {
                            character.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g, '').replace(/\n/g, ''))
                        })
                        $('#mw-content-text > div > aside > div').get().map((rest) => {
                            items.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g, '').replace(/\n/g, ''))
                        })
                        const img = $('#mw-content-text > div > aside > figure > a').attr('href')
                        const chara = character.slice(0, 2)
                        const result = {
                            status: 200,
                            hero_name: name + ` ( ${mw[0].replace('CV:', ' CV:')} )`,
                            entrance_quotes: attrib[2].replace('Entrance Quotes', '').replace('\n', ''),
                            hero_feature: attrib[attrib.length - 1].replace('Hero Feature', ''),
                            image: img,
                            items: items,
                            character: {
                                chara
                            },
                            attributes: {
                                movement_speed: attrib[12].replace('● Movement Speed', ''),
                                physical_attack: attrib[13].replace('● Physical Attack', ''),
                                magic_power: attrib[14].replace('● Magic Power', ''),
                                attack_speed: attrib[15].replace('● Attack Speed', ''),
                                physical_defense: attrib[16].replace('● Physical Defense', ''),
                                magic_defense: attrib[17].replace('● Magic Defense', ''),
                                basic_atk_crit_rate: attrib[18].replace('● Basic ATK Crit Rate', ''),
                                hp: attrib[19].replace('● HP', ''),
                                mana: attrib[20].replace('● Mana', ''),
                                ability_crit_rate: attrib[21].replace('● Ability Crit Rate', ''),
                                hp_regen: attrib[22].replace('● HP Regen', ''),
                                mana_regen: attrib[23].replace('● Mana Regen', '')
                            },
                            price: {
                                battle_point: mw[1].split('|')[0].replace(/ /g, ''),
                                diamond: mw[1].split('|')[1].replace(/ /g, ''),
                                hero_fragment: mw[1].split('|')[2] ? mw[1].split('|')[2].replace(/ /g, '') : 'none'
                            },
                            role: mw[2],
                            skill: {
                                durability: skill[0],
                                offense: skill[1],
                                skill_effects: skill[2],
                                difficulty: skill[3]
                            },
                            speciality: mw[3],
                            laning_recommendation: mw[4],
                            release_date: mw[5],
                            background_story: story
                        }
                        resolve(result)
                    }).catch((e) => reject({ status: 404, message: e.message }))
            }).catch((e) => reject({ status: 404, message: e.message }))
    })
}
exports.emoji = (emoji) => {
    return new Promise((resolve, reject) => {
        const emo = encodeURIComponent(emoji)
        axios.get(`https://emojipedia.org/${emo}/`)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const Array = []
                let json = {}
                $('section.vendor-list > ul > li').each(function (a, b) {
                    const nama = $(b).find('div.vendor-info > h2 > a').text()
                    const url = $(b).find('div.vendor-image > img').attr('src')
                    Array.push({
                        nama,
                        url
                    })
                })
                Array.map(v => {
                    if (v.nama === undefined) return
                    if (v.url === undefined) return
                    json[v.nama.toLowerCase()] = v.url
                })
                resolve({
                    code: 200,
                    result: json
                })
            })
            .catch(reject)
    })
}
exports.artinama = (query) => {
    return new Promise((resolve, reject) => {
        queryy = query.replace(/ /g, '+')
        axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+')
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const result = $('#body').text();
                const result2 = result.split('\n      \n        \n        \n')[0]
                const result4 = result2.split('ARTI NAMA')[1]
                const result5 = result4.split('.\n\n')
                const result6 = result5[0] + '\n\n' + result5[1]
                resolve(result6)
            })
            .catch(reject)
    })
}

exports.harilarangan = (tanggal) => {
    return new Promise((resolve, reject) => {
        const tgl = Tanggal(tanggal).tanggal
        const bln = Tanggal(tanggal).bulan
        const thn = Tanggal(tanggal).tahun
        const options = {
            method: 'POST',
            url: 'https://primbon.com/hari_sangar_taliwangke.php',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                tgl: tgl,
                bln: bln,
                thn: thn,
                kirim: " Submit! "
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace(tgl, `\n${tgl}`).replace("Termasuk", "\nTermasuk").replace(/Untuk mengetahui.*$/s, "")
            resolve(result)
        });
    })
}
exports.kecocokannama = (nama, tanggal) => {
    return new Promise((resolve, reject) => {
        const tgl = Tanggal(tanggal).tanggal
        const bln = Tanggal(tanggal).bulan
        const thn = Tanggal(tanggal).tahun
        const options = {
            method: 'POST',
            url: 'https://primbon.com/kecocokan_nama.php',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                nama: nama,
                tgl: tgl,
                bln: bln,
                thn: thn,
                kirim: " Submit! "
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace("Tgl. Lahir:", "\nTanggal Lahir:").replace(/< Hitung Kembali.*$/s, "")
            resolve(result)
        });
    })
}
exports.tanggaljadi = (tanggal) => {
    return new Promise((resolve, reject) => {
        const tgl = Tanggal(tanggal).tanggal
        const bln = Tanggal(tanggal).bulan
        const thn = Tanggal(tanggal).tahun
        axios
            .get(
                `https://www.primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`
            )
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = $("#body").text().replace("Karakteristik:", "\nKarakteristik:").replace("Hubungan", "\nHubungan").replace(/^\s*\n/gm, "").replace(/< Hitung Kembali.*$/s, "")
                resolve(result)
            })
            .catch(reject);
    });
};
exports.tafsirMimpi = (mimpi) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                `https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`
            )
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const cek = $("#body > font > i").text();
                const adaga = /Tidak ditemukan/g.test(cek) ? false : true;
                if (adaga) {
                    const isi = $("#body")
                        .text()
                        .split(`Hasil pencarian untuk kata kunci: ${mimpi}`)[1]
                        .replace(/\n\n\n\n\n\n\n\n\n/gi, "\n");
                    const result = isi.replace(/\n/gi, "").replace("       ", "").replace("\"        ", "").replace(/Solusi.*$/, "");
                    const hasil = replaceAll(`${result}`, ".Mimpi", ".\nMimpi")
                    resolve(hasil)
                } else {
                    resolve(`Tidak ditemukan tafsir mimpi ${mimpi}. Cari dengan kata kunci yang lain..`);
                }
            })
            .catch(reject);
    });
};

exports.Jodoh = (nama1, nama2) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const love = 'https://www.primbon.com/' + $('#body > img').attr('src');
                const res = $('#body').text().split(nama2)[1].replace('< Hitung Kembali', '').split('\n')[0];
                const positif = res.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ', '')
                const negatif = res.split('Sisi Negatif Anda: ')[1]
                const result = {
                    creator: 'Irfan',
                    namaAnda: nama1,
                    namaPasangan: nama2,
                    positif: positif,
                    negatif: negatif,
                    love: love
                }
                resolve(result);
            })
            .catch(reject);
    })
}
exports.chord = async (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.gitagram.com/chord-gitar/depan?do=search&q=' + query)
            .then(({
                data
            }) => {
                const $$ = cheerio.load(data)
                plink = $$('#dokuwiki__content > div.typo.position-relative > div.search_fulltextresult > dl > div:nth-child(1) > dt > a').attr('href')
                if (plink == undefined) return resolve('Chord tidak ditemukan!')
                axios.get(plink)
                    .then(({
                        data
                    }) => {
                        const $ = cheerio.load(data)
                        chords = $('#dokuwiki__content').find('h3.sectionedit1').text()
                        $('#dokuwiki__content').each(function (a, b) {
                            chords += $(b).find('div.song-with-chords').text().replace(/#/g, '')
                        })
                        resolve(chords)
                    })
            })
    })
}

exports.jadwaltv = async (channel) => {
    return new Promise((resolve, reject) => {
        const time = Math.floor(new Date() / 1000)
        axios.get('https://www.jadwaltv.net/channel/' + channel)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const acara = [];
                const jam = [];
                const result = [];
                $('div > div > table > tbody > tr').each(function (a, b) {
                    if ($(b).find('td:nth-child(1)').text() != 'Jam') {
                        jam.push($(b).find('td:nth-child(1)').text())
                    }
                    if ($(b).find('td:nth-child(2)').text() != 'Acara') {
                        acara.push($(b).find('td:nth-child(2)').text())
                    }
                })
                for (let i = 0; i < acara.length; i++) {
                    result.push({
                        acara: acara[i],
                        jam: jam[i]
                    })
                }
                format = result.filter(mek => mek.acara != 'Jadwal TV selengkapnya di JadwalTV.Net')
                resolve({
                    channel: channel,
                    result: format
                })
            })
    })
}

exports.ceritahantu = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://cerita-hantu.com/list-cerita-hantu-a-z/`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const plink = [];
                $('div > div > ul:nth-child(7) > li > a').each(function (a, b) {
                    plink.push($(b).attr('href'))
                })
                $('div > div > ul:nth-child(9) > li > a').each(function (a, b) {
                    if ($(b).attr('href') != undefined) {
                        plink.push($(b).attr('href'))
                    }
                })
                $('div > div > ol > li > a').each(function (a, b) {
                    if ($(b).attr('href') != undefined) {
                        plink.push($(b).attr('href'))
                    }
                })
                axios.get(plink[Math.floor(Math.random() * plink.length)])
                    .then(({
                        data
                    }) => {
                        const $$ = cheerio.load(data)
                        const clink = [];
                        $$('div > div > a').each(function (a, b) {
                            if ($$(b).attr('href').startsWith('https:')) {
                                clink.push($$(b).attr('href'))
                            }
                        })
                        rand = clink[Math.floor(Math.random() * clink.length)]
                        axios.get(rand)
                            .then(({
                                data
                            }) => {
                                const $$$ = cheerio.load(data)
                                resolve({
                                    judul: $$$('div > header > div > h1 > a').text(),
                                    author: $$$('div > header > div > div > span.simple-grid-entry-meta-single-author > span > a').text(),
                                    author_link: $$$('div > header > div > div > span.simple-grid-entry-meta-single-author > span > a').attr('href'),
                                    upload_date: $$$('div > header > div > div > span.simple-grid-entry-meta-single-date').text(),
                                    kategori: $$$('div > header > div > div > span.simple-grid-entry-meta-single-cats > a').text(),
                                    source: rand,
                                    cerita: $$$('div > div > p').text().split('Cerita Hantu')[1].split('Copyright')[0]
                                })
                            })
                    })
            })
    })
}

exports.dddtik = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `https://dddtik.com/down.php`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "user-agent": fakeUa(),
                "cookie": "sc_is_visitor_unique=rx12545292.1635383422.F7DED83AD2BA4F9517A804FC1A0ED021.1.1.1.1.1.1.1.1.1; __gads=ID=b947ab19f44e72c9-22cb5054e4cc00ef:T=1635383422:RT=1635383422:S=ALNI_MZWS0q0Op8F6EpwhOL1pMlFTGjCvQ"
            },
            formData: {
                url: link
            }
        };

        request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body)
            resolve({
                caption: $('div > div.ml-3 > span').text(),
                download: {
                    source: $('div > div:nth-child(4)').find('a').attr('href'),
                    dddtik: $('div > div:nth-child(5)').find('a').attr('href')
                }
            });
        });
    })
}

exports.jarakkota = async (kawal, ktujuan) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://jarakantarkota.com/${kawal}/${ktujuan}/`)
            .then((data) => {
                const $ = cheerio.load(data.data)
                const jarak = $('body > div.content > div > div.b-search-route > div > div > div.col-xs-12.col-sm-12.col-md-12.col-lg-8 > div').text().replace('                       ', '')
                resolve({
                    kota_asal: jarak.split('  -')[0],
                    kota_tujuan: jarak.split('- ')[1].split(' (')[0],
                    jarak: jarak.split(' (')[1].split(')')[0]
                })
            })
            .catch(reject)
    })
}
exports.moddroid = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://moddroid.com/?s=${query}`).then(tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.col-12.col-md-6.mb-4").each(function (c, d) {
                link = $(d).find("a.d-flex.position-relative.archive-post").attr('href');
                name = $(d).find("div > h3.h5.font-weight-semibold.text-truncate.text-primary.w-100").text().trim();
                img = $(d).find("div.flex-shrink-0.mr-2 > img").attr('src');
                desc = $(d).find("div.text-truncate.text-muted > span.align-middle").text();
                const Data = {
                    img: img,
                    name: name,
                    desc: desc,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    });
}
exports.growstock = (query) => new Promise((resolve, reject) => {
    fetch(`https://growstocks.xyz/search?item=${query}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://growstocks.xyz/",
        "method": "GET",
        "mode": "cors"
    }).then((res) => res.text())
        .then((text) => {
            const $ = cheerio.load(text)
            const dataArr = [];
            $('div.searchRes').each((i, el) => {
                const title = $(el).find('div > div > h2 > a').text().trim();
                const price = $(el).find('div > div > p:nth-child(3) > b:nth-child(1)').text().trim();
                const editedAt = $(el).find('div > div > p:nth-child(5) > b:nth-child(1)').text().trim();
                dataArr.push({
                    title: title,
                    price: price ? price : 'Data tidak terbaca',
                    editedAt: editedAt ? editedAt : 'Data tidak terbaca',
                })
            })
            resolve(dataArr)
        })
})
exports.twittertrend = async (country) => {
    return new Promise(async (resolve, reject) => {
        axios.get(`https://getdaytrends.com/${country}/`)
            .then(({ data }) => {
                console.log(data)
                const $ = cheerio.load(data)
                const hastag = [];
                const link = [];
                const twit = [];
                const format = [];
                $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > a').get().map((b) => {
                    jud = $(b).text();
                    hastag.push(jud)
                })
                $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span').get().map((b) => {
                    jud = $(b).text();
                    twit.push(jud)
                })
                for (let i = 0; i < hastag.length; i++) {
                    format.push({
                        hastag: hastag[i],
                        rank: i + 1,
                        tweet: twit[i],
                        link: `https://twitter.com/search?q=${hastag[i].replace(/ /g, '%20')}&src=typed_query`
                    })
                }
                resolve({
                    trend: format
                })
            })
    })
}
exports.apkmody = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://apkmody.io/?s=${query}`).then(tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.flex-item").each(function (c, d) {
                name = $(d).find("div.card-title > h2.truncate").text();
                desc = $(d).find("div.card-body > p.card-excerpt.has-small-font-size.truncate").text().trim();
                img = $(d).find("div.card-image > img").attr('src');
                link = $(d).find("article.card.has-shadow.clickable > a").attr('href');
                const Data = {
                    img: img,
                    name: name,
                    desc: desc,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    });
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(color(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})