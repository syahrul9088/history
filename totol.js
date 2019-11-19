const fetch = require('node-fetch');
const uuid = require('uuid/v4');
const sessionID = uuid();
const readlineSync = require('readline-sync');
var randomstring = require('randomstring')

const functionName = () => new Promise((resolve, reject) => {

    fetch('https://uinames.com/api/?region=indonesia', { 
        method: 'GET'
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionSendOtp = (nomor) => new Promise((resolve, reject) => {
    const bodys = {
        nation_number: "1",
        user_phone: nomor
    }
      fetch('http://app.mycomma.net/api/common/request_sms_number', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'Authorization': 'Basic',
            'X-Lang': 'ko',
            'X-Login-Type': '',
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'app.mycomma.net',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.0'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });
  
const functionVerifOtp = (otp, nomor) => new Promise((resolve, reject) => {
    const bodys = {
        auth_number: otp,
        nation_number: "1",
        user_phone : nomor
    }
      fetch('http://app.mycomma.net/api/common/check_sms_number', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'Authorization': 'Basic',
            'X-Lang': 'ko',
            'X-Login-Type': '',
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'app.mycomma.net',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.0'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionRegist = (sessionID, code, email, username, nomor) => new Promise((resolve, reject) => {
    const bodys = {
        ad_id: sessionID,
        invite_code: code,
        lang_code: "ko",
        nation_number: "1",
        use_app: "S",
        user_birthday: "",
        user_email: `${email}@gmail.com`,
        user_gender: "",
        user_join: "A",
        user_name: username,
        user_phone: nomor,
        user_platform: "A",
        user_profile_img: "",
        user_pwd: "Kmaway87aaa@",
        user_registration_id: `${randomstring.generate(11)}:${randomstring.generate(9)}-${randomstring.generate(14)}-${randomstring.generate(115)}`,
        user_sns_email: "",
        user_sns_id: ""
    }
      fetch('http://app.mycomma.net/api/user/regist_v2', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'Authorization': 'Basic',
            'X-Lang': 'ko',
            'X-Login-Type': '',
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'app.mycomma.net',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.0'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

(async () => {
    const code = readlineSync.question('[?] Code reff: ')
    for (var i = 0; i < 100; i++) {
      try {
        const uname = await functionName()
        const number = Math.floor(Math.random() * 10000) + 100;
        const username = `${uname.name}${number}`
        const email = `${uname.name}${number}`
        const nomor = readlineSync.question('[?] Nomor HP: ')
        const send = await functionSendOtp(nomor)
        if (send.code == 0000) {
            console.log('[+] OTP berhasil dikirim!')
        } else {
            console.log('[!] OTP gagal dikirim!')
        }
        const otp = readlineSync.question('[?] OTP: ')
        const verif = await functionVerifOtp(otp, nomor)
        if (verif.code == 0000) {
            console.log('[+] Berhasil diverifikasi!')
        } else {
            console.log('[!] Gagal diverifikasi!')
        }
        const regist = await functionRegist(sessionID, code, email, username, nomor)
        if (regist.code == 0000) {
            console.log('[+] Regist berhasil!')
        } else {
            console.log('[!] Regist gagal!')
        }
      } catch (e) {
          console.log(e)
      }
    }
  })()
