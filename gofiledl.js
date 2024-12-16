const uwu = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');
const jar = new CookieJar();
var headers = { "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/534.26 (KHTML, like Gecko)  Chrome/51.0.2561.232 Mobile Safari/536.0', }
const axios = wrapper(uwu.create({ jar, headers }));


function imgbb(buffer, name) {
  return new Promise(async(resolve, reject) => {
    const { data: step1 } = await axios('https://imgbb.com/upload')
    var token = step1.split('<input type="hidden" name="auth_token" value="')[1].split('"')[0]
    const form = new FormData()
    form.append('source', buffer, name);
    form.append('type', 'file');
    form.append('action', 'upload');
    form.append('timestamp', Date.now());
    form.append('auth_token', token);
    const { data } = await axios.post('https://imgbb.com/json', form, { headers: { ...form.getHeaders() } })
    resolve({ imageUrl: data.image.url })
  })
}

module.exports = imgbb
