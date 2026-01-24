var Be=Object.defineProperty;var Pe=(n,e,a)=>e in n?Be(n,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[e]=a;var ee=(n,e,a)=>Pe(n,typeof e!="symbol"?e+"":e,a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const Me="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",_e="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function Ue(){var e,a,t,s,i,o,r,l,m,c,d,v,h,w,E;const n={EUR:1};try{const f=await(await fetch(Me)).json();n.BTC=((e=f.bitcoin)==null?void 0:e.eur)||4e4,n.ETH=((a=f.ethereum)==null?void 0:a.eur)||2200,n.XRP=((t=f.ripple)==null?void 0:t.eur)||.5,n.KAS=((s=f.kaspa)==null?void 0:s.eur)||.1,n.SOL=((i=f.solana)==null?void 0:i.eur)||90,n.XLM=((o=f.stellar)==null?void 0:o.eur)||.11,n.ALGO=((r=f.algorand)==null?void 0:r.eur)||.18,n.LTC=((l=f.litecoin)==null?void 0:l.eur)||65,n.SUI=((m=f.sui)==null?void 0:m.eur)||1.1,n.LINK=((c=f.chainlink)==null?void 0:c.eur)||14,n.RNDR=((d=f["render-token"])==null?void 0:d.eur)||4.5,n.ADA=((v=f.cardano)==null?void 0:v.eur)||.45,n.ONDO=((h=f["ondo-finance"])==null?void 0:h.eur)||.7,(w=f.bitcoin)!=null&&w.ars&&((E=f.bitcoin)!=null&&E.eur)&&(n.ARS=f.bitcoin.eur/f.bitcoin.ars);const L=await fetch(_e);if(L.ok){const T=await L.json();n.USD=1/T.rates.USD,n.CHF=1/T.rates.CHF,n.GBP=1/T.rates.GBP,n.AUD=1/T.rates.AUD}n.GOLD=2100,n.SP500=4700}catch(k){console.error("Failed to fetch some prices:",k),n.USD=n.USD||.92,n.CHF=n.CHF||1.05,n.GBP=n.GBP||1.15,n.AUD=n.AUD||.6,n.ARS=n.ARS||.001}return n}class P{static async hash(e,a="salt_life_dashboard_2026"){const s=new TextEncoder().encode(e+a),i=await crypto.subtle.digest("SHA-512",s);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,a){const t=new TextEncoder,s=await crypto.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(a),iterations:25e4,hash:"SHA-512"},s,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,a){try{const t=crypto.getRandomValues(new Uint8Array(16)),s=crypto.getRandomValues(new Uint8Array(12)),i=await this.deriveKey(a,this.bufToBase64(t)),o=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(o),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:s},i,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(s),salt:this.bufToBase64(t),v:"5.0"}}catch(t){throw console.error("[Security] Encryption failed:",t),new Error("No se pudo encriptar la información")}}static async decrypt(e,a){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:t,iv:s,salt:i}=e,o=await this.deriveKey(a,i),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(s)},o,this.base64ToBuf(t)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(t){throw console.error("[Security] Decryption failed:",t),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(a=>a.charCodeAt(0)))}}const re=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:P},Symbol.toStringTag,{value:"Module"})),A={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class x{static isSetup(){return!!localStorage.getItem(A.MASTER_HASH)}static async setup(e){const a=await P.hash(e),t=await P.deriveVaultKey(e);return localStorage.setItem(A.MASTER_HASH,a),sessionStorage.setItem(A.VAULT_KEY,t),t}static async unlock(e){const a=await P.hash(e),t=localStorage.getItem(A.MASTER_HASH);if(a===t){const s=await P.deriveVaultKey(e);return sessionStorage.setItem(A.VAULT_KEY,s),s}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const a=sessionStorage.getItem(A.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const t=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:t,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(A.BIO_ENABLED,"true"),localStorage.setItem(A.VAULT_KEY,a),!0}catch(t){throw console.error("Biometric setup failed:",t),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(A.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const a=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:a,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const t=localStorage.getItem(A.VAULT_KEY);if(t)return sessionStorage.setItem(A.VAULT_KEY,t),t;throw new Error("Llave no encontrada. Usa contraseña.")}catch(a){throw console.error("Biometric auth failed:",a),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(A.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(A.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(A.BIO_ENABLED)==="true"}}const Oe="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Ne="https://www.googleapis.com/auth/drive.file";class C{static hasToken(){return!!this.accessToken&&localStorage.getItem("life-dashboard/drive_connected")==="true"}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,a)=>{const t=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.tokenClient=google.accounts.oauth2.initTokenClient({client_id:Oe,scope:Ne,callback:s=>{if(s.error){console.error("[Drive] Auth callback error:",s);return}this.saveSession(s)}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&(console.log("[Drive] Initial check: Attempting silent token restoration..."),this.authenticate(!0).catch(()=>{console.log("[Drive] Initial silent restoration skipped (expired or no session)")})),e(!0)}catch(s){console.error("[Drive] Init error:",s),a(s)}}):setTimeout(t,200)};t()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const a=Date.now()+(e.expires_in?e.expires_in*1e3:36e5);localStorage.setItem("life-dashboard/drive_token_expiry",a.toString())}static async authenticate(e=!1){return this.tokenClient||await this.init(),new Promise((a,t)=>{this.tokenClient.callback=s=>{if(s.error){e?(console.warn("[Drive] Silent auth failed, but keeping connection intent"),t(new Error("Silent auth failed"))):t(new Error(s.error_description||"Fallo en la autenticación"));return}this.saveSession(s),a(s.access_token)},e?this.tokenClient.requestAccessToken({prompt:"none"}):this.tokenClient.requestAccessToken({prompt:"consent"})})}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(this.tokenClient||await this.init(),!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Refreshing token silently...");try{return await this.authenticate(!0)}catch(s){throw console.warn("[Drive] Silent refresh failed:",s.message),new Error('Google Drive session expired. Click "Sync" in settings to reconnect.')}}return this.accessToken}static async getOrCreateFolderPath(e){var s;await this.ensureValidToken(),(s=gapi.client)!=null&&s.drive||await this.init();const a=e.split("/").filter(i=>i);let t="root";for(const i of a)try{const o=`name = '${i}' and mimeType = 'application/vnd.google-apps.folder' and '${t}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(l&&l.length>0)t=l[0].id;else{const m={name:i,mimeType:"application/vnd.google-apps.folder",parents:[t]};t=(await gapi.client.drive.files.create({resource:m,fields:"id"})).result.id}}catch(o){if(o.status===401){console.log("[Drive] 401 error, attempting auto-reconnect...");try{throw await this.authenticate(!0),new Error("RETRY")}catch{throw this.accessToken=null,new Error("Sesión de Google expirada. Por favor reconecta.")}}throw o}return t}static async pushData(e,a,t=!1){var s,i,o;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(s=gapi.client)!=null&&s.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log(`[Drive] Pushing encrypted data...${t?" (Retry)":""}`);const r=await this.getOrCreateFolderPath("/backup/life-dashboard/"),l=await P.encrypt(e,a),m="dashboard_vault_v5.bin",c=`name = '${m}' and '${r}' in parents and trashed = false`,v=(await gapi.client.drive.files.list({q:c,fields:"files(id)"})).result.files,h=new Blob([JSON.stringify(l)],{type:"application/json"});if(v&&v.length>0){const w=v[0].id,E=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${w}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:h});if(E.status===401&&!t)return await this.authenticate(!0),await this.pushData(e,a,!0);if(!E.ok)throw new Error(`Error al actualizar backup: ${E.status}`)}else{const w={name:m,parents:[r]},E=new FormData;E.append("metadata",new Blob([JSON.stringify(w)],{type:"application/json"})),E.append("file",h);const k=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:E});if(k.status===401&&!t)return await this.authenticate(!0),await this.pushData(e,a,!0);if(!k.ok)throw new Error(`Error al crear backup: ${k.status}`)}return!0}catch(r){if(r.message==="RETRY"&&!t)return await this.pushData(e,a,!0);throw console.error("[Drive] Push failed:",r),new Error(((o=(i=r.result)==null?void 0:i.error)==null?void 0:o.message)||r.message||"Fallo al subir datos a Drive")}}static async pullData(e,a=!1){var t,s,i;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(t=gapi.client)!=null&&t.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log(`[Drive] Pulling data...${a?" (Retry)":""}`);const l=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:l,fields:"files(id, name)"})).result.files;if(!c||c.length===0)return null;const d=c[0].id,v=await fetch(`https://www.googleapis.com/drive/v3/files/${d}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(v.status===401&&!a)return await this.authenticate(!0),await this.pullData(e,!0);if(!v.ok)throw new Error(`Error al descargar backup: ${v.status}`);const h=await v.json();return await P.decrypt(h,e)}catch(o){if(o.message==="RETRY"&&!a)return await this.pullData(e,!0);throw console.error("[Drive] Pull failed:",o),new Error(((i=(s=o.result)==null?void 0:s.error)==null?void 0:i.message)||o.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){var e,a,t;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(e=gapi.client)!=null&&e.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken});const o=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:o,fields:"files(id)"})).result.files;if(l&&l.length>0){const m=l[0].id;return await gapi.client.drive.files.delete({fileId:m}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(s){throw console.error("[Drive] Deletion failed:",s),new Error(((t=(a=s.result)==null?void 0:a.error)==null?void 0:t.message)||s.message||"Fallo al borrar backup en Drive")}}}ee(C,"tokenClient",null),ee(C,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null);const le={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'};function g(n,e=""){return(le[n]||le.package).replace("<svg",`<svg class="${e}"`)}class Fe{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,a="success",t=3e3){const s=document.createElement("div");s.className=`toast toast-${a} stagger-in`;const i=a==="success"?"check":a==="error"?"alertCircle":"info";s.innerHTML=`
            <div class="toast-content">
                ${g(i,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(s),setTimeout(()=>{s.classList.add("fade-out"),setTimeout(()=>s.remove(),500)},t)}alert(e,a){return new Promise(t=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>t(!0)}]})})}confirm(e,a,t="Confirmar",s="Cancelar"){return new Promise(i=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:s,type:"secondary",onClick:()=>i(!1)},{text:t,type:"danger",onClick:()=>i(!0)}]})})}prompt(e,a,t="",s="text"){return new Promise(i=>{const o=`prompt-input-${Date.now()}`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${s}" id="${o}" class="form-input" value="${t}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(o).value;i(r)}}]}),setTimeout(()=>{const r=document.getElementById(o);r&&(r.focus(),r.select&&r.select())},100)})}select(e,a,t=[],s=4){return new Promise(i=>{const o=`display: grid; grid-template-columns: repeat(${s}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="${o}">
                        ${t.map((l,m)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{i(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,a,t="BORRAR"){return new Promise(s=>{const i=`hard-confirm-input-${Date.now()}`,o=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${a}<br><br>Escribe <strong>${t}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${i}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>s(!1)},{text:"Borrar Todo",type:"danger",id:o,disabled:!0,onClick:()=>s(!0)}]});const r=document.getElementById(i),l=document.getElementById(o);r.addEventListener("input",()=>{const m=r.value.trim().toUpperCase()===t.toUpperCase();l.disabled=!m,l.style.opacity=m?"1":"0.3",l.style.pointerEvents=m?"auto":"none"})})}performance(e,a){const t=[{rating:1,emoji:"😰",label:"Duro"},{rating:3,emoji:"😐",label:"Bien"},{rating:5,emoji:"😄",label:"Fácil"}];return new Promise(s=>{this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${t.map(o=>`
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${o.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${o.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${o.label}</span>
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>s(null)}]});const i=document.querySelector(".modal-overlay.active");i&&i.querySelectorAll(".perf-emoji-btn").forEach(o=>{o.addEventListener("click",()=>{s(parseInt(o.dataset.value)),this._closeModal(i)})})})}_showModal({title:e,message:a,content:t="",buttons:s=[],centered:i=!1}){const o=document.createElement("div");o.className=`modal-overlay ${i?"overlay-centered":""}`,o.style.zIndex="9999";const r=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;o.id=r;const l=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${a}</div>
                    ${t}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    ${s.map((c,d)=>`
                        <button class="btn btn-${c.type} w-full" data-index="${d}" style="min-height: 48px; font-size: 16px; ${c.disabled?"opacity: 0.3; pointer-events: none;":""}" ${c.id?`id="${c.id}"`:""}>
                            ${c.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;o.innerHTML=l,document.body.appendChild(o),o.offsetHeight,o.classList.add("active"),o.querySelectorAll(".modal-footer button").forEach(c=>{const d=c.dataset.index;if(d!==void 0){const v=s[d];c.addEventListener("click",async h=>{h.stopPropagation();try{v.onClick&&await v.onClick(),await this._closeModal(o)}catch(w){console.error("Modal button action failed",w)}})}}),o.addEventListener("click",async c=>{if(c.target===o&&!s.some(v=>v.type==="danger")){const v=s.find(h=>h.type==="secondary");v&&v.onClick(),await this._closeModal(o)}})}async _closeModal(e){e.classList.remove("active");const a=e.querySelector(".modal");return a&&a.classList.add("animate-out"),new Promise(t=>{setTimeout(()=>{e.remove(),t()},300)})}}const p=new Fe,te="life-dashboard/data",ce="life-dashboard/secured",ae={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],lastMarketData:[]};class je{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...ae}}async loadEncrypted(e){const a=localStorage.getItem(ce),t=localStorage.getItem(te);if(a)try{const s=JSON.parse(a),i=await P.decrypt(s,e);return this.state={...ae,...i},this.notify(),!0}catch(s){return console.error("Failed to decrypt state:",s),!1}else if(t)try{const s=JSON.parse(t);return this.state={...ae,...s},await this.saveState(),localStorage.removeItem(te),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(s){return console.error("Migration failed:",s),!1}return!1}async refreshRates(){const e=await Ue();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=x.getVaultKey();if(e){const a=await P.encrypt(this.state,e);localStorage.setItem(ce,JSON.stringify(a)),localStorage.removeItem(te)}else console.warn("[Store] Attempted to save without Vault Key. Save skipped.")}catch(e){console.error("Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState().then(()=>{const a=x.getVaultKey();a&&C.hasToken()&&(this.syncTimeout&&clearTimeout(this.syncTimeout),this.syncTimeout=setTimeout(()=>{const{hideRealEstate:t,...s}=this.state;C.pushData(s,a).then(()=>{console.log("[Auto-Sync] Success"),p.toast("Sincronizado con Drive","success",2e3)}).catch(i=>{console.warn("[Auto-Sync] Failed:",i)})},5e3))}),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const a={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:a[e]||"$"})}convertToEUR(e,a){if(!a||a==="EUR")return e||0;const t=this.state.rates[a]||1;return(e||0)*t}convertFromEUR(e,a){if(!a||a==="EUR")return e;const t=this.state.rates[a];return t&&t!==0?e/t:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,a="investment"){const t={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return a==="passive"?this.addPassiveAsset({...t,monthlyIncome:0}):this.addInvestmentAsset(t)}convertValue(e,a){const t=this.convertToEUR(e,a);return this.convertFromEUR(t,this.state.currency)}addPassiveAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,a]}),a}updatePassiveAsset(e,a){this.setState({passiveAssets:this.state.passiveAssets.map(t=>t.id===e?{...t,...a}:t)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(a=>a.id!==e)})}addActiveIncome(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,a]}),a}updateActiveIncome(e,a){this.setState({activeIncomes:this.state.activeIncomes.map(t=>t.id===e?{...t,...a}:t)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(a=>a.id!==e)})}addLivingExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,a]}),a}updateLivingExpense(e,a){this.setState({livingExpenses:this.state.livingExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(a=>a.id!==e)})}addOtherExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,a]}),a}updateOtherExpense(e,a){this.setState({otherExpenses:this.state.otherExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(a=>a.id!==e)})}addInvestmentAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,a]}),a}updateInvestmentAsset(e,a){this.setState({investmentAssets:this.state.investmentAssets.map(t=>t.id===e?{...t,...a}:t)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(a=>a.id!==e)})}addLiability(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,a]}),a}updateLiability(e,a){this.setState({liabilities:this.state.liabilities.map(t=>t.id===e?{...t,...a}:t)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(a=>a.id!==e)})}sumItems(e,a){return e.reduce((t,s)=>{const i=s[a]||0;return t+this.convertValue(i,s.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),a=this.sumItems(this.state.liabilities,"monthlyPayment");return e+a}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),a=this.sumItems(this.state.investmentAssets,"value");return e+a}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),a=this.sumItems(this.state.activeIncomes,"amount");return e+a}getAllExpenses(){const e=this.getLivingExpenses(),a=this.sumItems(this.state.otherExpenses,"amount");return e+a}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,a){this.setState({health:{...this.state.health,[e]:a}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const a={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,a]}})}addFatLog(e){const a={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,a]}})}saveRoutine(e){const a=this.state.health.routines,s=a.find(i=>i.id===e.id)?a.map(i=>i.id===e.id?e:i):[...a,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:s}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(a=>a.id!==e)}})}renameRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,name:a}:t)}})}updateExercise(e,a,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(s=>{if(s.id===e){const i=[...s.exercises];return i[a]={...i[a],...t},{...s,exercises:i}}return s})}})}addExerciseToRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,exercises:[...t.exercises,{weight:50,reps:10,sets:4,...a}]}:t)}})}reorderRoutine(e,a){const t=[...this.state.health.routines],s=a==="up"?e-1:e+1;s<0||s>=t.length||([t[e],t[s]]=[t[s],t[e]],this.setState({health:{...this.state.health,routines:t}}))}reorderExercise(e,a,t){const s=this.state.health.routines.map(i=>{if(i.id===e){const o=[...i.exercises],r=t==="up"?a-1:a+1;return r<0||r>=o.length?i:([o[a],o[r]]=[o[r],o[a]],{...i,exercises:o})}return i});this.setState({health:{...this.state.health,routines:s}})}deleteExerciseFromRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>{if(t.id===e){const s=[...t.exercises];return s.splice(a,1),{...t,exercises:s}}return t})}})}addCalorieLog(e,a=""){const t={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:a};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,t]}})}logExercise(e,a,t){const s={id:crypto.randomUUID(),routineId:e,exerciseIndex:a,date:Date.now(),rating:parseInt(t)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],s]}})}getExerciseStatus(e,a){const s=(this.state.health.exerciseLogs||[]).filter(d=>d.routineId===e&&d.exerciseIndex===a);if(s.length===0)return{color:"green",lastDate:null};s.sort((d,v)=>v.date-d.date);const i=s[0],o=new Date,r=new Date(i.date),l=new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),m=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),c=Math.floor((l-m)/(1e3*60*60*24));return c===0?{color:"danger",status:"done_today",lastLog:i}:c===1?{color:"danger",status:"yesterday",lastLog:i}:c===2?{color:"tertiary",status:"day_before",lastLog:i}:{color:"success",status:"rested",lastLog:i}}addGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,a]})}toggleGoal(e){this.setState({goals:this.state.goals.map(a=>a.id===e?{...a,completed:!a.completed}:a)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(a=>a.id!==e)})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(a=>a.timeframe!==e||!a.completed)})}updateGoal(e,a){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,...a}:t)})}toggleSubGoal(e,a){const t=this.state.goals.find(i=>i.id===e);if(!t||!t.subGoals)return;const s=[...t.subGoals];s[a].completed=!s[a].completed,this.updateGoal(e,{subGoals:s})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,a){this.updateGoal(e,{color:a})}addEvent(e){const a={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,a]}),this.scheduleNotification(a)}deleteEvent(e){this.setState({events:this.state.events.filter(a=>a.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}}const u=new je,Ge=[{id:"finance",icon:"wallet",label:"Finanzas"},{id:"health",icon:"heart",label:"Salud"},{id:"goals",icon:"target",label:"Metas"},{id:"calendar",icon:"calendar",label:"Agenda"},{id:"settings",icon:"settings",label:"Ajustes"}];function de(n="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,a=Ge.map(t=>`
        <div class="nav-item ${t.id===n?"active":""}" data-nav="${t.id}">
            ${g(t.icon,"nav-icon")}
            <span class="nav-label">${t.label}</span>
        </div>
    `).join("");return e+a}function ue(n){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",()=>{const t=a.dataset.nav;e.forEach(s=>s.classList.remove("active")),a.classList.add("active"),n&&n(t)})})}function b(n,e="$"){const a=Math.abs(n);let t=0,s=0;e==="₿"?(t=4,s=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(t=0,s=2);const i=new Intl.NumberFormat("en-US",{minimumFractionDigits:t,maximumFractionDigits:s}).format(a);return`${n<0?"-":""}${e}${i}`}function pe(n){return n==null?"0.0%":`${n>=0?"+":""}${n.toFixed(1)}%`}const He="https://api.coingecko.com/api/v3",y={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},Ve=5*60*1e3;let Y={data:null,timestamp:0,currency:""};const U=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:y.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:y.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:y.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:y.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:y.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:y.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:y.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:y.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:y.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:y.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:y.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:y.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:y.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:y.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:y.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:y.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:y.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:y.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:y.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:y.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:y.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:y.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:y.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:y.CRYPTO_ALTS,icon:"bitcoin"}];async function qe(n="EUR"){if(Y.data&&Date.now()-Y.timestamp<Ve&&Y.currency===n)return console.log("[MarketService] Returning cached data"),Y.data;const e=U.map(t=>t.cgId).filter(Boolean).join(","),a=`${He}/coins/markets?vs_currency=${n.toLowerCase()}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const t=await fetch(a),s=t.ok?await t.json():[],i=U.filter(l=>l.yahooId),o=await Ke(i),r=U.map(l=>{if(l.cgId){const m=s.find(c=>c.id===l.cgId);if(m)return{...l,price:m.current_price,image:m.image,change24h:m.price_change_percentage_24h_in_currency||m.price_change_percentage_24h||0,change7d:m.price_change_percentage_7d_in_currency||0,change30d:m.price_change_percentage_30d_in_currency||0,change1y:m.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&o[l.yahooId]){const m=o[l.yahooId],c=n==="USD"?1:.92;return{...l,price:m.price*c,change24h:m.change24h,change7d:m.change7d,change30d:m.change30d,change1y:m.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return Y={data:r,timestamp:Date.now(),currency:n},r}catch(t){return console.error("Market fetch failed",t),U.map(s=>({...s,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function Ke(n){const e={};return await Promise.all(n.map(async a=>{try{const t=`https://query1.finance.yahoo.com/v8/finance/chart/${a.yahooId}?interval=1d&range=1y`,s=`https://api.allorigins.win/get?url=${encodeURIComponent(t)}`,o=await(await fetch(s)).json(),r=JSON.parse(o.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],m=l.meta,d=l.indicators.quote[0].close.filter(Z=>Z!==null);if(d.length===0)throw new Error("No valid price data");const v=m.regularMarketPrice||d[d.length-1],h=m.chartPreviousClose||(d.length>1?d[d.length-2]:v),w=(v-h)/h*100,E=Math.max(0,d.length-6),k=d[E],f=(v-k)/k*100,L=Math.max(0,d.length-22),T=d[L],q=(v-T)/T*100,K=d[0],z=(v-K)/K*100;e[a.yahooId]={price:v,change24h:isNaN(w)?0:w,change7d:isNaN(f)?0:f,change30d:isNaN(q)?0:q,change1y:isNaN(z)?0:z}}catch(t){console.warn(`Failed to fetch ${a.symbol} from Yahoo`,t),e[a.yahooId]=null}})),e}const ze={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let J=null,H=null;function Se(n,e){const a=ze[e];if(!a){console.error("Unknown category:",e);return}const i=u.getState()[a.storeKey].find(r=>r.id===n);if(!i){console.error("Item not found:",n);return}J=i,H=e;const o=document.createElement("div");o.className="modal-overlay",o.id="edit-modal",o.innerHTML=Xe(i,a),document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("active")}),Je(a)}const Ye=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],We={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function Xe(n,e){const a=H==="investment"||H==="passive",t=We[H]||[];let s="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?s=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="edit-value" value="${n.value||0}" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${n.monthlyIncome||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("value")?s=`
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="edit-value" value="${n.value||0}" step="any" inputmode="decimal">
      </div>
    `:e.fields.includes("amount")&&e.fields.includes("monthlyPayment")?s=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="edit-amount" value="${n.amount||0}" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${n.monthlyPayment||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("amount")&&(s=`
      <div class="form-group">
        <label class="form-label">${H==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${n.amount||0}" inputmode="numeric">
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
                  ${t.map(i=>`<option value="${i.value}" ${i.value===n.type?"selected":""}>${i.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${Ye.map(i=>`<option value="${i.value}" ${i.value===n.currency?"selected":""}>${i.label}</option>`).join("")}
                  </optgroup>
                  ${a?`
                  <optgroup label="Mercados Reales">
                      ${U.map(i=>`<option value="${i.symbol}" ${i.symbol===n.currency?"selected":""}>${i.name} (${i.symbol})</option>`).join("")}
                  </optgroup>
                  `:""}
              </select>
          </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${n.name||""}">
      </div>
      
      ${s}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${n.details||""}" placeholder="Notas adicionales...">
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
  `}function Je(n){const e=document.getElementById("edit-modal"),a=document.getElementById("edit-modal-close"),t=document.getElementById("btn-update"),s=document.getElementById("btn-delete");e.addEventListener("click",i=>{i.target===e&&Q()}),a.addEventListener("click",Q),t.addEventListener("click",()=>Ze(n)),s.addEventListener("click",()=>Qe(n))}function Ze(n){var m,c,d,v,h,w,E,k,f;const e=(c=(m=document.getElementById("edit-name"))==null?void 0:m.value)==null?void 0:c.trim(),a=(d=document.getElementById("edit-type"))==null?void 0:d.value,t=(v=document.getElementById("edit-currency"))==null?void 0:v.value,s=(w=(h=document.getElementById("edit-details"))==null?void 0:h.value)==null?void 0:w.trim(),i=parseFloat((E=document.getElementById("edit-value"))==null?void 0:E.value)||0,o=parseFloat((k=document.getElementById("edit-amount"))==null?void 0:k.value)||0,r=parseFloat((f=document.getElementById("edit-monthly"))==null?void 0:f.value)||0;if(!e){p.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:a,currency:t,details:s};n.fields.includes("value")&&(l.value=i),n.fields.includes("amount")&&(l.amount=o),n.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),n.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),u[n.updateMethod](J.id,l),Q()}function Qe(n){p.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${J.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(u[n.deleteMethod](J.id),p.toast("Eliminado correctamente","info"),Q())})}function Q(){const n=document.getElementById("edit-modal");n&&(n.classList.remove("active"),setTimeout(()=>n.remove(),300)),J=null,H=null}function me(){const n=u.getState(),e=n.currencySymbol,a=u.getPassiveIncome(),t=u.getLivingExpenses(),s=u.getNetPassiveIncome(),i=u.getInvestmentAssetsValue(),o=u.getTotalLiabilities(),r=u.getNetWorth(),l=u.getAllIncomes(),m=u.getAllExpenses(),c=u.getNetIncome();return`
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
            <span class="stat-value positive">${b(a,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${b(t,e)}</span>
          </div>
        </div>
        
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${s<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${g("piggyBank","card-icon")}
          </div>
          <div class="highlight-value ${s<0?"highlight-value-negative":""}">${b(s,e)}</div>
          <div class="highlight-label ${s<0?"highlight-label-negative":""}">
            ${s>=0?"🎉 ¡Libertad financiera alcanzada!":`Faltan ${b(Math.abs(s),e)}/mes`}
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
          <div class="stat-value ${r>=0?"positive":"negative"}" style="font-size: 32px; font-weight: 800; text-align: center; margin-top: var(--spacing-sm);">
            ${b(r,e)}
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
          <span class="stat-value positive">${b(l,e)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot expense"></span>
            Todos los Gastos
          </span>
          <span class="stat-value negative">${b(m,e)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${c>=0?"positive":"negative"}" style="font-size: 20px;">
            ${b(c,e)}
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
      
      ${et(n)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${tt(n)}

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
                    <option value="EUR" ${n.currency==="EUR"?"selected":""}>EUR (€)</option>
                    <option value="USD" ${n.currency==="USD"?"selected":""}>USD ($)</option>
                    <option value="CHF" ${n.currency==="CHF"?"selected":""}>CHF (Fr)</option>
                    <option value="GBP" ${n.currency==="GBP"?"selected":""}>GBP (£)</option>
                    <option value="AUD" ${n.currency==="AUD"?"selected":""}>AUD (A$)</option>
                    <option value="ARS" ${n.currency==="ARS"?"selected":""}>ARS ($)</option>
                    <option value="BTC" ${n.currency==="BTC"?"selected":""}>BTC (₿)</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  `}function et(n){const e=[...n.passiveAssets,...n.investmentAssets],a=n.liabilities;if(e.length===0)return"";const t={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(c=>{const d=u.convertValue(c.value||0,c.currency||"EUR");c.currency==="BTC"?t.Bitcoin.value+=d:c.currency==="ETH"||c.currency==="XRP"||c.type==="crypto"?t.Altcoins.value+=d:c.type==="property"||c.type==="rental"?t.Inmuebles.value+=d:c.type==="stocks"||c.type==="etf"||c.currency==="SP500"?t.Bolsa.value+=d:c.currency==="GOLD"?t.Oro.value+=d:t["Otros/Efe."].value+=d});const s=a.filter(c=>c.type==="mortgage").reduce((c,d)=>c+u.convertValue(d.amount||0,d.currency||"EUR"),0);t.Inmuebles.value=Math.max(0,t.Inmuebles.value-s),n.hideRealEstate&&(t.Inmuebles.value=0);const i=Object.entries(t).filter(([c,d])=>d.value>0).sort((c,d)=>d[1].value-c[1].value),o=i.reduce((c,[d,v])=>c+v.value,0);if(o===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${n.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=i.map(([c,d])=>{const v=d.value/o*100,h=r;return r+=v,{name:c,percentage:v,color:d.color,start:h}}),m=l.map(c=>`${c.color} ${c.start}% ${c.start+c.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${n.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${m});">
          <div class="pie-center">
            <div class="pie-total">${b(o,n.currencySymbol)}</div>
            <div class="pie-total-label">Total Neto</div>
          </div>
        </div>
        <div class="allocation-legend">
          ${l.map(c=>`
            <div class="legend-item">
              <div class="legend-color" style="background: ${c.color};"></div>
              <div class="legend-info">
                <span class="legend-name">${c.name}</span>
                <span class="legend-pct">${c.percentage.toFixed(1)}%</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function tt(n){const e=[...n.passiveAssets.map(t=>({...t,category:"passive"})),...n.investmentAssets.map(t=>({...t,category:"investment"})),...n.liabilities.map(t=>({...t,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${g("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const a=n.currencySymbol;return`
    <div class="asset-list">
      ${e.map(t=>{const s=at(t.currency||t.type),i=st(t.currency||t.type),o=t.category==="liability",r=t.value||t.amount||0,l=u.convertValue(r,t.currency||"EUR");let m="";if(t.currency!==n.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[t.currency]||t.currency;m=`<div class="asset-original-value">${r} ${d}</div>`}return`
          <div class="asset-item" data-id="${t.id}" data-category="${t.category}">
            <div class="asset-icon-wrapper ${s}">
              ${g(i,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${t.name}</div>
              <div class="asset-details">${t.details||t.type||""}</div>
              ${m}
            </div>
            <div>
              <div class="asset-value ${o?"text-warning":""}">
                ${o?"-":""}${b(l,a)}
              </div>
              ${t.monthlyIncome?`<div class="asset-yield">+${b(u.convertValue(t.monthlyIncome,t.currency),a)}/mes</div>`:""}
              ${t.monthlyPayment?`<div class="asset-yield text-negative">-${b(u.convertValue(t.monthlyPayment,t.currency),a)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function at(n){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt"}[n]||"cash"}function st(n){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard"}[n]||"dollarSign"}function ve(){document.querySelectorAll(".asset-item").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.id,i=t.dataset.category;Se(s,i)})});const e=document.getElementById("toggle-real-estate");e&&e.addEventListener("change",()=>{u.toggleRealEstate()});const a=document.getElementById("display-currency-select");a&&a.addEventListener("change",t=>{u.setCurrency(t.target.value)})}let M=10,N=7,F=null,j=null;function nt(){const e=u.getState().currencySymbol,a=u.getNetWorth(),s=u.getNetIncome()*12,i=F!==null?F:a,o=j!==null?j:s,r=Ie(i,o,N,M);return`
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
          <div class="compound-input-hint">Patrimonio actual: ${b(a,e)}</div>
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
          <div class="compound-input-hint">Ingreso neto anual: ${b(s,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${N}" step="0.5">
            <span class="slider-value" id="rate-value">${N}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${M}">
            <span class="slider-value" id="years-value">${M} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${M} años</span>
          ${g("trendingUp","card-icon")}
        </div>
        <div class="highlight-value" id="future-value">${b(r.finalValue,e)}</div>
        <div class="highlight-label" id="growth-label">
          ${r.totalGrowth>=0?"📈":"📉"} ${r.growthMultiple.toFixed(1)}x tu capital inicial
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
          <span class="stat-value ${r.totalContributions>=0?"positive":"negative"}" id="total-contributed">${b(r.totalContributions,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot" style="background: var(--accent-secondary);"></span>
            Intereses Generados
          </span>
          <span class="stat-value" style="color: var(--accent-secondary);" id="total-interest">${b(r.totalInterest,e)}</span>
        </div>
        
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Valor Final
          </span>
          <span class="stat-value positive" style="font-size: 20px;" id="final-value-breakdown">${b(r.finalValue,e)}</span>
        </div>
      </div>
      
      <!-- YEAR BY YEAR PROJECTION -->
      <div class="section-divider">
        <span class="section-title">Proyección Año a Año</span>
      </div>
      
      <div class="projection-chart" id="projection-chart">
        ${$e(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${Ae(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function Ie(n,e,a,t){const s=a/100,i=[];let o=n,r=0,l=0;for(let m=1;m<=t;m++){const c=o,d=o*s;o+=d+e,r+=e,l+=d,i.push({year:m,startBalance:c,contribution:e,interest:d,endBalance:o,totalContributions:r,totalInterest:l})}return{finalValue:o,totalContributions:r,totalInterest:l,totalGrowth:o-n,growthMultiple:n>0?o/n:0,yearlyBreakdown:i}}function $e(n,e){if(n.length===0)return"";const a=Math.max(...n.map(s=>Math.abs(s.endBalance))),t=n.map((s,i)=>{const o=i/(n.length-1)*100,r=100-s.endBalance/a*100;return`${o},${r}`});return`
    <div class="line-chart-container" style="height: 200px; width: 100%; position: relative; margin-top: 20px;">
      <svg viewBox="0 0 100 100" class="projection-line-chart" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
        <!-- Grid horizontal lines -->
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        
        <!-- Area under curve -->
        <path d="M0,100 L${t.join(" L")} L100,100 Z" fill="url(#chart-gradient)" opacity="0.2" />
        
        <!-- Main line -->
        <path d="M${t.join(" L")}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Labels -->
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--text-muted);">
        <span>Año 0</span>
        <span>Año ${Math.floor(n.length/2)}</span>
        <span>Año ${n.length}</span>
      </div>
    </div>
  `}function Ae(n,e){const a=[];for(let t=0;t<n.length;t++){const s=n[t];(t<5||(t+1)%5===0||t===n.length-1)&&a.push(s)}return`
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
          ${a.map(t=>`
            <tr>
              <td>${t.year}</td>
              <td class="${t.endBalance>=0?"positive":"negative"}">${b(t.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${b(t.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function it(n){const e=document.getElementById("back-to-finance"),a=document.getElementById("rate-slider"),t=document.getElementById("years-slider"),s=document.getElementById("principal-input"),i=document.getElementById("contribution-input"),o=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",n),s&&s.addEventListener("input",l=>{F=parseFloat(l.target.value)||0,G()}),i&&i.addEventListener("input",l=>{j=parseFloat(l.target.value)||0,G()}),o&&o.addEventListener("click",()=>{F=null;const l=u.getNetWorth();s.value=l,G()}),r&&r.addEventListener("click",()=>{j=null;const l=u.getNetIncome()*12;i.value=l,G()}),a&&a.addEventListener("input",l=>{N=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${N}%`,G()}),t&&t.addEventListener("input",l=>{M=parseInt(l.target.value),document.getElementById("years-value").textContent=`${M} años`,G()})}function G(){const e=u.getState().currencySymbol,a=F!==null?F:u.getNetWorth(),t=j!==null?j:u.getNetIncome()*12,s=Ie(a,t,N,M),i=document.getElementById("future-value"),o=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),m=document.getElementById("total-contributed"),c=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),v=document.getElementById("projection-chart"),h=document.getElementById("projection-table");i&&(i.textContent=b(s.finalValue,e)),o&&(o.textContent=`Valor Futuro en ${M} años`),r&&(r.innerHTML=`${s.totalGrowth>=0?"📈":"📉"} ${s.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=b(a,e)),m&&(m.textContent=b(s.totalContributions,e),m.className=`stat-value ${s.totalContributions>=0?"positive":"negative"}`),c&&(c.textContent=b(s.totalInterest,e)),d&&(d.textContent=b(s.finalValue,e)),v&&(v.innerHTML=$e(s.yearlyBreakdown)),h&&(h.innerHTML=Ae(s.yearlyBreakdown,e))}function ot(){M=10,N=7,F=null,j=null}let W=u.getState().lastMarketData||[],X=!1,S={key:"price",direction:"desc"},Ce="";function rt(){const n=u.getState(),e=n.currency||"EUR",a=n.currencySymbol||"€";if((W.length===0||Ce!==e)&&(X||Le(),W.length===0))return`
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
            `;const t=Object.values(y);return`
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
                                ${X?`
                                    <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,212,170,0.1); padding: 4px 10px; border-radius: 20px;">
                                        <div class="loading-spinner-sm" style="width:10px; height:10px; border-width: 1.5px; border-color: var(--accent-primary) transparent var(--accent-primary) transparent;"></div>
                                        <span style="font-size: 10px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Actualizando</span>
                                    </div>
                                `:""}
                            </div>
                            <p class="page-subtitle">Activos globales en ${e}</p>
                        </div>
                    </div>
                    
                    <div class="market-currency-toggle" style="background: rgba(255,255,255,0.05); padding: 5px; border-radius: var(--radius-md); display: flex; gap: 6px;">
                        <button class="btn-toggle ${e==="EUR"?"active":""}" data-curr="EUR" style="padding: 8px 16px; font-size: 14px; border-radius: 8px; border: none; cursor: pointer; background: ${e==="EUR"?"var(--accent-primary)":"transparent"}; color: ${e==="EUR"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 700;">EUR</button>
                        <button class="btn-toggle ${e==="USD"?"active":""}" data-curr="USD" style="padding: 8px 16px; font-size: 14px; border-radius: 8px; border: none; cursor: pointer; background: ${e==="USD"?"var(--accent-primary)":"transparent"}; color: ${e==="USD"?"var(--bg-primary)":"var(--text-secondary)"}; font-weight: 700;">USD</button>
                    </div>
                </div>
            </header>

            ${t.map(s=>{const i=W.filter(o=>o.category===s);return i.length===0?"":lt(s,i,a)}).join("")}
        </div>
    `}function lt(n,e,a){const t=[...e].sort((s,i)=>{let o=s[S.key],r=i[S.key];return typeof o=="string"&&(o=o.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),o<r?S.direction==="asc"?-1:1:o>r?S.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${n}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${S.key==="name"?"active "+S.direction:""}" style="padding-left: var(--spacing-md);">Activo</th>
                                <th data-sort="price" class="${S.key==="price"?"active "+S.direction:""}">Precio</th>
                                <th data-sort="change24h" class="${S.key==="change24h"?"active "+S.direction:""}">24h</th>
                                <th data-sort="change30d" class="${S.key==="change30d"?"active "+S.direction:""}" style="padding-right: var(--spacing-md);">30d</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${t.map(s=>`
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${s.image?`<img src="${s.image}" alt="${s.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`:`<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${g(s.icon||"dollarSign")}
                                                </div>`}
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${s.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${s.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${s.price!==null?b(s.price,a):"-"}</td>
                                    <td class="${s.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${s.change24h!==null?pe(s.change24h):"-"}</td>
                                    <td class="${s.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${s.change30d!==null?pe(s.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function Le(){const e=u.getState().currency||"EUR";X||(X=!0,Ce=e,W=await qe(e),u.saveMarketData(W),X=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function ct(n){const e=document.getElementById("market-back");e&&e.addEventListener("click",n),document.querySelectorAll(".market-table th[data-sort]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.sort;S.key===i?S.direction=S.direction==="asc"?"desc":"asc":(S.key=i,S.direction="desc",i==="name"&&(S.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.curr;u.setCurrency(i),Le()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class ge{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const a=this.getApiKey();if(!a)throw new Error("Se requiere una API Key de Gemini en Configuración.");const s=(await this.fileToBase64(e)).split(",")[1],i=e.type,o=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o},{inline_data:{mime_type:i,data:s}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const d=await l.json();throw new Error(((r=d.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const c=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(c)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((a,t)=>{const s=new FileReader;s.readAsDataURL(e),s.onload=()=>a(s.result),s.onerror=i=>t(i)})}}let V=localStorage.getItem("life-dashboard/health_current_tab")||"exercise";function dt(){const n=u.getState(),{health:e}=n;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Salud y Forma Física</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${V==="exercise"?"active":""}" data-tab="exercise">
            ${g("zap")} Ejercicio
        </button>
        <button class="health-tab-btn ${V==="diet"?"active":""}" data-tab="diet">
            ${g("apple")} Dieta
        </button>
      </div>

      <div id="health-tab-content">
        ${V==="exercise"?ut(e):pt(e)}
      </div>

    </div>
    `}function ut(n){return`
      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${n.routines.map((e,a)=>`
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${g("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="up">${g("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="down">${g("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${g("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${a}" data-name="${e.name}">
                    ${g("moreVertical")}
                </button>
            </header>

            <div class="exercise-list-health">
                ${e.exercises.map((t,s)=>{const i=u.getExerciseStatus(e.id,s),o=`var(--accent-${i.color})`,r=i.status==="done_today";return`
                    <div class="exercise-item-health ${r?"exercise-done":""}">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot-wear" style="background-color: ${o}; box-shadow: 0 0 10px ${o};"></div>
                            <div class="ex-health-info">
                                <div class="ex-health-name-row">
                                    <span class="ex-health-name clickable rename-exercise" data-routine="${e.id}" data-index="${s}" data-current="${t.name}">${t.name}</span>
                                    <div class="ex-reorder-btns desktop-only">
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${s}" data-dir="up">${g("chevronUp")}</button>
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${s}" data-dir="down">${g("chevronDown")}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${e.id}" data-index="${s}">${t.weight||50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${e.id}" data-index="${s}">${t.reps||10} reps</span>
                                    ${i.lastLog?`
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${mt(i.lastLog.rating)}</span>
                                    `:""}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            ${r?`
                                <div class="exercise-done-badge-solid">
                                    ${g("check","done-icon-solid")}
                                </div>
                            `:`
                                <button class="btn btn-secondary btn-icon-only log-stars-btn" data-rid="${e.id}" data-idx="${s}" style="width: 42px; height: 42px; border-radius: 12px;">
                                    ${g("check")}
                                </button>
                            `}
                            <button class="icon-btn mobile-only ex-more-btn" data-routine="${e.id}" data-index="${s}" data-name="${t.name}">
                                ${g("moreVertical")}
                            </button>
                            <button class="delete-exercise-btn ex-delete-mini desktop-only" data-routine="${e.id}" data-index="${s}" title="Eliminar">${g("trash")}</button>
                        </div>
                    </div>
                    `}).join("")}
            </div>
            <div class="add-ex-row" style="margin-top: var(--spacing-md);">
                <button class="btn btn-secondary add-ex-btn w-full" data-id="${e.id}">
                    ${g("plus")} Agregar Ejercicio
                </button>
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-success add-routine-btn w-full" id="add-routine-btn">
                ${g("plus")} Nueva Rutina
            </button>
        </div>
      </div>
    `}function pt(n){return`
      <!-- METRICS: WEIGHT & FAT -->
      <div class="section-divider">
        <span class="section-title">Métricas de Cuerpo</span>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-2xl);">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${n.weightLogs.length>0?n.weightLogs[n.weightLogs.length-1].weight:"--"} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${n.fatLogs.length>0&&n.fatLogs[n.fatLogs.length-1].fat||"--"} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${n.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${n.fatGoal||"--"} %</div>
          <div class="summary-label">Objetivo Grasa</div>
        </div>
      </div>
      
      <div class="card ai-calorie-card" style="margin-bottom: var(--spacing-2xl); display: flex; flex-direction: column; align-items: center;">
          <div class="summary-value" style="font-size: 28px;">${vt(n)} kcal</div>
          <div class="summary-label">Calorías Registradas Hoy</div>
          <button class="btn btn-primary" id="ai-scan-photo" style="margin-top: var(--spacing-md); width: auto; padding: 10px 20px;">
             ${g("camera")} Escanear Comida (AI)
          </button>
      </div>
    `}function mt(n){return n<=2?"😰":n<=4?"😐":"😄"}function vt(n){const e=new Date().toDateString();return(n.calorieLogs||[]).filter(a=>new Date(a.date).toDateString()===e).reduce((a,t)=>a+(t.calories||0),0)}function gt(){document.querySelectorAll(".health-tab-btn").forEach(n=>{n.addEventListener("click",()=>{const e=n.dataset.tab;e!==V&&(V=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),V==="exercise"?ht():yt()}function ht(){var n;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=await p.prompt("Nuevo Ejercicio","Nombre del ejercicio:");t&&(u.addExerciseToRoutine(a,{name:t}),p.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=e.dataset.current,s=await p.prompt("Editar Rutina","Nombre de la rutina:",t);s&&s!==t&&(u.renameRoutine(a,s),p.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id;await p.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(a),p.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.id,s=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await p.select(`Menú: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await p.prompt("Editar Rutina","Nuevo nombre:",i);l&&l!==i&&(u.renameRoutine(t,l),p.toast("Rutina renombrada"))}else r==="up"?u.reorderRoutine(s,"up"):r==="down"?u.reorderRoutine(s,"down"):r==="delete"&&await p.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(t),p.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index),s=e.dataset.current,i=await p.prompt("Renombrar Ejercicio","Nuevo nombre:",s);i&&i!==s&&(u.updateExercise(a,t,{name:i}),p.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index);await p.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(a,t),p.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,s=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await p.select(`Ejercicio: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await p.prompt("Renombrar Ejercicio","Nuevo nombre:",i);l&&l!==i&&(u.updateExercise(t,s,{name:l}),p.toast("Ejercicio renombrado"))}else r==="up"?u.reorderExercise(t,s,"up"):r==="down"?u.reorderExercise(t,s,"down"):r==="delete"&&await p.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(t,s),p.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=parseInt(e.dataset.index),s=e.dataset.dir;u.reorderRoutine(t,s)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=e.dataset.routine,s=parseInt(e.dataset.index),i=e.dataset.dir;u.reorderExercise(t,s,i)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,s=parseInt(e.dataset.index),i=[];for(let r=10;r<=150;r+=2.5)i.push(`${r}kg`);const o=await p.select("Seleccionar Peso","Elige el peso para este ejercicio:",i,4);if(o){const r=parseFloat(o.replace("kg",""));u.updateExercise(t,s,{weight:r}),p.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,s=parseInt(e.dataset.index),i=[];for(let r=7;r<=20;r++)i.push(`${r} reps`);const o=await p.select("Seleccionar Reps","Elige las repeticiones objetivo:",i,4);if(o){const r=parseInt(o.replace(" reps",""));u.updateExercise(t,s,{reps:r}),p.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.rid,s=parseInt(e.dataset.idx),i=await p.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");i&&(u.logExercise(t,s,i),p.toast("Ejercicio registrado","success"))})}),(n=document.getElementById("add-routine-btn"))==null||n.addEventListener("click",async()=>{const e=await p.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(u.saveRoutine({name:e,exercises:[]}),p.toast("Rutina creada"))})}function yt(){var n,e,a,t,s;(n=document.getElementById("log-weight-btn"))==null||n.addEventListener("click",async()=>{const i=await p.prompt("Registrar Peso","Peso actual (kg):");i&&(u.addWeightLog(parseFloat(i)),p.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const i=await p.prompt("Registrar Grasa","Porcentaje de grasa (%):");i&&(u.addFatLog(parseFloat(i)),p.toast("Grasa registrada"))}),(a=document.getElementById("set-weight-goal-btn"))==null||a.addEventListener("click",async()=>{const i=u.getState().health.weightGoal,o=await p.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",i);o&&(u.updateHealthGoal("weightGoal",parseFloat(o)),p.toast("Objetivo actualizado"))}),(t=document.getElementById("set-fat-goal-btn"))==null||t.addEventListener("click",async()=>{const i=u.getState().health.fatGoal,o=await p.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",i);o&&(u.updateHealthGoal("fatGoal",parseFloat(o)),p.toast("Objetivo actualizado"))}),(s=document.getElementById("ai-scan-photo"))==null||s.addEventListener("click",()=>{const i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=async r=>{var m;const l=r.target.files[0];if(l){if(!ge.hasKey()){if(await p.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(m=document.querySelector('[data-nav="settings"]'))==null||m.click();return}p.toast("Usando simulación...","info"),o();return}try{p.toast("Analizando con Gemini...","info");const c=await ge.analyzeFood(l);await p.confirm("IA Detectada",`Identificado: "${c.name}" (${c.calories} kcal). ¿Registrar?`)&&(u.addCalorieLog(c.calories,`${c.name} (AI)`),p.toast("Calorías registradas"))}catch(c){p.alert("Error IA",c.message)}}};function o(){setTimeout(async()=>{const r={name:"Bowl Saludable",calories:450};await p.confirm("IA Simulada",`Detectado "${r.name}" con ${r.calories} kcal. ¿Registrar?`)&&(u.addCalorieLog(r.calories,r.name),p.toast("Registrado"))},1e3)}i.click()})}const se=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];function bt(){const n=u.getState(),{goals:e}=n;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas y Enfoque</h1>
        <p class="page-subtitle">Organiza tus prioridades con colores y objetivos dinámicos</p>
      </header>

      <div class="goals-grid-layout">
        ${[{id:"day",label:"Hoy",icon:"zap",color:"#FFD700"},{id:"week",label:"Semana",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Año 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Largo Plazo",icon:"trendingUp",color:"#EF4444"}].map(t=>{const s=e.filter(l=>l.timeframe===t.id),i=s.filter(l=>l.completed).length,o=s.length,r=o>0?i/o*100:0;return`
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${t.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${t.color}22; color: ${t.color}">${g(t.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${t.label}</span>
                        <span class="column-stats">${i}/${o}</span>
                    </div>
                    ${i>0?`
                        <button class="btn-clear-completed" data-tf="${t.id}" title="Limpiar completadas">
                            ${g("trash")}
                        </button>
                    `:""}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${r}%; background: ${t.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${t.id}">
                    ${ft(s,t.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${t.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${t.id}">
                        ${g("plus")}
                    </button>
                </div>
            </div>
          </div>
        `}).join("")}
      </div>
    </div>
  `}function ft(n,e){return n.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${g("package")}</div>
            </div>
        `:[...n].sort((t,s)=>t.completed!==s.completed?t.completed?1:-1:t.order!==void 0&&s.order!==void 0?t.order-s.order:(s.createdAt||0)-(t.createdAt||0)).map(t=>{const s=t.subGoals&&t.subGoals.length>0,i=s?t.subGoals.filter(r=>r.completed).length/t.subGoals.length*100:0,o=t.color||"#ffffff";return`
        <div class="goal-card-premium ${t.completed?"is-completed":""}" 
             data-id="${t.id}" 
             draggable="true"
             style="border-left: 4px solid ${o};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${t.id}" style="border-color: ${o}aa; background: ${t.completed?o:"transparent"}">
                    ${t.completed?g("check","check-icon-white"):""}
                </div>
                <div class="goal-main-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div class="goal-title-premium clickable-edit-goal" 
                             data-id="${t.id}" 
                             style="color: ${o}; font-weight: 700; flex: 1;">${t.title}</div>
                        <button class="open-color-picker" data-id="${t.id}" 
                                style="width: 14px; height: 14px; background: ${o}; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; margin-top: 4px;" 
                                title="Cambiar color"></button>
                    </div>
                    
                    <div class="goal-header-row" style="margin-top: 4px;">
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${t.id}" title="Hito">${g("plus")}</button>
                            <button class="action-btn-mini delete-goal" data-id="${t.id}" title="Borrar">${g("trash")}</button>
                        </div>
                    </div>
                    
                    ${s?`
                        <div class="subgoals-list-premium">
                            ${t.subGoals.map((r,l)=>`
                                <div class="subgoal-item-premium ${r.completed?"sub-done":""} toggle-subgoal" data-id="${t.id}" data-idx="${l}">
                                    <div class="sub-check" style="color: ${o}">${g(r.completed?"check":"plus","sub-check-svg")}</div>
                                    <span class="sub-title" style="color: ${o}ee">${r.title}</span>
                                </div>
                            `).join("")}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${i}%; background: ${o}"></div>
                            </div>
                        </div>
                    `:""}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${t.id}">
                        ${se.map(r=>`
                            <div class="goal-color-dot ${r===o?"active":""} set-goal-color" 
                                 data-id="${t.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function wt(){document.querySelectorAll(".btn-clear-completed").forEach(t=>{t.addEventListener("click",async s=>{s.stopPropagation();const i=t.dataset.tf;await p.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(u.deleteCompletedGoals(i),p.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const i=t.dataset.id;u.toggleGoal(i)})}),document.querySelectorAll(".open-color-picker").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const i=t.dataset.id,o=document.getElementById(`colors-${i}`);document.querySelectorAll(".color-selector-overlay").forEach(r=>{r.id!==`colors-${i}`&&r.classList.add("hidden")}),o==null||o.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const i=t.dataset.id,o=t.dataset.color;u.updateGoalColor(i,o),p.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const i=t.dataset.id,o=parseInt(t.dataset.idx);u.toggleSubGoal(i,o)})}),document.querySelectorAll(".delete-goal").forEach(t=>{t.addEventListener("click",async s=>{s.stopPropagation(),await p.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(u.deleteGoal(t.dataset.id),p.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(t=>{t.addEventListener("click",async s=>{s.stopPropagation();const i=t.dataset.id,o=await p.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(o){const l=[...u.getState().goals.find(m=>m.id===i).subGoals||[],{title:o,completed:!1}];u.updateGoal(i,{subGoals:l}),p.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(t=>{t.addEventListener("click",async()=>{const s=t.dataset.id,i=t.textContent,o=await p.prompt("Editar Meta","Actualiza el texto:",i);o&&o!==i&&u.updateGoal(s,{title:o})})}),document.querySelectorAll(".quick-add-input-premium").forEach(t=>{t.addEventListener("keypress",s=>{if(s.key==="Enter"&&t.value.trim()){const i=t.dataset.timeframe;u.addGoal({title:t.value.trim(),timeframe:i,color:se[0]}),t.value="",p.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.timeframe,i=t.previousElementSibling;i&&i.value.trim()?(u.addGoal({title:i.value.trim(),timeframe:s,color:se[0]}),i.value="",p.toast("Creada")):i&&i.focus()})});const n=document.querySelectorAll(".goals-list-premium");let e=null;document.querySelectorAll(".goal-card-premium").forEach(t=>{t.addEventListener("dragstart",s=>{e=t.dataset.id,t.classList.add("dragging"),s.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(s=>s.classList.remove("drag-over"))})}),n.forEach(t=>{t.addEventListener("dragover",s=>{s.preventDefault(),t.classList.add("drag-over"),s.dataTransfer.dropEffect="move"}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",s=>{s.preventDefault(),t.classList.remove("drag-over");const i=t.dataset.timeframe,o=[...u.getState().goals],r=o.findIndex(d=>d.id===e);if(r===-1)return;const l={...o[r]};l.timeframe!==i&&(l.timeframe=i),o.splice(r,1);const m=a(t,s.clientY);if(m==null)o.push(l);else{const d=m.dataset.id,v=o.findIndex(h=>h.id===d);o.splice(v,0,l)}const c=o.map((d,v)=>({...d,order:v}));u.reorderGoals(c),p.toast("Orden actualizado")})});function a(t,s){return[...t.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((o,r)=>{const l=r.getBoundingClientRect(),m=s-l.top-l.height/2;return m<0&&m>o.offset?{offset:m,element:r}:o},{offset:Number.NEGATIVE_INFINITY}).element}}let B=new Date;function Et(){const n=u.getState(),{events:e}=n;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Agenda</h1>
            <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
        </div>
        <button class="btn btn-primary" id="add-event-manual-btn" style="width: auto; padding: 10px 20px;">
            ${g("plus")} Nuevo Evento
        </button>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation prev-month">${g("chevronLeft")}</button>
                <span class="current-month">${xt()}</span>
                <button class="icon-btn-navigation next-month">${g("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${kt(e)}
            </div>
        </div>

        <div class="events-list-container" style="margin-top: var(--spacing-xl);">
            <div class="section-divider">
                <span class="section-title">Próximos Eventos</span>
            </div>
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${g("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                    </div>
                `:e.filter(a=>{const t=new Date(a.date);return t.getMonth()===B.getMonth()&&t.getFullYear()===B.getFullYear()}).sort((a,t)=>new Date(a.date)-new Date(t.date)).map(a=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${a.category||"event"}">
                            ${g(It(a.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${a.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${St(a.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${a.time}</span>
                                ${a.repeat!=="none"?`<span class="event-repeat-tag">${$t(a.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${a.id}">
                            ${g("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function kt(n){const e=B.getMonth(),a=B.getFullYear(),t=new Date().getDate(),s=new Date().getMonth()===e&&new Date().getFullYear()===a,i=new Date(a,e+1,0).getDate(),o=new Date(a,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;n.forEach(c=>{const d=new Date(c.date);d.getMonth()===e&&d.getFullYear()===a&&l.add(d.getDate())});let m=r.map(c=>`<div class="calendar-day-label">${c}</div>`).join("");for(let c=0;c<o;c++)m+='<div class="calendar-day empty"></div>';for(let c=1;c<=i;c++){const d=s&&c===t,v=l.has(c);m+=`
            <div class="calendar-day ${d?"today":""} ${v?"has-event":""}">
                ${c}
                ${v?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return m}function xt(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][B.getMonth()]} ${B.getFullYear()}`}function St(n){const e={day:"numeric",month:"short"};return new Date(n).toLocaleDateString("es-ES",e).toUpperCase()}function It(n){switch(n){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function $t(n){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[n]||""}function At(){var n,e,a;(n=document.querySelector(".prev-month"))==null||n.addEventListener("click",()=>{B.setMonth(B.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{B.setMonth(B.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(t=>{t.addEventListener("click",async()=>{await p.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(u.deleteEvent(t.dataset.id),p.toast("Evento eliminado"))})}),(a=document.getElementById("add-event-manual-btn"))==null||a.addEventListener("click",async()=>{const t=await p.prompt("Nuevo Evento","Título del evento:");if(!t)return;const s=await p.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!s)return;const i=await p.prompt("Hora","Formato HH:MM:","10:00");if(!i)return;const o=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await p.select("Categoría","Tipo de evento:",o,0);u.addEvent({title:t,date:s,time:i,category:r||"event",repeat:"none"}),p.toast("Evento agendado","success")})}function Ct(){const n=u.getState(),e=n.currencySymbol,a=n.livingExpenses,t=n.otherExpenses||[],s=n.liabilities,i=u.sumItems(a,"amount"),o=u.sumItems(t,"amount"),r=u.sumItems(s,"monthlyPayment"),l=i+o+r,m=[...(a||[]).map(c=>({...c,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(t||[]).map(c=>({...c,category:"otherExpense",typeLabel:"Otro Gasto"})),...(s||[]).filter(c=>c.monthlyPayment>0).map(c=>({...c,amount:c.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((c,d)=>d.amount-c.amount);return`
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
            ${b(l,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${b(i,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(r,e)}</div>
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
      
      ${Lt(m,n)}

    </div>
  `}function Lt(n,e){if(n.length===0)return`
            <div class="empty-state">
                ${g("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const a=e.currencySymbol;return`
        <div class="asset-list">
            ${n.map(t=>{const s=u.convertValue(t.amount,t.currency||"EUR"),i=Tt(t.category);return`
                <div class="asset-item expense-item" data-id="${t.id}" data-category="${t.category}">
                    <div class="asset-icon-wrapper expense">
                        ${g(i,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${t.name}</div>
                        <div class="asset-details">${t.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${b(s,a)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function Tt(n){switch(n){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function Rt(n){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",n),document.querySelectorAll(".expense-item").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.id,i=t.dataset.category;Se(s,i)})})}const ie={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},he=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let $="passiveAsset";function ye(n="passiveAsset"){var a,t;$=n,(t=(a=ie[$])==null?void 0:a.types[0])!=null&&t.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=Dt(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),Bt()}function Dt(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${$==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${g("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${$!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(ie).map(([e,a])=>`
          <div class="type-option ${e===$?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${g(a.icon)}
            </div>
            <div class="type-option-label">${a.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${Te()}
      </div>
    </div>
  `}function Te(){const n=ie[$],e=$==="investmentAsset"||$==="passiveAsset";if(e){const t=U.map(s=>({value:s.symbol,label:`${s.name} (${s.symbol})`}));[...he,...t]}let a="";return $==="passiveAsset"||$==="investmentAsset"?a=`
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
      ${$==="passiveAsset"?`
      <div class="form-group">
          <label class="form-label">Ingreso Mensual (en EUR)</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
      </div>`:""}
    `:$==="activeIncome"||$==="livingExpense"?a=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:$==="liability"?a=`
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
    `:$==="event"&&(a=`
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
                ${n.types.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${he.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${U.map(t=>`<option value="${t.symbol}">${t.name} (${t.symbol})</option>`).join("")}
                </optgroup>
                `:""}
            </select>
        </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" class="form-input" id="input-name" placeholder="Ej: Mi Wallet BTC">
    </div>
    
    ${a}
    
    <div class="form-group">
      <label class="form-label">Detalles (opcional)</label>
      <input type="text" class="form-input" id="input-details" placeholder="Notas adicionales...">
    </div>
    
    <button class="btn btn-primary" id="btn-save" style="margin-top: var(--spacing-md);">
      ${g("plus")} Agregar
    </button>
  `}function Bt(){const n=document.getElementById("add-modal"),e=document.getElementById("modal-close");n.addEventListener("click",t=>{t.target===n&&ne()}),e.addEventListener("click",ne);const a=n.querySelectorAll(".category-selector .type-option");a.forEach(t=>{t.addEventListener("click",()=>{$=t.dataset.category,a.forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.getElementById("form-container").innerHTML=Te(),be()})}),be()}function be(){const n=document.getElementById("btn-save");n&&n.addEventListener("click",Pt);const e=document.getElementById("mode-qty"),a=document.getElementById("mode-total"),t=document.getElementById("input-qty"),s=document.getElementById("input-value"),i=document.getElementById("input-currency"),o=document.getElementById("input-name");if(e&&a){const l=m=>{m==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",a.style.background="transparent",a.style.color="var(--text-secondary)",t.focus()):(a.style.background="var(--accent-primary)",a.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",s.focus())};e.addEventListener("click",()=>l("qty")),a.addEventListener("click",()=>l("total"))}const r=l=>{const m=u.getState().rates,c=i==null?void 0:i.value,d=m[c]||1;if(l==="qty"){const v=parseFloat(t.value)||0;s.value=(v*d).toFixed(2)}else{const v=parseFloat(s.value)||0;t.value=(v/d).toFixed(6)}};t==null||t.addEventListener("input",()=>r("qty")),s==null||s.addEventListener("input",()=>r("total")),i&&i.addEventListener("change",()=>{if(o&&!o.value){const l=i.options[i.selectedIndex].text;o.value=l.split(" (")[0]}r("qty")})}function Pt(){var h,w,E,k,f,L,T,q,K,z,Z,oe;const n=(w=(h=document.getElementById("input-name"))==null?void 0:h.value)==null?void 0:w.trim(),e=(E=document.getElementById("input-type"))==null?void 0:E.value,a=(k=document.getElementById("input-currency"))==null?void 0:k.value,t=(L=(f=document.getElementById("input-details"))==null?void 0:f.value)==null?void 0:L.trim(),s=parseFloat((T=document.getElementById("input-value"))==null?void 0:T.value)||0,i=document.getElementById("input-qty"),o=i?parseFloat(i.value)||0:s,r=parseFloat((q=document.getElementById("input-amount"))==null?void 0:q.value)||0,l=parseFloat((K=document.getElementById("input-monthly"))==null?void 0:K.value)||0,m=(z=document.getElementById("input-date"))==null?void 0:z.value,c=(Z=document.getElementById("input-time"))==null?void 0:Z.value,d=(oe=document.getElementById("input-repeat"))==null?void 0:oe.value;if(!n){p.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const v={name:n,type:e,currency:a,details:t};switch($){case"passiveAsset":u.addPassiveAsset({...v,value:o,monthlyIncome:l});break;case"activeIncome":u.addActiveIncome({...v,amount:r});break;case"livingExpense":u.addLivingExpense({...v,amount:r});break;case"investmentAsset":u.addInvestmentAsset({...v,value:o});break;case"liability":u.addLiability({...v,amount:r,monthlyPayment:l});break;case"event":u.addEvent({title:n,date:m,time:c,repeat:d,category:e});break}ne()}function ne(){const n=document.getElementById("add-modal");n&&(n.classList.remove("active"),setTimeout(()=>n.remove(),300))}function Mt(){const n=x.isSetup(),e=x.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${g("lock","auth-icon")}
                </div>
                <h1 class="auth-title">${n?"Bienvenida de nuevo":"Configura tu Bóveda"}</h1>
                <p class="auth-subtitle">${n?"Introduce tu contraseña para entrar":"Crea una contraseña maestra para proteger tus datos"}</p>
            </div>

            <div class="auth-form">
                <div class="input-group">
                    <input type="password" id="auth-password" class="form-input" placeholder="Contraseña maestra" autofocus>
                </div>
                
                ${n?"":`
                <div class="input-group">
                    <input type="password" id="auth-confirm" class="form-input" placeholder="Confirmar contraseña">
                </div>
                `}

                <button id="auth-submit-btn" class="btn btn-primary w-full">
                    ${n?"Desbloquear":"Empezar"}
                </button>

                ${n&&e?`
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
    `}function _t(n){var i;const e=document.getElementById("auth-submit-btn"),a=document.getElementById("auth-bio-btn"),t=document.getElementById("auth-password"),s=async()=>{const o=t.value,r=document.getElementById("auth-confirm"),l=x.isSetup();try{let m;if(l)m=await x.unlock(o);else{if(!o||o.length<4)throw new Error("Contraseña demasiado corta");if(o!==r.value)throw new Error("Las contraseñas no coinciden");m=await x.setup(o)}await u.loadEncrypted(m),n()}catch(m){p.alert("Error",m.message)}};e==null||e.addEventListener("click",s),t==null||t.addEventListener("keypress",o=>{o.key==="Enter"&&s()}),(i=document.getElementById("auth-confirm"))==null||i.addEventListener("keypress",o=>{o.key==="Enter"&&s()}),a==null||a.addEventListener("click",async()=>{try{const o=await x.unlockWithBiometrics();await u.loadEncrypted(o),n()}catch(o){p.alert("Identificación",o.message)}}),x.isBioEnabled()&&setTimeout(async()=>{try{const o=await x.unlockWithBiometrics();await u.loadEncrypted(o),n()}catch{console.log("Auto-bio failed or cancelled")}},500)}const Ut="modulepreload",Ot=function(n){return"/life-dashboard/"+n},fe={},we=function(e,a,t){let s=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(a.map(l=>{if(l=Ot(l),l in fe)return;fe[l]=!0;const m=l.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=m?"stylesheet":Ut,m||(d.as="script"),d.crossOrigin="",d.href=l,r&&d.setAttribute("nonce",r),document.head.appendChild(d),m)return new Promise((v,h)=>{d.addEventListener("load",v),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return s.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function Nt(){const n=x.isBioEnabled(),e=C.hasToken();return`
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
                        <input type="checkbox" id="toggle-bio" ${n?"checked":""}>
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
            <p>Life Dashboard Pro v1.0.74</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Ft(){var t,s,i,o,r,l,m;(t=document.getElementById("toggle-bio"))==null||t.addEventListener("change",async c=>{if(c.target.checked){const v=await p.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(v)try{await x.registerBiometrics(v),p.toast("Biometría activada correctamente")}catch(h){await p.alert("Error",h.message),c.target.checked=!1}else c.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),p.toast("Biometría desactivada","info")});const n=document.getElementById("btn-install-pwa");n&&setTimeout(()=>{if(window.deferredPrompt){const c=document.getElementById("install-pwa-card");c&&(c.style.display="block"),n.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:d}=await window.deferredPrompt.userChoice;if(d==="accepted"){p.toast("Instalando aplicación...");const v=document.getElementById("install-pwa-card");v&&(v.style.display="none")}window.deferredPrompt=null})}},1e3),(s=document.getElementById("sync-drive-btn"))==null||s.addEventListener("click",async()=>{const c=document.getElementById("sync-drive-btn"),d=C.hasToken(),v=c.innerHTML;try{if(c.innerHTML='<div class="loading-spinner-sm"></div>',c.style.pointerEvents="none",d){const h=x.getVaultKey();await C.pushData(u.getState(),h),p.toast("Bóveda actualizada en Drive")}else{await C.authenticate();const h=x.getVaultKey(),w=await C.pullData(h).catch(()=>null);if(w&&await p.confirm("Respaldo Encontrado","Hemos detectado una bóveda existente en Google Drive. ¿Qué deseas hacer con tus datos?","Recuperar de la Nube","Sobreescribir Nube")){u.setState(w),await u.saveState(),p.toast("Datos recuperados correctamente"),setTimeout(()=>window.location.reload(),800);return}await C.pushData(u.getState(),h),p.toast("Google Drive conectado y sincronizado")}typeof window.reRender=="function"&&window.reRender()}catch(h){if(console.error(h),h.message&&(h.message.includes("Contraseña incorrecta")||h.message.includes("corruptos"))){if(await p.confirm("Error de Decifrado","La contraseña actual no coincide con la del backup en la nube. ¿Deseas borrar los datos en Drive para empezar de cero?","Borrar Datos Nube","Cancelar"))try{await C.deleteBackup(),p.toast("Datos de Drive borrados");const E=x.getVaultKey();await C.pushData(u.getState(),E),p.toast("Google Drive sincronizado (Nueva Bóveda)")}catch{p.alert("Error","No se pudieron borrar los datos de Drive.")}}else p.alert("Error",h.message||(typeof h=="object"?JSON.stringify(h):"Error al conectar con Google"))}finally{c.innerHTML=v,c.style.pointerEvents="auto"}}),(i=document.getElementById("export-data-btn"))==null||i.addEventListener("click",async()=>{try{p.toast("Preparando archivo encriptado...","info");const c=u.getState(),d=x.getVaultKey(),{SecurityService:v}=await we(async()=>{const{SecurityService:L}=await Promise.resolve().then(()=>re);return{SecurityService:L}},void 0),h=await v.encrypt(c,d),w=new Blob([JSON.stringify(h)],{type:"application/octet-stream"}),E=URL.createObjectURL(w),k=document.createElement("a"),f=new Date().toISOString().split("T")[0];k.href=E,k.download=`life_dashboard_backup_${f}.bin`,document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(E),p.toast("Backup exportado correctamente")}catch(c){console.error("Export error:",c),p.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),a=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{a==null||a.click()}),a==null||a.addEventListener("change",async c=>{var h;const d=(h=c.target.files)==null?void 0:h[0];if(!d)return;if(!await p.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){a.value="";return}try{const w=await d.text(),E=JSON.parse(w),k=x.getVaultKey(),{SecurityService:f}=await we(async()=>{const{SecurityService:T}=await Promise.resolve().then(()=>re);return{SecurityService:T}},void 0),L=await f.decrypt(E,k);if(L)u.setState(L),await u.saveState(),p.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(w){console.error("Import error:",w),p.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{a.value=""}}),(o=document.getElementById("btn-logout"))==null||o.addEventListener("click",async()=>{await p.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(x.logout(),window.location.reload())}),(r=document.getElementById("btn-force-update"))==null||r.addEventListener("click",async()=>{if(await p.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const d=await caches.keys();for(let v of d)await caches.delete(v)}catch(d){console.error("Error clearing cache",d)}window.location.reload(!0)}}),(l=document.getElementById("btn-save-gemini"))==null||l.addEventListener("click",()=>{var d;const c=(d=document.getElementById("gemini-api-key"))==null?void 0:d.value;c!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",c.trim()),p.toast("API Key de Gemini guardada"))}),(m=document.getElementById("btn-factory-reset"))==null||m.addEventListener("click",async()=>{if(await p.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const d="life-dashboard/";if(Object.keys(localStorage).forEach(v=>{v.startsWith(d)&&localStorage.removeItem(v)}),Object.keys(sessionStorage).forEach(v=>{v.startsWith(d)&&sessionStorage.removeItem(v)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(h=>window.indexedDB.deleteDatabase(h.name)),navigator.serviceWorker){const v=await navigator.serviceWorker.getRegistrations();for(let h of v)h.unregister()}p.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.origin+"?reset="+Date.now()},1e3)}})}let D=localStorage.getItem("life-dashboard/app_current_page")||"finance",I=localStorage.getItem("life-dashboard/app_current_sub_page")||null;I==="null"&&(I=null);async function Ee(){C.init().catch(e=>console.warn("[Drive] Pre-init failed:",e));const n=x.getVaultKey();n?await u.loadEncrypted(n)?Re():(console.error("[Boot] Decryption failed, invalid vault key in session?"),x.logout(),ke()):ke()}function ke(){const n=document.getElementById("app");n.innerHTML=Mt(),_t(()=>{Re()})}function Re(){const n=document.getElementById("app");n.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,De(),u.subscribe(()=>{R()}),window.reRender=()=>R(),jt()}function jt(){var t,s;const n=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(n&&(Date.now()-parseInt(n))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
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
    `,document.body.appendChild(e);const a=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};a(),window.addEventListener("beforeinstallprompt",a),(t=document.getElementById("pwa-banner-install"))==null||t.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:i}=await window.deferredPrompt.userChoice;i==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(s=document.getElementById("pwa-banner-close"))==null||s.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function De(){const n=document.getElementById("bottom-nav");n.innerHTML=de(D),ue(e=>{D=e,I=null,localStorage.setItem("life-dashboard/app_current_page",D),localStorage.setItem("life-dashboard/app_current_sub_page",I),_(),R(),n.innerHTML=de(D),ue(a=>{D=a,I=null,localStorage.setItem("life-dashboard/app_current_page",D),localStorage.setItem("life-dashboard/app_current_sub_page",I),_(),R(),De()})}),Gt(),R()}function R(){const n=document.getElementById("main-content");if(!n)return;const e=n.scrollTop;if(I==="compound"){n.innerHTML=nt(),it(()=>{I=null,ot(),_(),R()}),n.scrollTop=e;return}if(I==="expenses"){n.innerHTML=Ct(),Rt(()=>{I=null,_(),R()}),n.scrollTop=e;return}if(I==="market"){n.innerHTML=rt(),ct(()=>{I=null,_(),R()}),n.scrollTop=e;return}switch(n.classList.toggle("no-padding-mobile",D==="health"),D){case"finance":_(),n.innerHTML=me(),ve(),xe();break;case"goals":O(),n.innerHTML=bt(),wt();break;case"calendar":n.innerHTML=Et(),At(),O();break;case"health":n.innerHTML=dt(),gt(),O();break;case"settings":n.innerHTML=Nt(),Ft(),O();break;default:_(),n.innerHTML=me(),ve(),xe()}requestAnimationFrame(()=>{n.scrollTop=e})}function xe(){const n=document.getElementById("open-compound");n&&n.addEventListener("click",()=>{I="compound",localStorage.setItem("life-dashboard/app_current_sub_page",I),O(),R()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{I="market",localStorage.setItem("life-dashboard/app_current_sub_page",I),O(),R()});const a=document.getElementById("open-expenses");a&&a.addEventListener("click",()=>{I="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",I),O(),R()})}function Gt(){const n=document.querySelector(".fab");n&&n.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=g("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{if(D==="calendar")ye("event");else if(D==="health"){const a=await ns.confirm("Registrar Métrica","¿Qué deseas registrar hoy?","Peso","Grasa");if(a===!0){const t=await ns.prompt("Registrar Peso","Ingresa tu peso actual en kg:","","number");t&&u.addWeightLog(t)}else if(a===!1){const t=await ns.prompt("Grasa Corporal","Ingresa tu % de grasa:","","number");t&&u.addFatLog(t)}}else ye()}),document.body.appendChild(e)}function O(){const n=document.getElementById("main-fab");n&&(n.style.display="none")}function _(){const n=document.getElementById("main-fab");n&&(n.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ee):Ee();window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),window.deferredPrompt=n,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});
