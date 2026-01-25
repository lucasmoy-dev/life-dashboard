var _e=Object.defineProperty;var Ue=(s,e,a)=>e in s?_e(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a;var ae=(s,e,a)=>Ue(s,typeof e!="symbol"?e+"":e,a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Oe="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",Ne="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function je(){var e,a,t,n,o,i,r,l,p,c,d,g,h,w,E;const s={EUR:1};try{const b=await(await fetch(Oe)).json();s.BTC=((e=b.bitcoin)==null?void 0:e.eur)||4e4,s.ETH=((a=b.ethereum)==null?void 0:a.eur)||2200,s.XRP=((t=b.ripple)==null?void 0:t.eur)||.5,s.KAS=((n=b.kaspa)==null?void 0:n.eur)||.1,s.SOL=((o=b.solana)==null?void 0:o.eur)||90,s.XLM=((i=b.stellar)==null?void 0:i.eur)||.11,s.ALGO=((r=b.algorand)==null?void 0:r.eur)||.18,s.LTC=((l=b.litecoin)==null?void 0:l.eur)||65,s.SUI=((p=b.sui)==null?void 0:p.eur)||1.1,s.LINK=((c=b.chainlink)==null?void 0:c.eur)||14,s.RNDR=((d=b["render-token"])==null?void 0:d.eur)||4.5,s.ADA=((g=b.cardano)==null?void 0:g.eur)||.45,s.ONDO=((h=b["ondo-finance"])==null?void 0:h.eur)||.7,(w=b.bitcoin)!=null&&w.ars&&((E=b.bitcoin)!=null&&E.eur)&&(s.ARS=b.bitcoin.eur/b.bitcoin.ars);const A=await fetch(Ne);if(A.ok){const T=await A.json();s.USD=1/T.rates.USD,s.CHF=1/T.rates.CHF,s.GBP=1/T.rates.GBP,s.AUD=1/T.rates.AUD}s.GOLD=2100,s.SP500=4700}catch(k){console.error("Failed to fetch some prices:",k),s.USD=s.USD||.92,s.CHF=s.CHF||1.05,s.GBP=s.GBP||1.15,s.AUD=s.AUD||.6,s.ARS=s.ARS||.001}return s}class P{static async hash(e,a="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+a),o=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(o)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,a){const t=new TextEncoder,n=await crypto.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(a),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,a){try{const t=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),o=await this.deriveKey(a,this.bufToBase64(t)),i=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(i),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},o,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(n),salt:this.bufToBase64(t),v:"5.0"}}catch(t){throw console.error("[Security] Encryption failed:",t),new Error("No se pudo encriptar la información")}}static async decrypt(e,a){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:t,iv:n,salt:o}=e,i=await this.deriveKey(a,o),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},i,this.base64ToBuf(t)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(t){throw console.error("[Security] Decryption failed:",t),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(a=>a.charCodeAt(0)))}}const de=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:P},Symbol.toStringTag,{value:"Module"})),C={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class x{static isSetup(){return!!localStorage.getItem(C.MASTER_HASH)}static async setup(e){const a=await P.hash(e),t=await P.deriveVaultKey(e);return localStorage.setItem(C.MASTER_HASH,a),sessionStorage.setItem(C.VAULT_KEY,t),t}static async unlock(e){const a=await P.hash(e),t=localStorage.getItem(C.MASTER_HASH);if(a===t){const n=await P.deriveVaultKey(e);return sessionStorage.setItem(C.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const a=sessionStorage.getItem(C.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const t=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:t,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(C.BIO_ENABLED,"true"),localStorage.setItem(C.VAULT_KEY,a),!0}catch(t){throw console.error("Biometric setup failed:",t),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(C.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const a=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:a,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const t=localStorage.getItem(C.VAULT_KEY);if(t)return sessionStorage.setItem(C.VAULT_KEY,t),t;throw new Error("Llave no encontrada. Usa contraseña.")}catch(a){throw console.error("Biometric auth failed:",a),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(C.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(C.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(C.BIO_ENABLED)==="true"}}const Fe="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Ge="https://www.googleapis.com/auth/drive.file";class L{static hasToken(){return!!this.accessToken&&localStorage.getItem("life-dashboard/drive_connected")==="true"}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,a)=>{const t=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.tokenClient=google.accounts.oauth2.initTokenClient({client_id:Fe,scope:Ge,callback:n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}this.saveSession(n)}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&(console.log("[Drive] Initial check: Attempting silent token restoration..."),this.authenticate(!0).catch(()=>{console.log("[Drive] Initial silent restoration skipped (expired or no session)")})),e(!0)}catch(n){console.error("[Drive] Init error:",n),a(n)}}):setTimeout(t,200)};t()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const a=Date.now()+(e.expires_in?e.expires_in*1e3:36e5);localStorage.setItem("life-dashboard/drive_token_expiry",a.toString())}static async authenticate(e=!1){return this.tokenClient||await this.init(),new Promise((a,t)=>{this.tokenClient.callback=n=>{if(n.error){e?(console.warn("[Drive] Silent auth failed, but keeping connection intent"),t(new Error("Silent auth failed"))):t(new Error(n.error_description||"Fallo en la autenticación"));return}this.saveSession(n),a(n.access_token)},e?this.tokenClient.requestAccessToken({prompt:"none"}):this.tokenClient.requestAccessToken({prompt:"consent"})})}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(this.tokenClient||await this.init(),!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Refreshing token silently...");try{return await this.authenticate(!0)}catch(n){throw console.warn("[Drive] Silent refresh failed:",n.message),new Error('Google Drive session expired. Click "Sync" in settings to reconnect.')}}return this.accessToken}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const a=e.split("/").filter(o=>o);let t="root";for(const o of a)try{const i=`name = '${o}' and mimeType = 'application/vnd.google-apps.folder' and '${t}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(l&&l.length>0)t=l[0].id;else{const p={name:o,mimeType:"application/vnd.google-apps.folder",parents:[t]};t=(await gapi.client.drive.files.create({resource:p,fields:"id"})).result.id}}catch(i){if(i.status===401){console.log("[Drive] 401 error, attempting auto-reconnect...");try{throw await this.authenticate(!0),new Error("RETRY")}catch{throw this.accessToken=null,new Error("Sesión de Google expirada. Por favor reconecta.")}}throw i}return t}static async pushData(e,a,t=!1){var n,o,i;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(n=gapi.client)!=null&&n.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log(`[Drive] Pushing encrypted data...${t?" (Retry)":""}`);const r=await this.getOrCreateFolderPath("/backup/life-dashboard/"),l=await P.encrypt(e,a),p="dashboard_vault_v5.bin",c=`name = '${p}' and '${r}' in parents and trashed = false`,g=(await gapi.client.drive.files.list({q:c,fields:"files(id)"})).result.files,h=new Blob([JSON.stringify(l)],{type:"application/json"});if(g&&g.length>0){const w=g[0].id,E=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${w}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:h});if(E.status===401&&!t)return await this.authenticate(!0),await this.pushData(e,a,!0);if(!E.ok)throw new Error(`Error al actualizar backup: ${E.status}`)}else{const w={name:p,parents:[r]},E=new FormData;E.append("metadata",new Blob([JSON.stringify(w)],{type:"application/json"})),E.append("file",h);const k=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:E});if(k.status===401&&!t)return await this.authenticate(!0),await this.pushData(e,a,!0);if(!k.ok)throw new Error(`Error al crear backup: ${k.status}`)}return!0}catch(r){if(r.message==="RETRY"&&!t)return await this.pushData(e,a,!0);throw console.error("[Drive] Push failed:",r),new Error(((i=(o=r.result)==null?void 0:o.error)==null?void 0:i.message)||r.message||"Fallo al subir datos a Drive")}}static async pullData(e,a=!1){var t,n,o;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(t=gapi.client)!=null&&t.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken}),console.log(`[Drive] Pulling data...${a?" (Retry)":""}`);const l=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,c=(await gapi.client.drive.files.list({q:l,fields:"files(id, name)"})).result.files;if(!c||c.length===0)return null;const d=c[0].id,g=await fetch(`https://www.googleapis.com/drive/v3/files/${d}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(g.status===401&&!a)return await this.authenticate(!0),await this.pullData(e,!0);if(!g.ok)throw new Error(`Error al descargar backup: ${g.status}`);const h=await g.json();return await P.decrypt(h,e)}catch(i){if(i.message==="RETRY"&&!a)return await this.pullData(e,!0);throw console.error("[Drive] Pull failed:",i),new Error(((o=(n=i.result)==null?void 0:n.error)==null?void 0:o.message)||i.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){var e,a,t;try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");(e=gapi.client)!=null&&e.drive||await this.init(),gapi.client.setToken({access_token:this.accessToken});const i=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:i,fields:"files(id)"})).result.files;if(l&&l.length>0){const p=l[0].id;return await gapi.client.drive.files.delete({fileId:p}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(n){throw console.error("[Drive] Deletion failed:",n),new Error(((t=(a=n.result)==null?void 0:a.error)==null?void 0:t.message)||n.message||"Fallo al borrar backup en Drive")}}}ae(L,"tokenClient",null),ae(L,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null);const ue={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',users:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',messageSquare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',phone:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',facebook:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',linkedin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"/><path d="M5 15.1a7 7 0 0 0 10.9 0"/><path d="M6 13.6a7 7 0 0 0 4.6 2.4"/><path d="M13.4 16a7 7 0 0 0 4.6-2.4"/><path d="M8 12.1a5 5 0 0 0 6.9 0"/><path d="M9.1 11a3 3 0 0 0 3.9 0"/><path d="M12 18.5V20"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',palette:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>'};function v(s,e=""){return(ue[s]||ue.package).replace("<svg",`<svg class="${e}"`)}class He{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,a="success",t=3e3){const n=document.createElement("div");n.className=`toast toast-${a} stagger-in`;const o=a==="success"?"check":a==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${v(o,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},t)}alert(e,a){return new Promise(t=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>t(!0)}]})})}confirm(e,a,t="Confirmar",n="Cancelar"){return new Promise(o=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>o(!1)},{text:t,type:"danger",onClick:()=>o(!0)}]})})}prompt(e,a,t="",n="text"){return new Promise(o=>{const i=`prompt-input-${Date.now()}`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${i}" class="form-input" value="${t}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(i).value;o(r)}}]}),setTimeout(()=>{const r=document.getElementById(i);r&&(r.focus(),r.select&&r.select())},100)})}select(e,a,t=[],n=4){return new Promise(o=>{const i=`display: grid; grid-template-columns: repeat(${n}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="${i}">
                        ${t.map((l,p)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{o(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,a,t="BORRAR"){return new Promise(n=>{const o=`hard-confirm-input-${Date.now()}`,i=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${a}<br><br>Escribe <strong>${t}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${o}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:i,disabled:!0,onClick:()=>n(!0)}]});const r=document.getElementById(o),l=document.getElementById(i);r.addEventListener("input",()=>{const p=r.value.trim().toUpperCase()===t.toUpperCase();l.disabled=!p,l.style.opacity=p?"1":"0.3",l.style.pointerEvents=p?"auto":"none"})})}performance(e,a){const t=[{rating:1,emoji:"🫣",label:"Baja"},{rating:3,emoji:"😐",label:"Media"},{rating:5,emoji:"😎",label:"Alta"}];return new Promise(n=>{this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${t.map(i=>`
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${i.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${i.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${i.label}</span>
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(null)}]});const o=document.querySelector(".modal-overlay.active");o&&o.querySelectorAll(".perf-emoji-btn").forEach(i=>{i.addEventListener("click",()=>{n(parseInt(i.dataset.value)),this._closeModal(o)})})})}_showModal({title:e,message:a,content:t="",buttons:n=[],centered:o=!1}){const i=document.createElement("div");i.className=`modal-overlay ${o?"overlay-centered":""}`,i.style.zIndex="9999";const r=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;i.id=r;const l=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${a}</div>
                    ${t}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    ${n.map((d,g)=>`
                        <button class="btn btn-${d.type} w-full" data-index="${g}" style="min-height: 48px; font-size: 16px; ${d.disabled?"opacity: 0.3; pointer-events: none;":""}" ${d.id?`id="${d.id}"`:""}>
                            ${d.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;i.innerHTML=l,document.body.appendChild(i),i.offsetHeight,i.classList.add("active"),setTimeout(()=>{const d=i.querySelectorAll(".modal-footer button");d.length>0&&d[d.length-1].focus()},100);const p=d=>{d.key==="Escape"&&(n.some(h=>h.type==="danger")||(i.removeEventListener("keydown",p),this._closeModal(i)))};i.tabIndex=-1,i.addEventListener("keydown",p),i.querySelectorAll(".modal-footer button").forEach(d=>{const g=d.dataset.index;if(g!==void 0){const h=n[g];d.addEventListener("click",async w=>{if(w.stopPropagation(),!d.classList.contains("btn-processing")){d.classList.add("btn-processing"),d.style.pointerEvents="none";try{h.onClick&&await h.onClick(),await this._closeModal(i)}catch(E){console.error("Modal button action failed",E),d.classList.remove("btn-processing"),d.style.pointerEvents="auto"}}})}}),i.addEventListener("click",async d=>{if(d.target===i&&!n.some(h=>h.type==="danger")){const h=n.find(w=>w.type==="secondary");h&&h.onClick(),await this._closeModal(i)}})}async _closeModal(e){e.classList.remove("active");const a=e.querySelector(".modal");return a&&a.classList.add("animate-out"),new Promise(t=>{setTimeout(()=>{e.remove(),t()},300)})}}const m=new He,se="life-dashboard/data",pe="life-dashboard/secured",ne={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],social:{people:[],columns:[{id:"1",name:"Chat",color:"#3b82f6",order:0},{id:"2",name:"Phone",color:"#8b5cf6",order:1},{id:"3",name:"Meeting",color:"#10b981",order:2},{id:"4",name:"Closed",color:"#f59e0b",order:3}],idealLeadProfile:""},lastMarketData:[]};class Ve{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...ne}}async loadEncrypted(e){const a=localStorage.getItem(pe),t=localStorage.getItem(se);if(a)try{const n=JSON.parse(a),o=await P.decrypt(n,e);return this.state={...ne,...o},this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(t)try{const n=JSON.parse(t);return this.state={...ne,...n},await this.saveState(),localStorage.removeItem(se),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await je();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=x.getVaultKey();if(e){const a=await P.encrypt(this.state,e);localStorage.setItem(pe,JSON.stringify(a)),localStorage.removeItem(se)}else console.warn("[Store] Attempted to save without Vault Key. Save skipped.")}catch(e){console.error("Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState().then(()=>{const a=x.getVaultKey();a&&L.hasToken()&&(this.syncTimeout&&clearTimeout(this.syncTimeout),this.syncTimeout=setTimeout(()=>{const{hideRealEstate:t,...n}=this.state;L.pushData(n,a).then(()=>{console.log("[Auto-Sync] Success"),m.toast("Sincronizado con Drive","success",2e3)}).catch(o=>{console.warn("[Auto-Sync] Failed:",o)})},5e3))}),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const a={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:a[e]||"$"})}convertToEUR(e,a){if(!a||a==="EUR")return e||0;const t=this.state.rates[a]||1;return(e||0)*t}convertFromEUR(e,a){if(!a||a==="EUR")return e;const t=this.state.rates[a];return t&&t!==0?e/t:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,a="investment"){const t={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return a==="passive"?this.addPassiveAsset({...t,monthlyIncome:0}):this.addInvestmentAsset(t)}convertValue(e,a){const t=this.convertToEUR(e,a);return this.convertFromEUR(t,this.state.currency)}addPassiveAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,a]}),a}updatePassiveAsset(e,a){this.setState({passiveAssets:this.state.passiveAssets.map(t=>t.id===e?{...t,...a}:t)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(a=>a.id!==e)})}addActiveIncome(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,a]}),a}updateActiveIncome(e,a){this.setState({activeIncomes:this.state.activeIncomes.map(t=>t.id===e?{...t,...a}:t)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(a=>a.id!==e)})}addLivingExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,a]}),a}updateLivingExpense(e,a){this.setState({livingExpenses:this.state.livingExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(a=>a.id!==e)})}addOtherExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,a]}),a}updateOtherExpense(e,a){this.setState({otherExpenses:this.state.otherExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(a=>a.id!==e)})}addInvestmentAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,a]}),a}updateInvestmentAsset(e,a){this.setState({investmentAssets:this.state.investmentAssets.map(t=>t.id===e?{...t,...a}:t)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(a=>a.id!==e)})}addLiability(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,a]}),a}updateLiability(e,a){this.setState({liabilities:this.state.liabilities.map(t=>t.id===e?{...t,...a}:t)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(a=>a.id!==e)})}sumItems(e,a){return e.reduce((t,n)=>{const o=n[a]||0;return t+this.convertValue(o,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),a=this.sumItems(this.state.liabilities,"monthlyPayment");return e+a}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),a=this.sumItems(this.state.investmentAssets,"value");return e+a}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),a=this.sumItems(this.state.activeIncomes,"amount");return e+a}getAllExpenses(){const e=this.getLivingExpenses(),a=this.sumItems(this.state.otherExpenses,"amount");return e+a}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,a){this.setState({health:{...this.state.health,[e]:a}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const a={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,a]}})}addFatLog(e){const a={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,a]}})}saveRoutine(e){const a=this.state.health.routines,n=a.find(o=>o.id===e.id)?a.map(o=>o.id===e.id?e:o):[...a,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(a=>a.id!==e)}})}renameRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,name:a}:t)}})}updateExercise(e,a,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const o=[...n.exercises];return o[a]={...o[a],...t},{...n,exercises:o}}return n})}})}addExerciseToRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,exercises:[...t.exercises,{weight:50,reps:10,sets:4,...a}]}:t)}})}reorderRoutine(e,a){const t=[...this.state.health.routines],n=a==="up"?e-1:e+1;n<0||n>=t.length||([t[e],t[n]]=[t[n],t[e]],this.setState({health:{...this.state.health,routines:t}}))}reorderExercise(e,a,t){const n=this.state.health.routines.map(o=>{if(o.id===e){const i=[...o.exercises],r=t==="up"?a-1:a+1;return r<0||r>=i.length?o:([i[a],i[r]]=[i[r],i[a]],{...o,exercises:i})}return o});this.setState({health:{...this.state.health,routines:n}})}deleteExerciseFromRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>{if(t.id===e){const n=[...t.exercises];return n.splice(a,1),{...t,exercises:n}}return t})}})}addCalorieLog(e,a=""){const t={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:a};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,t]}})}logExercise(e,a,t){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:a,date:Date.now(),rating:parseInt(t)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,a){const n=(this.state.health.exerciseLogs||[]).filter(d=>d.routineId===e&&d.exerciseIndex===a);if(n.length===0)return{color:"green",lastDate:null};n.sort((d,g)=>g.date-d.date);const o=n[0],i=new Date,r=new Date(o.date),l=new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),p=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),c=Math.floor((l-p)/(1e3*60*60*24));return c===0?{color:"danger",status:"done_today",lastLog:o}:c===1?{color:"danger",status:"yesterday",lastLog:o}:c===2?{color:"tertiary",status:"day_before",lastLog:o}:{color:"success",status:"rested",lastLog:o}}addGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,a]})}toggleGoal(e){this.setState({goals:this.state.goals.map(a=>a.id===e?{...a,completed:!a.completed}:a)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(a=>a.id!==e)})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(a=>a.timeframe!==e||!a.completed)})}updateGoal(e,a){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,...a}:t)})}toggleSubGoal(e,a){const t=this.state.goals.find(o=>o.id===e);if(!t||!t.subGoals)return;const n=[...t.subGoals];n[a].completed=!n[a].completed,this.updateGoal(e,{subGoals:n})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,a){this.updateGoal(e,{color:a})}addEvent(e){const a={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,a]}),this.scheduleNotification(a)}deleteEvent(e){this.setState({events:this.state.events.filter(a=>a.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}addPerson(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({social:{...this.state.social,people:[...this.state.social.people,a]}}),a}updatePerson(e,a){this.setState({social:{...this.state.social,people:this.state.social.people.map(t=>t.id===e?{...t,...a}:t)}})}deletePerson(e){this.setState({social:{...this.state.social,people:this.state.social.people.filter(a=>a.id!==e)}})}movePerson(e,a){this.updatePerson(e,{columnId:a})}addSocialColumn(e){const a={id:crypto.randomUUID(),order:this.state.social.columns.length,...e};this.setState({social:{...this.state.social,columns:[...this.state.social.columns,a]}})}updateSocialColumn(e,a){this.setState({social:{...this.state.social,columns:this.state.social.columns.map(t=>t.id===e?{...t,...a}:t)}})}deleteSocialColumn(e){this.setState({social:{...this.state.social,columns:this.state.social.columns.filter(a=>a.id!==e),people:this.state.social.people.filter(a=>a.columnId!==e)}})}reorderSocialColumns(e){this.setState({social:{...this.state.social,columns:e}})}updateIdealLeadProfile(e){this.setState({social:{...this.state.social,idealLeadProfile:e}})}}const u=new Ve,qe=[{id:"finance",icon:"wallet",label:"Finanzas"},{id:"health",icon:"heart",label:"Salud"},{id:"goals",icon:"target",label:"Metas"},{id:"social",icon:"users",label:"Social"},{id:"menu",icon:"menu",label:"Menú"}];function me(s="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,a=qe.map(t=>`
        <div class="nav-item ${t.id===s?"active":""}" data-nav="${t.id}">
            ${v(t.icon,"nav-icon")}
            <span class="nav-label">${t.label}</span>
        </div>
    `).join("");return e+a}function ve(s){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",()=>{const t=a.dataset.nav;e.forEach(n=>n.classList.remove("active")),a.classList.add("active"),s&&s(t)})})}function f(s,e="$"){const a=Math.abs(s);let t=0,n=0;e==="₿"?(t=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(t=0,n=2);const o=new Intl.NumberFormat("en-US",{minimumFractionDigits:t,maximumFractionDigits:n}).format(a);return`${s<0?"-":""}${e}${o}`}function ge(s){return s==null?"0.0%":`${s>=0?"+":""}${s.toFixed(1)}%`}const Ke="https://api.coingecko.com/api/v3",y={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},ze=5*60*1e3;let W={data:null,timestamp:0,currency:""};const O=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:y.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:y.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:y.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:y.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:y.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:y.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:y.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:y.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:y.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:y.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:y.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:y.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:y.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:y.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:y.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:y.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:y.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:y.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:y.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:y.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:y.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:y.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:y.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:y.CRYPTO_ALTS,icon:"bitcoin"}];async function Ye(s="EUR"){if(W.data&&Date.now()-W.timestamp<ze&&W.currency===s)return console.log("[MarketService] Returning cached data"),W.data;const e=O.map(t=>t.cgId).filter(Boolean).join(","),a=`${Ke}/coins/markets?vs_currency=${s.toLowerCase()}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const t=await fetch(a),n=t.ok?await t.json():[],o=O.filter(l=>l.yahooId),i=await We(o),r=O.map(l=>{if(l.cgId){const p=n.find(c=>c.id===l.cgId);if(p)return{...l,price:p.current_price,image:p.image,change24h:p.price_change_percentage_24h_in_currency||p.price_change_percentage_24h||0,change7d:p.price_change_percentage_7d_in_currency||0,change30d:p.price_change_percentage_30d_in_currency||0,change1y:p.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&i[l.yahooId]){const p=i[l.yahooId],c=s==="USD"?1:.92;return{...l,price:p.price*c,change24h:p.change24h,change7d:p.change7d,change30d:p.change30d,change1y:p.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return W={data:r,timestamp:Date.now(),currency:s},r}catch(t){return console.error("Market fetch failed",t),O.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function We(s){const e={};return await Promise.all(s.map(async a=>{try{const t=`https://query1.finance.yahoo.com/v8/finance/chart/${a.yahooId}?interval=1d&range=1y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(t)}`,i=await(await fetch(n)).json(),r=JSON.parse(i.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],p=l.meta,d=l.indicators.quote[0].close.filter(Q=>Q!==null);if(d.length===0)throw new Error("No valid price data");const g=p.regularMarketPrice||d[d.length-1],h=p.chartPreviousClose||(d.length>1?d[d.length-2]:g),w=(g-h)/h*100,E=Math.max(0,d.length-6),k=d[E],b=(g-k)/k*100,A=Math.max(0,d.length-22),T=d[A],K=(g-T)/T*100,z=d[0],Y=(g-z)/z*100;e[a.yahooId]={price:g,change24h:isNaN(w)?0:w,change7d:isNaN(b)?0:b,change30d:isNaN(K)?0:K,change1y:isNaN(Y)?0:Y}}catch(t){console.warn(`Failed to fetch ${a.symbol} from Yahoo`,t),e[a.yahooId]=null}})),e}const Xe={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let Z=null,H=null;function $e(s,e){const a=Xe[e];if(!a){console.error("Unknown category:",e);return}const o=u.getState()[a.storeKey].find(r=>r.id===s);if(!o){console.error("Item not found:",s);return}Z=o,H=e;const i=document.createElement("div");i.className="modal-overlay",i.id="edit-modal",i.innerHTML=Qe(o,a),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("active")}),et(a)}const Je=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],Ze={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function Qe(s,e){const a=H==="investment"||H==="passive",t=Ze[H]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
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
        <label class="form-label">${H==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
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

      <div class="form-row">
          <div class="form-group" style="flex: 1.5;">
              <label class="form-label">Tipo</label>
              <select class="form-input form-select" id="edit-type">
                  ${t.map(o=>`<option value="${o.value}" ${o.value===s.type?"selected":""}>${o.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${Je.map(o=>`<option value="${o.value}" ${o.value===s.currency?"selected":""}>${o.label}</option>`).join("")}
                  </optgroup>
                  ${a?`
                  <optgroup label="Mercados Reales">
                      ${O.map(o=>`<option value="${o.symbol}" ${o.symbol===s.currency?"selected":""}>${o.name} (${o.symbol})</option>`).join("")}
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
          ${v("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function et(s){const e=document.getElementById("edit-modal"),a=document.getElementById("edit-modal-close"),t=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",o=>{o.target===e&&ee()}),a.addEventListener("click",ee),t.addEventListener("click",()=>tt(s)),n.addEventListener("click",()=>at(s))}function tt(s){var p,c,d,g,h,w,E,k,b;const e=(c=(p=document.getElementById("edit-name"))==null?void 0:p.value)==null?void 0:c.trim(),a=(d=document.getElementById("edit-type"))==null?void 0:d.value,t=(g=document.getElementById("edit-currency"))==null?void 0:g.value,n=(w=(h=document.getElementById("edit-details"))==null?void 0:h.value)==null?void 0:w.trim(),o=parseFloat((E=document.getElementById("edit-value"))==null?void 0:E.value)||0,i=parseFloat((k=document.getElementById("edit-amount"))==null?void 0:k.value)||0,r=parseFloat((b=document.getElementById("edit-monthly"))==null?void 0:b.value)||0;if(!e){m.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:a,currency:t,details:n};s.fields.includes("value")&&(l.value=o),s.fields.includes("amount")&&(l.amount=i),s.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),s.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),u[s.updateMethod](Z.id,l),ee()}function at(s){m.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${Z.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(u[s.deleteMethod](Z.id),m.toast("Eliminado correctamente","info"),ee())})}function ee(){const s=document.getElementById("edit-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300)),Z=null,H=null}function he(){const s=u.getState(),e=s.currencySymbol,a=u.getPassiveIncome(),t=u.getLivingExpenses(),n=u.getNetPassiveIncome(),o=u.getInvestmentAssetsValue(),i=u.getTotalLiabilities(),r=u.getNetWorth(),l=u.getAllIncomes(),p=u.getAllExpenses(),c=u.getNetIncome();return`
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
            <span class="stat-value positive">${f(a,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${f(t,e)}</span>
          </div>
        </div>
        
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${n<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${v("piggyBank","card-icon")}
          </div>
          <div class="highlight-value ${n<0?"highlight-value-negative":""}">${f(n,e)}</div>
          <div class="highlight-label ${n<0?"highlight-label-negative":""}">
            ${n>=0?"🎉 ¡Libertad financiera alcanzada!":`Faltan ${f(Math.abs(n),e)}/mes`}
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
            <div class="summary-value text-primary-accent">${f(o,e)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${f(i,e)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${v("scale","card-icon")}
          </div>
          <div class="stat-value ${r>=0?"positive":"negative"}" style="font-size: 32px; font-weight: 800; text-align: center; margin-top: var(--spacing-sm);">
            ${f(r,e)}
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
          <span class="stat-value positive">${f(l,e)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot expense"></span>
            Todos los Gastos
          </span>
          <span class="stat-value negative">${f(p,e)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${c>=0?"positive":"negative"}" style="font-size: 20px;">
            ${f(c,e)}
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

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${st(s)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${nt(s)}

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
  `}function st(s){const e=[...s.passiveAssets,...s.investmentAssets],a=s.liabilities;if(e.length===0)return"";const t={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(c=>{const d=u.convertValue(c.value||0,c.currency||"EUR");c.currency==="BTC"?t.Bitcoin.value+=d:c.currency==="ETH"||c.currency==="XRP"||c.type==="crypto"?t.Altcoins.value+=d:c.type==="property"||c.type==="rental"?t.Inmuebles.value+=d:c.type==="stocks"||c.type==="etf"||c.currency==="SP500"?t.Bolsa.value+=d:c.currency==="GOLD"?t.Oro.value+=d:t["Otros/Efe."].value+=d});const n=a.filter(c=>c.type==="mortgage").reduce((c,d)=>c+u.convertValue(d.amount||0,d.currency||"EUR"),0);t.Inmuebles.value=Math.max(0,t.Inmuebles.value-n),s.hideRealEstate&&(t.Inmuebles.value=0);const o=Object.entries(t).filter(([c,d])=>d.value>0).sort((c,d)=>d[1].value-c[1].value),i=o.reduce((c,[d,g])=>c+g.value,0);if(i===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${s.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=o.map(([c,d])=>{const g=d.value/i*100,h=r;return r+=g,{name:c,percentage:g,color:d.color,start:h}}),p=l.map(c=>`${c.color} ${c.start}% ${c.start+c.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${s.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${p});">
          <div class="pie-center">
            <div class="pie-total">${f(i,s.currencySymbol)}</div>
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
  `}function nt(s){const e=[...s.passiveAssets.map(t=>({...t,category:"passive"})),...s.investmentAssets.map(t=>({...t,category:"investment"})),...s.liabilities.map(t=>({...t,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${v("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const a=s.currencySymbol;return`
    <div class="asset-list">
      ${e.map(t=>{const n=ot(t.currency||t.type),o=it(t.currency||t.type),i=t.category==="liability",r=t.value||t.amount||0,l=u.convertValue(r,t.currency||"EUR");let p="";if(t.currency!==s.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[t.currency]||t.currency;p=`<div class="asset-original-value">${r} ${d}</div>`}return`
          <div class="asset-item" data-id="${t.id}" data-category="${t.category}">
            <div class="asset-icon-wrapper ${n}">
              ${v(o,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${t.name}</div>
              <div class="asset-details">${t.details||t.type||""}</div>
              ${p}
            </div>
            <div>
              <div class="asset-value ${i?"text-warning":""}">
                ${i?"-":""}${f(l,a)}
              </div>
              ${t.monthlyIncome?`<div class="asset-yield">+${f(u.convertValue(t.monthlyIncome,t.currency),a)}/mes</div>`:""}
              ${t.monthlyPayment?`<div class="asset-yield text-negative">-${f(u.convertValue(t.monthlyPayment,t.currency),a)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function ot(s){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt"}[s]||"cash"}function it(s){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard"}[s]||"dollarSign"}function ye(){document.querySelectorAll(".asset-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=t.dataset.category;$e(n,o)})});const e=document.getElementById("toggle-real-estate");e&&e.addEventListener("change",()=>{u.toggleRealEstate()});const a=document.getElementById("display-currency-select");a&&a.addEventListener("change",t=>{u.setCurrency(t.target.value)})}let _=10,N=7,j=null,F=null;function rt(){const e=u.getState().currencySymbol,a=u.getNetWorth(),n=u.getNetIncome()*12,o=j!==null?j:a,i=F!==null?F:n,r=Ae(o,i,N,_);return`
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
          <div class="compound-input-hint">Patrimonio actual: ${f(a,e)}</div>
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
          <div class="compound-input-hint">Ingreso neto anual: ${f(n,e)}</div>
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
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${_}">
            <span class="slider-value" id="years-value">${_} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${_} años</span>
          ${v("trendingUp","card-icon")}
        </div>
        <div class="highlight-value" id="future-value">${f(r.finalValue,e)}</div>
        <div class="highlight-label" id="growth-label">
          ${r.totalGrowth>=0?"📈":"📉"} ${r.growthMultiple.toFixed(1)}x tu capital inicial
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
          <span class="stat-value neutral" id="initial-capital">${f(o,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Total Aportado
          </span>
          <span class="stat-value ${r.totalContributions>=0?"positive":"negative"}" id="total-contributed">${f(r.totalContributions,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot" style="background: var(--accent-secondary);"></span>
            Intereses Generados
          </span>
          <span class="stat-value" style="color: var(--accent-secondary);" id="total-interest">${f(r.totalInterest,e)}</span>
        </div>
        
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Valor Final
          </span>
          <span class="stat-value positive" style="font-size: 20px;" id="final-value-breakdown">${f(r.finalValue,e)}</span>
        </div>
      </div>
      
      <!-- YEAR BY YEAR PROJECTION -->
      <div class="section-divider">
        <span class="section-title">Proyección Año a Año</span>
      </div>
      
      <div class="projection-chart" id="projection-chart">
        ${Ce(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${Le(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function Ae(s,e,a,t){const n=a/100,o=[];let i=s,r=0,l=0;for(let p=1;p<=t;p++){const c=i,d=i*n;i+=d+e,r+=e,l+=d,o.push({year:p,startBalance:c,contribution:e,interest:d,endBalance:i,totalContributions:r,totalInterest:l})}return{finalValue:i,totalContributions:r,totalInterest:l,totalGrowth:i-s,growthMultiple:s>0?i/s:0,yearlyBreakdown:o}}function Ce(s,e){if(s.length===0)return"";const a=Math.max(...s.map(n=>Math.abs(n.endBalance))),t=s.map((n,o)=>{const i=o/(s.length-1)*100,r=100-n.endBalance/a*100;return`${i},${r}`});return`
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
        <span>Año ${Math.floor(s.length/2)}</span>
        <span>Año ${s.length}</span>
      </div>
    </div>
  `}function Le(s,e){const a=[];for(let t=0;t<s.length;t++){const n=s[t];(t<5||(t+1)%5===0||t===s.length-1)&&a.push(n)}return`
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
              <td class="${t.endBalance>=0?"positive":"negative"}">${f(t.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${f(t.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function lt(s){const e=document.getElementById("back-to-finance"),a=document.getElementById("rate-slider"),t=document.getElementById("years-slider"),n=document.getElementById("principal-input"),o=document.getElementById("contribution-input"),i=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",s),n&&n.addEventListener("input",l=>{j=parseFloat(l.target.value)||0,G()}),o&&o.addEventListener("input",l=>{F=parseFloat(l.target.value)||0,G()}),i&&i.addEventListener("click",()=>{j=null;const l=u.getNetWorth();n.value=l,G()}),r&&r.addEventListener("click",()=>{F=null;const l=u.getNetIncome()*12;o.value=l,G()}),a&&a.addEventListener("input",l=>{N=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${N}%`,G()}),t&&t.addEventListener("input",l=>{_=parseInt(l.target.value),document.getElementById("years-value").textContent=`${_} años`,G()})}function G(){const e=u.getState().currencySymbol,a=j!==null?j:u.getNetWorth(),t=F!==null?F:u.getNetIncome()*12,n=Ae(a,t,N,_),o=document.getElementById("future-value"),i=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),p=document.getElementById("total-contributed"),c=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),g=document.getElementById("projection-chart"),h=document.getElementById("projection-table");o&&(o.textContent=f(n.finalValue,e)),i&&(i.textContent=`Valor Futuro en ${_} años`),r&&(r.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=f(a,e)),p&&(p.textContent=f(n.totalContributions,e),p.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),c&&(c.textContent=f(n.totalInterest,e)),d&&(d.textContent=f(n.finalValue,e)),g&&(g.innerHTML=Ce(n.yearlyBreakdown)),h&&(h.innerHTML=Le(n.yearlyBreakdown,e))}function ct(){_=10,N=7,j=null,F=null}let X=u.getState().lastMarketData||[],J=!1,S={key:"price",direction:"desc"},Te="";function dt(){const s=u.getState(),e=s.currency||"EUR",a=s.currencySymbol||"€";if((X.length===0||Te!==e)&&(J||Be(),X.length===0))return`
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
                            ${v("chevronLeft")}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${J?`
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

            ${t.map(n=>{const o=X.filter(i=>i.category===n);return o.length===0?"":ut(n,o,a)}).join("")}
        </div>
    `}function ut(s,e,a){const t=[...e].sort((n,o)=>{let i=n[S.key],r=o[S.key];return typeof i=="string"&&(i=i.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),i<r?S.direction==="asc"?-1:1:i>r?S.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${s}
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
                            ${t.map(n=>`
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${n.image?`<img src="${n.image}" alt="${n.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`:`<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${v(n.icon||"dollarSign")}
                                                </div>`}
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${n.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${n.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?f(n.price,a):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?ge(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?ge(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function Be(){const e=u.getState().currency||"EUR";J||(J=!0,Te=e,X=await Ye(e),u.saveMarketData(X),J=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function pt(s){const e=document.getElementById("market-back");e&&e.addEventListener("click",s),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.sort;S.key===o?S.direction=S.direction==="asc"?"desc":"asc":(S.key=o,S.direction="desc",o==="name"&&(S.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.curr;u.setCurrency(o),Be()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class fe{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const a=this.getApiKey();if(!a)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],o=e.type,i=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:i},{inline_data:{mime_type:o,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const d=await l.json();throw new Error(((r=d.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const c=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(c)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((a,t)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>a(n.result),n.onerror=o=>t(o)})}}let V=localStorage.getItem("life-dashboard/health_current_tab")||"exercise";function mt(){const s=u.getState(),{health:e}=s;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Salud y Forma Física</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${V==="exercise"?"active":""}" data-tab="exercise">
            ${v("zap")} Ejercicio
        </button>
        <button class="health-tab-btn ${V==="diet"?"active":""}" data-tab="diet">
            ${v("apple")} Dieta
        </button>
      </div>

      <div id="health-tab-content">
        ${V==="exercise"?vt(e):gt(e)}
      </div>

    </div>
    `}function vt(s){return`
      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${s.routines.map((e,a)=>`
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${v("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="up">${v("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="down">${v("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${v("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${a}" data-name="${e.name}">
                    ${v("moreVertical")}
                </button>
            </header>

            <div class="exercise-list-health">
                ${e.exercises.map((t,n)=>{const o=u.getExerciseStatus(e.id,n),i=`var(--accent-${o.color})`,r=o.status==="done_today";return`
                    <div class="exercise-item-health ${r?"exercise-done":""}">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot-wear" style="background-color: ${i}; box-shadow: 0 0 10px ${i};"></div>
                            <div class="ex-health-info">
                                <div class="ex-health-name-row">
                                    <span class="ex-health-name clickable rename-exercise" data-routine="${e.id}" data-index="${n}" data-current="${t.name}">${t.name}</span>
                                    <div class="ex-reorder-btns desktop-only">
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="up">${v("chevronUp")}</button>
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="down">${v("chevronDown")}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${e.id}" data-index="${n}">${t.weight||50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${e.id}" data-index="${n}">${t.reps||10} reps</span>
                                    ${o.lastLog?`
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${ht(o.lastLog.rating)}</span>
                                    `:""}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            ${r?`
                                <div class="exercise-done-badge-solid">
                                    ${v("check","done-icon-solid")}
                                </div>
                            `:`
                                <button class="btn btn-secondary btn-icon-only log-stars-btn" data-rid="${e.id}" data-idx="${n}" title="Marcar como hecho">
                                    <span style="font-size: 20px;">🏋️‍♂️</span>
                                </button>
                            `}
                            <button class="icon-btn mobile-only ex-more-btn" data-routine="${e.id}" data-index="${n}" data-name="${t.name}">
                                ${v("moreVertical")}
                            </button>
                            <button class="ex-delete-mini desktop-only" data-routine="${e.id}" data-index="${n}" title="Eliminar">${v("trash")}</button>
                        </div>
                    </div>
                    `}).join("")}
            </div>
            <div class="add-ex-row" style="margin-top: var(--spacing-md);">
                <button class="btn btn-secondary add-ex-btn w-full" data-id="${e.id}">
                    ${v("plus")} Agregar Ejercicio
                </button>
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-success add-routine-btn w-full" id="add-routine-btn">
                ${v("plus")} Nueva Rutina
            </button>
        </div>
      </div>
    `}function gt(s){return`
      <!-- METRICS: WEIGHT & FAT -->
      <div class="section-divider">
        <span class="section-title">Métricas de Cuerpo</span>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-2xl);">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${s.weightLogs.length>0?s.weightLogs[s.weightLogs.length-1].weight:"--"} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${s.fatLogs.length>0&&s.fatLogs[s.fatLogs.length-1].fat||"--"} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${s.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${s.fatGoal||"--"} %</div>
          <div class="summary-label">Objetivo Grasa</div>
        </div>
      </div>
      
      <div class="card ai-calorie-card" style="margin-bottom: var(--spacing-2xl); display: flex; flex-direction: column; align-items: center;">
          <div class="summary-value" style="font-size: 28px;">${yt(s)} kcal</div>
          <div class="summary-label">Calorías Registradas Hoy</div>
          <button class="btn btn-primary" id="ai-scan-photo" style="margin-top: var(--spacing-md); width: auto; padding: 10px 20px;">
             ${v("camera")} Escanear Comida (AI)
          </button>
      </div>
    `}function ht(s){return s<=2?"😰":s<=4?"😐":"😄"}function yt(s){const e=new Date().toDateString();return(s.calorieLogs||[]).filter(a=>new Date(a.date).toDateString()===e).reduce((a,t)=>a+(t.calories||0),0)}function ft(){document.querySelectorAll(".health-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.tab;e!==V&&(V=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),V==="exercise"?bt():wt()}function bt(){var s;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=await m.prompt("Nuevo Ejercicio","Nombre del ejercicio:");t&&(u.addExerciseToRoutine(a,{name:t}),m.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=e.dataset.current,n=await m.prompt("Editar Rutina","Nombre de la rutina:",t);n&&n!==t&&(u.renameRoutine(a,n),m.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id;await m.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(a),m.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.id,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await m.select(`Menú: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await m.prompt("Editar Rutina","Nuevo nombre:",o);l&&l!==o&&(u.renameRoutine(t,l),m.toast("Rutina renombrada"))}else r==="up"?u.reorderRoutine(n,"up"):r==="down"?u.reorderRoutine(n,"down"):r==="delete"&&await m.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(t),m.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index),n=e.dataset.current,o=await m.prompt("Renombrar Ejercicio","Nuevo nombre:",n);o&&o!==n&&(u.updateExercise(a,t,{name:o}),m.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index);await m.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(a,t),m.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await m.select(`Ejercicio: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await m.prompt("Renombrar Ejercicio","Nuevo nombre:",o);l&&l!==o&&(u.updateExercise(t,n,{name:l}),m.toast("Ejercicio renombrado"))}else r==="up"?u.reorderExercise(t,n,"up"):r==="down"?u.reorderExercise(t,n,"down"):r==="delete"&&await m.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(t,n),m.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=parseInt(e.dataset.index),n=e.dataset.dir;u.reorderRoutine(t,n)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.dir;u.reorderExercise(t,n,o)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=10;r<=150;r+=2.5)o.push(`${r}kg`);const i=await m.select("Seleccionar Peso","Elige el peso para este ejercicio:",o,4);if(i){const r=parseFloat(i.replace("kg",""));u.updateExercise(t,n,{weight:r}),m.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=7;r<=20;r++)o.push(`${r} reps`);const i=await m.select("Seleccionar Reps","Elige las repeticiones objetivo:",o,4);if(i){const r=parseInt(i.replace(" reps",""));u.updateExercise(t,n,{reps:r}),m.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.rid,n=parseInt(e.dataset.idx),o=await m.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");o&&(u.logExercise(t,n,o),m.toast("Ejercicio registrado","success"))})}),(s=document.getElementById("add-routine-btn"))==null||s.addEventListener("click",async()=>{const e=await m.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(u.saveRoutine({name:e,exercises:[]}),m.toast("Rutina creada"))})}function wt(){var s,e,a,t,n;(s=document.getElementById("log-weight-btn"))==null||s.addEventListener("click",async()=>{const o=await m.prompt("Registrar Peso","Peso actual (kg):");o&&(u.addWeightLog(parseFloat(o)),m.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const o=await m.prompt("Registrar Grasa","Porcentaje de grasa (%):");o&&(u.addFatLog(parseFloat(o)),m.toast("Grasa registrada"))}),(a=document.getElementById("set-weight-goal-btn"))==null||a.addEventListener("click",async()=>{const o=u.getState().health.weightGoal,i=await m.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",o);i&&(u.updateHealthGoal("weightGoal",parseFloat(i)),m.toast("Objetivo actualizado"))}),(t=document.getElementById("set-fat-goal-btn"))==null||t.addEventListener("click",async()=>{const o=u.getState().health.fatGoal,i=await m.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",o);i&&(u.updateHealthGoal("fatGoal",parseFloat(i)),m.toast("Objetivo actualizado"))}),(n=document.getElementById("ai-scan-photo"))==null||n.addEventListener("click",()=>{const o=document.createElement("input");o.type="file",o.accept="image/*",o.onchange=async r=>{var p;const l=r.target.files[0];if(l){if(!fe.hasKey()){if(await m.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(p=document.querySelector('[data-nav="settings"]'))==null||p.click();return}m.toast("Usando simulación...","info"),i();return}try{m.toast("Analizando con Gemini...","info");const c=await fe.analyzeFood(l);await m.confirm("IA Detectada",`Identificado: "${c.name}" (${c.calories} kcal). ¿Registrar?`)&&(u.addCalorieLog(c.calories,`${c.name} (AI)`),m.toast("Calorías registradas"))}catch(c){m.alert("Error IA",c.message)}}};function i(){setTimeout(async()=>{const r={name:"Bowl Saludable",calories:450};await m.confirm("IA Simulada",`Detectado "${r.name}" con ${r.calories} kcal. ¿Registrar?`)&&(u.addCalorieLog(r.calories,r.name),m.toast("Registrado"))},1e3)}o.click()})}const oe=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];function Et(){const s=u.getState(),{goals:e}=s;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas y Enfoque</h1>
        <p class="page-subtitle">Organiza tus prioridades con colores y objetivos dinámicos</p>
      </header>

      <div class="goals-grid-layout">
        ${[{id:"day",label:"Hoy",icon:"zap",color:"#FFD700"},{id:"week",label:"Semana",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Año 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Largo Plazo",icon:"trendingUp",color:"#EF4444"}].map(t=>{const n=e.filter(l=>l.timeframe===t.id),o=n.filter(l=>l.completed).length,i=n.length,r=i>0?o/i*100:0;return`
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${t.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${t.color}22; color: ${t.color}">${v(t.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${t.label}</span>
                        <span class="column-stats">${o}/${i}</span>
                    </div>
                    ${o>0?`
                        <button class="btn-clear-completed" data-tf="${t.id}" title="Limpiar completadas">
                            ${v("trash")}
                        </button>
                    `:""}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${r}%; background: ${t.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${t.id}">
                    ${kt(n,t.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${t.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${t.id}">
                        ${v("plus")}
                    </button>
                </div>
            </div>
          </div>
        `}).join("")}
      </div>
    </div>
  `}function kt(s,e){return s.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${v("package")}</div>
            </div>
        `:[...s].sort((t,n)=>t.completed!==n.completed?t.completed?1:-1:t.order!==void 0&&n.order!==void 0?t.order-n.order:(n.createdAt||0)-(t.createdAt||0)).map(t=>{const n=t.subGoals&&t.subGoals.length>0,o=n?t.subGoals.filter(r=>r.completed).length/t.subGoals.length*100:0,i=t.color||"#ffffff";return`
        <div class="goal-card-premium ${t.completed?"is-completed":""}" 
             data-id="${t.id}" 
             draggable="true"
             style="border-left: 4px solid ${i};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${t.id}" style="border-color: ${i}aa; background: ${t.completed?i:"transparent"}">
                    ${t.completed?v("check","check-icon-white"):""}
                </div>
                <div class="goal-main-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div class="goal-title-premium clickable-edit-goal" 
                             data-id="${t.id}" 
                             style="color: ${i}; font-weight: 700; flex: 1;">${t.title}</div>
                        <button class="open-color-picker" data-id="${t.id}" 
                                style="width: 14px; height: 14px; background: ${i}; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; margin-top: 4px;" 
                                title="Cambiar color"></button>
                    </div>
                    
                    <div class="goal-header-row" style="margin-top: 4px;">
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${t.id}" title="Hito">${v("plus")}</button>
                            <button class="action-btn-mini delete-goal" data-id="${t.id}" title="Borrar">${v("trash")}</button>
                        </div>
                    </div>
                    
                    ${n?`
                        <div class="subgoals-list-premium">
                            ${t.subGoals.map((r,l)=>`
                                <div class="subgoal-item-premium ${r.completed?"sub-done":""} toggle-subgoal" data-id="${t.id}" data-idx="${l}">
                                    <div class="sub-check" style="color: ${i}">${v(r.completed?"check":"plus","sub-check-svg")}</div>
                                    <span class="sub-title" style="color: ${i}ee">${r.title}</span>
                                </div>
                            `).join("")}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${o}%; background: ${i}"></div>
                            </div>
                        </div>
                    `:""}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${t.id}">
                        ${oe.map(r=>`
                            <div class="goal-color-dot ${r===i?"active":""} set-goal-color" 
                                 data-id="${t.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function xt(){document.querySelectorAll(".btn-clear-completed").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=t.dataset.tf;await m.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(u.deleteCompletedGoals(o),m.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id;u.toggleGoal(o)})}),document.querySelectorAll(".open-color-picker").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=document.getElementById(`colors-${o}`);document.querySelectorAll(".color-selector-overlay").forEach(r=>{r.id!==`colors-${o}`&&r.classList.add("hidden")}),i==null||i.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=t.dataset.color;u.updateGoalColor(o,i),m.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=parseInt(t.dataset.idx);u.toggleSubGoal(o,i)})}),document.querySelectorAll(".delete-goal").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation(),await m.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(u.deleteGoal(t.dataset.id),m.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=t.dataset.id,i=await m.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(i){const l=[...u.getState().goals.find(p=>p.id===o).subGoals||[],{title:i,completed:!1}];u.updateGoal(o,{subGoals:l}),m.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(t=>{t.addEventListener("click",async()=>{const n=t.dataset.id,o=t.textContent,i=await m.prompt("Editar Meta","Actualiza el texto:",o);i&&i!==o&&u.updateGoal(n,{title:i})})}),document.querySelectorAll(".quick-add-input-premium").forEach(t=>{t.addEventListener("keypress",n=>{if(n.key==="Enter"&&t.value.trim()){const o=t.dataset.timeframe;u.addGoal({title:t.value.trim(),timeframe:o,color:oe[0]}),t.value="",m.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.timeframe,o=t.previousElementSibling;o&&o.value.trim()?(u.addGoal({title:o.value.trim(),timeframe:n,color:oe[0]}),o.value="",m.toast("Creada")):o&&o.focus()})});const s=document.querySelectorAll(".goals-list-premium");let e=null;document.querySelectorAll(".goal-card-premium").forEach(t=>{t.addEventListener("dragstart",n=>{e=t.dataset.id,t.classList.add("dragging"),n.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(n=>n.classList.remove("drag-over"))})}),s.forEach(t=>{t.addEventListener("dragover",n=>{n.preventDefault(),t.classList.add("drag-over"),n.dataTransfer.dropEffect="move"}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",n=>{n.preventDefault(),t.classList.remove("drag-over");const o=t.dataset.timeframe,i=[...u.getState().goals],r=i.findIndex(d=>d.id===e);if(r===-1)return;const l={...i[r]};l.timeframe!==o&&(l.timeframe=o),i.splice(r,1);const p=a(t,n.clientY);if(p==null)i.push(l);else{const d=p.dataset.id,g=i.findIndex(h=>h.id===d);i.splice(g,0,l)}const c=i.map((d,g)=>({...d,order:g}));u.reorderGoals(c),m.toast("Orden actualizado")})});function a(t,n){return[...t.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((i,r)=>{const l=r.getBoundingClientRect(),p=n-l.top-l.height/2;return p<0&&p>i.offset?{offset:p,element:r}:i},{offset:Number.NEGATIVE_INFINITY}).element}}let R=new Date;function St(){const s=u.getState(),{events:e}=s;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Agenda</h1>
            <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
        </div>
        <button class="btn btn-primary" id="add-event-manual-btn" style="width: auto; padding: 10px 20px;">
            ${v("plus")} Nuevo Evento
        </button>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation prev-month">${v("chevronLeft")}</button>
                <span class="current-month">${$t()}</span>
                <button class="icon-btn-navigation next-month">${v("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${It(e)}
            </div>
        </div>

        <div class="events-list-container" style="margin-top: var(--spacing-xl);">
            <div class="section-divider">
                <span class="section-title">Próximos Eventos</span>
            </div>
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${v("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                    </div>
                `:e.filter(a=>{const t=new Date(a.date);return t.getMonth()===R.getMonth()&&t.getFullYear()===R.getFullYear()}).sort((a,t)=>new Date(a.date)-new Date(t.date)).map(a=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${a.category||"event"}">
                            ${v(Ct(a.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${a.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${At(a.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${a.time}</span>
                                ${a.repeat!=="none"?`<span class="event-repeat-tag">${Lt(a.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${a.id}">
                            ${v("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function It(s){const e=R.getMonth(),a=R.getFullYear(),t=new Date().getDate(),n=new Date().getMonth()===e&&new Date().getFullYear()===a,o=new Date(a,e+1,0).getDate(),i=new Date(a,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;s.forEach(c=>{const d=new Date(c.date);d.getMonth()===e&&d.getFullYear()===a&&l.add(d.getDate())});let p=r.map(c=>`<div class="calendar-day-label">${c}</div>`).join("");for(let c=0;c<i;c++)p+='<div class="calendar-day empty"></div>';for(let c=1;c<=o;c++){const d=n&&c===t,g=l.has(c);p+=`
            <div class="calendar-day ${d?"today":""} ${g?"has-event":""}">
                ${c}
                ${g?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return p}function $t(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][R.getMonth()]} ${R.getFullYear()}`}function At(s){const e={day:"numeric",month:"short"};return new Date(s).toLocaleDateString("es-ES",e).toUpperCase()}function Ct(s){switch(s){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function Lt(s){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[s]||""}function Tt(){var s,e,a;(s=document.querySelector(".prev-month"))==null||s.addEventListener("click",()=>{R.setMonth(R.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{R.setMonth(R.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(t=>{t.addEventListener("click",async()=>{await m.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(u.deleteEvent(t.dataset.id),m.toast("Evento eliminado"))})}),(a=document.getElementById("add-event-manual-btn"))==null||a.addEventListener("click",async()=>{const t=await m.prompt("Nuevo Evento","Título del evento:");if(!t)return;const n=await m.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!n)return;const o=await m.prompt("Hora","Formato HH:MM:","10:00");if(!o)return;const i=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await m.select("Categoría","Tipo de evento:",i,0);u.addEvent({title:t,date:n,time:o,category:r||"event",repeat:"none"}),m.toast("Evento agendado","success")})}function Bt(){const s=u.getState(),e=s.currencySymbol,a=s.livingExpenses,t=s.otherExpenses||[],n=s.liabilities,o=u.sumItems(a,"amount"),i=u.sumItems(t,"amount"),r=u.sumItems(n,"monthlyPayment"),l=o+i+r,p=[...(a||[]).map(c=>({...c,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(t||[]).map(c=>({...c,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(c=>c.monthlyPayment>0).map(c=>({...c,amount:c.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((c,d)=>d.amount-c.amount);return`
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="back-btn" id="back-to-finance">
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
            ${f(l,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${f(o,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${f(r,e)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${f(i,e)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${Dt(p,s)}

    </div>
  `}function Dt(s,e){if(s.length===0)return`
            <div class="empty-state">
                ${v("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const a=e.currencySymbol;return`
        <div class="asset-list">
            ${s.map(t=>{const n=u.convertValue(t.amount,t.currency||"EUR"),o=Rt(t.category);return`
                <div class="asset-item expense-item" data-id="${t.id}" data-category="${t.category}">
                    <div class="asset-icon-wrapper expense">
                        ${v(o,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${t.name}</div>
                        <div class="asset-details">${t.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${f(n,a)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function Rt(s){switch(s){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function Mt(s){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",s),document.querySelectorAll(".expense-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=t.dataset.category;$e(n,o)})})}const Pt="modulepreload",_t=function(s){return"/life-dashboard/"+s},be={},we=function(e,a,t){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),r=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(a.map(l=>{if(l=_t(l),l in be)return;be[l]=!0;const p=l.endsWith(".css"),c=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":Pt,p||(d.as="script"),d.crossOrigin="",d.href=l,r&&d.setAttribute("nonce",r),document.head.appendChild(d),p)return new Promise((g,h)=>{d.addEventListener("load",g),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return n.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function Ut(){const s=x.isBioEnabled(),e=L.hasToken();return`
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
            <p>Life Dashboard Pro v1.0.75</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Ot(){var t,n,o,i,r,l,p;(t=document.getElementById("toggle-bio"))==null||t.addEventListener("change",async c=>{if(c.target.checked){const g=await m.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(g)try{await x.registerBiometrics(g),m.toast("Biometría activada correctamente")}catch(h){await m.alert("Error",h.message),c.target.checked=!1}else c.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),m.toast("Biometría desactivada","info")});const s=document.getElementById("btn-install-pwa");s&&setTimeout(()=>{if(window.deferredPrompt){const c=document.getElementById("install-pwa-card");c&&(c.style.display="block"),s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:d}=await window.deferredPrompt.userChoice;if(d==="accepted"){m.toast("Instalando aplicación...");const g=document.getElementById("install-pwa-card");g&&(g.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("sync-drive-btn"))==null||n.addEventListener("click",async()=>{const c=document.getElementById("sync-drive-btn"),d=L.hasToken(),g=c.innerHTML;try{if(c.innerHTML='<div class="loading-spinner-sm"></div>',c.style.pointerEvents="none",d){const h=x.getVaultKey();await L.pushData(u.getState(),h),m.toast("Bóveda actualizada en Drive")}else{await L.authenticate();const h=x.getVaultKey(),w=await L.pullData(h).catch(()=>null);if(w&&await m.confirm("Respaldo Encontrado","Hemos detectado una bóveda existente en Google Drive. ¿Qué deseas hacer con tus datos?","Recuperar de la Nube","Sobreescribir Nube")){u.setState(w),await u.saveState(),m.toast("Datos recuperados correctamente"),setTimeout(()=>window.location.reload(),800);return}await L.pushData(u.getState(),h),m.toast("Google Drive conectado y sincronizado")}typeof window.reRender=="function"&&window.reRender()}catch(h){if(console.error(h),h.message&&(h.message.includes("Contraseña incorrecta")||h.message.includes("corruptos"))){if(await m.confirm("Error de Decifrado","La contraseña actual no coincide con la del backup en la nube. ¿Deseas borrar los datos en Drive para empezar de cero?","Borrar Datos Nube","Cancelar"))try{await L.deleteBackup(),m.toast("Datos de Drive borrados");const E=x.getVaultKey();await L.pushData(u.getState(),E),m.toast("Google Drive sincronizado (Nueva Bóveda)")}catch{m.alert("Error","No se pudieron borrar los datos de Drive.")}}else m.alert("Error",h.message||(typeof h=="object"?JSON.stringify(h):"Error al conectar con Google"))}finally{c.innerHTML=g,c.style.pointerEvents="auto"}}),(o=document.getElementById("export-data-btn"))==null||o.addEventListener("click",async()=>{try{m.toast("Preparando archivo encriptado...","info");const c=u.getState(),d=x.getVaultKey(),{SecurityService:g}=await we(async()=>{const{SecurityService:A}=await Promise.resolve().then(()=>de);return{SecurityService:A}},void 0),h=await g.encrypt(c,d),w=new Blob([JSON.stringify(h)],{type:"application/octet-stream"}),E=URL.createObjectURL(w),k=document.createElement("a"),b=new Date().toISOString().split("T")[0];k.href=E,k.download=`life_dashboard_backup_${b}.bin`,document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(E),m.toast("Backup exportado correctamente")}catch(c){console.error("Export error:",c),m.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),a=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{a==null||a.click()}),a==null||a.addEventListener("change",async c=>{var h;const d=(h=c.target.files)==null?void 0:h[0];if(!d)return;if(!await m.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){a.value="";return}try{const w=await d.text(),E=JSON.parse(w),k=x.getVaultKey(),{SecurityService:b}=await we(async()=>{const{SecurityService:T}=await Promise.resolve().then(()=>de);return{SecurityService:T}},void 0),A=await b.decrypt(E,k);if(A)u.setState(A),await u.saveState(),m.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(w){console.error("Import error:",w),m.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{a.value=""}}),(i=document.getElementById("btn-logout"))==null||i.addEventListener("click",async()=>{await m.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(x.logout(),window.location.reload())}),(r=document.getElementById("btn-force-update"))==null||r.addEventListener("click",async()=>{if(await m.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const d=await caches.keys();for(let g of d)await caches.delete(g)}catch(d){console.error("Error clearing cache",d)}window.location.reload(!0)}}),(l=document.getElementById("btn-save-gemini"))==null||l.addEventListener("click",()=>{var d;const c=(d=document.getElementById("gemini-api-key"))==null?void 0:d.value;c!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",c.trim()),m.toast("API Key de Gemini guardada"))}),(p=document.getElementById("btn-factory-reset"))==null||p.addEventListener("click",async()=>{if(await m.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const d="life-dashboard/";if(Object.keys(localStorage).forEach(g=>{g.startsWith(d)&&localStorage.removeItem(g)}),Object.keys(sessionStorage).forEach(g=>{g.startsWith(d)&&sessionStorage.removeItem(g)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(h=>window.indexedDB.deleteDatabase(h.name)),navigator.serviceWorker){const g=await navigator.serviceWorker.getRegistrations();for(let h of g)h.unregister()}m.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.origin+"?reset="+Date.now()},1e3)}})}function Nt(){return`
    <div class="stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Menú</h1>
        </header>

        <div class="menu-grid">
            <button class="menu-card" id="open-calendar">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);">
                    ${v("calendar")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Agenda</div>
                    <div class="menu-desc">Eventos y recordatorios</div>
                </div>
                <div class="menu-arrow">${v("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-settings">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                    ${v("settings")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Ajustes</div>
                    <div class="menu-desc">Configuración general</div>
                </div>
                <div class="menu-arrow">${v("chevronRight")}</div>
            </button>
        </div>
    </div>
    `}function jt(s){var e,a;(e=document.getElementById("open-calendar"))==null||e.addEventListener("click",()=>{s("calendar")}),(a=document.getElementById("open-settings"))==null||a.addEventListener("click",()=>{s("settings")})}function Ft(){const{social:s}=u.getState(),{people:e,columns:a}=s;return`
    <div class="social-page stagger-children">
        <header class="page-header" style="margin-bottom: var(--spacing-sm);">
            <div class="header-content">
                <h1 class="page-title">Social CRM</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones</p>
                
                <div class="social-header-actions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn-action-primary" id="add-person-btn">
                        ${v("users")} Nuevo Lead
                    </button>
                    <button class="btn-action-secondary" id="add-social-col-btn">
                        ${v("plus")} Etapa
                    </button>
                    <button class="btn-action-outline" id="ideal-lead-btn">
                        ${v("target")} Lead Ideal
                    </button>
                </div>
            </div>
        </header>

        <div class="kanban-container">
            ${a.sort((t,n)=>t.order-n.order).map(t=>{const n=e.filter(o=>o.columnId===t.id);return`
                <div class="kanban-column" data-col-id="${t.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${t.color}"></span>
                            ${t.name}
                            <span class="kanban-count">${n.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${t.id}">${v("moreVertical")}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${t.id}">
                        ${n.map(o=>Gt(o)).join("")}
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function Gt(s){return`
    <div class="person-card glass-panel" draggable="true" data-id="${s.id}">
        <div class="person-header">
            <h3 class="person-name">${s.name}</h3>
            ${s.rating?`<span class="person-rating">★ ${s.rating}</span>`:""}
        </div>
        ${s.city?`<div class="person-detail text-muted">${v("map","tiny-icon")} ${s.city}</div>`:""}
        <div class="person-tags">
            ${s.source?`<span class="tag">${s.source}</span>`:""}
        </div>
    </div>
    `}function Ht(){var e,a,t;const s=document.querySelector(".kanban-container");document.addEventListener("click",n=>{const o=n.target.closest(".col-opts-btn");if(o){n.preventDefault(),n.stopPropagation();const i=o.dataset.id;console.log("Opening menu for column:",i),Kt(i,o)}}),(e=document.getElementById("add-social-col-btn"))==null||e.addEventListener("click",async()=>{const n=await m.prompt("Nueva Columna","Nombre de la etapa:");n&&u.addSocialColumn({name:n,color:"#94a3b8"})}),(a=document.getElementById("add-person-btn"))==null||a.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person"}}))}),(t=document.getElementById("ideal-lead-btn"))==null||t.addEventListener("click",async()=>{const n=u.getState().social.idealLeadProfile||"",o=await qt(n);o!==null&&(u.updateIdealLeadProfile(o),m.toast("Perfil Ideal actualizado"))}),s&&(s.addEventListener("click",o=>{const i=o.target.closest(".person-card");i&&Vt(i.dataset.id)}),document.querySelectorAll(".person-card").forEach(o=>{o.draggable=!0,o.addEventListener("dragstart",i=>{i.dataTransfer.setData("text/plain",o.dataset.id),o.classList.add("dragging")}),o.addEventListener("dragend",()=>{o.classList.remove("dragging")})}),document.querySelectorAll(".kanban-cards").forEach(o=>{o.addEventListener("dragover",i=>{i.preventDefault(),o.classList.add("drag-over")}),o.addEventListener("dragleave",()=>{o.classList.remove("drag-over")}),o.addEventListener("drop",i=>{i.preventDefault(),o.classList.remove("drag-over");const r=i.dataTransfer.getData("text/plain"),l=o.dataset.colId;r&&l&&u.movePerson(r,l)})}))}function Vt(s){const e=u.getState().social.people.find(a=>a.id===s);e&&window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person",person:e}}))}function qt(s){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="9999",a.innerHTML=`
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${v("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${s||""}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const t=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#save-ideal-lead").addEventListener("click",()=>{const n=a.querySelector("#ideal-lead-text").value;a.remove(),e(n)}),a.addEventListener("click",n=>{n.target===a&&t()})})}function Kt(s,e){document.querySelectorAll(".column-options-menu").forEach(i=>i.remove());const a=u.getState().social.columns.find(i=>i.id===s);if(!a)return;const t=document.createElement("div");t.className="column-options-menu",t.innerHTML=`
        <button class="menu-item" data-action="edit">
            ${v("edit")} Editar Nombre
        </button>
        <button class="menu-item" data-action="color">
            ${v("palette")} Cambiar Color
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_left">
            ${v("chevronLeft")} Mover Izquierda
        </button>
        <button class="menu-item" data-action="move_right">
            ${v("chevronRight")} Mover Derecha
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">
            ${v("trash")} Eliminar Etapa
        </button>
    `;const n=e.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.bottom+8}px`,t.style.right=`${window.innerWidth-n.right}px`,t.style.zIndex="9999",document.body.appendChild(t),t.querySelectorAll(".menu-item").forEach(i=>{i.addEventListener("click",async()=>{const r=i.dataset.action;if(t.remove(),r==="edit"){const l=await m.prompt("Nombre de Columna","Ingresa el nuevo nombre:",a.name);l&&l.trim()&&u.updateSocialColumn(s,{name:l.trim()})}else if(r==="color"){const l=await m.prompt("Color de Etapa","Ingresa un color en formato hex (#rrggbb):",a.color);l&&l.startsWith("#")&&u.updateSocialColumn(s,{color:l})}else if(r==="delete")await m.confirm("Eliminar Etapa",`¿Eliminar "${a.name}"? Los leads en esta etapa también se eliminarán.`)&&u.deleteSocialColumn(s);else if(r==="move_left"||r==="move_right"){const l=[...u.getState().social.columns].sort((c,d)=>c.order-d.order),p=l.findIndex(c=>c.id===s);if(p===-1)return;if(r==="move_left"&&p>0){const c=l[p].order;l[p].order=l[p-1].order,l[p-1].order=c,u.reorderSocialColumns(l)}else if(r==="move_right"&&p<l.length-1){const c=l[p].order;l[p].order=l[p+1].order,l[p+1].order=c,u.reorderSocialColumns(l)}}})});const o=i=>{!t.contains(i.target)&&i.target!==e&&(t.remove(),document.removeEventListener("click",o))};setTimeout(()=>document.addEventListener("click",o),10)}const le={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},Ee=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let $="passiveAsset";function ie(s="passiveAsset"){var a,t;$=s,(t=(a=le[$])==null?void 0:a.types[0])!=null&&t.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=zt(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),Yt()}function zt(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${$==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${v("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${$!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(le).map(([e,a])=>`
          <div class="type-option ${e===$?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${v(a.icon)}
            </div>
            <div class="type-option-label">${a.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${De()}
      </div>
    </div>
  `}function De(){const s=le[$],e=$==="investmentAsset"||$==="passiveAsset";if(e){const t=O.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...Ee,...t]}let a="";return $==="passiveAsset"||$==="investmentAsset"?a=`
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
                ${s.types.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${Ee.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${O.map(t=>`<option value="${t.symbol}">${t.name} (${t.symbol})</option>`).join("")}
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
      ${v("plus")} Agregar
    </button>
  `}function Yt(){const s=document.getElementById("add-modal"),e=document.getElementById("modal-close");s.addEventListener("click",t=>{t.target===s&&re()}),e.addEventListener("click",re);const a=s.querySelectorAll(".category-selector .type-option");a.forEach(t=>{t.addEventListener("click",()=>{$=t.dataset.category,a.forEach(n=>n.classList.remove("active")),t.classList.add("active"),document.getElementById("form-container").innerHTML=De(),ke()})}),ke()}function ke(){const s=document.getElementById("btn-save");s&&s.addEventListener("click",Wt);const e=document.getElementById("mode-qty"),a=document.getElementById("mode-total"),t=document.getElementById("input-qty"),n=document.getElementById("input-value"),o=document.getElementById("input-currency"),i=document.getElementById("input-name");if(e&&a){const l=p=>{p==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",a.style.background="transparent",a.style.color="var(--text-secondary)",t.focus()):(a.style.background="var(--accent-primary)",a.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>l("qty")),a.addEventListener("click",()=>l("total"))}const r=l=>{const p=u.getState().rates,c=o==null?void 0:o.value,d=p[c]||1;if(l==="qty"){const g=parseFloat(t.value)||0;n.value=(g*d).toFixed(2)}else{const g=parseFloat(n.value)||0;t.value=(g/d).toFixed(6)}};t==null||t.addEventListener("input",()=>r("qty")),n==null||n.addEventListener("input",()=>r("total")),o&&o.addEventListener("change",()=>{if(i&&!i.value){const l=o.options[o.selectedIndex].text;i.value=l.split(" (")[0]}r("qty")})}function Wt(){var h,w,E,k,b,A,T,K,z,Y,Q,ce;const s=(w=(h=document.getElementById("input-name"))==null?void 0:h.value)==null?void 0:w.trim(),e=(E=document.getElementById("input-type"))==null?void 0:E.value,a=(k=document.getElementById("input-currency"))==null?void 0:k.value,t=(A=(b=document.getElementById("input-details"))==null?void 0:b.value)==null?void 0:A.trim(),n=parseFloat((T=document.getElementById("input-value"))==null?void 0:T.value)||0,o=document.getElementById("input-qty"),i=o?parseFloat(o.value)||0:n,r=parseFloat((K=document.getElementById("input-amount"))==null?void 0:K.value)||0,l=parseFloat((z=document.getElementById("input-monthly"))==null?void 0:z.value)||0,p=(Y=document.getElementById("input-date"))==null?void 0:Y.value,c=(Q=document.getElementById("input-time"))==null?void 0:Q.value,d=(ce=document.getElementById("input-repeat"))==null?void 0:ce.value;if(!s){m.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const g={name:s,type:e,currency:a,details:t};switch($){case"passiveAsset":u.addPassiveAsset({...g,value:i,monthlyIncome:l});break;case"activeIncome":u.addActiveIncome({...g,amount:r});break;case"livingExpense":u.addLivingExpense({...g,amount:r});break;case"investmentAsset":u.addInvestmentAsset({...g,value:i});break;case"liability":u.addLiability({...g,amount:r,monthlyPayment:l});break;case"event":u.addEvent({title:s,date:p,time:c,repeat:d,category:e});break}re()}function re(){const s=document.getElementById("add-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}let q=null;function Re(s=null){q=s?s.id:null;const e=document.createElement("div");e.className="modal-overlay",e.id="add-person-modal",e.innerHTML=Xt(s),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),Jt()}function Xt(s=null){const e=s?"Editar Lead":"Nuevo Lead",a=s?"Guardar Cambios":"Guardar Lead";return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <div class="header-title-wrapper" style="display: flex; align-items: center; gap: 12px;">
            <div style="background: var(--accent-primary); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-primary);">
                ${v("users")}
            </div>
            <h2 class="modal-title">${e}</h2>
        </div>
        <button class="modal-close" id="person-modal-close">
          ${v("x")}
        </button>
      </div>
      
      <div id="person-form-container" style="margin-top: var(--spacing-lg);">
        <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${(s==null?void 0:s.name)||""}" autofocus>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" id="person-phone" placeholder="+54 9 ..." value="${(s==null?void 0:s.phone)||""}">
            </div>
            <div class="form-group">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-input" id="person-city" placeholder="Ej: Buenos Aires" value="${(s==null?void 0:s.city)||""}">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Fuente de Contacto</label>
                <select class="form-input form-select" id="person-source">
                    <option value="Instagram" ${(s==null?void 0:s.source)==="Instagram"?"selected":""}>Instagram</option>
                    <option value="WhatsApp" ${(s==null?void 0:s.source)==="WhatsApp"?"selected":""}>WhatsApp</option>
                    <option value="Tinder" ${(s==null?void 0:s.source)==="Tinder"?"selected":""}>Tinder</option>
                    <option value="Bumble" ${(s==null?void 0:s.source)==="Bumble"?"selected":""}>Bumble</option>
                    <option value="LinkedIn" ${(s==null?void 0:s.source)==="LinkedIn"?"selected":""}>LinkedIn</option>
                    <option value="Evento" ${(s==null?void 0:s.source)==="Evento"?"selected":""}>Evento</option>
                    <option value="Amigo" ${(s==null?void 0:s.source)==="Amigo"?"selected":""}>Amigo</option>
                    <option value="Otro" ${(s==null?void 0:s.source)==="Otro"?"selected":""}>Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Lead Alignment (1-10)</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" class="form-range" id="person-rating-slider" min="1" max="10" value="${(s==null?void 0:s.rating)||5}" style="flex: 1;">
                    <span id="rating-value" style="font-weight: bold; width: 24px; text-align: center;">${(s==null?void 0:s.rating)||5}</span>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notas / Descripción</label>
            <textarea class="form-input" id="person-desc" rows="3" placeholder="Detalles importantes, gustos, temas de conversación...">${(s==null?void 0:s.description)||""}</textarea>
        </div>

        <div class="form-group" style="margin-top: var(--spacing-md);">
             <label class="form-label">Etapa</label>
             <select class="form-input form-select" id="person-column">
                ${u.getState().social.columns.sort((t,n)=>t.order-n.order).map(t=>`<option value="${t.id}" ${(s==null?void 0:s.columnId)===t.id?"selected":""}>${t.name}</option>`).join("")}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${q?`
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${v("trash")}
            </button>`:""}
            <button class="btn btn-primary w-full" id="btn-save-person" style="padding: 14px;">
                ${v("plus")} ${a}
            </button>
        </div>
      </div>
    </div>
  `}function Jt(){const s=document.getElementById("add-person-modal"),e=document.getElementById("person-modal-close"),a=document.getElementById("btn-save-person"),t=document.getElementById("btn-delete-person"),n=document.getElementById("person-rating-slider"),o=document.getElementById("rating-value");s.addEventListener("click",i=>{i.target===s&&te()}),e.addEventListener("click",te),n&&o&&n.addEventListener("input",i=>{o.textContent=i.target.value}),a&&a.addEventListener("click",Qt),t&&t.addEventListener("click",Zt)}async function Zt(){q&&await m.confirm("Eliminar Lead","¿Estás seguro de eliminar este lead?")&&(u.deletePerson(q),m.toast("Lead eliminado","success"),te())}function Qt(){var l,p,c,d,g,h,w,E,k,b,A;const s=(p=(l=document.getElementById("person-name"))==null?void 0:l.value)==null?void 0:p.trim(),e=(d=(c=document.getElementById("person-phone"))==null?void 0:c.value)==null?void 0:d.trim(),a=(h=(g=document.getElementById("person-city"))==null?void 0:g.value)==null?void 0:h.trim(),t=(w=document.getElementById("person-source"))==null?void 0:w.value,n=(E=document.getElementById("person-rating-slider"))==null?void 0:E.value,o=(b=(k=document.getElementById("person-desc"))==null?void 0:k.value)==null?void 0:b.trim(),i=(A=document.getElementById("person-column"))==null?void 0:A.value;if(!s){m.toast("El nombre es obligatorio","error");return}const r={name:s,phone:e,city:a,source:t,rating:n,description:o,columnId:i};q?(u.updatePerson(q,r),m.toast("Lead actualizado correctamente","success")):(u.addPerson(r),m.toast("Lead guardado correctamente","success")),te()}function te(){const s=document.getElementById("add-person-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}function ea(){const s=x.isSetup(),e=x.isBioEnabled();return`
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
    `}function ta(s){var o;const e=document.getElementById("auth-submit-btn"),a=document.getElementById("auth-bio-btn"),t=document.getElementById("auth-password"),n=async()=>{const i=t.value,r=document.getElementById("auth-confirm"),l=x.isSetup();try{let p;if(l)p=await x.unlock(i);else{if(!i||i.length<4)throw new Error("Contraseña demasiado corta");if(i!==r.value)throw new Error("Las contraseñas no coinciden");p=await x.setup(i)}await u.loadEncrypted(p),s()}catch(p){m.alert("Error",p.message)}};e==null||e.addEventListener("click",n),t==null||t.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),(o=document.getElementById("auth-confirm"))==null||o.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),a==null||a.addEventListener("click",async()=>{try{const i=await x.unlockWithBiometrics();await u.loadEncrypted(i),s()}catch(i){m.alert("Identificación",i.message)}}),x.isBioEnabled()&&setTimeout(async()=>{try{const i=await x.unlockWithBiometrics();await u.loadEncrypted(i),s()}catch{console.log("Auto-bio failed or cancelled")}},500)}let B=localStorage.getItem("life-dashboard/app_current_page")||"finance",I=localStorage.getItem("life-dashboard/app_current_sub_page")||null;I==="null"&&(I=null);async function xe(){window.addEventListener("open-add-modal",e=>{var t,n;const a=(t=e.detail)==null?void 0:t.type;a==="person"?Re((n=e.detail)==null?void 0:n.person):ie(a)}),L.init().catch(e=>console.warn("[Drive] Pre-init failed:",e));const s=x.getVaultKey();s?await u.loadEncrypted(s)?Me():(console.error("[Boot] Decryption failed, invalid vault key in session?"),x.logout(),Se()):Se()}function Se(){const s=document.getElementById("app");s.innerHTML=ea(),ta(()=>{Me()})}function Me(){const s=document.getElementById("app");s.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,Pe(),u.subscribe(()=>{D()}),window.reRender=()=>D(),aa()}function aa(){var t,n;const s=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(s&&(Date.now()-parseInt(s))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
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
    `,document.body.appendChild(e);const a=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};a(),window.addEventListener("beforeinstallprompt",a),(t=document.getElementById("pwa-banner-install"))==null||t.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:o}=await window.deferredPrompt.userChoice;o==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function Pe(){const s=document.getElementById("bottom-nav");s.innerHTML=me(B),ve(e=>{B=e,I=null,localStorage.setItem("life-dashboard/app_current_page",B),localStorage.setItem("life-dashboard/app_current_sub_page",I),M(),D(),s.innerHTML=me(B),ve(a=>{B=a,I=null,localStorage.setItem("life-dashboard/app_current_page",B),localStorage.setItem("life-dashboard/app_current_sub_page",I),M(),D(),Pe()})}),sa(),D()}function D(){const s=document.getElementById("main-content");if(!s)return;const e=s.scrollTop;if(I==="compound"){s.innerHTML=rt(),lt(()=>{I=null,ct(),M(),D()}),s.scrollTop=e;return}if(I==="expenses"){s.innerHTML=Bt(),Mt(()=>{I=null,M(),D()}),s.scrollTop=e;return}if(I==="market"){s.innerHTML=dt(),pt(()=>{I=null,M(),D()}),s.scrollTop=e;return}switch(s.classList.toggle("no-padding-mobile",B==="health"),B){case"finance":M(),s.innerHTML=he(),ye(),Ie();break;case"goals":U(),s.innerHTML=Et(),xt();break;case"social":U(),s.innerHTML=Ft(),Ht();break;case"health":s.innerHTML=mt(),ft(),U();break;case"menu":s.innerHTML=Nt(),jt(a=>{B=a,M(),D()}),U();break;case"calendar":s.innerHTML=St(),Tt(),M();break;case"settings":s.innerHTML=Ut(),Ot(),U();break;default:M(),s.innerHTML=he(),ye(),Ie()}requestAnimationFrame(()=>{s.scrollTop=e})}function Ie(){const s=document.getElementById("open-compound");s&&s.addEventListener("click",()=>{I="compound",localStorage.setItem("life-dashboard/app_current_sub_page",I),U(),D()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{I="market",localStorage.setItem("life-dashboard/app_current_sub_page",I),U(),D()});const a=document.getElementById("open-expenses");a&&a.addEventListener("click",()=>{I="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",I),U(),D()})}function sa(){const s=document.querySelector(".fab");s&&s.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=v("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{if(B==="calendar")ie("event");else if(B==="health"){const a=await ns.confirm("Registrar Métrica","¿Qué deseas registrar hoy?","Peso","Grasa");if(a===!0){const t=await ns.prompt("Registrar Peso","Ingresa tu peso actual en kg:","","number");t&&u.addWeightLog(t)}else if(a===!1){const t=await ns.prompt("Grasa Corporal","Ingresa tu % de grasa:","","number");t&&u.addFatLog(t)}}else B==="social"?Re():ie()}),document.body.appendChild(e)}function U(){const s=document.getElementById("main-fab");s&&(s.style.display="none")}function M(){const s=document.getElementById("main-fab");s&&(s.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xe):xe();window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),window.deferredPrompt=s,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});
