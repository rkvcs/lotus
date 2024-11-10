import Handlebars from "npm:handlebars";
import select from "npm:@inquirer/select";
import { serveDir } from "jsr:@std/http/file-server";

async function main() {
    const _files = Deno.readDirSync('./css')
    const choices= []
    let answer = ""

    for(const _file of _files){
        choices.push({
            name: _file.name,
            value: _file.name,
        })
    }

    if(choices.length > 1){
        answer = await select({
            message: "Select a theme:",
            choices,
        });
    }else{
        answer = choices[0].value ?? 'lotus.css'
    }


    Deno.serve((req) => {
        const pathname = new URL(req.url).pathname;
    
        if (pathname.startsWith("/static")) {
            return serveDir(req, {
                fsRoot: "css",
                urlRoot: "static",
            });
        }
    
        const decoder = new TextDecoder("utf-8");
        const _file = Deno.readFileSync("./server.index.html");
        const template = Handlebars.compile(decoder.decode(_file));
    
        return new Response(template({ theme: answer }), {
            headers: {
                "content-type": "text/html",
            },
        });
    });
}


if (import.meta.main) {
    main();
}
