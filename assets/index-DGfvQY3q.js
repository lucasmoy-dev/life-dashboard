var Ce=Object.defineProperty;var Le=(s,e,t)=>e in s?Ce(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var J=(s,e,t)=>Le(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const Te="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",Be="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function Re(){var e,t,a,n,i,o,l,c,u,r,d,v,h,f,E;const s={EUR:1};try{const w=await(await fetch(Te)).json();s.BTC=((e=w.bitcoin)==null?void 0:e.eur)||4e4,s.ETH=((t=w.ethereum)==null?void 0:t.eur)||2200,s.XRP=((a=w.ripple)==null?void 0:a.eur)||.5,s.KAS=((n=w.kaspa)==null?void 0:n.eur)||.1,s.SOL=((i=w.solana)==null?void 0:i.eur)||90,s.XLM=((o=w.stellar)==null?void 0:o.eur)||.11,s.ALGO=((l=w.algorand)==null?void 0:l.eur)||.18,s.LTC=((c=w.litecoin)==null?void 0:c.eur)||65,s.SUI=((u=w.sui)==null?void 0:u.eur)||1.1,s.LINK=((r=w.chainlink)==null?void 0:r.eur)||14,s.RNDR=((d=w["render-token"])==null?void 0:d.eur)||4.5,s.ADA=((v=w.cardano)==null?void 0:v.eur)||.45,s.ONDO=((h=w["ondo-finance"])==null?void 0:h.eur)||.7,(f=w.bitcoin)!=null&&f.ars&&((E=w.bitcoin)!=null&&E.eur)&&(s.ARS=w.bitcoin.eur/w.bitcoin.ars);const C=await fetch(Be);if(C.ok){const L=await C.json();s.USD=1/L.rates.USD,s.CHF=1/L.rates.CHF,s.GBP=1/L.rates.GBP,s.AUD=1/L.rates.AUD}s.GOLD=2100,s.SP500=4700}catch(k){console.error("Failed to fetch some prices:",k),s.USD=s.USD||.92,s.CHF=s.CHF||1.05,s.GBP=s.GBP||1.15,s.AUD=s.AUD||.6,s.ARS=s.ARS||.001}return s}class D{static async hash(e,t="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+t),i=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(i)).map(l=>l.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,t){const a=new TextEncoder,n=await crypto.subtle.importKey("raw",a.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:a.encode(t),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,t){try{const a=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),i=await this.deriveKey(t,this.bufToBase64(a)),o=typeof e=="string"?e:JSON.stringify(e),l=new TextEncoder().encode(o),c=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},i,l);return{payload:this.bufToBase64(new Uint8Array(c)),iv:this.bufToBase64(n),salt:this.bufToBase64(a),v:"5.0"}}catch(a){throw console.error("[Security] Encryption failed:",a),new Error("No se pudo encriptar la información")}}static async decrypt(e,t){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:a,iv:n,salt:i}=e,o=await this.deriveKey(t,i),l=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},o,this.base64ToBuf(a)),c=new TextDecoder().decode(l);try{return JSON.parse(c)}catch{return c}}catch(a){throw console.error("[Security] Decryption failed:",a),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(t=>t.charCodeAt(0)))}}const ne=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:D},Symbol.toStringTag,{value:"Module"})),$={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class x{static isSetup(){return!!localStorage.getItem($.MASTER_HASH)}static async setup(e){const t=await D.hash(e),a=await D.deriveVaultKey(e);return localStorage.setItem($.MASTER_HASH,t),sessionStorage.setItem($.VAULT_KEY,a),a}static async unlock(e){const t=await D.hash(e),a=localStorage.getItem($.MASTER_HASH);if(t===a){const n=await D.deriveVaultKey(e);return sessionStorage.setItem($.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const t=sessionStorage.getItem($.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const a=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:a,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem($.BIO_ENABLED,"true"),localStorage.setItem($.VAULT_KEY,t),!0}catch(a){throw console.error("Biometric setup failed:",a),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem($.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const t=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:t,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const a=localStorage.getItem($.VAULT_KEY);if(a)return sessionStorage.setItem($.VAULT_KEY,a),a;throw new Error("Llave no encontrada. Usa contraseña.")}catch(t){throw console.error("Biometric auth failed:",t),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem($.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem($.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem($.BIO_ENABLED)==="true"}}const De="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Pe="https://www.googleapis.com/auth/drive.file";class T{static hasToken(){return!!this.accessToken&&localStorage.getItem("life-dashboard/drive_connected")==="true"}static async init(){return new Promise((e,t)=>{const a=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.tokenClient=google.accounts.oauth2.initTokenClient({client_id:De,scope:Pe,callback:n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}this.saveSession(n)}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&(console.log("[Drive] Attempting silent token restoration..."),this.tokenClient.requestAccessToken({prompt:"none"})),e(!0)}catch(n){console.error("[Drive] Init error:",n),t(n)}}):setTimeout(a,200)};a()})}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const t=Date.now()+(e.expires_in?e.expires_in*1e3:36e5);localStorage.setItem("life-dashboard/drive_token_expiry",t.toString())}static async authenticate(e=!1){return this.tokenClient||await this.init(),new Promise((t,a)=>{this.tokenClient.callback=n=>{if(n.error){e?(localStorage.setItem("life-dashboard/drive_connected","false"),a(new Error("Silent auth failed"))):a(new Error(n.error_description||"Fallo en la autenticación"));return}this.saveSession(n),t(n.access_token)},e?this.tokenClient.requestAccessToken({prompt:"none"}):this.tokenClient.requestAccessToken({prompt:"consent"})})}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(localStorage.getItem("life-dashboard/drive_connected")==="true"&&Date.now()>e-3e5){console.log("[Drive] Token expired or near expiry, refreshing...");try{return await this.authenticate(!0),this.accessToken}catch{throw console.warn("[Drive] Silent refresh failed, manual re-connect may be needed"),this.accessToken=null,new Error("Sesión de Drive expirada. Por favor reconecta en Configuración.")}}return this.accessToken}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const t=e.split("/").filter(i=>i);let a="root";for(const i of t)try{const o=`name = '${i}' and mimeType = 'application/vnd.google-apps.folder' and '${a}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(c&&c.length>0)a=c[0].id;else{const u={name:i,mimeType:"application/vnd.google-apps.folder",parents:[a]};a=(await gapi.client.drive.files.create({resource:u,fields:"id"})).result.id}}catch(o){throw o.status===401?(this.accessToken=null,new Error("Sesión de Google expirada. Por favor reconecta.")):o}return a}static async pushData(e,t){var a,n,i;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(a=gapi.client)!=null&&a.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log("[Drive] Pushing full encrypted data...");const o=await this.getOrCreateFolderPath("/backup/life-dashboard/"),l=await D.encrypt(e,t),c="dashboard_vault_v5.bin",u=`name = '${c}' and '${o}' in parents and trashed = false`,d=(await gapi.client.drive.files.list({q:u,fields:"files(id)"})).result.files,v=new Blob([JSON.stringify(l)],{type:"application/json"});if(d&&d.length>0){const h=d[0].id,f=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${h}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:v});if(!f.ok)throw new Error(`Error al actualizar backup: ${f.status}`)}else{const h={name:c,parents:[o]},f=new FormData;f.append("metadata",new Blob([JSON.stringify(h)],{type:"application/json"})),f.append("file",v);const E=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:f});if(!E.ok)throw new Error(`Error al crear backup: ${E.status}`)}return!0}catch(o){throw console.error("[Drive] Push failed:",o),new Error(((i=(n=o.result)==null?void 0:n.error)==null?void 0:i.message)||o.message||"Fallo al subir datos a Drive")}}static async pullData(e){var t,a,n;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(t=gapi.client)!=null&&t.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log("[Drive] Pulling data...");const l=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,u=(await gapi.client.drive.files.list({q:l,fields:"files(id, name)"})).result.files;if(!u||u.length===0)return null;const r=u[0].id,d=await fetch(`https://www.googleapis.com/drive/v3/files/${r}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(!d.ok)throw new Error(`Error al descargar backup: ${d.status}`);const v=await d.json();return await D.decrypt(v,e)}catch(i){throw console.error("[Drive] Pull failed:",i),new Error(((n=(a=i.result)==null?void 0:a.error)==null?void 0:n.message)||i.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){var e,t,a;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(e=gapi.client)!=null&&e.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken});const o=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:o,fields:"files(id)"})).result.files;if(c&&c.length>0){const u=c[0].id;return await gapi.client.drive.files.delete({fileId:u}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(n){throw console.error("[Drive] Deletion failed:",n),new Error(((a=(t=n.result)==null?void 0:t.error)==null?void 0:a.message)||n.message||"Fallo al borrar backup en Drive")}}}J(T,"tokenClient",null),J(T,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null);const ie={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'};function g(s,e=""){return(ie[s]||ie.package).replace("<svg",`<svg class="${e}"`)}class Me{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,t="success",a=3e3){const n=document.createElement("div");n.className=`toast toast-${t} stagger-in`;const i=t==="success"?"check":t==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${g(i,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},a)}alert(e,t){return new Promise(a=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>a(!0)}]})})}confirm(e,t,a="Confirmar",n="Cancelar"){return new Promise(i=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>i(!1)},{text:a,type:"danger",onClick:()=>i(!0)}]})})}prompt(e,t,a="",n="text"){return new Promise(i=>{const o=`prompt-input-${Date.now()}`;this._showModal({title:e,message:t,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${o}" class="form-input" placeholder="${a}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)},{text:"Aceptar",type:"primary",onClick:()=>{const l=document.getElementById(o).value;i(l)}}]})})}hardConfirm(e,t,a="BORRAR"){return new Promise(n=>{const i=`hard-confirm-input-${Date.now()}`,o=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${t}<br><br>Escribe <strong>${a}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${i}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:o,disabled:!0,onClick:()=>n(!0)}]});const l=document.getElementById(i),c=document.getElementById(o);l.addEventListener("input",()=>{const u=l.value.trim().toUpperCase()===a.toUpperCase();c.disabled=!u,c.style.opacity=u?"1":"0.3",c.style.pointerEvents=u?"auto":"none"})})}_showModal({title:e,message:t,content:a="",buttons:n=[],centered:i=!1}){const o=document.createElement("div");o.className=`modal-overlay ${i?"overlay-centered":""}`,o.style.zIndex="9999";const l=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;o.id=l;const c=`
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
        `;o.innerHTML=c,document.body.appendChild(o),o.offsetHeight,o.classList.add("active"),o.querySelectorAll(".modal-footer button").forEach(r=>{const d=r.dataset.index;if(d!==void 0){const v=n[d];v.id,r.addEventListener("click",async h=>{h.stopPropagation();try{v.onClick&&await v.onClick(),await this._closeModal(o)}catch(f){console.error("Modal button action failed",f)}})}}),o.addEventListener("click",async r=>{if(r.target===o&&!n.some(v=>v.type==="danger")){const v=n.find(h=>h.type==="secondary");v&&v.onClick(),await this._closeModal(o)}})}async _closeModal(e){e.classList.remove("active");const t=e.querySelector(".modal");return t&&t.classList.add("animate-out"),new Promise(a=>{setTimeout(()=>{e.remove(),a()},300)})}}const m=new Me,Z="life-dashboard/data",oe="life-dashboard/secured",Q={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],lastMarketData:[]};class _e{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3)}loadState(){return{...Q}}async loadEncrypted(e){const t=localStorage.getItem(oe),a=localStorage.getItem(Z);if(t)try{const n=JSON.parse(t),i=await D.decrypt(n,e);return this.state={...Q,...i},this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(a)try{const n=JSON.parse(a);return this.state={...Q,...n},await this.saveState(),localStorage.removeItem(Z),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await Re();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=x.getVaultKey();if(e){const t=await D.encrypt(this.state,e);localStorage.setItem(oe,JSON.stringify(t)),localStorage.removeItem(Z)}else console.warn("[Store] Attempted to save without Vault Key. Save skipped.")}catch(e){console.error("Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState().then(()=>{const t=x.getVaultKey();t&&T.hasToken()&&T.pushData(this.state,t).then(()=>{console.log("[Auto-Sync] Success"),m.toast("Sincronizado con Drive","success",2e3)}).catch(a=>{console.warn("[Auto-Sync] Failed:",a)})}),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const t={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:t[e]||"$"})}convertToEUR(e,t){if(!t||t==="EUR")return e||0;const a=this.state.rates[t]||1;return(e||0)*a}convertFromEUR(e,t){if(!t||t==="EUR")return e;const a=this.state.rates[t];return a&&a!==0?e/a:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,t="investment"){const a={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return t==="passive"?this.addPassiveAsset({...a,monthlyIncome:0}):this.addInvestmentAsset(a)}convertValue(e,t){const a=this.convertToEUR(e,t);return this.convertFromEUR(a,this.state.currency)}addPassiveAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,t]}),t}updatePassiveAsset(e,t){this.setState({passiveAssets:this.state.passiveAssets.map(a=>a.id===e?{...a,...t}:a)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(t=>t.id!==e)})}addActiveIncome(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,t]}),t}updateActiveIncome(e,t){this.setState({activeIncomes:this.state.activeIncomes.map(a=>a.id===e?{...a,...t}:a)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(t=>t.id!==e)})}addLivingExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,t]}),t}updateLivingExpense(e,t){this.setState({livingExpenses:this.state.livingExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(t=>t.id!==e)})}addOtherExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,t]}),t}updateOtherExpense(e,t){this.setState({otherExpenses:this.state.otherExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(t=>t.id!==e)})}addInvestmentAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,t]}),t}updateInvestmentAsset(e,t){this.setState({investmentAssets:this.state.investmentAssets.map(a=>a.id===e?{...a,...t}:a)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(t=>t.id!==e)})}addLiability(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,t]}),t}updateLiability(e,t){this.setState({liabilities:this.state.liabilities.map(a=>a.id===e?{...a,...t}:a)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(t=>t.id!==e)})}sumItems(e,t){return e.reduce((a,n)=>{const i=n[t]||0;return a+this.convertValue(i,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),t=this.sumItems(this.state.liabilities,"monthlyPayment");return e+t}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),t=this.sumItems(this.state.investmentAssets,"value");return e+t}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),t=this.sumItems(this.state.activeIncomes,"amount");return e+t}getAllExpenses(){const e=this.getLivingExpenses(),t=this.sumItems(this.state.otherExpenses,"amount");return e+t}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}addWeightLog(e){const t={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,t]}})}addFatLog(e){const t={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,t]}})}saveRoutine(e){const t=this.state.health.routines,n=t.find(i=>i.id===e.id)?t.map(i=>i.id===e.id?e:i):[...t,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(t=>t.id!==e)}})}renameRoutine(e,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(a=>a.id===e?{...a,name:t}:a)}})}updateExercise(e,t,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const i=[...n.exercises];return i[t]={...i[t],...a},{...n,exercises:i}}return n})}})}addCalorieLog(e,t=""){const a={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:t};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,a]}})}logExercise(e,t,a){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:t,date:Date.now(),rating:parseInt(a)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,t){const n=(this.state.health.exerciseLogs||[]).filter(d=>d.routineId===e&&d.exerciseIndex===t);if(n.length===0)return{color:"green",lastDate:null};n.sort((d,v)=>v.date-d.date);const i=n[0],o=new Date,l=new Date(i.date),c=new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),u=new Date(l.getFullYear(),l.getMonth(),l.getDate()).getTime(),r=(c-u)/(1e3*60*60*24);return r===0?{color:"red",status:"done_today",lastLog:i}:r===1?{color:"red",status:"tired",lastLog:i}:r===2?{color:"orange",status:"recovering",lastLog:i}:{color:"green",status:"ready",lastLog:i}}addGoal(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,t]})}toggleGoal(e){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,completed:!t.completed}:t)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(t=>t.id!==e)})}addEvent(e){const t={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,t]}),this.scheduleNotification(t)}deleteEvent(e){this.setState({events:this.state.events.filter(t=>t.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}}const p=new _e,Ue=[{id:"finance",icon:"wallet",label:"Finanzas"},{id:"health",icon:"heart",label:"Salud"},{id:"goals",icon:"target",label:"Metas"},{id:"calendar",icon:"calendar",label:"Agenda"},{id:"settings",icon:"settings",label:"Ajustes"}];function re(s="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,t=Ue.map(a=>`
        <div class="nav-item ${a.id===s?"active":""}" data-nav="${a.id}">
            ${g(a.icon,"nav-icon")}
            <span class="nav-label">${a.label}</span>
        </div>
    `).join("");return e+t}function le(s){const e=document.querySelectorAll(".nav-item");e.forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.nav;e.forEach(n=>n.classList.remove("active")),t.classList.add("active"),s&&s(a)})})}function b(s,e="$"){const t=Math.abs(s);let a=0,n=0;e==="₿"?(a=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(a=0,n=2);const i=new Intl.NumberFormat("en-US",{minimumFractionDigits:a,maximumFractionDigits:n}).format(t);return`${s<0?"-":""}${e}${i}`}function Oe(s,e="$"){const t=Math.abs(s);let a;return t>=1e6?a=(t/1e6).toFixed(1)+"M":t>=1e3?a=(t/1e3).toFixed(1)+"K":a=t.toString(),`${s<0?"-":""}${e}${a}`}function ce(s){return s==null?"0.0%":`${s>=0?"+":""}${s.toFixed(1)}%`}const Ne="https://api.coingecko.com/api/v3",y={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},M=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:y.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:y.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:y.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:y.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:y.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:y.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:y.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:y.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:y.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:y.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:y.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:y.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:y.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:y.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:y.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:y.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:y.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:y.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:y.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:y.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:y.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:y.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:y.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:y.CRYPTO_ALTS,icon:"bitcoin"}];async function Fe(s="EUR"){const e=M.map(a=>a.cgId).filter(Boolean).join(","),t=`${Ne}/coins/markets?vs_currency=${s.toLowerCase()}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const a=await fetch(t),n=a.ok?await a.json():[],i=M.filter(l=>l.yahooId),o=await je(i);return M.map(l=>{if(l.cgId){const c=n.find(u=>u.id===l.cgId);if(c)return{...l,price:c.current_price,image:c.image,change24h:c.price_change_percentage_24h_in_currency||c.price_change_percentage_24h||0,change7d:c.price_change_percentage_7d_in_currency||0,change30d:c.price_change_percentage_30d_in_currency||0,change1y:c.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&o[l.yahooId]){const c=o[l.yahooId],u=s==="USD"?1:.92;return{...l,price:c.price*u,change24h:c.change24h,change7d:c.change7d,change30d:c.change30d,change1y:c.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}})}catch(a){return console.error("Market fetch failed",a),M.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function je(s){const e={};return await Promise.all(s.map(async t=>{try{const a=`https://query1.finance.yahoo.com/v8/finance/chart/${t.yahooId}?interval=1d&range=1y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(a)}`,o=await(await fetch(n)).json(),l=JSON.parse(o.contents);if(!l.chart||!l.chart.result||!l.chart.result[0])throw new Error("Invalid data");const c=l.chart.result[0],u=c.meta,d=c.indicators.quote[0].close.filter(Y=>Y!==null);if(d.length===0)throw new Error("No valid price data");const v=u.regularMarketPrice||d[d.length-1],h=u.chartPreviousClose||(d.length>1?d[d.length-2]:v),f=(v-h)/h*100,E=Math.max(0,d.length-6),k=d[E],w=(v-k)/k*100,C=Math.max(0,d.length-22),L=d[C],j=(v-L)/L*100,G=d[0],H=(v-G)/G*100;e[t.yahooId]={price:v,change24h:isNaN(f)?0:f,change7d:isNaN(w)?0:w,change30d:isNaN(j)?0:j,change1y:isNaN(H)?0:H}}catch(a){console.warn(`Failed to fetch ${t.symbol} from Yahoo`,a),e[t.yahooId]=null}})),e}const Ge={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let z=null,F=null;function Ee(s,e){const t=Ge[e];if(!t){console.error("Unknown category:",e);return}const i=p.getState()[t.storeKey].find(l=>l.id===s);if(!i){console.error("Item not found:",s);return}z=i,F=e;const o=document.createElement("div");o.className="modal-overlay",o.id="edit-modal",o.innerHTML=Ve(i,t),document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("active")}),ze(t)}const He=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],Ke={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function Ve(s,e){const t=F==="investment"||F==="passive",a=Ke[F]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="edit-value" value="${s.value||0}" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${s.monthlyIncome||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("value")?n=`
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="edit-value" value="${s.value||0}" step="any" inputmode="decimal">
      </div>
    `:e.fields.includes("amount")&&e.fields.includes("monthlyPayment")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${s.monthlyPayment||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("amount")&&(n=`
      <div class="form-group">
        <label class="form-label">${F==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
      </div>
    `),`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">Editar ${e.label}</h2>
        <button class="modal-close" id="edit-modal-close">
          ${g("x")}
        </button>
      </div>

      <div class="form-row">
          <div class="form-group" style="flex: 1.5;">
              <label class="form-label">Tipo</label>
              <select class="form-input form-select" id="edit-type">
                  ${a.map(i=>`<option value="${i.value}" ${i.value===s.type?"selected":""}>${i.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${He.map(i=>`<option value="${i.value}" ${i.value===s.currency?"selected":""}>${i.label}</option>`).join("")}
                  </optgroup>
                  ${t?`
                  <optgroup label="Mercados Reales">
                      ${M.map(i=>`<option value="${i.symbol}" ${i.symbol===s.currency?"selected":""}>${i.name} (${i.symbol})</option>`).join("")}
                  </optgroup>
                  `:""}
              </select>
          </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${s.name||""}">
      </div>
      
      ${n}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${s.details||""}" placeholder="Notas adicionales...">
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
        <button class="btn btn-danger" id="btn-delete" style="flex: 0 0 auto; width: auto; padding: 14px 20px;">
          ${g("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function ze(s){const e=document.getElementById("edit-modal"),t=document.getElementById("edit-modal-close"),a=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",i=>{i.target===e&&X()}),t.addEventListener("click",X),a.addEventListener("click",()=>qe(s)),n.addEventListener("click",()=>Ye(s))}function qe(s){var u,r,d,v,h,f,E,k,w;const e=(r=(u=document.getElementById("edit-name"))==null?void 0:u.value)==null?void 0:r.trim(),t=(d=document.getElementById("edit-type"))==null?void 0:d.value,a=(v=document.getElementById("edit-currency"))==null?void 0:v.value,n=(f=(h=document.getElementById("edit-details"))==null?void 0:h.value)==null?void 0:f.trim(),i=parseFloat((E=document.getElementById("edit-value"))==null?void 0:E.value)||0,o=parseFloat((k=document.getElementById("edit-amount"))==null?void 0:k.value)||0,l=parseFloat((w=document.getElementById("edit-monthly"))==null?void 0:w.value)||0;if(!e){m.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const c={name:e,type:t,currency:a,details:n};s.fields.includes("value")&&(c.value=i),s.fields.includes("amount")&&(c.amount=o),s.fields.includes("monthlyIncome")&&(c.monthlyIncome=l),s.fields.includes("monthlyPayment")&&(c.monthlyPayment=l),p[s.updateMethod](z.id,c),X()}function Ye(s){m.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${z.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(p[s.deleteMethod](z.id),m.toast("Eliminado correctamente","info"),X())})}function X(){const s=document.getElementById("edit-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300)),z=null,F=null}function de(){const s=p.getState(),e=s.currencySymbol,t=p.getPassiveIncome(),a=p.getLivingExpenses(),n=p.getNetPassiveIncome(),i=p.getInvestmentAssetsValue(),o=p.getTotalLiabilities(),l=p.getNetWorth(),c=p.getAllIncomes(),u=p.getAllExpenses(),r=p.getNetIncome();return`
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
            ${g("zap","card-icon")}
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
            ${g("piggyBank","card-icon")}
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
            <div class="summary-value text-primary-accent">${b(i,e)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${b(o,e)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${g("scale","card-icon")}
          </div>
          <div class="stat-value ${l>=0?"positive":"negative"}" style="font-size: 32px; font-weight: 800; text-align: center; margin-top: var(--spacing-sm);">
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
              ${g("creditCard")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Ver Gastos Mensuales</div>
              <div class="compound-link-subtitle">Detalle de salidas y deudas</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${g("chevronRight")}
          </div>
        </button>

        <!-- COMPOUND INTEREST CALCULATOR LINK -->
        <button class="compound-link-btn" id="open-compound">
          <div class="compound-link-content">
            <div class="compound-link-icon">
              ${g("calculator")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Calculadora de Interés Compuesto</div>
              <div class="compound-link-subtitle">Proyecta el crecimiento de tu patrimonio</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${g("chevronRight")}
          </div>
        </button>
      </div>

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${We(s)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${Xe(s)}

      <!-- FOOTER BUTTONS & SETTINGS -->
      <div class="section-divider">
        <span class="section-title">Opciones y Mercados</span>
      </div>

      <div class="footer-actions">
        <button class="btn btn-secondary compound-link-btn" id="open-markets" style="margin-top: 0; background: linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 212, 170, 0.05) 100%); border: 1px solid rgba(0, 212, 170, 0.3);">
            <div class="compound-link-content">
                <div class="compound-link-icon" style="background: rgba(0, 212, 170, 0.3); color: var(--accent-primary);">
                    ${g("trendingUp")}
                </div>
                <div class="compound-link-text">
                    <div class="compound-link-title">Mercados del Mundo</div>
                    <div class="compound-link-subtitle">Índices, Stocks y Cripto</div>
                </div>
            </div>
            <div class="compound-link-arrow">
                ${g("chevronRight")}
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
  `}function We(s){const e=[...s.passiveAssets,...s.investmentAssets],t=s.liabilities;if(e.length===0)return"";const a={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(r=>{const d=p.convertValue(r.value||0,r.currency||"EUR");r.currency==="BTC"?a.Bitcoin.value+=d:r.currency==="ETH"||r.currency==="XRP"||r.type==="crypto"?a.Altcoins.value+=d:r.type==="property"||r.type==="rental"?a.Inmuebles.value+=d:r.type==="stocks"||r.type==="etf"||r.currency==="SP500"?a.Bolsa.value+=d:r.currency==="GOLD"?a.Oro.value+=d:a["Otros/Efe."].value+=d});const n=t.filter(r=>r.type==="mortgage").reduce((r,d)=>r+p.convertValue(d.amount||0,d.currency||"EUR"),0);a.Inmuebles.value=Math.max(0,a.Inmuebles.value-n),s.hideRealEstate&&(a.Inmuebles.value=0);const i=Object.entries(a).filter(([r,d])=>d.value>0).sort((r,d)=>d[1].value-r[1].value),o=i.reduce((r,[d,v])=>r+v.value,0);if(o===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${s.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let l=0;const c=i.map(([r,d])=>{const v=d.value/o*100,h=l;return l+=v,{name:r,percentage:v,color:d.color,start:h}}),u=c.map(r=>`${r.color} ${r.start}% ${r.start+r.percentage}%`).join(", ");return`
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
            <div class="pie-total">${b(o,s.currencySymbol)}</div>
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
  `}function Xe(s){const e=[...s.passiveAssets.map(a=>({...a,category:"passive"})),...s.investmentAssets.map(a=>({...a,category:"investment"})),...s.liabilities.map(a=>({...a,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${g("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const t=s.currencySymbol;return`
    <div class="asset-list">
      ${e.map(a=>{const n=Je(a.currency||a.type),i=Ze(a.currency||a.type),o=a.category==="liability",l=a.value||a.amount||0,c=p.convertValue(l,a.currency||"EUR");let u="";if(a.currency!==s.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[a.currency]||a.currency;u=`<div class="asset-original-value">${l} ${d}</div>`}return`
          <div class="asset-item" data-id="${a.id}" data-category="${a.category}">
            <div class="asset-icon-wrapper ${n}">
              ${g(i,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${a.name}</div>
              <div class="asset-details">${a.details||a.type||""}</div>
              ${u}
            </div>
            <div>
              <div class="asset-value ${o?"text-warning":""}">
                ${o?"-":""}${b(c,t)}
              </div>
              ${a.monthlyIncome?`<div class="asset-yield">+${b(p.convertValue(a.monthlyIncome,a.currency),t)}/mes</div>`:""}
              ${a.monthlyPayment?`<div class="asset-yield text-negative">-${b(p.convertValue(a.monthlyPayment,a.currency),t)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function Je(s){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt"}[s]||"cash"}function Ze(s){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard"}[s]||"dollarSign"}function ue(){document.querySelectorAll(".asset-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,i=a.dataset.category;Ee(n,i)})});const e=document.getElementById("toggle-real-estate");e&&e.addEventListener("change",()=>{p.toggleRealEstate()});const t=document.getElementById("display-currency-select");t&&t.addEventListener("change",a=>{p.setCurrency(a.target.value)})}let P=10,_=7,U=null,O=null;function Qe(){const e=p.getState().currencySymbol,t=p.getNetWorth(),n=p.getNetIncome()*12,i=U!==null?U:t,o=O!==null?O:n,l=ke(i,o,_,P);return`
    <div class="compound-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
          <button class="back-btn" id="back-to-finance">
            ${g("chevronLeft")}
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
          ${g("settings","card-icon")}
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Capital Inicial</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="principal-input" 
                   value="${i}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-principal" title="Usar Patrimonio Neto">
              ${g("home")}
            </button>
          </div>
          <div class="compound-input-hint">Patrimonio actual: ${b(t,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Aporte Anual</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="contribution-input" 
                   value="${o}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-contribution" title="Usar Ingreso Neto × 12">
              ${g("zap")}
            </button>
          </div>
          <div class="compound-input-hint">Ingreso neto anual: ${b(n,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${_}" step="0.5">
            <span class="slider-value" id="rate-value">${_}%</span>
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
          ${g("trendingUp","card-icon")}
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
          ${g("coins","card-icon")}
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot asset"></span>
            Capital Inicial
          </span>
          <span class="stat-value neutral" id="initial-capital">${b(i,e)}</span>
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
        ${xe(l.yearlyBreakdown,e)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${Ie(l.yearlyBreakdown,e)}
      </div>
    </div>
  `}function ke(s,e,t,a){const n=t/100,i=[];let o=s,l=0,c=0;for(let u=1;u<=a;u++){const r=o,d=o*n;o+=d+e,l+=e,c+=d,i.push({year:u,startBalance:r,contribution:e,interest:d,endBalance:o,totalContributions:l,totalInterest:c})}return{finalValue:o,totalContributions:l,totalInterest:c,totalGrowth:o-s,growthMultiple:s>0?o/s:0,yearlyBreakdown:i}}function xe(s,e){if(s.length===0)return"";const t=Math.max(...s.map(i=>Math.abs(i.endBalance))),a=Math.ceil(s.length/10);return`
    <div class="chart-bars">
      ${s.filter((i,o)=>(o+1)%a===0||o===s.length-1).map(i=>{const o=t>0?Math.abs(i.endBalance)/t*100:0;return`
          <div class="chart-bar-container">
            <div class="chart-bar ${i.endBalance<0?"negative":""}" style="height: ${Math.max(o,5)}%;">
              <span class="chart-bar-value">${Oe(i.endBalance,e)}</span>
            </div>
            <span class="chart-bar-label">Año ${i.year}</span>
          </div>
        `}).join("")}
    </div>
  `}function Ie(s,e){const t=[];for(let a=0;a<s.length;a++){const n=s[a];(a<5||(a+1)%5===0||a===s.length-1)&&t.push(n)}return`
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
  `}function et(s){const e=document.getElementById("back-to-finance"),t=document.getElementById("rate-slider"),a=document.getElementById("years-slider"),n=document.getElementById("principal-input"),i=document.getElementById("contribution-input"),o=document.getElementById("reset-principal"),l=document.getElementById("reset-contribution");e&&e.addEventListener("click",s),n&&n.addEventListener("input",c=>{U=parseFloat(c.target.value)||0,N()}),i&&i.addEventListener("input",c=>{O=parseFloat(c.target.value)||0,N()}),o&&o.addEventListener("click",()=>{U=null;const c=p.getNetWorth();n.value=c,N()}),l&&l.addEventListener("click",()=>{O=null;const c=p.getNetIncome()*12;i.value=c,N()}),t&&t.addEventListener("input",c=>{_=parseFloat(c.target.value),document.getElementById("rate-value").textContent=`${_}%`,N()}),a&&a.addEventListener("input",c=>{P=parseInt(c.target.value),document.getElementById("years-value").textContent=`${P} años`,N()})}function N(){const e=p.getState().currencySymbol,t=U!==null?U:p.getNetWorth(),a=O!==null?O:p.getNetIncome()*12,n=ke(t,a,_,P),i=document.getElementById("future-value"),o=document.getElementById("future-value-title"),l=document.getElementById("growth-label"),c=document.getElementById("initial-capital"),u=document.getElementById("total-contributed"),r=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),v=document.getElementById("projection-chart"),h=document.getElementById("projection-table");i&&(i.textContent=b(n.finalValue,e)),o&&(o.textContent=`Valor Futuro en ${P} años`),l&&(l.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),c&&(c.textContent=b(t,e)),u&&(u.textContent=b(n.totalContributions,e),u.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),r&&(r.textContent=b(n.totalInterest,e)),d&&(d.textContent=b(n.finalValue,e)),v&&(v.innerHTML=xe(n.yearlyBreakdown,e)),h&&(h.innerHTML=Ie(n.yearlyBreakdown,e))}function tt(){P=10,_=7,U=null,O=null}let q=p.getState().lastMarketData||[],K=q.length===0,I={key:"price",direction:"desc"};function at(){const s=p.getState(),e=s.currency||"EUR",t=s.currencySymbol||"€";if(q.length===0){if(K)return ee(),`
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
            `}else K||ee();const a=Object.values(y);return`
        <div class="market-page stagger-children" style="padding-bottom: 80px;">
            <header class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <button class="back-btn" id="market-back">
                            ${g("chevronLeft")}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${K?`
                                    <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,212,170,0.1); padding: 4px 10px; border-radius: 20px;">
                                        <div class="loading-spinner-sm" style="width:10px; height:10px; border-width: 1.5px; border-color: var(--accent-primary) transparent var(--accent-primary) transparent;"></div>
                                        <span style="font-size: 10px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Actualizando</span>
                                    </div>
                                `:""}
                            </div>
                            <p class="page-subtitle">Activos globales en ${e}</p>
                        </div>
                    </div>
                    
                    <div class="market-currency-toggle" style="background: rgba(255,255,255,0.05); padding: 4px; border-radius: var(--radius-md); display: flex; gap: 4px;">
                        <button class="btn-toggle ${e==="EUR"?"active":""}" data-curr="EUR" style="padding: 4px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: ${e==="EUR"?"var(--accent-primary)":"transparent"}; color: ${e==="EUR"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 600;">EUR</button>
                        <button class="btn-toggle ${e==="USD"?"active":""}" data-curr="USD" style="padding: 4px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: ${e==="USD"?"var(--accent-primary)":"transparent"}; color: ${e==="USD"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 600;">USD</button>
                    </div>
                </div>
            </header>

            ${a.map(n=>{const i=q.filter(o=>o.category===n);return i.length===0?"":st(n,i,t)}).join("")}
        </div>
    `}function st(s,e,t){const a=[...e].sort((n,i)=>{let o=n[I.key],l=i[I.key];return typeof o=="string"&&(o=o.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),o<l?I.direction==="asc"?-1:1:o>l?I.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${s}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${I.key==="name"?"active "+I.direction:""}" style="padding-left: var(--spacing-md);">Activo</th>
                                <th data-sort="price" class="${I.key==="price"?"active "+I.direction:""}">Precio</th>
                                <th data-sort="change24h" class="${I.key==="change24h"?"active "+I.direction:""}">24h</th>
                                <th data-sort="change30d" class="${I.key==="change30d"?"active "+I.direction:""}" style="padding-right: var(--spacing-md);">30d</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${a.map(n=>`
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${n.image?`<img src="${n.image}" alt="${n.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`:`<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${g(n.icon||"dollarSign")}
                                                </div>`}
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${n.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${n.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?b(n.price,t):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?ce(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?ce(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function ee(){const e=p.getState().currency||"EUR";K=!0,q=await Fe(e),p.saveMarketData(q),K=!1,window.dispatchEvent(new CustomEvent("market-ready"))}function nt(s){const e=document.getElementById("market-back");e&&e.addEventListener("click",s),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.sort;I.key===i?I.direction=I.direction==="asc"?"desc":"asc":(I.key=i,I.direction="desc",i==="name"&&(I.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.curr;p.setCurrency(i),ee()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class pe{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var l;const t=this.getApiKey();if(!t)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],i=e.type,o=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const c=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o},{inline_data:{mime_type:i,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!c.ok){const d=await c.json();throw new Error(((l=d.error)==null?void 0:l.message)||"Error al conectar con Gemini AI")}const r=(await c.json()).candidates[0].content.parts[0].text;return JSON.parse(r)}catch(c){throw console.error("[Gemini] Analysis failed:",c),c}}static fileToBase64(e){return new Promise((t,a)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>t(n.result),n.onerror=i=>a(i)})}}function it(){const s=p.getState(),{health:e}=s;return`
    <div class="health-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Salud</h1>
        <p class="page-subtitle">Trackeo de bienestar y fitness</p>
      </header>

      <!-- WORKOUT ROUTINES (TOP) -->
      <div class="section-divider" style="margin-top: 0;">
        <span class="section-title">Rutinas de Entrenamiento</span>
      </div>

      <div class="routines-list">
        ${e.routines.map(t=>`
          <div class="card routine-card">
            <div class="routine-header">
                <div class="routine-info">
                    <div class="routine-name clickable rename-routine" data-id="${t.id}">${t.name}</div>
                    <div class="routine-meta">${t.exercises.length} ejercicios</div>
                </div>
                <button class="icon-btn delete-routine" data-id="${t.id}" style="color: var(--accent-danger);">
                    ${g("trash")}
                </button>
            </div>
            <div class="exercise-list">
                ${t.exercises.map((a,n)=>{const i=p.getExerciseStatus(t.id,n);let o="var(--text-muted)";i.color==="red"&&(o="var(--accent-danger)"),i.color==="orange"&&(o="var(--accent-warning)"),i.color==="green"&&(o="var(--accent-success)");let l="";return i.status==="done_today"&&i.lastLog&&(l=`<span style="font-size: 10px; color: var(--accent-tertiary);">★ ${i.lastLog.rating}</span>`),`
                    <div class="exercise-item-health">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background-color: ${o}; box-shadow: 0 0 6px ${o};"></div>
                            <div class="ex-health-info" style="${i.color==="red"?"opacity: 0.6;":""}">
                                <div class="ex-health-name">${a.name}</div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${t.id}" data-index="${n}">${a.weight||0}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${t.id}" data-index="${n}">${a.reps||14} reps</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span style="font-size: 11px; font-weight: 500;">4 series</span>
                                    ${l?`<span style="opacity: 0.3;">•</span> ${l}`:""}
                                </div>
                            </div>
                        </div>
                        <button class="log-exercise-large-btn trigger-exercise-log" data-routine="${t.id}" data-index="${n}" data-name="${a.name}">
                            🏋️
                        </button>
                    </div>
                    `}).join("")}
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-secondary add-routine-btn" id="add-routine-btn">
                ${g("plus")} Nueva Rutina
            </button>
        </div>
      </div>

      <!-- METRICS: WEIGHT & FAT -->
      <div class="section-divider">
        <span class="section-title">Métricas de Cuerpo</span>
      </div>

      <div class="summary-grid">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${e.weightLogs.length>0?e.weightLogs[e.weightLogs.length-1].weight:"--"} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${e.fatLogs.length>0&&e.fatLogs[e.fatLogs.length-1].fat||"--"} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
        <div class="summary-item card">
          <div class="summary-value">${e.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card">
          <div class="summary-value">${ve(e)}</div>
          <div class="summary-label">Kcal Hoy</div>
        </div>
      </div>

      <div class="health-top-layout">
        <!-- GOAL PROGRESS -->
        <div class="card health-goal-card">
          <div class="card-header">
            <span class="card-title">Progreso de Peso</span>
            ${g("target","card-icon")}
          </div>
          <div class="burndown-container">
              ${ot(e)}
          </div>
          <div class="goal-stats" style="margin-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05); padding-top: var(--spacing-sm);">
              <div class="goal-stat">
                  <span class="goal-label">Faltan:</span>
                  <span class="goal-value" style="color: var(--accent-primary); font-weight: 700;">${lt(e)} kg</span>
              </div>
          </div>
        </div>

        <!-- AI CALORIE TRACKER -->
        <div class="card ai-calorie-card">
          <div class="card-header">
            <span class="card-title">Analizador de Platos IA</span>
            ${g("zap","card-icon")}
          </div>
          <p class="card-desc">Análisis visual instantáneo de comida con Gemini Flash.</p>
          <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; margin: var(--spacing-lg) 0;">
            <button class="btn btn-primary ai-scan-btn" id="ai-scan-photo" style="width: 100%;">
                ${g("camera")}
                Capturar Comida
            </button>
          </div>
          <div class="calorie-brief" style="text-align: center; font-size: 13px; color: var(--text-muted);">
              Consumo de hoy: <span style="color: var(--text-primary); font-weight: 600;">${ve(e)} kcal</span>
          </div>
        </div>
      </div>
    </div>
  `}function ot(s){const e=s.weightLogs;return e.length<2?'<div class="empty-chart-msg">Registra al menos 2 pesos para ver el gráfico.</div>':`
        <div class="simple-chart-placeholder">
            <svg viewBox="0 0 100 40" class="burndown-line" preserveAspectRatio="none">
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2" stroke-width="0.5" />
                <path d="${rt(e,s.weightGoal)}" fill="none" stroke="var(--accent-primary)" stroke-width="2" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
    `}function rt(s,e){if(s.length<2)return"";const t=s.map(r=>r.weight),a=Math.min(...t,e)-1,i=Math.max(...t,e)+1-a,o=s[0].date,c=s[s.length-1].date-o||1;return`M${s.map((r,d)=>{const v=d===0?0:(r.date-o)/c*100,h=40-(r.weight-a)/i*40;return`${v},${h}`}).join(" L")}`}function lt(s){if(s.weightLogs.length===0)return"--";const t=s.weightLogs[s.weightLogs.length-1].weight-s.weightGoal;return t>0?t.toFixed(1):"¡Logrado!"}function ve(s){const e=new Date().setHours(0,0,0,0);return s.calorieLogs.filter(t=>new Date(t.date).setHours(0,0,0,0)===e).reduce((t,a)=>t+a.calories,0)}function ct(){var e,t,a,n;(e=document.getElementById("log-weight-btn"))==null||e.addEventListener("click",async()=>{const i=await m.prompt("Registrar Peso","Ingresa tu peso actual en kg:","Ej: 75.5","number");i&&!isNaN(i)&&(p.addWeightLog(i),m.toast("Peso registrado"))}),(t=document.getElementById("log-fat-btn"))==null||t.addEventListener("click",async()=>{const i=await m.prompt("Grasa Corporal","Ingresa tu % de grasa (deja en blanco si no lo sabes):","Ej: 18.2","number");if(i!==null){const o=parseFloat(i);isNaN(o)||(p.addFatLog(o),m.toast("Grasa registrada"))}}),document.querySelectorAll(".rename-routine").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.id,l=i.textContent,c=await m.prompt("Renombrar Rutina","Nuevo nombre:",l);c&&c!==l&&(p.renameRoutine(o,c),m.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.id;await m.confirm("Borrar Rutina","¿Estás seguro de eliminar esta rutina?","BORRAR","CANCELAR")&&(p.deleteRoutine(o),m.toast("Rutina eliminada"))})}),document.querySelectorAll(".update-weight").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.routine,c=parseInt(i.dataset.index),u=i.textContent.replace("kg",""),r=await m.prompt("Cambiar Peso","Ingresa el nuevo peso (kg):",u,"number");r!==null&&!isNaN(r)&&(p.updateExercise(l,c,{weight:parseFloat(r)}),m.toast("Peso actualizado"))})}),document.querySelectorAll(".update-reps").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.routine,c=parseInt(i.dataset.index),u=i.textContent.replace(" reps",""),r=await m.prompt("Cambiar Repeticiones","Ingresa las reps objetivo:",u,"number");r!==null&&!isNaN(r)&&(p.updateExercise(l,c,{reps:parseInt(r)}),m.toast("Reps actualizadas"))})}),document.querySelectorAll(".trigger-exercise-log").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.routine,c=parseInt(i.dataset.index),u=i.dataset.name,r=await m.prompt("Monitor de Ejercicio",`¿Completaste "${u}" hoy? Califica tu desempeño (1-5):`,"5","number");if(r){const d=parseInt(r);d>=1&&d<=5?(p.logExercise(l,c,d),m.toast("¡Entrenamiento guardado!","success")):m.toast("Calificación inválida (1-5)","error")}})}),(a=document.getElementById("ai-scan-photo"))==null||a.addEventListener("click",()=>{const i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=async l=>{var u;const c=l.target.files[0];if(c){if(!pe.hasKey()){if(await m.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(u=document.querySelector('[data-nav="settings"]'))==null||u.click();return}m.toast("Usando simulación...","info"),o();return}try{m.toast("Analizando con Gemini...","info");const r=await pe.analyzeFood(c);await m.confirm("IA Detectada",`Identificado: "${r.name}" (${r.calories} kcal). ¿Registrar?`)&&(p.addCalorieLog(r.calories,`${r.name} (AI)`),m.toast("Calorías registradas"))}catch(r){m.alert("Error IA",r.message)}}};function o(){setTimeout(async()=>{const l={name:"Bowl Saludable",cals:450};await m.confirm("IA Simulada",`Detectado "${l.name}" con ${l.cals} kcal. ¿Registrar?`)&&(p.addCalorieLog(l.cals,l.name),m.toast("Registrado"))},1e3)}i.click()}),(n=document.getElementById("add-routine-btn"))==null||n.addEventListener("click",async()=>{const i=await m.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");i&&(p.saveRoutine({name:i,exercises:[]}),m.toast("Rutina creada"))})}function dt(){const s=p.getState(),{goals:e}=s;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas</h1>
        <p class="page-subtitle">Organiza tus objetivos y tareas</p>
      </header>

      <div class="goals-container">
        ${[{id:"day",label:"Hoy",icon:"zap"},{id:"week",label:"Esta Semana",icon:"calendar"},{id:"year",label:"Objetivos 2026",icon:"target"},{id:"long",label:"Largo Plazo",icon:"trendingUp"}].slice(0,3).map(a=>`
          <div class="goals-column">
            <div class="goals-column-header">
                <div class="goals-column-logo">${g(a.icon)}</div>
                <div class="goals-column-title">${a.label}</div>
            </div>
            
            <div class="goals-list" data-timeframe="${a.id}">
                ${ut(e,a.id)}
            </div>

            <!-- Quick Add Input -->
            <div class="quick-add-goal">
                <input type="text" class="quick-add-input" placeholder="Agregar a ${a.label}..." data-timeframe="${a.id}">
            </div>

            <button class="btn btn-secondary add-goal-mini" style="width: 100%; margin-top: var(--spacing-sm);" data-timeframe="${a.id}">
                ${g("plus")} Meta avanzada
            </button>
          </div>
        `).join("")}
      </div>

      <div class="card add-goal-card-large" id="add-goal-primary" style="margin-top: var(--spacing-2xl);">
          <div class="add-goal-prompt">
              ${g("plus","add-icon")}
              <span>Crear nueva meta estratégica de largo plazo</span>
          </div>
      </div>
    </div>
  `}function ut(s,e){const t=s.filter(a=>a.timeframe===e);return t.length===0?'<div class="empty-goals">No hay metas para este periodo.</div>':t.map(a=>`
        <div class="card goal-item ${a.completed?"completed":""}" data-id="${a.id}">
            <div class="goal-check">
                <div class="checkbox ${a.completed?"checked":""}" data-id="${a.id}">
                    ${a.completed?g("check"):""}
                </div>
            </div>
            <div class="goal-content">
                <div class="goal-top">
                    <span class="goal-category-tag">${a.category||"General"}</span>
                    <button class="goal-delete" data-id="${a.id}">${g("trash")}</button>
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
    `).join("")}function pt(){document.querySelectorAll(".checkbox").forEach(s=>{s.addEventListener("click",e=>{e.stopPropagation();const t=s.dataset.id;p.toggleGoal(t)})}),document.querySelectorAll(".goal-delete").forEach(s=>{s.addEventListener("click",async e=>{e.stopPropagation(),await m.confirm("¿Eliminar meta?","Esta acción no se puede deshacer.")&&(p.deleteGoal(s.dataset.id),m.toast("Meta eliminada"))})}),document.querySelectorAll(".quick-add-input").forEach(s=>{s.addEventListener("keypress",e=>{if(e.key==="Enter"&&s.value.trim()){const t=s.dataset.timeframe;p.addGoal({title:s.value.trim(),timeframe:t,category:"General"}),s.value="",m.toast("Meta añadida")}})}),document.querySelectorAll(".add-goal-mini, #add-goal-primary").forEach(s=>{s.addEventListener("click",async()=>{const e=s.dataset.timeframe||"day",t=await m.prompt("Nueva Meta","¿Cuál es tu objetivo?");t&&setTimeout(async()=>{const a=await m.prompt("Categoría","Ej: Salud, Finanzas, Trabajo","General");p.addGoal({title:t,timeframe:e,category:a||"General"}),m.toast("Meta añadida")},400)})})}function vt(){const s=p.getState(),{events:e}=s;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Agenda</h1>
        <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation">${g("chevronLeft")}</button>
                <span class="current-month">${gt()}</span>
                <button class="icon-btn-navigation">${g("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${mt(e)}
            </div>
        </div>

        <div class="events-list-container">
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${g("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                        <p style="font-size: 11px; color: var(--text-muted);">Usa el botón + para agregar uno</p>
                    </div>
                `:e.sort((t,a)=>new Date(t.date)-new Date(a.date)).map(t=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${t.category||"event"}">
                            ${g(yt(t.category||"event"))}
                        </div>
                        <div class="event-main-col">
                            <div class="event-title">${t.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${ht(t.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${t.time}</span>
                                ${t.repeat!=="none"?`<span class="event-repeat-tag">${bt(t.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${t.id}">
                            ${g("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function mt(s){const e=new Date,t=e.getMonth(),a=e.getFullYear(),n=e.getDate(),i=new Date(a,t+1,0).getDate(),o=new Date(a,t,1).getDay(),l=["D","L","M","M","J","V","S"],c=new Set;s.forEach(r=>{const d=new Date(r.date);d.getMonth()===t&&d.getFullYear()===a&&c.add(d.getDate())});let u=l.map(r=>`<div class="calendar-day-label">${r}</div>`).join("");for(let r=0;r<o;r++)u+='<div class="calendar-day empty"></div>';for(let r=1;r<=i;r++){const d=r===n,v=c.has(r);u+=`
            <div class="calendar-day ${d?"today":""} ${v?"has-event":""}">
                ${r}
                ${v?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return u}function gt(){const s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],e=new Date;return`${s[e.getMonth()]} ${e.getFullYear()}`}function ht(s){const e={day:"numeric",month:"short"};return new Date(s).toLocaleDateString("es-ES",e).toUpperCase()}function yt(s){switch(s){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function bt(s){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[s]||""}function ft(){document.querySelectorAll(".event-delete-btn").forEach(s=>{s.addEventListener("click",async()=>{await m.confirm("¿Eliminar evento?","¿Estás seguro de que quieres borrar este evento de tu agenda?")&&(p.deleteEvent(s.dataset.id),m.toast("Evento eliminado","info"))})})}function wt(){const s=p.getState(),e=s.currencySymbol,t=s.livingExpenses,a=s.otherExpenses||[],n=s.liabilities,i=p.sumItems(t,"amount"),o=p.sumItems(a,"amount"),l=p.sumItems(n,"monthlyPayment"),c=i+o+l,u=[...(t||[]).map(r=>({...r,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(a||[]).map(r=>({...r,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(r=>r.monthlyPayment>0).map(r=>({...r,amount:r.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((r,d)=>d.amount-r.amount);return`
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="back-btn" id="back-to-finance">
                ${g("chevronLeft")}
            </button>
            <h1 class="page-title" style="margin-bottom: 0;">Gastos Mensuales</h1>
        </div>
        <p class="page-subtitle" style="margin-left: 40px;">Desglose detallado de tus salidas</p>
      </header>
      
      <!-- PRIMARY METRIC -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Total Mensual</span>
          ${g("creditCard","card-icon")}
        </div>
        <div class="stat-value negative text-center" style="font-size: 32px; margin: var(--spacing-md) 0;">
            ${b(c,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${b(i,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(l,e)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(o,e)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${Et(u,s)}

    </div>
  `}function Et(s,e){if(s.length===0)return`
            <div class="empty-state">
                ${g("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const t=e.currencySymbol;return`
        <div class="asset-list">
            ${s.map(a=>{const n=p.convertValue(a.amount,a.currency||"EUR"),i=kt(a.category);return`
                <div class="asset-item expense-item" data-id="${a.id}" data-category="${a.category}">
                    <div class="asset-icon-wrapper expense">
                        ${g(i,"asset-icon")}
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
    `}function kt(s){switch(s){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function xt(s){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",s),document.querySelectorAll(".expense-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,i=a.dataset.category;Ee(n,i)})})}const ae={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},me=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let A="passiveAsset";function ge(s="passiveAsset"){var t,a;A=s,(a=(t=ae[A])==null?void 0:t.types[0])!=null&&a.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=It(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),St()}function It(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${A==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${g("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${A!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(ae).map(([e,t])=>`
          <div class="type-option ${e===A?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${g(t.icon)}
            </div>
            <div class="type-option-label">${t.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${Se()}
      </div>
    </div>
  `}function Se(){const s=ae[A],e=A==="investmentAsset"||A==="passiveAsset";if(e){const a=M.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...me,...a]}let t="";return A==="passiveAsset"||A==="investmentAsset"?t=`
      <div class="form-group" style="margin-bottom: var(--spacing-sm);">
        <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: var(--radius-md);">
          <button type="button" class="btn mode-toggle-btn active" id="mode-qty" style="flex: 1; padding: 6px; font-size: 11px; border-radius: 6px; background: var(--accent-primary); color: var(--bg-primary); border: none; font-weight: 600;">CANTIDAD</button>
          <button type="button" class="btn mode-toggle-btn" id="mode-total" style="flex: 1; padding: 6px; font-size: 11px; border-radius: 6px; background: transparent; color: var(--text-secondary); border: none; font-weight: 600;">VALOR TOTAL (EUR)</button>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" id="label-qty">Cantidad</label>
          <input type="number" class="form-input" id="input-qty" placeholder="0.00" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Valor en EUR</label>
          <input type="number" class="form-input" id="input-value" placeholder="0.00" step="any" inputmode="decimal">
        </div>
      </div>
      ${A==="passiveAsset"?`
      <div class="form-group">
          <label class="form-label">Ingreso Mensual (en EUR)</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
      </div>`:""}
    `:A==="activeIncome"||A==="livingExpense"?t=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:A==="liability"?t=`
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
    `:A==="event"&&(t=`
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
                    ${me.map(a=>`<option value="${a.value}">${a.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${M.map(a=>`<option value="${a.symbol}">${a.name} (${a.symbol})</option>`).join("")}
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
      ${g("plus")} Agregar
    </button>
  `}function St(){const s=document.getElementById("add-modal"),e=document.getElementById("modal-close");s.addEventListener("click",a=>{a.target===s&&te()}),e.addEventListener("click",te);const t=s.querySelectorAll(".category-selector .type-option");t.forEach(a=>{a.addEventListener("click",()=>{A=a.dataset.category,t.forEach(n=>n.classList.remove("active")),a.classList.add("active"),document.getElementById("form-container").innerHTML=Se(),he()})}),he()}function he(){const s=document.getElementById("btn-save");s&&s.addEventListener("click",At);const e=document.getElementById("mode-qty"),t=document.getElementById("mode-total"),a=document.getElementById("input-qty"),n=document.getElementById("input-value"),i=document.getElementById("input-currency"),o=document.getElementById("input-name");if(e&&t){const c=u=>{u==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",t.style.background="transparent",t.style.color="var(--text-secondary)",a.focus()):(t.style.background="var(--accent-primary)",t.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>c("qty")),t.addEventListener("click",()=>c("total"))}const l=c=>{const u=p.getState().rates,r=i==null?void 0:i.value,d=u[r]||1;if(c==="qty"){const v=parseFloat(a.value)||0;n.value=(v*d).toFixed(2)}else{const v=parseFloat(n.value)||0;a.value=(v/d).toFixed(6)}};a==null||a.addEventListener("input",()=>l("qty")),n==null||n.addEventListener("input",()=>l("total")),i&&i.addEventListener("change",()=>{if(o&&!o.value){const c=i.options[i.selectedIndex].text;o.value=c.split(" (")[0]}l("qty")})}function At(){var h,f,E,k,w,C,L,j,G,H,Y,se;const s=(f=(h=document.getElementById("input-name"))==null?void 0:h.value)==null?void 0:f.trim(),e=(E=document.getElementById("input-type"))==null?void 0:E.value,t=(k=document.getElementById("input-currency"))==null?void 0:k.value,a=(C=(w=document.getElementById("input-details"))==null?void 0:w.value)==null?void 0:C.trim(),n=parseFloat((L=document.getElementById("input-value"))==null?void 0:L.value)||0,i=document.getElementById("input-qty"),o=i?parseFloat(i.value)||0:n,l=parseFloat((j=document.getElementById("input-amount"))==null?void 0:j.value)||0,c=parseFloat((G=document.getElementById("input-monthly"))==null?void 0:G.value)||0,u=(H=document.getElementById("input-date"))==null?void 0:H.value,r=(Y=document.getElementById("input-time"))==null?void 0:Y.value,d=(se=document.getElementById("input-repeat"))==null?void 0:se.value;if(!s){m.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const v={name:s,type:e,currency:t,details:a};switch(A){case"passiveAsset":p.addPassiveAsset({...v,value:o,monthlyIncome:c});break;case"activeIncome":p.addActiveIncome({...v,amount:l});break;case"livingExpense":p.addLivingExpense({...v,amount:l});break;case"investmentAsset":p.addInvestmentAsset({...v,value:o});break;case"liability":p.addLiability({...v,amount:l,monthlyPayment:c});break;case"event":p.addEvent({title:s,date:u,time:r,repeat:d,category:e});break}te()}function te(){const s=document.getElementById("add-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}function $t(){const s=x.isSetup(),e=x.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${g("lock","auth-icon")}
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
                    ${g("fingerprint")} Usar Huella
                </button>
                `:""}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `}function Ct(s){var i;const e=document.getElementById("auth-submit-btn"),t=document.getElementById("auth-bio-btn"),a=document.getElementById("auth-password"),n=async()=>{const o=a.value,l=document.getElementById("auth-confirm"),c=x.isSetup();try{let u;if(c)u=await x.unlock(o);else{if(!o||o.length<4)throw new Error("Contraseña demasiado corta");if(o!==l.value)throw new Error("Las contraseñas no coinciden");u=await x.setup(o)}await p.loadEncrypted(u),s()}catch(u){m.alert("Error",u.message)}};e==null||e.addEventListener("click",n),a==null||a.addEventListener("keypress",o=>{o.key==="Enter"&&n()}),(i=document.getElementById("auth-confirm"))==null||i.addEventListener("keypress",o=>{o.key==="Enter"&&n()}),t==null||t.addEventListener("click",async()=>{try{const o=await x.unlockWithBiometrics();await p.loadEncrypted(o),s()}catch(o){m.alert("Identificación",o.message)}}),x.isBioEnabled()&&setTimeout(async()=>{try{const o=await x.unlockWithBiometrics();await p.loadEncrypted(o),s()}catch{console.log("Auto-bio failed or cancelled")}},500)}const Lt="modulepreload",Tt=function(s){return"/life-dashboard/"+s},ye={},be=function(e,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(t.map(c=>{if(c=Tt(c),c in ye)return;ye[c]=!0;const u=c.endsWith(".css"),r=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${r}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":Lt,u||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((v,h)=>{d.addEventListener("load",v),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return n.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function Bt(){const s=x.isBioEnabled(),e=T.hasToken();return`
    <div class="settings-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Configuración</h1>
            <p class="page-subtitle">Privacidad, Seguridad y Sincronización</p>
        </header>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${g("shield","section-icon")} Seguridad
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
                    <div class="settings-action-icon">${g("chevronRight")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${g("cloud","section-icon")} Nube & Sincronización
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Google Drive</div>
                        <div class="settings-item-desc">${e?'<span class="status-badge connected">Conectado</span>':'<span class="status-badge disconnected">No conectado</span>'} Sincroniza tu bóveda encriptada.</div>
                    </div>
                    <button class="btn-settings-action ${e?"active":""}" id="sync-drive-btn">
                        ${g(e?"refreshCw":"link")}
                        <span>${e?"Sincronizar":"Conectar"}</span>
                    </button>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="import-backup-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Importar Backup Manual</div>
                        <div class="settings-item-desc">Restaurar desde archivo .bin exportado.</div>
                    </div>
                    <div class="settings-action-icon">${g("upload")}</div>
                </div>
                <input type="file" id="import-backup-input" accept=".bin" style="display: none;">

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="export-data-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Exportar Backup Manual</div>
                        <div class="settings-item-desc">Descargar archivo encriptado (.bin) para seguridad externa.</div>
                    </div>
                    <div class="settings-action-icon">${g("download")}</div>
                </div>
            </div>

            <div class="settings-note">
                ${g("lock","note-icon")} Todos tus datos se encriptan localmente con AES-256-GCM antes de ser enviados a tu Google Drive personal. Nadie más tiene acceso.
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${g("settings","section-icon")} Aplicación
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row clickable" id="btn-logout">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Cerrar Sesión</div>
                        <div class="settings-item-desc">Bloquear acceso y limpiar llaves de sesión.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${g("logOut")}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-force-update">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Forzar Actualización</div>
                        <div class="settings-item-desc">Recargar la última versión de la App (limpia caché).</div>
                    </div>
                    <div class="settings-action-icon">${g("refreshCw")}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-factory-reset">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Borrar todos los datos</div>
                        <div class="settings-item-desc">Elimina permanentemente el almacenamiento local y reinicia la App.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${g("trash")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${g("zap","section-icon")} Inteligencia Artificial
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row" style="cursor: default;">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Gemini API Key</div>
                        <div class="settings-item-desc">Necesaria para el análisis de comida con IA real.</div>
                        <div style="margin-top: var(--spacing-sm); display: flex; gap: var(--spacing-sm);">
                            <input type="password" id="gemini-api-key" class="form-input" 
                                placeholder="Tu API Key de Google AI" 
                                value="${localStorage.getItem("life-dashboard/db_gemini_api_key")||""}"
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
            <p>Life Dashboard Pro v1.0.55</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Rt(){var a,n,i,o,l,c,u;(a=document.getElementById("toggle-bio"))==null||a.addEventListener("change",async r=>{if(r.target.checked){const v=await m.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(v)try{await x.registerBiometrics(v),m.toast("Biometría activada correctamente")}catch(h){await m.alert("Error",h.message),r.target.checked=!1}else r.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),m.toast("Biometría desactivada","info")});const s=document.getElementById("btn-install-pwa");s&&setTimeout(()=>{if(window.deferredPrompt){const r=document.getElementById("install-pwa-card");r&&(r.style.display="block"),s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:d}=await window.deferredPrompt.userChoice;if(d==="accepted"){m.toast("Instalando aplicación...");const v=document.getElementById("install-pwa-card");v&&(v.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("sync-drive-btn"))==null||n.addEventListener("click",async()=>{const r=document.getElementById("sync-drive-btn"),d=T.hasToken(),v=r.innerHTML;try{if(r.innerHTML='<div class="loading-spinner-sm"></div>',r.style.pointerEvents="none",d){const h=x.getVaultKey();await T.pushData(p.getState(),h),m.toast("Bóveda actualizada en Drive")}else{await T.authenticate();const h=x.getVaultKey(),f=await T.pullData(h).catch(()=>null);if(f&&await m.confirm("Respaldo Encontrado","Hemos detectado una bóveda existente en Google Drive. ¿Qué deseas hacer con tus datos?","Recuperar de la Nube","Sobreescribir Nube")){p.setState(f),await p.saveState(),m.toast("Datos recuperados correctamente"),setTimeout(()=>window.location.reload(),800);return}await T.pushData(p.getState(),h),m.toast("Google Drive conectado y sincronizado")}typeof window.reRender=="function"&&window.reRender()}catch(h){if(console.error(h),h.message&&(h.message.includes("Contraseña incorrecta")||h.message.includes("corruptos"))){if(await m.confirm("Error de Decifrado","La contraseña actual no coincide con la del backup en la nube. ¿Deseas borrar los datos en Drive para empezar de cero?","Borrar Datos Nube","Cancelar"))try{await T.deleteBackup(),m.toast("Datos de Drive borrados");const E=x.getVaultKey();await T.pushData(p.getState(),E),m.toast("Google Drive sincronizado (Nueva Bóveda)")}catch{m.alert("Error","No se pudieron borrar los datos de Drive.")}}else m.alert("Error",h.message||(typeof h=="object"?JSON.stringify(h):"Error al conectar con Google"))}finally{r.innerHTML=v,r.style.pointerEvents="auto"}}),(i=document.getElementById("export-data-btn"))==null||i.addEventListener("click",async()=>{try{m.toast("Preparando archivo encriptado...","info");const r=p.getState(),d=x.getVaultKey(),{SecurityService:v}=await be(async()=>{const{SecurityService:C}=await Promise.resolve().then(()=>ne);return{SecurityService:C}},void 0),h=await v.encrypt(r,d),f=new Blob([JSON.stringify(h)],{type:"application/octet-stream"}),E=URL.createObjectURL(f),k=document.createElement("a"),w=new Date().toISOString().split("T")[0];k.href=E,k.download=`life_dashboard_backup_${w}.bin`,document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(E),m.toast("Backup exportado correctamente")}catch(r){console.error("Export error:",r),m.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),t=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{t==null||t.click()}),t==null||t.addEventListener("change",async r=>{var h;const d=(h=r.target.files)==null?void 0:h[0];if(!d)return;if(!await m.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){t.value="";return}try{const f=await d.text(),E=JSON.parse(f),k=x.getVaultKey(),{SecurityService:w}=await be(async()=>{const{SecurityService:L}=await Promise.resolve().then(()=>ne);return{SecurityService:L}},void 0),C=await w.decrypt(E,k);if(C)p.setState(C),await p.saveState(),m.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(f){console.error("Import error:",f),m.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{t.value=""}}),(o=document.getElementById("btn-logout"))==null||o.addEventListener("click",async()=>{await m.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(x.logout(),window.location.reload())}),(l=document.getElementById("btn-force-update"))==null||l.addEventListener("click",async()=>{if(await m.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const d=await caches.keys();for(let v of d)await caches.delete(v)}catch(d){console.error("Error clearing cache",d)}window.location.reload(!0)}}),(c=document.getElementById("btn-save-gemini"))==null||c.addEventListener("click",()=>{var d;const r=(d=document.getElementById("gemini-api-key"))==null?void 0:d.value;r!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",r.trim()),m.toast("API Key de Gemini guardada"))}),(u=document.getElementById("btn-factory-reset"))==null||u.addEventListener("click",async()=>{if(await m.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const d="life-dashboard/";if(Object.keys(localStorage).forEach(v=>{v.startsWith(d)&&localStorage.removeItem(v)}),Object.keys(sessionStorage).forEach(v=>{v.startsWith(d)&&sessionStorage.removeItem(v)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(h=>window.indexedDB.deleteDatabase(h.name)),navigator.serviceWorker){const v=await navigator.serviceWorker.getRegistrations();for(let h of v)h.unregister()}m.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.origin+"?reset="+Date.now()},1e3)}})}let R=localStorage.getItem("life-dashboard/app_current_page")||"finance",S=localStorage.getItem("life-dashboard/app_current_sub_page")||null;S==="null"&&(S=null);async function fe(){const s=x.getVaultKey();s?(await p.loadEncrypted(s),Ae()):Dt()}function Dt(){const s=document.getElementById("app");s.innerHTML=$t(),Ct(()=>{Ae()})}function Ae(){const s=document.getElementById("app");s.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,$e(),p.subscribe(()=>{B()}),window.reRender=()=>B(),Pt()}function Pt(){var a,n;const s=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(s&&(Date.now()-parseInt(s))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
        <div class="pwa-install-banner-icon">
            ${g("download")}
        </div>
        <div class="pwa-install-banner-text">
            <div class="pwa-install-banner-title">Instalar Life Dashboard</div>
            <div class="pwa-install-banner-subtitle">Accede más rápido desde tu pantalla de inicio</div>
        </div>
        <button class="pwa-install-btn" id="pwa-banner-install">Instalar</button>
        <button class="pwa-install-close" id="pwa-banner-close">
            ${g("x")}
        </button>
    `,document.body.appendChild(e);const t=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};t(),window.addEventListener("beforeinstallprompt",t),(a=document.getElementById("pwa-banner-install"))==null||a.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:i}=await window.deferredPrompt.userChoice;i==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function $e(){const s=document.getElementById("bottom-nav");s.innerHTML=re(R),le(e=>{R=e,S=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",S),V(),B(),s.innerHTML=re(R),le(t=>{R=t,S=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",S),V(),B(),$e()})}),Mt(),B()}function B(){const s=document.getElementById("main-content");if(S==="compound"){s.innerHTML=Qe(),et(()=>{S=null,tt(),V(),B()});return}if(S==="expenses"){s.innerHTML=wt(),xt(()=>{S=null,V(),B()});return}if(S==="market"){s.innerHTML=at(),nt(()=>{S=null,V(),B()});return}switch(R){case"finance":s.innerHTML=de(),ue(),we();break;case"goals":s.innerHTML=dt(),pt();break;case"calendar":s.innerHTML=vt(),ft();break;case"health":s.innerHTML=it(),ct();break;case"settings":s.innerHTML=Bt(),Rt(),W();break;default:s.innerHTML=de(),ue(),we()}}function we(){const s=document.getElementById("open-compound");s&&s.addEventListener("click",()=>{S="compound",localStorage.setItem("life-dashboard/app_current_sub_page",S),W(),B()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{S="market",localStorage.setItem("life-dashboard/app_current_sub_page",S),W(),B()});const t=document.getElementById("open-expenses");t&&t.addEventListener("click",()=>{S="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",S),W(),B()})}function Mt(){const s=document.querySelector(".fab");s&&s.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=g("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{if(R==="calendar")ge("event");else if(R==="health"){const t=await ns.confirm("Registrar Métrica","¿Qué deseas registrar hoy?","Peso","Grasa");if(t===!0){const a=await ns.prompt("Registrar Peso","Ingresa tu peso actual en kg:","","number");a&&p.addWeightLog(a)}else if(t===!1){const a=await ns.prompt("Grasa Corporal","Ingresa tu % de grasa:","","number");a&&p.addFatLog(a)}}else ge()}),document.body.appendChild(e)}function W(){const s=document.getElementById("main-fab");s&&(s.style.display="none")}function V(){const s=document.getElementById("main-fab");s&&(s.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fe):fe();window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),window.deferredPrompt=s,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});
