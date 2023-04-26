addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
  })
  async function handleRequest(request) {
    if (request.method === "POST") {
      const payload = await request.json()
      if ('message' in payload) {
        const chatId = payload.message.chat.id
        let text = payload.message.text
        let parse = 'markdown'
        const api_Key = API_KEY
        let output = // coming-soon
        const url = `https://api.telegram.org/bot${api_Key}/sendMessage?chat_id=${chatId}&text=${output}&parse_mode=${parse}`
        const data = await fetch(url).then(resp => resp.json())
      }
    }
    return new Response("OK") // Doesn't really matter
  }
