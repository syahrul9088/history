const fetch = require('node-fetch');
const readline = require('readline-sync');
const uuid = require('uuidv4').default;
const sessionID = uuid()
const chalk = require('chalk');
const delay = require('delay');

const unik = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const functionSendOtp = (nomor, sessionID, unikID) => new Promise((resolve, reject) => {
        const url = 'https://api.gojekapi.com/v4/customers/login_with_phone';
        const bodys = {
            phone: `+${nomor}`
        }
        fetch(url, {
            method: 'POST',
            headers: { 
                'X-Session-ID': sessionID,
                'X-Platform': 'Android',
                'X-UniqueId': unikID,
                'X-AppVersion': '3.34.1',
                'X-AppId': 'com.gojek.app',
                'Accept': 'application/json',
                'X-PhoneModel': 'Android,Custom',
                'X-PushTokenType': 'FCM',
                'X-DeviceOS': 'Android,6.0', 
                'Authorization': 'Bearer',
                'Accept-Language': 'en-ID',
                'X-User-Locale': 'en_ID',
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'okhttp/3.12.1'
            },
            body: JSON.stringify(bodys)
        })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    
    });

const functionVerifOtp = (sessionID, unikID, otp, loginToken) => new Promise((resolve, reject) => {
        const url = 'https://api.gojekapi.com/v4/customers/login/verify';
        const bodys = {
            "client_name":"gojek:cons:android",
            "client_secret":"83415d06-ec4e-11e6-a41b-6c40088ab51e",
            "data":
            {
                "otp": otp,
                "otp_token": loginToken
            },
            "grant_type":"otp",
            "scopes":"gojek:customer:transaction gojek:customer:readonly"
        };
        fetch(url, {
            method: 'POST',
            headers: { 
                'X-Session-ID': sessionID,
                'X-Platform': 'Android',
                'X-UniqueId': unikID,
                'X-AppVersion': '3.34.1',
                'X-AppId': 'com.gojek.app',
                'Accept': 'application/json',
                'X-PhoneModel': 'Android,Custom',
                'X-PushTokenType': 'FCM',
                'X-DeviceOS': 'Android,6.0', 
                'Authorization': 'Bearer',
                'Accept-Language': 'en-ID',
                'X-User-Locale': 'en_ID',
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'okhttp/3.12.1'
            },
            body: JSON.stringify(bodys)
        })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    
    });

const functionCheck = (sessionID, unikID, accessToken) => new Promise((resolve, reject) => {
        const url = 'https://api.gojekapi.com/wallet/history?page=1&limit=20';
        fetch(url, {
            method: 'GET',
            headers: { 
                'X-Session-ID': sessionID,
                'X-Platform': 'Android',
                'X-UniqueId': unikID,
                'X-AppVersion': '3.34.1',
                'X-AppId': 'com.gojek.app',
                'Accept': 'application/json',
                'X-PhoneModel': 'Android,Custom',
                'X-PushTokenType': 'FCM',
                'X-DeviceOS': 'Android,6.0',
                'Authorization': `Bearer ${accessToken}`,
                'Accept-Language': 'en-ID',
                'X-User-Locale': 'en_ID',
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'okhttp/3.12.1'
            }
        })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    
    });

(async () => {
    try{
    for (var i = 0; i < 20; i++) {
    const unikID = unik(16)
    const nomor = readline.question(chalk.yellow('[-] Nomor HP (ex: 62XXX): '))
    const send = await functionSendOtp(nomor, sessionID, unikID)
    if (send.success == true) {
        console.log(chalk.green('[+] OTP berhasil dikirim!'))
    } else if (send.success == false) {
        const msg = send.errors[0].message
        console.log(chalk.red(`[-] ${msg}`))
        break
    }
    const loginToken = send.data.login_token
    const otp = readline.question(chalk.yellow('[-] OTP: '))
    const verif = await functionVerifOtp(sessionID, unikID, otp, loginToken)
    console.log(verif)
    const accessToken = verif.data.access_token
    if (verif.success == true) {
        console.log(chalk.green('[+] Login berhasil!\n'))
    }else {
        console.log(chalk.red('[-] OTP salah!'))
        break
    }
    const check = await functionCheck(sessionID, unikID, accessToken)
    const data = check.data.success[i]
    if (data == undefined) {
        break
    }
    await delay (3000)
    const status = chalk.green(`=> Status: ${data.status}\n=> Jumlah Transaksi: ${data.amount}\n=> Waktu Transaksi: ${data.transacted_at}\n'=> Transaksi Reff: ${data.transaction_ref}\n=> Deskripsi: ${data.description}\n`)
    console.log(status)
}
    }catch(e){
        console.log(e)
    }
})();
