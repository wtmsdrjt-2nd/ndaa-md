const axios = require("axios")
const cheerio = require("cheerio")
const Util = require("util");
const { igCookie } = require("../config")
const { UserAgent } = require("../lib/myfunc")

/* Instagram Api */
const highlight = "https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=%s";
const story = "https://i.instagram.com/api/v1/feed/user/%s/reel_media/";
const cookie = igCookie
const UA = "Instagram 10.3.2 (iPhone7,2; iPhone OS 9_3_3; en_US; en-US; scale=2.00; 750x1334) AppleWebKit/420+";

function format(angka) {
   var balancenyeini = '';
   var angkarev = angka.toString().split('').reverse().join('');
   for (var i = 0; i < angkarev.length; i++)
   if (i % 3 == 0) balancenyeini += angkarev.substr(i, 3) + '.';
   return '' + balancenyeini.split('', balancenyeini.length - 1).reverse().join('');
}

/**
 * Instagram Downloader Scraper From https://downvideo.quora-wiki.com
 * @function
 * @param {String} url - Your Instagram url, example https://www.instagram.com/p/CfYiWX_NjsS/?igshid=YmMyMTA2M2Y=
 *
 */
exports.igdl = async (url) => {
    try {
        const tokenn = await axios.get("https://downvideo.quora-wiki.com/instagram-video-downloader#url=" + url);
        let a = cheerio.load(tokenn.data);
        let token = a("#token").attr("value");
        const param = {
            url: url,
            token: token,
        };
        const { data } = await axios.request("https://downvideo.quora-wiki.com/system/action.php", {
                method: "post",
                data: new URLSearchParams(Object.entries(param)),
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    "referer": "https://downvideo.quora-wiki.com/tiktok-video-downloader",
                },
            }
        );
        return {
            status: 200,
            author: 'irpan',
            title: data.title,
            thumbnail: "https:" + data.thumbnail,
            duration: data.duration,
            media: data.medias,
        };
    } catch (e) {
        return e
    }
}

const req = async(url, options) => {
    let res = await axios({
       url,
       ...options,
    })
    return res.data
}

/**
 * Instagram Stalking Scraper From Api Instagram
 * @function
 * @param {String} username - Your Instagram Username, example irfann._x
 */
exports.igstalk = async (user) => {
    try {
        const data = await req('https://i.instagram.com/api/v1/users/web_profile_info/?username=' + user, {
           method: 'GET',
           headers: {
             "user-agent": UA,
             cookie
           }
        })
        return(data.status == 'ok' ? {
           status: true,
           profile: {
              low: data.data.user.profile_pic_url,
              high: data.data.user.profile_pic_url_hd,
           },
           data: {
              url: data.data.user.external_url,
              id: data.data.user.id,
              username: data.data.user.username,
              fullname: data.data.user.full_name,
              private: data.data.user.is_private,
              verified: data.data.user.is_verified,
              bio: data.data.user.biography,
              follower: format(data.data.user.edge_followed_by.count),
              following: format(data.data.user.edge_follow.count),
              conneted_fb: data.data.user.connected_fb_page,
              videotimeline: data.data.user.edge_felix_video_timeline.count,
              timeline: data.data.user.edge_owner_to_timeline_media.count,
              savedmedia: data.data.user.edge_saved_media.count,
              collections: data.data.user.edge_media_collections.count,
           }
        } : {status: false, message: 'user not found'})
     } catch {
        return ({
          status: false,
          message: 'user not found'
        })
     }
}

/**
 * Get all highlight media based on given highlight id
 * @param {String} highId highlight id
 */
const getHighReels = async (highId) => {
    let res = await axios.get(Util.format(highlight, highId), {
        headers: {
            "User-Agent": UA,
            cookie,
        },
    });
    return res.data
};

exports.igHighlight = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parsed = new URL(url);
            let media_id = parsed.searchParams.get("story_media_id");
            let res = await axios.request({
                url,
                headers: {
                    cookie,
                },
            });
            let parsed2 = new URL(res.request.res.responseUrl);
            let highId = parsed2.pathname.split("/").filter((v) => v)[2];
            const res3 = await getHighReels(`highlight:${highId}`);
            const res2 = res3.reels[`highlight:${highId}`].items;
            let tmp;
            let metadata = {};
            for (const idx in res2) {
                if (res2[idx].id == media_id) {
                    tmp = res2[idx];
                }
            }
            metadata["status"] = 200
            metadata["uriType"] = "igHighlight"
            metadata["user"] = {
               username: res3.reels_media[0].user.username,
               fullname: res3.reels_media[0].user.full_name,
               private: res3.reels_media[0].user.is_private,
               verified: res3.reels_media[0].user.is_verified
            }
            metadata["type"] = { 1: "photo", 2: "video" }[tmp.media_type];
            metadata["media"] = { 1: tmp.image_versions2.candidates, 2: tmp.video_versions }[tmp.media_type];
            resolve(metadata);
        } catch (e) {
            resolve({
               status: 403,
               msg: "Invalid Link"
            })
        }
    });
}

/**
 * Get all story media based on given user id
 * @param {String} userId Instagram user id
 */
const getStory = async (userId) => {
    let res = await axios.get(Util.format(story, userId), {
        headers: {
            "User-Agent": UA,
            cookie,
        },
    });
    return res.data.items;
};

exports.igStory = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parsed = new URL(url);
            let media_id = parsed.pathname.split("/").filter((v) => v)[2];
            let username = parsed.pathname.split("/").filter((v) => v)[1];
            let res = await exports.igstalk(username)
            let res2 = await getStory(res.data.id);
            let tmp;
            let metadata = {};
            for (const idx in res2) {
                if (res2[idx].id.includes(media_id)) {
                    tmp = res2[idx];
                }
            }
            metadata["status"] = 200
            metadata["uriType"] = "IgStory"
            metadata["user"] = {
               username,
               fullname: res.data.fullname,
               private: res.data.private,
               verified: res.data.verified,
               bio: res.data.bio
            }
            metadata["type"] = { 1: "photo", 2: "video" }[tmp.media_type];
            metadata["media"] = { 1: tmp.image_versions2.candidates, 2: tmp.video_versions }[tmp.media_type];
            resolve(metadata);
        } catch (e) {
            reject(e);
        }
    });
}

exports.all_type = (url) => {
    let rex1 = /(?:\/p\/|\/reel\/|\/tv\/)([^\s&]+)/;
    let rex2 = /\/s\/([^\s&]+)/;
    let rex3 = /\/stories\/([^\s&]+)/;

    if (rex1.test(url)) {
       return exports.igdl(url);
    } else if (rex2.test(url)) {
       return exports.igHighlight(url);
    } else if (rex3.test(url)) {
       return exports.igStory(url);
    } else {
       throw "Invalid URL or not supported";
    }
}