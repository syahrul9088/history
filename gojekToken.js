const fetch = require('node-fetch');
const uuid = require('uuid/v4');
const sessionID = uuid();
const readline = require('readline-sync');
const chalk = require('chalk');
const delay = require('delay');
const fs = require('fs-extra');

const unik = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });


const functionLogin = (nomor, unikID, sessionID) => new Promise((resolve, reject) => {
	const url = 'https://api.gojekapi.com/v4/customers/login_with_phone'

	const bodys = {
        "phone": `+${nomor}`
    }

	fetch(url, {
		method: 'POST',
		headers: {
			'X-Session-ID': unikID,
			'X-UniqueId': sessionID,
			'X-AppVersion': '3.34.1',
			Authorization: 'Bearer',
			'Content-Type': 'application/json; charset=UTF-8'
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

const functionVerify = (sessionID, unikID, otp, otpToken) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v4/customers/login/verify';

    const bodys = {
        "client_name":"gojek:cons:android",
        "client_secret":"83415d06-ec4e-11e6-a41b-6c40088ab51e",
        "data":
        {
            "otp": otp,
            "otp_token": otpToken
        },
        "grant_type":"otp",
		"scopes":"gojek:customer:transaction gojek:customer:readonly"
    };

    fetch (url, {
        method : 'POST',
        headers : {
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


(async () => {
    try{
    const unikID = unik(16);
    const nomor = readline.question(chalk.yellow('[-] Nomor (ex: 62XXXX): '))
    const login = await functionLogin(nomor, unikID, sessionID)
    const otpMsg = login.success
    if (otpMsg == true) {
        console.log(chalk.green('[+] OTP berhasil dikirim!'))
    } else {
        console.log(chalk.red('[-] OTP gagal dikirim!'))
    }
    const otpToken = login.data.login_token
    const otp = readline.question(chalk.yellow('OTP: '))
    const verify = await functionVerify(sessionID, unikID, otp, otpToken)
    const accessToken = await verify.data.access_token
    console.log(chalk.yellow(`[+] Your accessToken: ${accessToken}`))
    }catch(e){
        console.log(e) 
    }
})();
