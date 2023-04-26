import yaml from 'js-yaml';
addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
  })
  async function handleRequest(request) {
    if (request.method === "POST") {
      const payload = await request.json()
      if ('message' in payload) {
        const chatId = payload.message.chat.id;
        let text = payload.message.text;
        let parse = 'markdown';
        const api_Key = '6266931631:AAHd1TMF9SqKKmmetTKfq5tXjqoNE1SjD1s';
	const urlparse = encodeURIComponent(text);
	const link = `https://sub.bonds.id/sub2?target=clash&url=${urlparse}&insert=false&config=base%2Fdatabase%2Fconfig%2Fstandard%2Fstandard_redir.ini&emoji=false&list=true&udp=true&tfo=false&expand=false&scv=true&fdn=false&sort=false&new_name=true`;
		try {
			const response = await fetch(link);
			const data = await response.text();
			const config = yaml.load(data);
			// console.log(data);
			const {
			  name,
			  type,
			  server,
			  uuid,
			  port,
			  cipher,
			  tls,
			  servername,
			  'skip-cert-verify': skipCertVerify,
			  network,
			} = config.proxies[0];
			
			let path, Host;
			if (config.proxies[0]['ws-opts']) {
			  path = config.proxies[0]['ws-opts'].path;
			  Host = config.proxies[0]['ws-opts'].headers.Host;
			}
			
			let grpcServiceName;
			if (network === 'grpc' && config.proxies[0]['grpc-opts']) {
			  grpcServiceName = config.proxies[0]['grpc-opts']['grpc-service-name'];
			}
			
			let configSing;
			if (network === 'grpc') {
			  const configSingResponse = await fetch('https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vmessgrpc.json');
			  configSing = await configSingResponse.json();
			} else {
			  const configSingResponse = await fetch('https://raw.githubusercontent.com/iyarivky/sing-simple/main/config/vmesstest.json');
			  configSing = await configSingResponse.json();
			}
			
			console.log(configSing);
			configSing.outbounds[0].type = type;
			configSing.outbounds[0].server = server;
			configSing.outbounds[0].server_port = parseInt(port, 10);
			configSing.outbounds[0].uuid = uuid;
			configSing.outbounds[0].security = cipher;
			
			if (tls) {
			  configSing.outbounds[0].tls.enabled = tls;
			  configSing.outbounds[0].tls.server_name = servername;
			  configSing.outbounds[0].tls.insecure = skipCertVerify;
			} else {
			  delete configSing.outbounds[0].tls;
			}
			
			if (network === 'grpc') {
			  configSing.outbounds[0].transport.service_name = grpcServiceName;
			} else {
			  configSing.outbounds[0].transport.type = network;
			  
			  if (path) {
				configSing.outbounds[0].transport.path = path;
				configSing.outbounds[0].transport.headers.Host = Host;
			  }
			  
			}
			
			let formatted_json = JSON.stringify(configSing, null, 2);
			// console.log('```json\n' + formatted_json + '\n```\n');
			let output = '```json\n' + formatted_json + '\n```\n';
			const uerel = `https://api.telegram.org/bot${api_Key}/sendMessage?chat_id=${chatId}&text=${output}&parse_mode=${parse}`;
			const daita = await fetch(uerel).then(resp => resp.json()) 
		
		  } catch (error) {
			console.log('Error: ' + error.message);
		  }
      }
    }
    return new Response("OK")
  }
