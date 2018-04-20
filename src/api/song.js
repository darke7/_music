import { commonParams } from './config'
import axios from 'axios'
import { ERR_OK } from 'api/config'

const proxyRequest = 'http://request.emlice.top/ceshi';

export function getSongsUrl(songs) {
    const url = 'http://ustbhuangyi.com/music/api/getPurlUrl';

    let mids = []
    let types = []

    songs.forEach((song) => {
        mids.push(song.mid)
        types.push(0)
    })

    const urlMid = genUrlMid(mids, types)

    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        format: 'json',
        platform: 'h5',
        needNewCode: 1,
        uin: 0
    })


    return new Promise((reslove, reject) => {
        let tryTime = 3
        function request() {
            return axios({
                url: proxyRequest,
                method: 'post',
                data: {
                    method: 'post',
                    baseURL: url,
                    data: {
                        comm: data,
                        url_mid: urlMid
                    }
                }
            }).then((response) => {
                const res = response.data
                if (res.code === ERR_OK) {
                    let urlMid = res.url_mid
                    if (urlMid && urlMid.code === ERR_OK) {
                        const info = urlMid.data.midurlinfo[0]
                        if (info && info.purl) {
                            reslove(res)
                        } else {
                            retry()
                        }
                    } else {
                        retry()
                    }
                } else {
                    retry()
                }
            })
        }

        function retry() {
            if (--tryTime >= 0) {
                request()
            } else {
                reject(new Error('Can not get the songs url'))
            }
        }

        request()
    })
}

function genUrlMid(mids, types) {
    const guid = getUid()
    return {
        module: 'vkey.GetVkeyServer',
        method: "CgiGetVkey",
        param: {
            guid,
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
        }
    }
}

let _uid = ''

export function getUid() {
    if (_uid) {
        return _uid
    }
    if (!_uid) {
        const t = (new Date).getUTCMilliseconds()
        _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
    }
    return _uid
}

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
