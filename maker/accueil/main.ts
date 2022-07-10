export async function main(request:any, webhook:any) {
    let url = request.url
    let method = request.method
    let lang = request.headers.get("Accept-Language")
    let userAgent = request.headers.get("User-Agent")
    let navigator = userAgent.split(" ")
    let browser = navigator[0]
    let version = navigator[1]
    let os = navigator[2]
    let osVersion = navigator[3]
    let device = navigator[4]
    let deviceVersion = navigator[5]
    let deviceType = navigator[6]
    let ipv4 = request.conn.remoteAddr.host
    let ipv6 = request.conn.remoteAddr.hostname
    let ip = ipv4 || ipv6
    let pays = request.headers.get("CF-IPCountry")
    webhook.send({
        "content": `connexion à **flagcreator** depuis **${ip}** `+(pays ? `en **${pays}**` : ``)+` via **${os}** langue : **${lang}**`,
    });

    let temp = Deno.readTextFileSync("./web-page/index.html");

    return temp;

}
