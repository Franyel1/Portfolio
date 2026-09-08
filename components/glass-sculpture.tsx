'use client';
import { useEffect, useRef } from 'react';
export default function GlassSculpture({ paused }: { paused: boolean }) {
 const ref = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const canvas=ref.current; if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'}); if(!gl)return;
  const vertex=`attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment=`precision mediump float; uniform vec2 resolution; uniform float time; uniform vec2 pointer;
   mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
   float shape(vec3 p){p.xz=rot(time*.12+pointer.x*.5)*p.xz;p.xy=rot(.65+pointer.y*.3)*p.xy;p.yz=rot(.6)*p.yz;return length(vec2(length(p.xy)-.94,p.z))-.31;}
   vec3 environment(vec3 d){vec3 c=mix(vec3(.12,.28,.38),vec3(.72,.93,1.),d.y*.5+.5);c+=pow(max(0.,dot(d,normalize(vec3(-1.,2.,1.)))),22.)*vec3(1.,.83,.65);c+=pow(max(0.,dot(d,normalize(vec3(2.,-.2,1.)))),12.)*vec3(.15,.55,.7);return c;}
   void main(){vec2 uv=(gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);vec3 ro=vec3(0.,0.,3.9);vec3 rd=normalize(vec3(uv,-3.));float t=0.;float d=0.;for(int i=0;i<64;i++){d=shape(ro+rd*t);if(d<.002||t>7.)break;t+=d*.8;}if(t>7.){gl_FragColor=vec4(0.);return;}vec3 p=ro+rd*t;vec2 e=vec2(.002,0.);vec3 n=normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));float f=pow(1.-max(0.,dot(n,-rd)),2.5);vec3 reflection=environment(reflect(rd,n));vec3 refraction=environment(refract(rd,n,.72));vec3 color=mix(refraction*vec3(.55,.85,.95),reflection,f*.85+.15);float spec=pow(max(0.,dot(reflect(normalize(vec3(-2.,-3.,-4.)),n),-rd)),30.);color+=spec*.85;gl_FragColor=vec4(color,.88+f*.12);}`;
  const compile=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);return s;};
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram()!;
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const size=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time'),pointer=gl.getUniformLocation(program,'pointer');
  let frame=0,visible=true,last=0,x=0,y=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render=(ms:number)=>{if(visible&&ms-last>32){last=ms;const s=Math.min(640,Math.round(canvas.clientWidth*Math.min(devicePixelRatio,1.25)));if(canvas.width!==s){canvas.width=s;canvas.height=s;gl.viewport(0,0,s,s);}gl.uniform2f(size,s,s);gl.uniform1f(clock,paused||reduced?0:ms*.001);gl.uniform2f(pointer,paused||reduced?0:x,paused||reduced?0:y);gl.drawArrays(gl.TRIANGLES,0,6);}if(!paused&&!reduced)frame=requestAnimationFrame(render);};
  const move=(event:PointerEvent)=>{const r=canvas.getBoundingClientRect();x=(event.clientX-r.left)/r.width-.5;y=(event.clientY-r.top)/r.height-.5;};canvas.addEventListener('pointermove',move);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&(paused||reduced))render(100);});observer.observe(canvas);render(100);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointermove',move);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[paused]);
 return <div className="sculpture"><div className="sculpture-halo"/><canvas ref={ref} width="500" height="500" aria-label="An interactive, rotating glass loop" role="img"/><span className="sculpture-label eyebrow">A different way to see things</span></div>;
}
