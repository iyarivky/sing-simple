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
      type,
      server,
      uuid,
      port,
      chiper,
      tls,
      servername,
      'skip-cert-verify': skipCertVerify,
      'ws-opts': {
        path,
        headers: { Host },
      },
    } = config.proxies[0];
    const configSing = await fetch('https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vmesstest.json');
    const dataSing = await configSing.json();
    console.log(dataSing);
    dataSing.outbounds[0].type = type
    dataSing.outbounds[0].server = server
    dataSing.outbounds[0].server_port = parseInt(port,10)
    dataSing.outbounds[0].uuid = uuid
    dataSing.outbounds[0].security = chiper
    dataSing.outbounds[0].tls.enabled = tls
    dataSing.outbounds[0].tls.server_name = servername
    dataSing.outbounds[0].tls.insecure = skipCertVerify
    dataSing.outbounds[0].transport.path = path
    dataSing.outbounds[0].transport.headers.Host = Host
    let formatted_json = JSON.stringify(dataSing, null, 2);
    console.log('```json\n' + formatted_json + '\n```\n');

  } catch (error) {
    console.log('Error: ' + error.message);
  }
}

getData();
