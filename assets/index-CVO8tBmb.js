var $e=Object.defineProperty;var Ce=(s,e,t)=>e in s?$e(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var W=(s,e,t)=>Ce(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const Te="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa&vs_currencies=eur,ars",Le="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function Be(){const s={EUR:1};try{const t=await(await fetch(Te)).json();s.BTC=t.bitcoin.eur,s.ETH=t.ethereum.eur,s.XRP=t.ripple.eur,s.KAS=t.kaspa.eur,t.bitcoin.ars&&t.bitcoin.eur&&(s.ARS=t.bitcoin.eur/t.bitcoin.ars);const n=await(await fetch(Le)).json();s.USD=1/n.rates.USD,s.CHF=1/n.rates.CHF,s.GBP=1/n.rates.GBP,s.AUD=1/n.rates.AUD,s.GOLD=2100,s.SP500=4700}catch(e){console.error("Failed to fetch some prices:",e),s.USD=s.USD||.92,s.CHF=s.CHF||1.05,s.GBP=s.GBP||1.15,s.AUD=s.AUD||.6,s.ARS=s.ARS||.001}return s}class B{static async hash(e,t="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+t),o=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(o)).map(l=>l.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,t){const a=new TextEncoder,n=await crypto.subtle.importKey("raw",a.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:a.encode(t),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,t){try{const a=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),o=await this.deriveKey(t,this.bufToBase64(a)),i=typeof e=="string"?e:JSON.stringify(e),l=new TextEncoder().encode(i),c=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},o,l);return{payload:this.bufToBase64(new Uint8Array(c)),iv:this.bufToBase64(n),salt:this.bufToBase64(a),v:"5.0"}}catch(a){throw console.error("[Security] Encryption failed:",a),new Error("No se pudo encriptar la información")}}static async decrypt(e,t){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:a,iv:n,salt:o}=e,i=await this.deriveKey(t,o),l=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},i,this.base64ToBuf(a)),c=new TextDecoder().decode(l);try{return JSON.parse(c)}catch{return c}}catch(a){throw console.error("[Security] Decryption failed:",a),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(t=>t.charCodeAt(0)))}}const ae=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:B},Symbol.toStringTag,{value:"Module"})),x={MASTER_HASH:"db_master_hash",VAULT_KEY:"db_vault_key",BIO_ENABLED:"db_bio_enabled"};class k{static isSetup(){return!!localStorage.getItem(x.MASTER_HASH)}static async setup(e){const t=await B.hash(e),a=await B.deriveVaultKey(e);return localStorage.setItem(x.MASTER_HASH,t),sessionStorage.setItem(x.VAULT_KEY,a),a}static async unlock(e){const t=await B.hash(e),a=localStorage.getItem(x.MASTER_HASH);if(t===a){const n=await B.deriveVaultKey(e);return sessionStorage.setItem(x.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const t=sessionStorage.getItem(x.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const a=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:a,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(x.BIO_ENABLED,"true"),localStorage.setItem(x.VAULT_KEY,t),!0}catch(a){throw console.error("Biometric setup failed:",a),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(x.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const t=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:t,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const a=localStorage.getItem(x.VAULT_KEY);if(a)return sessionStorage.setItem(x.VAULT_KEY,a),a;throw new Error("Llave no encontrada. Usa contraseña.")}catch(t){throw console.error("Biometric auth failed:",t),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(x.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(x.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(x.BIO_ENABLED)==="true"}}const Pe="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Me="https://www.googleapis.com/auth/drive.file";class ${static hasToken(){return!!this.accessToken}static async init(){return new Promise((e,t)=>{const a=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.tokenClient=google.accounts.oauth2.initTokenClient({client_id:Pe,scope:Me,callback:n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}this.accessToken=n.access_token,gapi.client.setToken({access_token:n.access_token}),sessionStorage.setItem("drive_access_token",n.access_token)}}),this.accessToken&&gapi.client.setToken({access_token:this.accessToken}),e(!0)}catch(n){console.error("[Drive] Init error:",n),t(n)}}):setTimeout(a,150)};a()})}static async authenticate(){return this.tokenClient||await this.init(),new Promise((e,t)=>{this.tokenClient.callback=a=>{if(a.error){t(new Error(a.error_description||"Fallo en la autenticación"));return}this.accessToken=a.access_token,gapi.client.setToken({access_token:a.access_token}),sessionStorage.setItem("drive_access_token",a.access_token),e(a.access_token)},this.tokenClient.requestAccessToken({prompt:"consent"})})}static async getOrCreateFolderPath(e){var n;(n=gapi.client)!=null&&n.drive||await this.init();const t=e.split("/").filter(o=>o);let a="root";for(const o of t)try{const i=`name = '${o}' and mimeType = 'application/vnd.google-apps.folder' and '${a}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(c&&c.length>0)a=c[0].id;else{const u={name:o,mimeType:"application/vnd.google-apps.folder",parents:[a]};a=(await gapi.client.drive.files.create({resource:u,fields:"id"})).result.id}}catch(i){throw i.status===401?(this.accessToken=null,new Error("Sesión de Google expirada. Por favor reconecta.")):i}return a}static async pushData(e,t){var a,n,o;try{if(!this.accessToken)throw new Error("Cloud not connected");(a=gapi.client)!=null&&a.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log("[Drive] Pushing full encrypted data...");const i=await this.getOrCreateFolderPath("/backup/life-dashboard/"),l=await B.encrypt(e,t),c="dashboard_vault_v5.bin",u=`name = '${c}' and '${i}' in parents and trashed = false`,d=(await gapi.client.drive.files.list({q:u,fields:"files(id)"})).result.files,m=new Blob([JSON.stringify(l)],{type:"application/json"});if(d&&d.length>0){const h=d[0].id,f=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${h}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:m});if(!f.ok)throw new Error(`Error al actualizar backup: ${f.status}`)}else{const h={name:c,parents:[i]},f=new FormData;f.append("metadata",new Blob([JSON.stringify(h)],{type:"application/json"})),f.append("file",m);const E=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:f});if(!E.ok)throw new Error(`Error al crear backup: ${E.status}`)}return!0}catch(i){throw console.error("[Drive] Push failed:",i),new Error(((o=(n=i.result)==null?void 0:n.error)==null?void 0:o.message)||i.message||"Fallo al subir datos a Drive")}}static async pullData(e){var t,a,n;try{if(!this.accessToken)throw new Error("Cloud not connected");(t=gapi.client)!=null&&t.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log("[Drive] Pulling data...");const l=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,u=(await gapi.client.drive.files.list({q:l,fields:"files(id, name)"})).result.files;if(!u||u.length===0)return null;const r=u[0].id,d=await fetch(`https://www.googleapis.com/drive/v3/files/${r}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(!d.ok)throw new Error(`Error al descargar backup: ${d.status}`);const m=await d.json();return await B.decrypt(m,e)}catch(o){throw console.error("[Drive] Pull failed:",o),new Error(((n=(a=o.result)==null?void 0:a.error)==null?void 0:n.message)||o.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){var e,t,a;try{if(!this.accessToken)throw new Error("Cloud not connected");(e=gapi.client)!=null&&e.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken});const i=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:i,fields:"files(id)"})).result.files;if(c&&c.length>0){const u=c[0].id;return await gapi.client.drive.files.delete({fileId:u}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(n){throw console.error("[Drive] Deletion failed:",n),new Error(((a=(t=n.result)==null?void 0:t.error)==null?void 0:a.message)||n.message||"Fallo al borrar backup en Drive")}}}W($,"tokenClient",null),W($,"accessToken",sessionStorage.getItem("drive_access_token")||null);const se={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'};function v(s,e=""){return(se[s]||se.package).replace("<svg",`<svg class="${e}"`)}class Re{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,t="success",a=3e3){const n=document.createElement("div");n.className=`toast toast-${t} stagger-in`;const o=t==="success"?"check":t==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${v(o,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},a)}alert(e,t){return new Promise(a=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>a(!0)}]})})}confirm(e,t,a="Confirmar",n="Cancelar"){return new Promise(o=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>o(!1)},{text:a,type:"danger",onClick:()=>o(!0)}]})})}prompt(e,t,a="",n="text"){return new Promise(o=>{const i=`prompt-input-${Date.now()}`;this._showModal({title:e,message:t,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${i}" class="form-input" placeholder="${a}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)},{text:"Aceptar",type:"primary",onClick:()=>{const l=document.getElementById(i).value;o(l)}}]})})}hardConfirm(e,t,a="BORRAR"){return new Promise(n=>{const o=`hard-confirm-input-${Date.now()}`,i=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${t}<br><br>Escribe <strong>${a}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${o}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:i,disabled:!0,onClick:()=>n(!0)}]});const l=document.getElementById(o),c=document.getElementById(i);l.addEventListener("input",()=>{const u=l.value.trim().toUpperCase()===a.toUpperCase();c.disabled=!u,c.style.opacity=u?"1":"0.3",c.style.pointerEvents=u?"auto":"none"})})}_showModal({title:e,message:t,content:a="",buttons:n=[],centered:o=!1}){const i=document.createElement("div");i.className=`modal-overlay ${o?"overlay-centered":""}`,i.style.zIndex="9999";const l=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;i.id=l;const c=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${t}</div>
                    ${a}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
                    ${n.map((r,d)=>`
                        <button class="btn btn-${r.type} w-full" data-index="${d}" ${r.disabled?'disabled style="opacity: 0.3; pointer-events: none;"':""} ${r.id?`id="${r.id}"`:""}>
                            ${r.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;i.innerHTML=c,document.body.appendChild(i),i.offsetHeight,i.classList.add("active"),i.querySelectorAll(".modal-footer button").forEach(r=>{const d=r.dataset.index;if(d!==void 0){const m=n[d];m.id,r.addEventListener("click",async h=>{h.stopPropagation();try{m.onClick&&await m.onClick(),await this._closeModal(i)}catch(f){console.error("Modal button action failed",f)}})}}),i.addEventListener("click",async r=>{if(r.target===i&&!n.some(m=>m.type==="danger")){const m=n.find(h=>h.type==="secondary");m&&m.onClick(),await this._closeModal(i)}})}async _closeModal(e){e.classList.remove("active");const t=e.querySelector(".modal");return t&&t.classList.add("animate-out"),new Promise(a=>{setTimeout(()=>{e.remove(),a()},300)})}}const g=new Re,X="life-dashboard-data",ne="life-dashboard-secured",J={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,fatLogs:[],fatGoal:15,routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60},{name:"Press Militar",weight:40}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0},{name:"Remo con Barra",weight:50}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[]};class De{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3)}loadState(){return{...J}}async loadEncrypted(e){const t=localStorage.getItem(ne),a=localStorage.getItem(X);if(t)try{const n=JSON.parse(t),o=await B.decrypt(n,e);return this.state={...J,...o},this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(a)try{const n=JSON.parse(a);return this.state={...J,...n},await this.saveState(),localStorage.removeItem(X),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await Be();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=k.getVaultKey();if(e){const t=await B.encrypt(this.state,e);localStorage.setItem(ne,JSON.stringify(t)),localStorage.removeItem(X)}else console.warn("[Store] Attempted to save without Vault Key. Save skipped.")}catch(e){console.error("Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState().then(()=>{const t=k.getVaultKey();t&&$.hasToken()&&$.pushData(this.state,t).then(()=>{console.log("[Auto-Sync] Success"),g.toast("Sincronizado con Drive","success",2e3)}).catch(a=>{console.warn("[Auto-Sync] Failed:",a)})}),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const t={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:t[e]||"$"})}convertToEUR(e,t){if(!t||t==="EUR")return e||0;const a=this.state.rates[t]||1;return(e||0)*a}convertFromEUR(e,t){if(!t||t==="EUR")return e;const a=this.state.rates[t];return a&&a!==0?e/a:e}convertValue(e,t){const a=this.convertToEUR(e,t);return this.convertFromEUR(a,this.state.currency)}addPassiveAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,t]}),t}updatePassiveAsset(e,t){this.setState({passiveAssets:this.state.passiveAssets.map(a=>a.id===e?{...a,...t}:a)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(t=>t.id!==e)})}addActiveIncome(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,t]}),t}updateActiveIncome(e,t){this.setState({activeIncomes:this.state.activeIncomes.map(a=>a.id===e?{...a,...t}:a)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(t=>t.id!==e)})}addLivingExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,t]}),t}updateLivingExpense(e,t){this.setState({livingExpenses:this.state.livingExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(t=>t.id!==e)})}addOtherExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,t]}),t}updateOtherExpense(e,t){this.setState({otherExpenses:this.state.otherExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(t=>t.id!==e)})}addInvestmentAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,t]}),t}updateInvestmentAsset(e,t){this.setState({investmentAssets:this.state.investmentAssets.map(a=>a.id===e?{...a,...t}:a)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(t=>t.id!==e)})}addLiability(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,t]}),t}updateLiability(e,t){this.setState({liabilities:this.state.liabilities.map(a=>a.id===e?{...a,...t}:a)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(t=>t.id!==e)})}sumItems(e,t){return e.reduce((a,n)=>{const o=n[t]||0;return a+this.convertValue(o,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){return this.sumItems(this.state.livingExpenses,"amount")}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),t=this.sumItems(this.state.investmentAssets,"value");return e+t}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),t=this.sumItems(this.state.activeIncomes,"amount");return e+t}getAllExpenses(){const e=this.getLivingExpenses(),t=this.sumItems(this.state.otherExpenses,"amount"),a=this.sumItems(this.state.liabilities,"monthlyPayment");return e+t+a}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}addWeightLog(e){const t={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,t]}})}addFatLog(e){const t={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,t]}})}saveRoutine(e){const t=this.state.health.routines,n=t.find(o=>o.id===e.id)?t.map(o=>o.id===e.id?e:o):[...t,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(t=>t.id!==e)}})}addCalorieLog(e,t=""){const a={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:t};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,a]}})}addGoal(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,t]})}toggleGoal(e){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,completed:!t.completed}:t)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(t=>t.id!==e)})}addEvent(e){const t={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,t]}),this.scheduleNotification(t)}deleteEvent(e){this.setState({events:this.state.events.filter(t=>t.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}}const p=new De,_e=[{id:"finance",icon:"wallet",label:"Finanzas"},{id:"goals",icon:"target",label:"Metas"},{id:"calendar",icon:"calendar",label:"Agenda"},{id:"health",icon:"heart",label:"Salud"},{id:"settings",icon:"settings",label:"Ajustes"}];function ie(s="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,t=_e.map(a=>`
        <div class="nav-item ${a.id===s?"active":""}" data-nav="${a.id}">
            ${v(a.icon,"nav-icon")}
            <span class="nav-label">${a.label}</span>
        </div>
    `).join("");return e+t}function oe(s){const e=document.querySelectorAll(".nav-item");e.forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.nav;e.forEach(n=>n.classList.remove("active")),t.classList.add("active"),s&&s(a)})})}function b(s,e="$"){const t=Math.abs(s);let a=0,n=0;e==="₿"?(a=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(a=0,n=2);const o=new Intl.NumberFormat("en-US",{minimumFractionDigits:a,maximumFractionDigits:n}).format(t);return`${s<0?"-":""}${e}${o}`}function Oe(s,e="$"){const t=Math.abs(s);let a;return t>=1e6?a=(t/1e6).toFixed(1)+"M":t>=1e3?a=(t/1e3).toFixed(1)+"K":a=t.toString(),`${s<0?"-":""}${e}${a}`}function z(s){return s==null?"0.0%":`${s>=0?"+":""}${s.toFixed(1)}%`}const Ue={passive:{label:"Activo Pasivo",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let V=null,H=null;function be(s,e){const t=Ue[e];if(!t){console.error("Unknown category:",e);return}const o=p.getState()[t.storeKey].find(l=>l.id===s);if(!o){console.error("Item not found:",s);return}V=o,H=e;const i=document.createElement("div");i.className="modal-overlay",i.id="edit-modal",i.innerHTML=Fe(o,t),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("active")}),je(t)}const Ne=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"BTC",label:"Bitcoin (BTC)"},{value:"ETH",label:"Ethereum (ETH)"},{value:"XRP",label:"Ripple (XRP)"},{value:"GOLD",label:"Oro (XAU)"},{value:"SP500",label:"S&P 500 (SPX)"}];function Fe(s,e){p.getState().currencySymbol;let t="";return e.fields.includes("value")&&(t+=`
      <div class="form-group">
        <label class="form-label">${H==="investment"?"Cantidad / Valor":"Valor Total"}</label>
        <input type="number" class="form-input" id="edit-value" value="${s.value||0}" step="any" inputmode="decimal">
      </div>
    `),e.fields.includes("amount")&&(t+=`
      <div class="form-group">
        <label class="form-label">${H==="liability"?"Monto Total":H==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
      </div>
    `),e.fields.includes("monthlyIncome")&&(t+=`
      <div class="form-group">
        <label class="form-label">Ingreso Mensual</label>
        <input type="number" class="form-input" id="edit-monthly" value="${s.monthlyIncome||0}" inputmode="numeric">
      </div>
    `),e.fields.includes("monthlyPayment")&&(t+=`
      <div class="form-group">
        <label class="form-label">Pago Mensual</label>
        <input type="number" class="form-input" id="edit-monthly" value="${s.monthlyPayment||0}" inputmode="numeric">
      </div>
    `),`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">Editar ${e.label}</h2>
        <button class="modal-close" id="edit-modal-close">
          ${v("x")}
        </button>
      </div>
      
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${s.name||""}">
      </div>

      <div class="form-group">
        <label class="form-label">Moneda/Activo</label>
        <select class="form-input form-select" id="edit-currency">
          ${Ne.map(a=>`<option value="${a.value}" ${a.value===s.currency?"selected":""}>${a.label}</option>`).join("")}
        </select>
      </div>
      
      ${t}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${s.details||""}" placeholder="Notas adicionales...">
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
        <button class="btn btn-danger" id="btn-delete" style="flex: 0 0 auto; width: auto; padding: 14px 20px;">
          ${v("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function je(s){const e=document.getElementById("edit-modal"),t=document.getElementById("edit-modal-close"),a=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",o=>{o.target===e&&q()}),t.addEventListener("click",q),a.addEventListener("click",()=>Ge(s)),n.addEventListener("click",()=>He(s))}function Ge(s){var c,u,r,d,m,h,f,E;const e=(u=(c=document.getElementById("edit-name"))==null?void 0:c.value)==null?void 0:u.trim(),t=(r=document.getElementById("edit-currency"))==null?void 0:r.value,a=(m=(d=document.getElementById("edit-details"))==null?void 0:d.value)==null?void 0:m.trim(),n=parseFloat((h=document.getElementById("edit-value"))==null?void 0:h.value)||0,o=parseFloat((f=document.getElementById("edit-amount"))==null?void 0:f.value)||0,i=parseFloat((E=document.getElementById("edit-monthly"))==null?void 0:E.value)||0;if(!e){g.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,currency:t,details:a};s.fields.includes("value")&&(l.value=n),s.fields.includes("amount")&&(l.amount=o),s.fields.includes("monthlyIncome")&&(l.monthlyIncome=i),s.fields.includes("monthlyPayment")&&(l.monthlyPayment=i),p[s.updateMethod](V.id,l),q()}function He(s){g.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${V.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(p[s.deleteMethod](V.id),g.toast("Eliminado correctamente","info"),q())})}function q(){const s=document.getElementById("edit-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300)),V=null,H=null}function re(){const s=p.getState(),e=s.currencySymbol,t=p.getPassiveIncome(),a=p.getLivingExpenses(),n=p.getNetPassiveIncome(),o=p.getInvestmentAssetsValue(),i=p.getTotalLiabilities(),l=p.getNetWorth(),c=p.getAllIncomes(),u=p.getAllExpenses(),r=p.getNetIncome();return`
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Finanzas</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <div class="finance-top-grid">
        <!-- PRIMARY METRICS -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Flujo Pasivo Mensual</span>
            ${v("zap","card-icon")}
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot income"></span>
              Ingresos Pasivos
            </span>
            <span class="stat-value positive">${b(t,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${b(a,e)}</span>
          </div>
        </div>
        
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${n<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${v("piggyBank","card-icon")}
          </div>
          <div class="highlight-value ${n<0?"highlight-value-negative":""}">${b(n,e)}</div>
          <div class="highlight-label ${n<0?"highlight-label-negative":""}">
            ${n>=0?"🎉 ¡Libertad financiera alcanzada!":`Faltan ${b(Math.abs(n),e)}/mes`}
          </div>
        </div>
      </div>
      
      <!-- BALANCE SHEET -->
      <div class="section-divider">
        <span class="section-title">Balance Patrimonial</span>
      </div>
      
      <div class="finance-balance-grid">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value text-primary-accent">${b(o,e)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${b(i,e)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${v("scale","card-icon")}
          </div>
          <div class="stat-value ${l>=0?"positive":"negative"}" style="font-size: 28px; font-weight: 700;">
            ${b(l,e)}
          </div>
        </div>
      </div>
      
      <!-- CASH FLOW -->
      <div class="section-divider">
        <span class="section-title">Flujo de Efectivo Mensual</span>
      </div>
      
      <div class="card">
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Todos los Ingresos
          </span>
          <span class="stat-value positive">${b(c,e)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot expense"></span>
            Todos los Gastos
          </span>
          <span class="stat-value negative">${b(u,e)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${r>=0?"positive":"negative"}" style="font-size: 20px;">
            ${b(r,e)}
          </span>
        </div>
      </div>
      
      <div class="finance-links-grid">
        <button class="compound-link-btn" id="open-expenses" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%); border-color: rgba(239, 68, 68, 0.3);">
          <div class="compound-link-content">
            <div class="compound-link-icon" style="background: rgba(239,68,68,0.2); color: var(--accent-danger);">
              ${v("creditCard")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Ver Gastos Mensuales</div>
              <div class="compound-link-subtitle">Detalle de salidas y deudas</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${v("chevronRight")}
          </div>
        </button>

        <!-- COMPOUND INTEREST CALCULATOR LINK -->
        <button class="compound-link-btn" id="open-compound">
          <div class="compound-link-content">
            <div class="compound-link-icon">
              ${v("calculator")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Calculadora de Interés Compuesto</div>
              <div class="compound-link-subtitle">Proyecta el crecimiento de tu patrimonio</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${v("chevronRight")}
          </div>
        </button>
      </div>

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Activos y Pasivos</span>
      </div>
      
      ${Ve(s)}

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${Ke(s)}

      <!-- FOOTER BUTTONS & SETTINGS -->
      <div class="section-divider">
        <span class="section-title">Opciones y Mercados</span>
      </div>

      <div class="footer-actions">
        <button class="btn btn-secondary compound-link-btn" id="open-markets" style="margin-top: 0; background: linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 212, 170, 0.05) 100%); border: 1px solid rgba(0, 212, 170, 0.3);">
            <div class="compound-link-content">
                <div class="compound-link-icon" style="background: rgba(0, 212, 170, 0.3); color: var(--accent-primary);">
                    ${v("trendingUp")}
                </div>
                <div class="compound-link-text">
                    <div class="compound-link-title">Mercados del Mundo</div>
                    <div class="compound-link-subtitle">Índices, Stocks y Cripto</div>
                </div>
            </div>
            <div class="compound-link-arrow">
                ${v("chevronRight")}
            </div>
        </button>

        <div class="card" style="margin-top: var(--spacing-md); padding: var(--spacing-md) !important;">
            <div class="footer-setting-row">
                <div class="setting-info">
                    <div class="setting-label">Divisa de Visualización</div>
                    <div class="setting-desc">Toda la plataforma cambiará a esta moneda</div>
                </div>
                <select class="form-select" id="display-currency-select" style="width: auto; padding: 8px 32px 8px 12px; font-size: 14px; background-position: right 8px center;">
                    <option value="EUR" ${s.currency==="EUR"?"selected":""}>EUR (€)</option>
                    <option value="USD" ${s.currency==="USD"?"selected":""}>USD ($)</option>
                    <option value="CHF" ${s.currency==="CHF"?"selected":""}>CHF (Fr)</option>
                    <option value="GBP" ${s.currency==="GBP"?"selected":""}>GBP (£)</option>
                    <option value="AUD" ${s.currency==="AUD"?"selected":""}>AUD (A$)</option>
                    <option value="ARS" ${s.currency==="ARS"?"selected":""}>ARS ($)</option>
                    <option value="BTC" ${s.currency==="BTC"?"selected":""}>BTC (₿)</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  `}function Ke(s){const e=[...s.passiveAssets,...s.investmentAssets],t=s.liabilities;if(e.length===0)return"";const a={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(r=>{const d=p.convertValue(r.value||0,r.currency||"EUR");r.currency==="BTC"?a.Bitcoin.value+=d:r.currency==="ETH"||r.currency==="XRP"||r.type==="crypto"?a.Altcoins.value+=d:r.type==="property"||r.type==="rental"?a.Inmuebles.value+=d:r.type==="stocks"||r.type==="etf"||r.currency==="SP500"?a.Bolsa.value+=d:r.currency==="GOLD"?a.Oro.value+=d:a["Otros/Efe."].value+=d});const n=t.filter(r=>r.type==="mortgage").reduce((r,d)=>r+p.convertValue(d.amount||0,d.currency||"EUR"),0);a.Inmuebles.value=Math.max(0,a.Inmuebles.value-n),s.hideRealEstate&&(a.Inmuebles.value=0);const o=Object.entries(a).filter(([r,d])=>d.value>0).sort((r,d)=>d[1].value-r[1].value),i=o.reduce((r,[d,m])=>r+m.value,0);if(i===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${s.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let l=0;const c=o.map(([r,d])=>{const m=d.value/i*100,h=l;return l+=m,{name:r,percentage:m,color:d.color,start:h}}),u=c.map(r=>`${r.color} ${r.start}% ${r.start+r.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${s.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${u});">
          <div class="pie-center">
            <div class="pie-total">${b(i,s.currencySymbol)}</div>
            <div class="pie-total-label">Total Neto</div>
          </div>
        </div>
        <div class="allocation-legend">
          ${c.map(r=>`
            <div class="legend-item">
              <div class="legend-color" style="background: ${r.color};"></div>
              <div class="legend-info">
                <span class="legend-name">${r.name}</span>
                <span class="legend-pct">${r.percentage.toFixed(1)}%</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function Ve(s){const e=[...s.passiveAssets.map(a=>({...a,category:"passive"})),...s.investmentAssets.map(a=>({...a,category:"investment"})),...s.liabilities.map(a=>({...a,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${v("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const t=s.currencySymbol;return`
    <div class="asset-list">
      ${e.map(a=>{const n=ze(a.currency||a.type),o=Ye(a.currency||a.type),i=a.category==="liability",l=a.value||a.amount||0,c=p.convertValue(l,a.currency||"EUR");let u="";if(a.currency!==s.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[a.currency]||a.currency;u=`<div class="asset-original-value">${l} ${d}</div>`}return`
          <div class="asset-item" data-id="${a.id}" data-category="${a.category}">
            <div class="asset-icon-wrapper ${n}">
              ${v(o,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${a.name}</div>
              <div class="asset-details">${a.details||a.type||""}</div>
              ${u}
            </div>
            <div>
              <div class="asset-value ${i?"text-warning":""}">
                ${i?"-":""}${b(c,t)}
              </div>
              ${a.monthlyIncome?`<div class="asset-yield">+${b(p.convertValue(a.monthlyIncome,a.currency),t)}/mes</div>`:""}
              ${a.monthlyPayment?`<div class="asset-yield text-negative">-${b(p.convertValue(a.monthlyPayment,a.currency),t)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function ze(s){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt"}[s]||"cash"}function Ye(s){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard"}[s]||"dollarSign"}function le(){document.querySelectorAll(".asset-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,o=a.dataset.category;be(n,o)})});const e=document.getElementById("toggle-real-estate");e&&e.addEventListener("change",()=>{p.toggleRealEstate()});const t=document.getElementById("display-currency-select");t&&t.addEventListener("change",a=>{p.setCurrency(a.target.value)})}let P=10,D=7,_=null,O=null;function qe(){const e=p.getState().currencySymbol,t=p.getNetWorth(),n=p.getNetIncome()*12,o=_!==null?_:t,i=O!==null?O:n,l=fe(o,i,D,P);return`
    <div class="compound-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
          <button class="back-btn" id="back-to-finance">
            ${v("chevronLeft")}
          </button>
          <div>
            <h1 class="page-title">Interés Compuesto</h1>
            <p class="page-subtitle">Proyección de crecimiento patrimonial</p>
          </div>
        </div>
      </header>
      
      <!-- INPUT PARAMETERS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Parámetros</span>
          ${v("settings","card-icon")}
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Capital Inicial</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="principal-input" 
                   value="${o}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-principal" title="Usar Patrimonio Neto">
              ${v("home")}
            </button>
          </div>
          <div class="compound-input-hint">Patrimonio actual: ${b(t,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Aporte Anual</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="contribution-input" 
                   value="${i}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-contribution" title="Usar Ingreso Neto × 12">
              ${v("zap")}
            </button>
          </div>
          <div class="compound-input-hint">Ingreso neto anual: ${b(n,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${D}" step="0.5">
            <span class="slider-value" id="rate-value">${D}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${P}">
            <span class="slider-value" id="years-value">${P} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${P} años</span>
          ${v("trendingUp","card-icon")}
        </div>
        <div class="highlight-value" id="future-value">${b(l.finalValue,e)}</div>
        <div class="highlight-label" id="growth-label">
          ${l.totalGrowth>=0?"📈":"📉"} ${l.growthMultiple.toFixed(1)}x tu capital inicial
        </div>
      </div>
      
      <!-- BREAKDOWN -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Desglose</span>
          ${v("coins","card-icon")}
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot asset"></span>
            Capital Inicial
          </span>
          <span class="stat-value neutral" id="initial-capital">${b(o,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Total Aportado
          </span>
          <span class="stat-value ${l.totalContributions>=0?"positive":"negative"}" id="total-contributed">${b(l.totalContributions,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot" style="background: var(--accent-secondary);"></span>
            Intereses Generados
          </span>
          <span class="stat-value" style="color: var(--accent-secondary);" id="total-interest">${b(l.totalInterest,e)}</span>
        </div>
        
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Valor Final
          </span>
          <span class="stat-value positive" style="font-size: 20px;" id="final-value-breakdown">${b(l.finalValue,e)}</span>
        </div>
      </div>
      
      <!-- YEAR BY YEAR PROJECTION -->
      <div class="section-divider">
        <span class="section-title">Proyección Año a Año</span>
      </div>
      
      <div class="projection-chart" id="projection-chart">
        ${we(l.yearlyBreakdown,e)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${Ee(l.yearlyBreakdown,e)}
      </div>
    </div>
  `}function fe(s,e,t,a){const n=t/100,o=[];let i=s,l=0,c=0;for(let u=1;u<=a;u++){const r=i,d=i*n;i+=d+e,l+=e,c+=d,o.push({year:u,startBalance:r,contribution:e,interest:d,endBalance:i,totalContributions:l,totalInterest:c})}return{finalValue:i,totalContributions:l,totalInterest:c,totalGrowth:i-s,growthMultiple:s>0?i/s:0,yearlyBreakdown:o}}function we(s,e){if(s.length===0)return"";const t=Math.max(...s.map(o=>Math.abs(o.endBalance))),a=Math.ceil(s.length/10);return`
    <div class="chart-bars">
      ${s.filter((o,i)=>(i+1)%a===0||i===s.length-1).map(o=>{const i=t>0?Math.abs(o.endBalance)/t*100:0;return`
          <div class="chart-bar-container">
            <div class="chart-bar ${o.endBalance<0?"negative":""}" style="height: ${Math.max(i,5)}%;">
              <span class="chart-bar-value">${Oe(o.endBalance,e)}</span>
            </div>
            <span class="chart-bar-label">Año ${o.year}</span>
          </div>
        `}).join("")}
    </div>
  `}function Ee(s,e){const t=[];for(let a=0;a<s.length;a++){const n=s[a];(a<5||(a+1)%5===0||a===s.length-1)&&t.push(n)}return`
    <div class="table-container">
      <table class="projection-data-table">
        <thead>
          <tr>
            <th>Año</th>
            <th>Balance</th>
            <th>Interés</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(a=>`
            <tr>
              <td>${a.year}</td>
              <td class="${a.endBalance>=0?"positive":"negative"}">${b(a.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${b(a.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function We(s){const e=document.getElementById("back-to-finance"),t=document.getElementById("rate-slider"),a=document.getElementById("years-slider"),n=document.getElementById("principal-input"),o=document.getElementById("contribution-input"),i=document.getElementById("reset-principal"),l=document.getElementById("reset-contribution");e&&e.addEventListener("click",s),n&&n.addEventListener("input",c=>{_=parseFloat(c.target.value)||0,U()}),o&&o.addEventListener("input",c=>{O=parseFloat(c.target.value)||0,U()}),i&&i.addEventListener("click",()=>{_=null;const c=p.getNetWorth();n.value=c,U()}),l&&l.addEventListener("click",()=>{O=null;const c=p.getNetIncome()*12;o.value=c,U()}),t&&t.addEventListener("input",c=>{D=parseFloat(c.target.value),document.getElementById("rate-value").textContent=`${D}%`,U()}),a&&a.addEventListener("input",c=>{P=parseInt(c.target.value),document.getElementById("years-value").textContent=`${P} años`,U()})}function U(){const e=p.getState().currencySymbol,t=_!==null?_:p.getNetWorth(),a=O!==null?O:p.getNetIncome()*12,n=fe(t,a,D,P),o=document.getElementById("future-value"),i=document.getElementById("future-value-title"),l=document.getElementById("growth-label"),c=document.getElementById("initial-capital"),u=document.getElementById("total-contributed"),r=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),m=document.getElementById("projection-chart"),h=document.getElementById("projection-table");o&&(o.textContent=b(n.finalValue,e)),i&&(i.textContent=`Valor Futuro en ${P} años`),l&&(l.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),c&&(c.textContent=b(t,e)),u&&(u.textContent=b(n.totalContributions,e),u.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),r&&(r.textContent=b(n.totalInterest,e)),d&&(d.textContent=b(n.finalValue,e)),m&&(m.innerHTML=we(n.yearlyBreakdown,e)),h&&(h.innerHTML=Ee(n.yearlyBreakdown,e))}function Xe(){P=10,D=7,_=null,O=null}const Je="https://api.coingecko.com/api/v3",y={STOCKS:"Stocks & Índices",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},N=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:y.STOCKS,yahooId:"%5EGSPC"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:y.STOCKS,yahooId:"%5EIXIC"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:y.STOCKS,yahooId:"URTH"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:y.STOCKS,yahooId:"MSFT"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:y.STOCKS,yahooId:"TSLA"},{id:"apple",name:"Apple",symbol:"AAPL",category:y.STOCKS,yahooId:"AAPL"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:y.STOCKS,yahooId:"AMZN"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:y.STOCKS,yahooId:"NVDA"},{id:"google",name:"Google",symbol:"GOOGL",category:y.STOCKS,yahooId:"GOOGL"},{id:"meta",name:"Meta",symbol:"META",category:y.STOCKS,yahooId:"META"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:y.STOCKS,yahooId:"ORCL"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:y.STOCKS,yahooId:"NFLX"},{id:"ypf",name:"YPF",symbol:"YPF",category:y.STOCKS,yahooId:"YPF"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:y.STOCKS,yahooId:"%5EIBEX"},{id:"gold",name:"Oro",symbol:"XAU",category:y.COMMODITIES,cgId:"pax-gold"},{id:"silver",name:"Plata",symbol:"XAG",category:y.COMMODITIES,cgId:"tether-gold"},{id:"copper",name:"Cobre",symbol:"HG",category:y.COMMODITIES,yahooId:"HG=F"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:y.CRYPTO_MAJORS},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:y.CRYPTO_MAJORS},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:y.CRYPTO_MAJORS},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:y.CRYPTO_MAJORS},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:y.CRYPTO_MAJORS},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:y.CRYPTO_MAJORS},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:y.CRYPTO_ALTS},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:y.CRYPTO_ALTS},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:y.CRYPTO_ALTS},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:y.CRYPTO_ALTS},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:y.CRYPTO_ALTS},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:y.CRYPTO_ALTS},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:y.CRYPTO_ALTS},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:y.CRYPTO_ALTS},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:y.CRYPTO_ALTS},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:y.CRYPTO_ALTS},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:y.CRYPTO_ALTS},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:y.CRYPTO_ALTS},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:y.CRYPTO_ALTS},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:y.CRYPTO_ALTS},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:y.CRYPTO_ALTS},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:y.CRYPTO_ALTS},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:y.CRYPTO_ALTS},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:y.CRYPTO_ALTS},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:y.CRYPTO_ALTS},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:y.CRYPTO_ALTS},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:y.CRYPTO_ALTS}];async function Ze(s="EUR"){const e=N.map(a=>a.cgId).filter(Boolean).join(","),t=`${Je}/coins/markets?vs_currency=${s.toLowerCase()}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const a=await fetch(t),n=a.ok?await a.json():[],o=N.filter(l=>l.yahooId),i=await Qe(o);return N.map(l=>{if(l.cgId){const c=n.find(u=>u.id===l.cgId);if(c)return{...l,price:c.current_price,change24h:c.price_change_percentage_24h_in_currency||c.price_change_percentage_24h||0,change7d:c.price_change_percentage_7d_in_currency||0,change30d:c.price_change_percentage_30d_in_currency||0,change1y:c.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&i[l.yahooId]){const c=i[l.yahooId],u=s==="USD"?1:.92;return{...l,price:c.price*u,change24h:c.change24h,change7d:c.change7d,change30d:c.change30d,change1y:c.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}})}catch(a){return console.error("Market fetch failed",a),N.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function Qe(s){const e={};return await Promise.all(s.map(async t=>{try{const a=`https://query1.finance.yahoo.com/v8/finance/chart/${t.yahooId}?interval=1d&range=1y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(a)}`,i=await(await fetch(n)).json(),l=JSON.parse(i.contents);if(!l.chart||!l.chart.result||!l.chart.result[0])throw new Error("Invalid data");const c=l.chart.result[0],u=c.meta,d=c.indicators.quote[0].close.filter(Ae=>Ae!==null);if(d.length===0)throw new Error("No valid price data");const m=u.regularMarketPrice||d[d.length-1],h=u.chartPreviousClose||(d.length>1?d[d.length-2]:m),f=(m-h)/h*100,E=Math.max(0,d.length-6),A=d[E],T=(m-A)/A*100,L=Math.max(0,d.length-22),R=d[L],F=(m-R)/R*100,j=d[0],G=(m-j)/j*100;e[t.yahooId]={price:m,change24h:isNaN(f)?0:f,change7d:isNaN(T)?0:T,change30d:isNaN(F)?0:F,change1y:isNaN(G)?0:G}}catch(a){console.warn(`Failed to fetch ${t.symbol} from Yahoo`,a),e[t.yahooId]=null}})),e}let Z=[],Q=!0,w={key:"price",direction:"desc"};function et(){const s=p.getState(),e=s.currency||"EUR",t=s.currencySymbol||"€";if(Q&&Z.length===0)return ke(),`
            <div class="market-page">
                <header class="page-header">
                    <h1 class="page-title">Mercados del Mundo</h1>
                    <p class="page-subtitle">Precios y tendencias globales</p>
                </header>
                <div class="empty-state">
                    <div class="loading-spinner"></div>
                    <p class="empty-description">Cargando datos reales de mercado...</p>
                </div>
            </div>
        `;const a=Object.values(y);return`
        <div class="market-page stagger-children" style="padding-bottom: 80px;">
            <header class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <button class="back-btn" id="market-back">
                            ${v("chevronLeft")}
                        </button>
                        <div>
                            <h1 class="page-title">Mercados del Mundo</h1>
                            <p class="page-subtitle">Activos globales en ${e}</p>
                        </div>
                    </div>
                    
                    <div class="market-currency-toggle" style="background: rgba(255,255,255,0.05); padding: 4px; border-radius: var(--radius-md); display: flex; gap: 4px;">
                        <button class="btn-toggle ${e==="EUR"?"active":""}" data-curr="EUR" style="padding: 4px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: ${e==="EUR"?"var(--accent-primary)":"transparent"}; color: ${e==="EUR"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 600;">EUR</button>
                        <button class="btn-toggle ${e==="USD"?"active":""}" data-curr="USD" style="padding: 4px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: ${e==="USD"?"var(--accent-primary)":"transparent"}; color: ${e==="USD"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 600;">USD</button>
                    </div>
                </div>
            </header>

            ${a.map(n=>{const o=Z.filter(i=>i.category===n);return o.length===0?"":tt(n,o,t)}).join("")}
        </div>
    `}function tt(s,e,t){const a=[...e].sort((n,o)=>{let i=n[w.key],l=o[w.key];return typeof i=="string"&&(i=i.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),i<l?w.direction==="asc"?-1:1:i>l?w.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${s}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${w.key==="name"?"active "+w.direction:""}">Activo</th>
                                <th data-sort="price" class="${w.key==="price"?"active "+w.direction:""}">Precio</th>
                                <th data-sort="change24h" class="${w.key==="change24h"?"active "+w.direction:""}">24h</th>
                                <th data-sort="change7d" class="${w.key==="change7d"?"active "+w.direction:""}">7d</th>
                                <th data-sort="change30d" class="${w.key==="change30d"?"active "+w.direction:""}">30d</th>
                                <th data-sort="change1y" class="${w.key==="change1y"?"active "+w.direction:""}">1a</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${a.map(n=>`
                                <tr>
                                    <td style="min-width: 140px;">
                                        <div class="asset-cell">
                                            <span class="asset-symbol" style="color: var(--accent-primary);">${n.symbol.toUpperCase()}</span>
                                            <span class="asset-name" style="font-size: 10px; color: var(--text-muted);">${n.name}</span>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?b(n.price,t):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?z(n.change24h):"-"}</td>
                                    <td class="${n.change7d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change7d!==null?z(n.change7d):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change30d!==null?z(n.change30d):"-"}</td>
                                    <td class="${n.change1y>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change1y!==null?z(n.change1y):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function ke(){const e=p.getState().currency||"EUR";Q=!0,Z=await Ze(e),Q=!1,window.dispatchEvent(new CustomEvent("market-ready"))}function at(s){const e=document.getElementById("market-back");e&&e.addEventListener("click",s),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.sort;w.key===o?w.direction=w.direction==="asc"?"desc":"asc":(w.key=o,w.direction="desc",o==="name"&&(w.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.curr;p.setCurrency(o),ke()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class ce{static getApiKey(){return localStorage.getItem("db_gemini_api_key")}static setApiKey(e){localStorage.setItem("db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var l;const t=this.getApiKey();if(!t)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],o=e.type,i=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:i},{inline_data:{mime_type:o,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!c.ok){const d=await c.json();throw new Error(((l=d.error)==null?void 0:l.message)||"Error al conectar con Gemini AI")}const r=(await c.json()).candidates[0].content.parts[0].text;return JSON.parse(r)}catch(c){throw console.error("[Gemini] Analysis failed:",c),c}}static fileToBase64(e){return new Promise((t,a)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>t(n.result),n.onerror=o=>a(o)})}}function st(){const s=p.getState(),{health:e}=s;return`
    <div class="health-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Salud</h1>
        <p class="page-subtitle">Trackeo de bienestar y fitness</p>
      </header>

      <!-- METRICS: WEIGHT & FAT -->
      <div class="summary-grid">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${e.weightLogs.length>0?e.weightLogs[e.weightLogs.length-1].weight:"--"} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${e.fatLogs.length>0?e.fatLogs[e.fatLogs.length-1].fat:"--"} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
        <div class="summary-item card">
          <div class="summary-value">${e.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card">
          <div class="summary-value">${de(e)}</div>
          <div class="summary-label">Kcal Hoy</div>
        </div>
      </div>

      <div class="health-top-layout">
        <!-- GOAL PROGRESS -->
        <div class="card health-goal-card">
          <div class="card-header">
            <span class="card-title">Progreso hacia el Objetivo</span>
            ${v("target","card-icon")}
          </div>
          <div class="burndown-container">
              ${nt(e)}
          </div>
          <div class="goal-stats" style="margin-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05); padding-top: var(--spacing-sm);">
              <div class="goal-stat">
                  <span class="goal-label">Pendiente:</span>
                  <span class="goal-value" style="color: var(--accent-primary); font-weight: 700;">${ot(e)} kg</span>
              </div>
          </div>
        </div>

        <!-- AI CALORIE TRACKER -->
        <div class="card ai-calorie-card">
          <div class="card-header">
            <span class="card-title">Contador de Calorías IA</span>
            ${v("zap","card-icon")}
          </div>
          <p class="card-desc">Análisis visual instantáneo de platos con IA real.</p>
          <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; margin: var(--spacing-lg) 0;">
            <button class="btn btn-primary ai-scan-btn" id="ai-scan-photo" style="width: 100%;">
                ${v("camera")}
                Capturar Comida
            </button>
          </div>
          <div class="calorie-brief" style="text-align: center; font-size: 13px; color: var(--text-muted);">
              Consumo de hoy: <span style="color: var(--text-primary); font-weight: 600;">${de(e)} kcal</span>
          </div>
        </div>
      </div>

      <!-- WORKOUT ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Rutinas de Entrenamiento</span>
      </div>

      <div class="routines-list">
        ${e.routines.map(t=>`
          <div class="card routine-card">
            <div class="routine-header">
                <div class="routine-info">
                    <div class="routine-name">${t.name}</div>
                    <div class="routine-meta">${t.exercises.length} ejercicios</div>
                </div>
                <button class="icon-btn edit-routine" data-id="${t.id}">
                    ${v("edit")}
                </button>
            </div>
            <div class="exercise-list">
                ${t.exercises.slice(0,3).map(a=>`
                    <div class="exercise-item">
                        <span class="ex-name">${a.name}</span>
                        <span class="ex-weight">${a.weight} kg</span>
                    </div>
                `).join("")}
                ${t.exercises.length>3?`<div class="more-exercises">+ ${t.exercises.length-3} más</div>`:""}
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-secondary add-routine-btn" id="add-routine-btn">
                ${v("plus")} Nueva Rutina
            </button>
        </div>
      </div>
    </div>
  `}function nt(s){const e=s.weightLogs;return e.length<2?'<div class="empty-chart-msg">Registra al menos 2 pesos para ver el gráfico.</div>':`
        <div class="simple-chart-placeholder">
            <svg viewBox="0 0 100 40" class="burndown-line" preserveAspectRatio="none">
                <!-- Goal Line -->
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2" stroke-width="0.5" />
                
                <!-- Progress Line -->
                <path d="${it(e,s.weightGoal)}" fill="none" stroke="var(--accent-primary)" stroke-width="2" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
    `}function it(s,e){if(s.length<2)return"";const t=s.map(r=>r.weight),a=Math.min(...t,e)-1,o=Math.max(...t,e)+1-a,i=s[0].date,c=s[s.length-1].date-i||1;return`M${s.map((r,d)=>{const m=d===0?0:(r.date-i)/c*100,h=40-(r.weight-a)/o*40;return`${m},${h}`}).join(" L")}`}function ot(s){if(s.weightLogs.length===0)return"--";const t=s.weightLogs[s.weightLogs.length-1].weight-s.weightGoal;return t>0?t.toFixed(1):"¡Logrado!"}function de(s){const e=new Date().setHours(0,0,0,0);return s.calorieLogs.filter(t=>new Date(t.date).setHours(0,0,0,0)===e).reduce((t,a)=>t+a.calories,0)}function rt(){var s,e,t,a;(s=document.getElementById("log-weight-btn"))==null||s.addEventListener("click",async()=>{const n=await g.prompt("Registrar Peso","Ingresa tu peso actual en kg:","Ej: 75.5","number");n&&!isNaN(n)&&(p.addWeightLog(n),g.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const n=await g.prompt("Grasa Corporal","Ingresa tu % de grasa:","Ej: 18.2","number");n&&!isNaN(n)&&(p.addFatLog(n),g.toast("Grasa registrada"))}),(t=document.getElementById("ai-scan-photo"))==null||t.addEventListener("click",()=>{const n=document.createElement("input");n.type="file",n.accept="image/*",n.onchange=async i=>{var c;const l=i.target.files[0];if(l){if(!ce.hasKey()){if(await g.confirm("IA no configurada","Para usar IA real debes añadir tu Gemini API Key en Ajustes. ¿Quieres ir a Ajustes?","Configurar IA","Usar Simulación")){(c=document.querySelector('[data-nav="settings"]'))==null||c.click();return}g.toast("Ejecutando Simulación...","info"),o();return}try{g.toast("Analizando con Gemini AI...","info");const u=await ce.analyzeFood(l);await g.confirm("IA Detectada",`La IA identificó: "${u.name}" con unas ${u.calories} kcal. ¿Deseas registrarlo?`,"Registrar","Cancelar")&&(p.addCalorieLog(u.calories,`${u.name} (Gemini AI)`),g.toast("Calorías registradas con IA real"))}catch(u){console.error(u),g.alert("Error IA",u.message||"No se pudo analizar la imagen.")}}};function o(){setTimeout(async()=>{const i=[{name:"Ensalada César",cals:350},{name:"Poke Bowl de Atún",cals:520},{name:"Hamburguesa con Queso",cals:780},{name:"Pasta Carbonara",cals:650},{name:"Tostada de Aguacate",cals:280},{name:"Salmón a la Plancha",cals:410},{name:"Pizza Margherita",cals:850}],l=i[Math.floor(Math.random()*i.length)];await g.confirm("IA Simulada",`La visión (simulada) detectó "${l.name}" con ${l.cals} kcal. ¿Registrar?`)&&(p.addCalorieLog(l.cals,`${l.name} (Simulación)`),g.toast("Calorías registradas"))},1500)}n.click()}),(a=document.getElementById("add-routine-btn"))==null||a.addEventListener("click",async()=>{const n=await g.prompt("Nueva Rutina","Nombre de la rutina (ej: Pierna):","Nombre");n&&(p.saveRoutine({name:n,exercises:[]}),g.toast("Rutina creada"))})}function lt(){const s=p.getState(),{goals:e}=s;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas</h1>
        <p class="page-subtitle">Organiza tus objetivos y tareas</p>
      </header>

      <div class="goals-container">
        ${[{id:"day",label:"Hoy",icon:"zap"},{id:"week",label:"Esta Semana",icon:"calendar"},{id:"year",label:"Objetivos 2026",icon:"target"},{id:"long",label:"Largo Plazo",icon:"trendingUp"}].slice(0,3).map(a=>`
          <div class="goals-column">
            <div class="goals-column-header">
                <div class="goals-column-logo">${v(a.icon)}</div>
                <div class="goals-column-title">${a.label}</div>
            </div>
            
            <div class="goals-list" data-timeframe="${a.id}">
                ${ct(e,a.id)}
            </div>

            <button class="btn btn-secondary add-goal-mini" style="width: 100%; margin-top: var(--spacing-md);" data-timeframe="${a.id}">
                ${v("plus")} Agregar meta
            </button>
          </div>
        `).join("")}
      </div>

      <div class="card add-goal-card-large" id="add-goal-primary" style="margin-top: var(--spacing-2xl);">
          <div class="add-goal-prompt">
              ${v("plus","add-icon")}
              <span>Crear nueva meta estratégica de largo plazo</span>
          </div>
      </div>
    </div>
  `}function ct(s,e){const t=s.filter(a=>a.timeframe===e);return t.length===0?'<div class="empty-goals">No hay metas para este periodo.</div>':t.map(a=>`
        <div class="card goal-item ${a.completed?"completed":""}" data-id="${a.id}">
            <div class="goal-check">
                <div class="checkbox ${a.completed?"checked":""}" data-id="${a.id}">
                    ${a.completed?v("check"):""}
                </div>
            </div>
            <div class="goal-content">
                <div class="goal-top">
                    <span class="goal-category-tag">${a.category||"General"}</span>
                    <button class="goal-delete" data-id="${a.id}">${v("trash")}</button>
                </div>
                <div class="goal-title">${a.title}</div>
                ${a.subGoals&&a.subGoals.length>0?`
                    <div class="subgoals-container">
                        ${a.subGoals.map(n=>`
                            <div class="subgoal-item ${n.completed?"completed":""}">
                                <div class="sub-dot"></div>
                                <span>${n.title}</span>
                            </div>
                        `).join("")}
                    </div>
                `:""}
            </div>
        </div>
    `).join("")}function dt(){document.querySelectorAll(".checkbox").forEach(s=>{s.addEventListener("click",e=>{e.stopPropagation();const t=s.dataset.id;p.toggleGoal(t)})}),document.querySelectorAll(".goal-delete").forEach(s=>{s.addEventListener("click",async e=>{e.stopPropagation(),await g.confirm("¿Eliminar meta?","Esta acción no se puede deshacer.")&&(p.deleteGoal(s.dataset.id),g.toast("Meta eliminada"))})}),document.querySelectorAll(".add-goal-mini, #add-goal-primary").forEach(s=>{s.addEventListener("click",async()=>{const e=s.dataset.timeframe||"day",t=await g.prompt("Nueva Meta","¿Cuál es tu objetivo?");t&&setTimeout(async()=>{const a=await g.prompt("Categoría","Ej: Salud, Finanzas, Trabajo","General");p.addGoal({title:t,timeframe:e,category:a||"General"}),g.toast("Meta añadida")},400)})})}function ut(){const s=p.getState(),{events:e}=s;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Agenda</h1>
        <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation">${v("chevronLeft")}</button>
                <span class="current-month">${vt()}</span>
                <button class="icon-btn-navigation">${v("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${pt(e)}
            </div>
        </div>

        <div class="events-list-container">
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${v("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                        <p style="font-size: 11px; color: var(--text-muted);">Usa el botón + para agregar uno</p>
                    </div>
                `:e.sort((t,a)=>new Date(t.date)-new Date(a.date)).map(t=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${t.category||"event"}">
                            ${v(gt(t.category||"event"))}
                        </div>
                        <div class="event-main-col">
                            <div class="event-title">${t.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${mt(t.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${t.time}</span>
                                ${t.repeat!=="none"?`<span class="event-repeat-tag">${ht(t.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${t.id}">
                            ${v("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function pt(s){const e=new Date,t=e.getMonth(),a=e.getFullYear(),n=e.getDate(),o=new Date(a,t+1,0).getDate(),i=new Date(a,t,1).getDay(),l=["D","L","M","M","J","V","S"],c=new Set;s.forEach(r=>{const d=new Date(r.date);d.getMonth()===t&&d.getFullYear()===a&&c.add(d.getDate())});let u=l.map(r=>`<div class="calendar-day-label">${r}</div>`).join("");for(let r=0;r<i;r++)u+='<div class="calendar-day empty"></div>';for(let r=1;r<=o;r++){const d=r===n,m=c.has(r);u+=`
            <div class="calendar-day ${d?"today":""} ${m?"has-event":""}">
                ${r}
                ${m?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return u}function vt(){const s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],e=new Date;return`${s[e.getMonth()]} ${e.getFullYear()}`}function mt(s){const e={day:"numeric",month:"short"};return new Date(s).toLocaleDateString("es-ES",e).toUpperCase()}function gt(s){switch(s){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function ht(s){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[s]||""}function yt(){document.querySelectorAll(".event-delete-btn").forEach(s=>{s.addEventListener("click",async()=>{await g.confirm("¿Eliminar evento?","¿Estás seguro de que quieres borrar este evento de tu agenda?")&&(p.deleteEvent(s.dataset.id),g.toast("Evento eliminado","info"))})})}function bt(){const s=p.getState(),e=s.currencySymbol,t=s.livingExpenses,a=s.otherExpenses||[],n=s.liabilities,o=p.getLivingExpenses(),i=p.sumItems(a,"amount"),l=p.sumItems(n,"monthlyPayment"),c=o+i+l,u=[...(t||[]).map(r=>({...r,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(a||[]).map(r=>({...r,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(r=>r.monthlyPayment>0).map(r=>({...r,amount:r.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((r,d)=>d.amount-r.amount);return`
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="icon-btn-back" id="back-to-finance">
                ${v("chevronLeft")}
            </button>
            <h1 class="page-title" style="margin-bottom: 0;">Gastos Mensuales</h1>
        </div>
        <p class="page-subtitle" style="margin-left: 40px;">Desglose detallado de tus salidas</p>
      </header>
      
      <!-- PRIMARY METRIC -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Total Mensual</span>
          ${v("creditCard","card-icon")}
        </div>
        <div class="stat-value negative text-center" style="font-size: 32px; margin: var(--spacing-md) 0;">
            ${b(c,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${b(o,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(l,e)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(i,e)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${ft(u,s)}

    </div>
  `}function ft(s,e){if(s.length===0)return`
            <div class="empty-state">
                ${v("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const t=e.currencySymbol;return`
        <div class="asset-list">
            ${s.map(a=>{const n=p.convertValue(a.amount,a.currency||"EUR"),o=wt(a.category);return`
                <div class="asset-item expense-item" data-id="${a.id}" data-category="${a.category}">
                    <div class="asset-icon-wrapper expense">
                        ${v(o,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${a.name}</div>
                        <div class="asset-details">${a.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${b(n,t)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function wt(s){switch(s){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function Et(s){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",s),document.querySelectorAll(".expense-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,o=a.dataset.category;be(n,o)})})}const te={passiveAsset:{label:"Activo Pasivo",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},ue=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let S="passiveAsset";function pe(s="passiveAsset"){var t,a;S=s,(a=(t=te[S])==null?void 0:t.types[0])!=null&&a.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=kt(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),It()}function kt(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${S==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${v("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${S!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(te).map(([e,t])=>`
          <div class="type-option ${e===S?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${v(t.icon)}
            </div>
            <div class="type-option-label">${t.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${Ie()}
      </div>
    </div>
  `}function Ie(){const s=te[S],e=S==="investmentAsset"||S==="passiveAsset";if(e){const a=N.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...ue,...a]}let t="";return S==="passiveAsset"?t=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="input-value" placeholder="0" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
        </div>
      </div>
    `:S==="activeIncome"||S==="livingExpense"?t=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:S==="investmentAsset"?t=`
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="input-value" placeholder="0" step="any" inputmode="decimal">
      </div>
    `:S==="liability"?t=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
        </div>
      </div>
    `:S==="event"&&(t=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input type="date" class="form-input" id="input-date" value="${new Date().toISOString().split("T")[0]}">
        </div>
        <div class="form-group">
          <label class="form-label">Hora</label>
          <input type="time" class="form-input" id="input-time" value="09:00">
        </div>
      </div>
      <div class="form-group">
          <label class="form-label">Repetición</label>
          <select class="form-input form-select" id="input-repeat">
              <option value="none">No repetir</option>
              <option value="daily">Cada día</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
          </select>
      </div>
    `),`
    <div class="form-row">
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Tipo</label>
            <select class="form-input form-select" id="input-type">
                ${s.types.map(a=>`<option value="${a.value}">${a.label}</option>`).join("")}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${ue.map(a=>`<option value="${a.value}">${a.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${N.map(a=>`<option value="${a.symbol}">${a.name} (${a.symbol})</option>`).join("")}
                </optgroup>
                `:""}
            </select>
        </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" class="form-input" id="input-name" placeholder="Ej: Mi Wallet BTC">
    </div>
    
    ${t}
    
    <div class="form-group">
      <label class="form-label">Detalles (opcional)</label>
      <input type="text" class="form-input" id="input-details" placeholder="Notas adicionales...">
    </div>
    
    <button class="btn btn-primary" id="btn-save" style="margin-top: var(--spacing-md);">
      ${v("plus")} Agregar
    </button>
  `}function It(){const s=document.getElementById("add-modal"),e=document.getElementById("modal-close");s.addEventListener("click",a=>{a.target===s&&ee()}),e.addEventListener("click",ee);const t=s.querySelectorAll(".category-selector .type-option");t.forEach(a=>{a.addEventListener("click",()=>{S=a.dataset.category,t.forEach(n=>n.classList.remove("active")),a.classList.add("active"),document.getElementById("form-container").innerHTML=Ie(),ve()})}),ve()}function ve(){const s=document.getElementById("btn-save");s&&s.addEventListener("click",St);const e=document.getElementById("input-currency"),t=document.getElementById("input-name");e&&t&&e.addEventListener("change",()=>{if(!t.value){const a=e.options[e.selectedIndex].text;t.value=a.split(" (")[0]}})}function St(){var d,m,h,f,E,A,T,L,R,F,j,G;const s=(m=(d=document.getElementById("input-name"))==null?void 0:d.value)==null?void 0:m.trim(),e=(h=document.getElementById("input-type"))==null?void 0:h.value,t=(f=document.getElementById("input-currency"))==null?void 0:f.value,a=(A=(E=document.getElementById("input-details"))==null?void 0:E.value)==null?void 0:A.trim(),n=parseFloat((T=document.getElementById("input-value"))==null?void 0:T.value)||0,o=parseFloat((L=document.getElementById("input-amount"))==null?void 0:L.value)||0,i=parseFloat((R=document.getElementById("input-monthly"))==null?void 0:R.value)||0,l=(F=document.getElementById("input-date"))==null?void 0:F.value,c=(j=document.getElementById("input-time"))==null?void 0:j.value,u=(G=document.getElementById("input-repeat"))==null?void 0:G.value;if(!s){g.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const r={name:s,type:e,currency:t,details:a};switch(S){case"passiveAsset":p.addPassiveAsset({...r,value:n,monthlyIncome:i});break;case"activeIncome":p.addActiveIncome({...r,amount:o});break;case"livingExpense":p.addLivingExpense({...r,amount:o});break;case"investmentAsset":p.addInvestmentAsset({...r,value:n});break;case"liability":p.addLiability({...r,amount:o,monthlyPayment:i});break;case"event":p.addEvent({title:s,date:l,time:c,repeat:u,category:e});break}ee()}function ee(){const s=document.getElementById("add-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}function xt(){const s=k.isSetup(),e=k.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${v("lock","auth-icon")}
                </div>
                <h1 class="auth-title">${s?"Bienvenida de nuevo":"Configura tu Bóveda"}</h1>
                <p class="auth-subtitle">${s?"Introduce tu contraseña para entrar":"Crea una contraseña maestra para proteger tus datos"}</p>
            </div>

            <div class="auth-form">
                <div class="input-group">
                    <input type="password" id="auth-password" class="form-input" placeholder="Contraseña maestra" autofocus>
                </div>
                
                ${s?"":`
                <div class="input-group">
                    <input type="password" id="auth-confirm" class="form-input" placeholder="Confirmar contraseña">
                </div>
                `}

                <button id="auth-submit-btn" class="btn btn-primary w-full">
                    ${s?"Desbloquear":"Empezar"}
                </button>

                ${s&&e?`
                <button id="auth-bio-btn" class="btn btn-secondary w-full" style="margin-top: var(--spacing-sm);">
                    ${v("fingerprint")} Usar Huella
                </button>
                `:""}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `}function At(s){var o;const e=document.getElementById("auth-submit-btn"),t=document.getElementById("auth-bio-btn"),a=document.getElementById("auth-password"),n=async()=>{const i=a.value,l=document.getElementById("auth-confirm"),c=k.isSetup();try{let u;if(c)u=await k.unlock(i);else{if(!i||i.length<4)throw new Error("Contraseña demasiado corta");if(i!==l.value)throw new Error("Las contraseñas no coinciden");u=await k.setup(i)}await p.loadEncrypted(u),s()}catch(u){g.alert("Error",u.message)}};e==null||e.addEventListener("click",n),a==null||a.addEventListener("keypress",i=>{i.key==="Enter"&&n()}),(o=document.getElementById("auth-confirm"))==null||o.addEventListener("keypress",i=>{i.key==="Enter"&&n()}),t==null||t.addEventListener("click",async()=>{try{const i=await k.unlockWithBiometrics();await p.loadEncrypted(i),s()}catch(i){g.alert("Identificación",i.message)}}),k.isBioEnabled()&&setTimeout(async()=>{try{const i=await k.unlockWithBiometrics();await p.loadEncrypted(i),s()}catch{console.log("Auto-bio failed or cancelled")}},500)}const $t="modulepreload",Ct=function(s){return"/life-dashboard/"+s},me={},ge=function(e,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(t.map(c=>{if(c=Ct(c),c in me)return;me[c]=!0;const u=c.endsWith(".css"),r=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${r}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":$t,u||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((m,h)=>{d.addEventListener("load",m),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return n.then(i=>{for(const l of i||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})};function Tt(){const s=k.isBioEnabled(),e=$.hasToken();return`
    <div class="settings-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Configuración</h1>
            <p class="page-subtitle">Privacidad, Seguridad y Sincronización</p>
        </header>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${v("shield","section-icon")} Seguridad
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Huella Dactilar / Biometría</div>
                        <div class="settings-item-desc">Desbloqueo rápido y seguro sin contraseña.</div>
                    </div>
                    <label class="switch-premium">
                        <input type="checkbox" id="toggle-bio" ${s?"checked":""}>
                        <span class="slider-premium round"></span>
                    </label>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="change-password-link">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Contraseña Maestra</div>
                        <div class="settings-item-desc">Cambiar la clave de acceso de tu bóveda local.</div>
                    </div>
                    <div class="settings-action-icon">${v("chevronRight")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${v("cloud","section-icon")} Nube & Sincronización
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Google Drive</div>
                        <div class="settings-item-desc">${e?'<span class="status-badge connected">Conectado</span>':'<span class="status-badge disconnected">No conectado</span>'} Sincroniza tu bóveda encriptada.</div>
                    </div>
                    <button class="btn-settings-action ${e?"active":""}" id="sync-drive-btn">
                        ${v(e?"refreshCw":"link")}
                        <span>${e?"Sincronizar":"Conectar"}</span>
                    </button>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="import-backup-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Importar Backup Manual</div>
                        <div class="settings-item-desc">Restaurar desde archivo .bin exportado.</div>
                    </div>
                    <div class="settings-action-icon">${v("upload")}</div>
                </div>
                <input type="file" id="import-backup-input" accept=".bin" style="display: none;">

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="export-data-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Exportar Backup Manual</div>
                        <div class="settings-item-desc">Descargar archivo encriptado (.bin) para seguridad externa.</div>
                    </div>
                    <div class="settings-action-icon">${v("download")}</div>
                </div>
            </div>

            <div class="settings-note">
                ${v("lock","note-icon")} Todos tus datos se encriptan localmente con AES-256-GCM antes de ser enviados a tu Google Drive personal. Nadie más tiene acceso.
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${v("settings","section-icon")} Aplicación
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row clickable" id="btn-logout">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Cerrar Sesión</div>
                        <div class="settings-item-desc">Bloquear acceso y limpiar llaves de sesión.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${v("logOut")}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-force-update">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Forzar Actualización</div>
                        <div class="settings-item-desc">Recargar la última versión de la App (limpia caché).</div>
                    </div>
                    <div class="settings-action-icon">${v("refreshCw")}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-factory-reset">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Borrar todos los datos</div>
                        <div class="settings-item-desc">Elimina permanentemente el almacenamiento local y reinicia la App.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${v("trash")}</div>
                </div>
            </div>

                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${v("zap","section-icon")} Inteligencia Artificial
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row" style="cursor: default;">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Gemini API Key</div>
                        <div class="settings-item-desc">Necesaria para el análisis de comida con IA real.</div>
                        <div style="margin-top: var(--spacing-sm); display: flex; gap: var(--spacing-sm);">
                            <input type="password" id="gemini-api-key" class="form-input" 
                                placeholder="Tu API Key de Google AI" 
                                value="${localStorage.getItem("db_gemini_api_key")||""}"
                                style="border-radius: var(--radius-sm); font-size: 13px;">
                            <button class="btn btn-primary" id="btn-save-gemini" style="padding: 0 16px; min-width: auto; height: 38px;">
                                Guardar
                            </button>
                        </div>
                        <p style="font-size: 10px; color: var(--text-muted); margin-top: 8px;">
                            Consigue tu llave gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-primary);">Google AI Studio</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <footer class="settings-footer">
            <p>Life Dashboard Pro v1.0.35</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Lt(){var a,n,o,i,l,c,u;(a=document.getElementById("toggle-bio"))==null||a.addEventListener("change",async r=>{if(r.target.checked){const m=await g.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(m)try{await k.registerBiometrics(m),g.toast("Biometría activada correctamente")}catch(h){await g.alert("Error",h.message),r.target.checked=!1}else r.target.checked=!1}else localStorage.setItem("db_bio_enabled","false"),g.toast("Biometría desactivada","info")});const s=document.getElementById("btn-install-pwa");s&&setTimeout(()=>{if(window.deferredPrompt){const r=document.getElementById("install-pwa-card");r&&(r.style.display="block"),s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:d}=await window.deferredPrompt.userChoice;if(d==="accepted"){g.toast("Instalando aplicación...");const m=document.getElementById("install-pwa-card");m&&(m.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("sync-drive-btn"))==null||n.addEventListener("click",async()=>{const r=document.getElementById("sync-drive-btn"),d=$.hasToken(),m=r.innerHTML;try{if(r.innerHTML='<div class="loading-spinner-sm"></div>',r.style.pointerEvents="none",d){const h=k.getVaultKey();await $.pushData(p.getState(),h),g.toast("Bóveda actualizada en Drive")}else{await $.authenticate();const h=k.getVaultKey(),f=await $.pullData(h).catch(()=>null);if(f&&await g.confirm("Respaldo Encontrado","Hemos detectado una bóveda existente en Google Drive. ¿Qué deseas hacer con tus datos?","Recuperar de la Nube","Sobreescribir Nube")){p.setState(f),await p.saveState(),g.toast("Datos recuperados correctamente"),setTimeout(()=>window.location.reload(),800);return}await $.pushData(p.getState(),h),g.toast("Google Drive conectado y sincronizado")}typeof window.reRender=="function"&&window.reRender()}catch(h){if(console.error(h),h.message&&(h.message.includes("Contraseña incorrecta")||h.message.includes("corruptos"))){if(await g.confirm("Error de Decifrado","La contraseña actual no coincide con la del backup en la nube. ¿Deseas borrar los datos en Drive para empezar de cero?","Borrar Datos Nube","Cancelar"))try{await $.deleteBackup(),g.toast("Datos de Drive borrados");const E=k.getVaultKey();await $.pushData(p.getState(),E),g.toast("Google Drive sincronizado (Nueva Bóveda)")}catch{g.alert("Error","No se pudieron borrar los datos de Drive.")}}else g.alert("Error",h.message||(typeof h=="object"?JSON.stringify(h):"Error al conectar con Google"))}finally{r.innerHTML=m,r.style.pointerEvents="auto"}}),(o=document.getElementById("export-data-btn"))==null||o.addEventListener("click",async()=>{try{g.toast("Preparando archivo encriptado...","info");const r=p.getState(),d=k.getVaultKey(),{SecurityService:m}=await ge(async()=>{const{SecurityService:L}=await Promise.resolve().then(()=>ae);return{SecurityService:L}},void 0),h=await m.encrypt(r,d),f=new Blob([JSON.stringify(h)],{type:"application/octet-stream"}),E=URL.createObjectURL(f),A=document.createElement("a"),T=new Date().toISOString().split("T")[0];A.href=E,A.download=`life_dashboard_backup_${T}.bin`,document.body.appendChild(A),A.click(),document.body.removeChild(A),URL.revokeObjectURL(E),g.toast("Backup exportado correctamente")}catch(r){console.error("Export error:",r),g.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),t=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{t==null||t.click()}),t==null||t.addEventListener("change",async r=>{var h;const d=(h=r.target.files)==null?void 0:h[0];if(!d)return;if(!await g.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){t.value="";return}try{const f=await d.text(),E=JSON.parse(f),A=k.getVaultKey(),{SecurityService:T}=await ge(async()=>{const{SecurityService:R}=await Promise.resolve().then(()=>ae);return{SecurityService:R}},void 0),L=await T.decrypt(E,A);if(L)p.setState(L),await p.saveState(),g.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(f){console.error("Import error:",f),g.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{t.value=""}}),(i=document.getElementById("btn-logout"))==null||i.addEventListener("click",async()=>{await g.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(k.logout(),window.location.reload())}),(l=document.getElementById("btn-force-update"))==null||l.addEventListener("click",async()=>{if(await g.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const d=await caches.keys();for(let m of d)await caches.delete(m)}catch(d){console.error("Error clearing cache",d)}window.location.reload(!0)}}),(c=document.getElementById("btn-save-gemini"))==null||c.addEventListener("click",()=>{var d;const r=(d=document.getElementById("gemini-api-key"))==null?void 0:d.value;r!==void 0&&(localStorage.setItem("db_gemini_api_key",r.trim()),g.toast("API Key de Gemini guardada"))}),(u=document.getElementById("btn-factory-reset"))==null||u.addEventListener("click",async()=>{if(await g.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){if(localStorage.clear(),sessionStorage.clear(),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(m=>window.indexedDB.deleteDatabase(m.name)),navigator.serviceWorker){const d=await navigator.serviceWorker.getRegistrations();for(let m of d)m.unregister()}g.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.origin+"?reset="+Date.now()},1e3)}})}let M=localStorage.getItem("app_current_page")||"finance",I=localStorage.getItem("app_current_sub_page")||null;I==="null"&&(I=null);async function he(){const s=k.getVaultKey();s?(await p.loadEncrypted(s),Se()):Bt()}function Bt(){const s=document.getElementById("app");s.innerHTML=xt(),At(()=>{Se()})}function Se(){const s=document.getElementById("app");s.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,xe(),p.subscribe(()=>{C()}),window.reRender=()=>C(),Pt()}function Pt(){var a,n;const s=localStorage.getItem("pwa_install_dismissed");if(s&&(Date.now()-parseInt(s))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
        <div class="pwa-install-banner-icon">
            ${v("download")}
        </div>
        <div class="pwa-install-banner-text">
            <div class="pwa-install-banner-title">Instalar Life Dashboard</div>
            <div class="pwa-install-banner-subtitle">Accede más rápido desde tu pantalla de inicio</div>
        </div>
        <button class="pwa-install-btn" id="pwa-banner-install">Instalar</button>
        <button class="pwa-install-close" id="pwa-banner-close">
            ${v("x")}
        </button>
    `,document.body.appendChild(e);const t=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};t(),window.addEventListener("beforeinstallprompt",t),(a=document.getElementById("pwa-banner-install"))==null||a.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:o}=await window.deferredPrompt.userChoice;o==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function xe(){const s=document.getElementById("bottom-nav");s.innerHTML=ie(M),oe(e=>{M=e,I=null,localStorage.setItem("app_current_page",M),localStorage.setItem("app_current_sub_page",I),K(),C(),s.innerHTML=ie(M),oe(t=>{M=t,I=null,localStorage.setItem("app_current_page",M),localStorage.setItem("app_current_sub_page",I),K(),C(),xe()})}),Mt(),C()}function C(){const s=document.getElementById("main-content");if(I==="compound"){s.innerHTML=qe(),We(()=>{I=null,Xe(),K(),C()});return}if(I==="expenses"){s.innerHTML=bt(),Et(()=>{I=null,K(),C()});return}if(I==="market"){s.innerHTML=et(),at(()=>{I=null,K(),C()});return}switch(M){case"finance":s.innerHTML=re(),le(),ye();break;case"goals":s.innerHTML=lt(),dt();break;case"calendar":s.innerHTML=ut(),yt();break;case"health":s.innerHTML=st(),rt();break;case"settings":s.innerHTML=Tt(),Lt(),Y();break;default:s.innerHTML=re(),le(),ye()}}function ye(){const s=document.getElementById("open-compound");s&&s.addEventListener("click",()=>{I="compound",localStorage.setItem("app_current_sub_page",I),Y(),C()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{I="market",localStorage.setItem("app_current_sub_page",I),Y(),C()});const t=document.getElementById("open-expenses");t&&t.addEventListener("click",()=>{I="expenses",localStorage.setItem("app_current_sub_page",I),Y(),C()})}function Mt(){const s=document.querySelector(".fab");s&&s.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=v("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",()=>{M==="calendar"?pe("event"):pe()}),document.body.appendChild(e)}function Y(){const s=document.getElementById("main-fab");s&&(s.style.display="none")}function K(){const s=document.getElementById("main-fab");s&&(s.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",he):he();window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),window.deferredPrompt=s,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});
