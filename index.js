const yaml = require('js-yaml');

async function getData() {
    const vray = prompt("Masukkan Akun: ");
    const urlparse = encodeURIComponent(vray);
    const link = `https://sub.bonds.id/sub2?target=clash&url=${urlparse}&insert=false&config=base%2Fdatabase%2Fconfig%2Fstandard%2Fstandard_redir.ini&emoji=false&list=true&udp=true&tfo=false&expand=false&scv=true&fdn=false&sort=false&new_name=true`;

    try {
        const response = await fetch(link);
        const data = await response.text();
        const config = yaml.load(data);
        console.log(data);
        const { name, server, port, "skip-cert-verify": skipCertVerify, "ws-opts": { path, "headers":{Host} } } = config.proxies[0];
        console.log("Name: " + name);
        console.log("Server: " + server);
        console.log("port: " + port);
        console.log("Path: " + path);
        console.log("Skip Cert Verify: " + skipCertVerify);
        console.log("Host:" + Host);
        // console.log(JSON.stringify(headers, null, 2));

    } catch (error) {
        console.log("Error: " + error.message);
    }
}

getData();
