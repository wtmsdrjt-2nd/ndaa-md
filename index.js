"use strict";
const {
        default: makeWASocket,
        BufferJSON,
        initInMemoryKeyStore,
        DisconnectReason,
        AnyMessageContent,
        useMultiFileAuthState,
        makeInMemoryStore,
        delay,
        downloadContentFromMessage,
        jidDecode,
        generateForwardMessageContent,
        generateWAMessageFromContent,
        proto,
        prepareWAMessageMedia
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const PhoneNumber = require('awesome-phonenumber')
const { Spinner } = clui
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif2')
const { serialize, fetchJson, getBuffer, makeid } = require("./lib/myfunc");
const { color, mylog, infolog } = require("./lib/color");
const afk = require("./lib/afk");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let setting = JSON.parse(fs.readFileSync('./config.json'));
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let _afk = JSON.parse(fs.readFileSync('./database/afk.json'));
let session = `${setting.sessionName}`

function title() {
      console.clear()
      console.log(chalk.bold.green(figlet.textSync('WaBot MD', {
         font: 'Standard',
         horizontalLayout: 'default',
         verticalLayout: 'default',
         width: 80,
         whitespaceBreak: false
      })))
      console.log(chalk.yellow(`\n                        ${chalk.yellow('[ Created By Jatzz ]')}\n\n${chalk.red('Hu Tao Bot')} : ${chalk.white('WhatsApp Bot Multi Device')}\n${chalk.red('Follow Insta Dev')} : ${chalk.white('@wtmsdrjt')}\n${chalk.red('Message Me On WhatsApp')} : ${chalk.white('+62 857-7164-7181')}\n${chalk.red('Donate')} : ${chalk.white('085771647181 ( Gopay/Ovo )')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
        console.log(`Module ${module} sedang diperhatikan terhadap perubahan`)
        fs.watchFile(require.resolve(module), async () => {
          await uncache(require.resolve(module))
          cb(module)
        })
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
        return new Promise((resolve, reject) => {
          try {
            delete require.cache[require.resolve(module)]
            resolve()
          } catch (e) {
            reject(e)
          }
        })
}

const getPosiSaying = (from, _db) => {
    let posi = null
    Object.keys(_db).forEach((i) => {
      if (_db[i].jid === from) {
        posi = i
      }
    })
    if (posi !== null) {
      return posi
    }
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

async function glbl() {
  const { state, saveCreds } = await useMultiFileAuthState('sticker')
  const connectToWhatsApp = async () => {
        const conn = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            browser: ['Hutao Multi Device','Safari','1.0.0'],
            auth: state,
            getMessage: async key => {
              return {
                
              }
          }
        })
        title()
        store.bind(conn.ev)

        /* Auto Update */
        require('./message/help')
        require('./lib/myfunc')
        require('./message/msg')
        nocache('./message/help', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
        nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
        nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))

        conn.multi = true
        conn.nopref = false
        conn.prefa = 'anjing'
        conn.spam = []
        conn.mode = 'public'
        conn.ev.on('messages.upsert', async m => {
           var msg = m.messages[0]
           if (!m.messages) return;
           // msg.message = (Object.keys(msg.message)[0] == "ephemeralMessage") ? msg.message.ephemeralMessage.message : msg.message
           if (msg.key && msg.key.remoteJid == "status@broadcast") return
           try { if (msg.message.messageContextInfo) delete msg.message.messageContextInfo } catch { }
           msg = serialize(conn, msg)
           msg.isBaileys = msg.key.id.startsWith('BAE5')
           require('./message/msg')(conn, msg, m, setting, store, welcome, _afk)
        })

        // To Read Presences
        conn.ev.on('presence.update', async data => {
           // Read Data Presences Afk
           if (data.presences) {
             for (let key in data.presences) {
               if (data.presences[key].lastKnownPresence === "composing" || data.presences[key].lastKnownPresence === "recording") {
                 if (afk.checkAfkUser(key, _afk)) {
                   _afk.splice(afk.getAfkPosition(key, _afk), 1)
                   fs.writeFileSync('./database/afk.json', JSON.stringify(_afk, null, 2))
                   conn.sendMessage(data.id, { text: `@${key.split("@")[0]} berhenti afk, dia sedang ${data.presences[key].lastKnownPresence === "composing" ? "mengetik" : "merekam"}`, mentions: [key] })
                 }
               }
             }
           }
        })

        conn.ev.on('connection.update', (update) => {
        	if (global.qr !== update.qr) {
           global.qr = update.qr
          }
          const { connection, lastDisconnect } = update
            if (connection === 'close') {
                lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : console.log('connection logged out...')
            }
        })

        conn.ev.on('group-participants.update', async (data) => {
           const isWelcome = getPosiSaying(data.id, welcome) ? true : false
           var posi = getPosiSaying(data.id, welcome)
           var groupData = await conn.groupMetadata(data.id)
           var { id, subject, desc, participants } = groupData
           if (isWelcome) {
             try {
               for (let i of data.participants) {
                 // Get Profile Picture Url Participants
                 try {
                   var pp_user = await conn.profilePictureUrl(i, 'image')
                 } catch {
                   var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                 }
                 var pushname = await conn.getName(i)
                 var img = await getBuffer(pp_user)
                 // Detecting Actions and Sending Greetings
                 if (data.action == 'add') {
                   var teksw = welcome[posi].welcome.replace(/@user/gi, `@${i.split("@")[0]}`).replace(/@subject/gi, subject).replace(/@pushname/gi, pushname).replace(/@desc/gi, desc)
                   conn.sendMessage(data.id, { caption: teksw, image: img, mentions: [i] })
                 } else if (data.action == 'remove') {
                   var teksl = welcome[posi].left.replace(/@user/gi, `@${i.split("@")[0]}`).replace(/@subject/gi, subject).replace(/@pushname/gi, pushname).replace(/@desc/gi, desc)
                   conn.sendMessage(data.id, { caption: teksl, image: img, mentions: [i] })
                 }
               }
             } catch (e) {
               console.log(e)
             }
           }
        })

        conn.ev.on('creds.update', await saveCreds)

        conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

        conn.ws.on('CB:call', async (json) => {
           console.log(JSON.stringify(json, null, 2))
           const callid = json.content[0].attrs['call-id']
           const callfrom = json.content[0].attrs['call-creator']
           conn.rejectCall(callid, callfrom)
           conn.sendMessage(callfrom, { text: `Jangan telepon bot!` })
        })

        conn.decodeJid = (jid) => {
           if (!jid) return jid
           if (/:\d+@/gi.test(jid)) {
             let decode = jidDecode(jid) || {}
             return decode.user && decode.server && decode.user + '@' + decode.server || jid
           } else return jid
        }

        conn.ev.on('contacts.update', update => {
           for (let contact of update) {
             let id = conn.decodeJid(contact.id)
             if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
           }
        })

        conn.tempButton = async function(remoteJid, text, footer, content) {
          // const { displayText, url, contentText, footer } = content
          //send a template message!
          const templateMessage = {
            viewOnceMessage: {
              message: {
                templateMessage: {
                  hydratedTemplate: {
                    hydratedContentText: text,
                    hydratedContentFooter: footer,
                    hydratedButtons: content
                  },
                }
              }
            }
          }
          const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {})
        }

        conn.getName = (jid, withoutContact = false) => {
           var id = conn.decodeJid(jid)
           withoutContact = conn.withoutContact || withoutContact
           let v
           if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
             v = store.contacts[id] || {}
             if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {}
             resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
           })
            else v = id === '0@s.whatsapp.net' ? {
             id,
             name: 'WhatsApp'
            } : id === conn.decodeJid(conn.user.id) ?
             conn.user :
             (store.contacts[id] || {})
             return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        conn.setStatus = (status) => {
           conn.query({
              tag: 'iq',
              attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
              },
              content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
              }]
            })
           return status
        }

        conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
           let list = []
           for (let i of kon) {
             list.push({
               lisplayName: await conn.getName(i + '@s.whatsapp.net'),
               vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:${await conn.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
             })
           }
           return conn.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
        }

        conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
           let vtype
           if (options.readViewOnce) {
             message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
             vtype = Object.keys(message.message.viewOnceMessage.message)[0]
             delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
             delete message.message.viewOnceMessage.message[vtype].viewOnce
             message.message = {
               ...message.message.viewOnceMessage.message
             }
           }
           let mtype = Object.keys(message.message)[0]
           let content = await generateForwardMessageContent(message, forceForward)
           let ctype = Object.keys(content)[0]
           let context = {}
           if (mtype != "conversation") context = message.message[mtype].contextInfo
           content[ctype].contextInfo = {
             ...context,
             ...content[ctype].contextInfo
           }
           const waMessage = await generateWAMessageFromContent(jid, content, options ? {
             ...content[ctype],
             ...options,
             ...(options.contextInfo ? {
               contextInfo: {
                 ...content[ctype].contextInfo,
                 ...options.contextInfo
               }
             } : {})
           } : {})
           await conn.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
           return waMessage
        }

        conn.sendMessageFromContent = async(jid, message, options = {}) => {
           var option = { contextInfo: {}, ...options }
           var prepare = await generateWAMessageFromContent(jid, message, option)
           await conn.relayMessage(jid, prepare.message, { messageId: prepare.key.id })
           return prepare
        }

        conn.groupInspectCode = async(jid) => {
           return require('./lib/inspect')(conn, jid)
        }

        conn.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
           if (type_file === 'image') {
             var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'video') {
             var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'sticker') {
             var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'audio') {
             var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           }
        }

        /**
        * @param {*} jid
        * @param {*} path
        * @param {*} quoted
        * @param {*} options
        * @returns
        */
        conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
           let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
           let buffer
           if (options && (options.packname || options.author)) {
             buffer = await writeExifImg(buff, options)
           } else {
             buffer = await imageToWebp(buff)
           }
           await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
           .then( response => {
              fs.unlinkSync(buffer)
              return response
           })
        }

        /**
        * @param {*} jid
        * @param {*} path
        * @param {*} quoted
        * @param {*} options
        * @returns
        */
        conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
           let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
           let buffer
           if (options && (options.packname || options.author)) {
             buffer = await writeExifVid(buff, options)
           } else {
             buffer = await videoToWebp(buff)
           }
           await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
           .then( response => {
              fs.unlinkSync(buffer)
              return response
           })
        }
        return conn
        }

connectToWhatsApp()
.catch(err => console.log(err))
}

glbl()
