'use strict';
const http = require('http');
const pug = require('pug');
const now = new Date();
const server = http.createServer((req, res) => {
    console.info(`[ ${now} ] Requested by ${req.connection.remoteAddress} `);
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    switch (req.method) {
        case 'GET':
            let firstItem = 'あんぱん';
            let secondItem ='クリームパン';
            if (req.url === '/enquetes/yaki-shabu') {
                firstItem = '焼肉';
                secondItem = 'しゃぶしゃぶ';
            } else if (req.url === '/enquetes/rice-bread') {
                firstItem = 'ご飯';
                secondItem = 'パン';
            } else if (req.url === '/enquetes/sushi-pizza') {
                firstItem = '寿司';
                secondItem = 'ピザ'
            }
            res.write(pug.renderFile('./form.pug',{
                path: req.url,
                firstItem: firstItem,
                secondItem: secondItem
            }));
            res.end();
            break;
        case 'POST':
            let rawData = '';
            req.on('data', (chunk) => {
                rawData += chunk;
            }).on('end', () => {
                const decoded = decodeURIComponent(rawData);
                console.info(`${now} 投稿: ${decoded}`);
                res.write(`<!DOCTYPE html>
                    <html lang="ja">
                    <body>
                        <h1> ${decoded} が投稿されました。</h1>
                    </body>
                    </html>`);
                res.end();
            });
            break;
        case 'DELETE':
            res.write(`DELETE ${req.url}`);
            break;
        default:
            break;
    }
}).on('error', (e) => {
    console.error(` [ ${now} ] Server Error`, e);
}).on('clientError', (e) => {
    console.error(` [ ${now} ] Client Error`, e);
});
const port = 8000;
server.listen(port, () => {
    console.info(` [${now}] Listening on ${port}`);
});
