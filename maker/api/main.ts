export async function main(request: any) {
    let url = request.url.split("/")
    let method = url[2]
    let id = url[3];
    if (method == "flags") {
        let flag = Deno.readFileSync("./flags/" + id + ".png");
        return flag;
    }else{
        return "Method not allowed";
    }

}