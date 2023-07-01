const { color, bgcolor } = require('./color');
const TicTacToe = require('tictactoejs');
const { makeid } = require('./myfunc');
const fs = require("fs");
const { isTicTacToe, getPosTic, KeisiSemua, cekIsi, cekTicTac } = require('./tictactoe');
const setting = JSON.parse(fs.readFileSync('./config.json'));

module.exports = async (conn, chats, prefix, ttcsolo, msg) => {
    const from = msg.key.remoteJid
    const isGroup = msg.key.remoteJid.endsWith('@g.us')
    let sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
    try {
     if (isTicTacToe(from, ttcsolo)) {
      let nomor = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      let posi = ttcsolo[getPosTic(from, ttcsolo)]
      let anu = posi.TicTacToe
      var all = []
      var no = 1
      for (let i of ttcsolo[0].TicTacToe.toString().split(',')) {
        all.push({ index: `${no++}`, emoji: i })
      }
      var _all = []
      for (let i of all) {
        if (i.emoji !== '❌' && i.emoji !== '⭕') {
          _all.push(i)
        }
      }
      var otdb = []
      for (let i of anu) {
        otdb.push(i)
      }
      function getPosiEm(emoji, db) {
        var posi = null
        Object.keys(db).forEach((i) => {
          if (db[i] == emoji) {
            posi = i
          }
        })
        return posi
      }
      var otdata = []
      var cek = null
      var res = null
      for (let i = 0; i < _all.length; i++) {
        var cekPosi = getPosiEm(_all[i].emoji, otdb)
        otdb[cekPosi] = '❌'
        cek = cekTicTac(otdb)
        _all[i].status = cek
        otdata.push(_all[i])
        if (cek === true) {
          res = _all[i]
        } else {
          otdb[cekPosi] = _all[i].emoji
          var rndm = _all[Math.floor(Math.random() * _all.length)]
          res = rndm.index
        }
      }

      if (posi.status === null) {
        if (sender === posi.penantang) {
          if (chats.toLowerCase() === 'y') {
            var tekss = `*PERMAINAN DIMULAI*

@${posi.penantang.split("@")[0]} = ❌
${setting.botName} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Giliran @${posi.penantang.split("@")[0]}
Ketik ${prefix}endttc untuk berhenti bermain`
            conn.sendMessage(from, { text: tekss, mentions: [posi.penantang] }, { messageId: 'TTCS'+makeid(12).toUpperCase() })
            ttcsolo[getPosTic(from, ttcsolo)].status = true
          } else if (chats.toLowerCase() === 'n') {
            var teksr = `Game dibatalkan, kirim perintah ${prefix}ttc-solo untuk bermain`
            conn.sendMessage(from, { text: teksr }, { messageId: 'TTCS'+makeid(12).toUpperCase() })
            ttcsolo.splice(getPosTic(from, ttcsolo), 1)
          }
        }
      } else if (posi.status === true) {
        var hasill = _all.find(i => i.index == 5)
        var hasil2 = _all.find(i => i.index == 1 || i.index == 3 || i.index == 7 || i.index == 9)
        if (posi.giliran == 'bot') {
         if (_all.length == 8 && hasill) {
          chats = '5'
          sender = setting.botName
         } else if (_all.length == 8 && hasil2) {
          var ans = ["1", "3", "7", "9"]
          chats = ans[Math.floor(Math.random() * ans.length)]
          sender = setting.botName
         } else {
          var hasilx = otdata.find( i => i.status == true)
          chats = hasilx ? hasilx.index : res
          sender = setting.botName
         }
        }
        if (posi.giliran == 'bot' ? posi.ditantang == sender : true) {
          for (let i of nomor) {
            if (Number(chats) === i) {
              if (cekIsi(Number(chats) - 1, anu)) return conn.sendMessage(from, { text: `Nomor tersebut sudah terisi` }, { quoted: msg, messageId: 'TTCS'+makeid(12).toUpperCase() })
              ttcsolo[getPosTic(from, ttcsolo)].TicTacToe[Number(chats) - 1] = posi.giliran == 'bot' ? '⭕' : '❌'
              if (cekTicTac(ttcsolo[getPosTic(from, ttcsolo)].TicTacToe)){
                var teksw = `${posi.giliran == 'bot' ? setting.botName : '@'+posi.penantang.split("@")[0]} Menang

@${posi.penantang.split('@')[0]} = ❌
${setting.botName} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${prefix}ttc-solo`
                conn.sendMessage(from, { text: teksw, mentions: [posi.penantang] }, { messageId: 'TTCS'+makeid(12).toUpperCase() })
                ttcsolo.splice(getPosTic(from, ttcsolo), 1)
              } else if (KeisiSemua(anu)) {
                var teksi = `Hasil Seri

@${posi.penantang.split('@')[0]} = ❌
${setting.botName} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${prefix}ttc-solo`
                conn.sendMessage(from, { text: teksi, mentions: [posi.penantang] }, { messageId: 'TTCS'+makeid(12).toUpperCase() })
                ttcsolo.splice(getPosTic(from, ttcsolo), 1)
              } else {
                var teksg = `${posi.giliran == 'bot' ? setting.botName : '@'+posi.penantang.split('@')[0]} telah mengisi

@${posi.penantang.split('@')[0]} = ❌
${setting.botName} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Giliran ${posi.giliran == 'bot' ? '@'+posi.penantang.split("@")[0] : setting.botName}
Ketik ${prefix}endttc untuk berhenti bermain`
                conn.sendMessage(from, { text: teksg, mentions: [posi.penantang] }, { messageId: 'TTCS'+makeid(12).toUpperCase() })
                posi.giliran = posi.giliran == 'bot' ? 'penantang' : 'bot'
              }
            }
          }
        }
       }
     }
    } catch (err) {
      console.log(color('[ERROR]', 'red'), err)
    }
}
