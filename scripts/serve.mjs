import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const directory=path.resolve(process.argv[2] || 'dist-preview');
const port=Number(process.argv[3] || 4321);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf','.jpg':'image/jpeg','.png':'image/png','.tex':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const decoded=decodeURIComponent(url.pathname);
    if(decoded.includes('\0')) throw new Error('bad path');
    let file=path.resolve(directory,`.${decoded}`);
    if(file!==directory&&!file.startsWith(directory+path.sep)) {res.writeHead(403);return res.end();}
    const stat=await fs.stat(file).catch(()=>null);
    if(stat?.isDirectory()) {
      if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});return res.end();}
      file=path.join(file,'index.html');
    }
    let body,status=200;
    try{body=await fs.readFile(file);}catch{status=404;file=path.join(directory,'404.html');body=await fs.readFile(file).catch(()=>Buffer.from('Page not found'));}
    res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(port,'0.0.0.0',()=>console.log(`Preview ${directory} on http://localhost:${port}`));
