import yaml from 'js-yaml';

async function getData() {
  const vray = prompt('Masukkan Akun: ');
  const urlparse = encodeURIComponent(vray);
  const link = `https://sub.bonds.id/sub2?target=clash&url=${urlparse}&insert=false&config=base%2Fdatabase%2Fconfig%2Fstandard%2Fstandard_redir.ini&emoji=false&list=true&udp=true&tfo=false&expand=false&scv=true&fdn=false&sort=false&new_name=true`;

  try {
    const response = await fetch(link);
    const data = await response.text();
    const config = yaml.load(data);
    console.log(data);
    const {
      name,
      server,
      port,
      type,
      'skip-cert-verify': skipCertVerify,
    } = config.proxies[0];

    let uuid,
      alterId,
      cipher,
      tls,
      servername,
      network,
      path,
      Host,
      grpcServiceName,
      password,
      sni;

    if (['vmess', 'vless', 'trojan'].includes(type)) {
      const proxy = config.proxies[0];

      if (type === 'vmess') {
        ({ uuid, alterId, cipher, tls, servername } = proxy);
      } else if (type === 'vless') {
        ({ uuid, cipher, tls, servername } = proxy);
      } else if (type === 'trojan') {
        ({ password, sni } = proxy);
      }

      if (proxy.network) {
        network = proxy.network;

        if (network === 'ws') {
          path = proxy['ws-opts'].path;
          Host = proxy['ws-opts'].headers.Host;
        } else if (network === 'grpc') {
          grpcServiceName = proxy['grpc-opts']['grpc-service-name'];
        }
      }
    }

    const configUrls = {
      trojan: {
        ws: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/trojan-ws.json',
        grpc: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/trojan-grpc.json',
        gfw:
          'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/trojan-gfw.json',
      },
      vmess: {
        ws: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vmess-ws.json',
        grpc: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vmess-grpc.json',
      },
      vless: {
        ws: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vless-ws.json',
        grpc: 'https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vless-grpc.json',
      },
    };

    let configSing;
    if (type in configUrls) {
      const url =
        network in configUrls[type]
          ? configUrls[type][network]
          : type === 'trojan'
          ? configUrls[type].gfw
          : undefined;
      if (url) {
        const configSingResponse = await fetch(url);
        configSing = await configSingResponse.json();
      }
    }

    console.log(configSing);

    if (type === 'vmess' || type === 'vless') {
      configSing.outbounds[0].type = type;
      configSing.outbounds[0].server = server;
      configSing.outbounds[0].server_port = parseInt(port, 10);
      configSing.outbounds[0].uuid = uuid;
      configSing.outbounds[0].security = cipher;
    
      if (type === 'vmess') {
        configSing.outbounds[0].alter_id = alterId;
      }
    
      if (network === 'ws') {
        configSing.outbounds[0].transport.path = path;
        configSing.outbounds[0].transport.headers.Host = Host;
      }
    
      if (network === 'grpc') {
        configSing.outbounds[0].transport.service_name = grpcServiceName;
      }
    
      if (tls) {
        configSing.outbounds[0].tls.enabled = tls;
        configSing.outbounds[0].tls.server_name = servername;
        configSing.outbounds[0].tls.insecure = skipCertVerify;
      } else {
        delete configSing.outbounds[0].tls;
      }
    }
    
    if (type === 'trojan') {
      configSing.outbounds[0].type = type;
      configSing.outbounds[0].server = server;
      configSing.outbounds[0].server_port = parseInt(port, 10);
      configSing.outbounds[0].password = password;
    
      if (network === 'ws') {
        configSing.outbounds[0].transport.path = path;
        configSing.outbounds[0].transport.headers.Host = Host;
      }
      if (network === 'grpc') {
        configSing.outbounds[0].transport.service_name = grpcServiceName;
      }
    }

    let formatted_json = JSON.stringify(configSing, null, 2);
    console.log('```json\n' + formatted_json + '\n```\n');
  } catch (error) {
    console.log('Error: ' + error.message);
  }
}

getData();
