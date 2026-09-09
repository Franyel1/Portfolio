import { mkdir, writeFile } from 'node:fs/promises';
const icons = {react:'react/react-original.svg',nextjs:'nextjs/nextjs-original.svg',javascript:'javascript/javascript-original.svg',html5:'html5/html5-original.svg',css3:'css3/css3-original.svg',python:'python/python-original.svg',flask:'flask/flask-original.svg',nodejs:'nodejs/nodejs-original.svg',mongodb:'mongodb/mongodb-original.svg',docker:'docker/docker-original.svg',git:'git/git-original.svg',figma:'figma/figma-original.svg'};
await mkdir('public/images/skills',{recursive:true});
for (const [name,path] of Object.entries(icons)) {
 const response = await fetch(`https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/${path}`);
 if(!response.ok)throw Error(`${name}: ${response.status}`);
 const svg=await response.text();if(!svg.includes('<svg'))throw Error(`Invalid icon ${name}`);
 await writeFile(`public/images/skills/${name}.svg`,svg);
}
console.log('12 Devicon SVG icons saved locally.');
