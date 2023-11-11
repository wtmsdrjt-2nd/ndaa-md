const moment = require("moment-timezone");
const fs = require("fs");

moment.tz.setDefault("Asia/Jakarta").locale("id");

let setting = JSON.parse(fs.readFileSync('./config.json'))
const { getLimit, getBalance, cekGLimit } = require("../lib/limit")

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

function toCommas(x) {
	x = x.toString()
	var pattern = /(-?\d+)(\d{3})/;
     while (pattern.test(x))
	   x = x.replace(pattern, "$1,$2");
	return x;
}

exports.allmenu = (sender, prefix, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount, ucapanWaktu) => {
	return `Hai @${sender.split('@')[0]}

Library : *Baileys-MD*.
Prefix : ( ${prefix} )
Tanggal Server : ${moment.tz('Asia/Jakarta').format('DD/MM/YY')}
Waktu Server : ${moment.tz('Asia/Jakarta').format('HH:mm:ss')} WIB

Status : ${isOwner ? 'Owner' : isPremium ? 'Premium' : 'Free'}
Limit Harian : ${isOwner ? '-' : isPremium ? 'Unlimited' : getLimit(sender, limitCount, limit)}
Limit Game : ${isOwner ? '-' : cekGLimit(sender, gcount, glimit)}
Balance : $${toCommas(getBalance(sender, balance))}
${readmore}
*MAIN MENU*
• ${prefix}menu
• ${prefix}infobot
• ${prefix}stats
• ${prefix}grouphutao
• ${prefix}owner
• ${prefix}script
• ${prefix}donasi
• ${prefix}speed
• ${prefix}runtime
• ${prefix}cekprem
• ${prefix}myprofile
• ${prefix}listprem
• ${prefix}daftarprem
• ${prefix}sewabot
• ${prefix}dashboard
• ${prefix}listbahasa
 
*CONVERTER/TOOLS*
• ${prefix}sticker
• ${prefix}stickerwm
• ${prefix}takesticker
• ${prefix}toimg
• ${prefix}tovid
• ${prefix}tomp3
• ${prefix}ttp
• ${prefix}attp
• ${prefix}emojimix
• ${prefix}stikermeme
• ${prefix}spamcall
• ${prefix}say
• ${prefix}qc
• ${prefix}translate
• ${prefix}nulis
• ${prefix}upload

*RELIGION MENU*
• ${prefix}listsurah
• ${prefix}alquran
• ${prefix}alquranaudio
 
*BAILEYS*
• ${prefix}fitnah
• ${prefix}nowa
• ${prefix}towame
• ${prefix}getquotedmsg
• ${prefix}hidetag
• ${prefix}fakehidetag
• ${prefix}react
• ${prefix}afk
• ${prefix}inspect
  
*ANONYMOUS CHAT*
• ${prefix}anonymous
• ${prefix}start
• ${prefix}stop
• ${prefix}skip
• ${prefix}sendprofile
• ${prefix}menfess
• ${prefix}galery_menfess

*DOWNLOADER*
• ${prefix}play
• ${prefix}tiktok
• ${prefix}tiktoaudio
• ${prefix}ytmp4
• ${prefix}ytmp3
• ${prefix}getvideo
• ${prefix}getmusic
• ${prefix}soundcloud
• ${prefix}instagram
• ${prefix}igstory
• ${prefix}facebook
• ${prefix}mediafire
• ${prefix}telesticker
• ${prefix}pinterestdl
• ${prefix}spotifydl

*MAKER MENU*
• ${prefix}pornhub
• ${prefix}tiktoklogo
• ${prefix}blackpink
• ${prefix}wolf
• ${prefix}thunder
• ${prefix}grafity
• ${prefix}matrix
• ${prefix}neonlove
  
*RANDOM MENU*
• ${prefix}quote
• ${prefix}randomfakta
• ${prefix}quoteanime
• ${prefix}cecan
• ${prefix}cogan
• ${prefix}waifu
• ${prefix}meme
• ${prefix}darkjoke
  
*SEARCH MENU*
• ${prefix}lirik
• ${prefix}grupwa
• ${prefix}pinterest
• ${prefix}ytsearch
• ${prefix}whatmusic
• ${prefix}igstalk
• ${prefix}searchbyimage
  
*GAME MENU*
• ${prefix}asahotak
• ${prefix}bet
• ${prefix}caklontong
• ${prefix}family100
• ${prefix}siapakahaku
• ${prefix}susunkata
• ${prefix}tebakbendera
• ${prefix}tebakgambar
• ${prefix}tebakkalimat
• ${prefix}tebakkata
• ${prefix}tebakkimia
• ${prefix}tebaklirik
• ${prefix}math
• ${prefix}tictactoe
• ${prefix}tictactoe-solo
• ${prefix}delttc 
• ${prefix}endttc
• ${prefix}kuis
• ${prefix}tebaklagu
• ${prefix}nyerah
• ${prefix}casino
• ${prefix}delcasino
• ${prefix}akinator 
• ${prefix}suit
  
*PAYMENT & BANK*
• ${prefix}topbalance
• ${prefix}buylimit
• ${prefix}buyglimit
• ${prefix}transfer
• ${prefix}limit
• ${prefix}balance
  
*GROUP MENU*
• ${prefix}linkgrup
• ${prefix}setppgrup
• ${prefix}setnamegc
• ${prefix}setdesc
• ${prefix}group
• ${prefix}revoke
• ${prefix}delete
• ${prefix}promote
• ${prefix}demote
• ${prefix}add
• ${prefix}kick
• ${prefix}antilink
• ${prefix}welcome
• ${prefix}setwelcome
• ${prefix}setleft
  
*OWNER MENU*
> evalcode
x evalcode-2
$ executor
• ${prefix}exif
• ${prefix}self
• ${prefix}public
• ${prefix}leave
• ${prefix}join
• ${prefix}setppbot
• ${prefix}getcase
• ${prefix}addprem
• ${prefix}delprem
• ${prefix}resetlimit
• ${prefix}broadcast
• ${prefix}dym`
}
