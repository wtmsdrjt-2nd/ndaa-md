/**
 * Al-Qur'an get from Json logging
 * author by Irfan Hariyanto
 * Github : https://github.com/rtwone
**/

const fs = require ("fs");
const { data: quran } = require('../database/quran.json');

let al_quran = JSON.parse(fs.readFileSync('./database/alquran.json'));
let all_surah = JSON.parse(fs.readFileSync('./database/quran.json'));

const getAllSurah = () => {
  var data = quran.map(item => {
    var surah = { ...item };
    delete surah.verses;
    delete surah.preBismillah;
    return surah;
  })
  return {
    code: 200,
    status: 'OK.',
    message: 'Success fetching all surah.',
    data
  };
}

const getSurah = (req) => {
  var data = quran[req - 1];
  if (data) {
    return {
      code: 200,
      status: 'OK.',
      message: 'Success fetching surah.',
      data
    };
  }
  return {
    code: 404,
    status: 'Not found.',
    message: `Surah "${surah}" is not found.`,
    data: {}
  };
}

const getAyahFromSurah = (surah, ayah) => {
  const checkSurah = quran[surah - 1];
  if (!checkSurah) {
    return {
      code: 404,
      status: 'Not found.',
      message: `Surah "${surah}" is not found.`,
      data: {}
    };
  }

  const checkAyah = checkSurah.verses[ayah - 1]
  if (!checkAyah) {
    return {
      code: 404,
      status: 'Not found.',
      message: `Ayah "${ayah}" in surah "${surah}" is not found.`,
      data: {}
    };
  }

  const dataSurah = { ...checkSurah };
  delete dataSurah.verses;
  const data = { ...checkAyah, surah: dataSurah };
  return {
    code: 200,
    status: 'OK.',
    message: 'Success fetching ayah',
    data
  };
}

exports.allsurah = () => {
  return new Promise((resolve, reject) => {
    let result = { status: 200, msg: 'succes', result: [] }
    for (let i of al_quran) {
      var option = { index: i.nomor, surah: i.nama, latin: i.nama_latin, jumlah_ayat: i.jumlah_ayat, wahyu: i.tempat_turun, arti: i.arti, desk: i.deskripsi, audio: i.audio }
      result.result.push(option)
    }
    resolve(result)
  })
}

exports.getSurat = (surah, ayat) => {
  return new Promise(async(resolve, reject) => {
    if (ayat !== undefined) {
      var data = getAyahFromSurah(surah, ayat)
        if (data.code === 404) return resolve({ status: 404, msg: data.message.replace('Ayah', 'Ayat') })
        let result = {
          status: 200,
          msg: "Sukses",
          result: {
            index_surah: surah,
            surah: data.data.surah.name.short,
            surah_id: data.data.surah.name.transliteration.id,
            wahyu: data.data.surah.revelation.id,
            ayat: ayat,
            arab: data.data.text.arab,
            latin: data.data.text.transliteration.en,
            id: data.data.translation.id,
            en: data.data.translation.en,
            audio: data.data.audio.secondary[0]
          }
        }
        resolve(result)
    } else {
      var data = getSurah(surah)
        if (data.code == 404) return resolve({ status: 404, msg: data.message })
        var anu = (await exports.allsurah()).result[surah - 1]
        let result = {
          status: 200,
          msg: "Sukses",
          result: {
            index_surah: surah,
            surah: data.data.name.short,
            surah_id: data.data.name.transliteration.id,
            wahyu: data.data.revelation.id,
            total_ayat: anu.jumlah_ayat,
            audio: anu.audio,
            data: []
          }
        }
        for (let i of data.data.verses) {
          var opt = { index_ayat: i.number.inSurah, ayat: i.text.arab, latin: i.text.transliteration.en, id: i.translation.id, en: i.translation.en, audio: i.audio.secondary[0] }
          result.result.data.push(opt)
        }
        resolve(result)
    }
  })
}