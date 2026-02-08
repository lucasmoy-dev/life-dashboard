var ut=Object.defineProperty;var pt=(a,e,s)=>e in a?ut(a,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[e]=s;var ue=(a,e,s)=>pt(a,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const mt="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",vt="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function gt(){var e,s,t,n,o,i,r,l,m,c,d,g,h,f,y;const a={EUR:1};try{const k=await(await fetch(mt)).json();a.BTC=((e=k.bitcoin)==null?void 0:e.eur)||4e4,a.ETH=((s=k.ethereum)==null?void 0:s.eur)||2200,a.XRP=((t=k.ripple)==null?void 0:t.eur)||.5,a.KAS=((n=k.kaspa)==null?void 0:n.eur)||.1,a.SOL=((o=k.solana)==null?void 0:o.eur)||90,a.XLM=((i=k.stellar)==null?void 0:i.eur)||.11,a.ALGO=((r=k.algorand)==null?void 0:r.eur)||.18,a.LTC=((l=k.litecoin)==null?void 0:l.eur)||65,a.SUI=((m=k.sui)==null?void 0:m.eur)||1.1,a.LINK=((c=k.chainlink)==null?void 0:c.eur)||14,a.RNDR=((d=k["render-token"])==null?void 0:d.eur)||4.5,a.ADA=((g=k.cardano)==null?void 0:g.eur)||.45,a.ONDO=((h=k["ondo-finance"])==null?void 0:h.eur)||.7,(f=k.bitcoin)!=null&&f.ars&&((y=k.bitcoin)!=null&&y.eur)&&(a.ARS=k.bitcoin.eur/k.bitcoin.ars);const L=await fetch(vt);if(L.ok){const E=await L.json();a.USD=1/E.rates.USD,a.CHF=1/E.rates.CHF,a.GBP=1/E.rates.GBP,a.AUD=1/E.rates.AUD}a.GOLD=2100,a.SP500=4700}catch(x){console.error("Failed to fetch some prices:",x),a.USD=a.USD||.92,a.CHF=a.CHF||1.05,a.GBP=a.GBP||1.15,a.AUD=a.AUD||.6,a.ARS=a.ARS||.001}return a}class H{static async hash(e,s="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+s),o=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(o)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,s){const t=new TextEncoder,n=await crypto.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(s),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,s){try{const t=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),o=await this.deriveKey(s,this.bufToBase64(t)),i=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(i),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},o,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(n),salt:this.bufToBase64(t),v:"5.0"}}catch(t){throw console.error("[Security] Encryption failed:",t),new Error("No se pudo encriptar la información")}}static async decrypt(e,s){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:t,iv:n,salt:o}=e,i=await this.deriveKey(s,o),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},i,this.base64ToBuf(t)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(t){throw console.error("[Security] Decryption failed:",t),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(s=>s.charCodeAt(0)))}}const De=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:H},Symbol.toStringTag,{value:"Module"})),B={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class ${static isSetup(){return!!localStorage.getItem(B.MASTER_HASH)}static async setup(e){const s=await H.hash(e),t=await H.deriveVaultKey(e);return localStorage.setItem(B.MASTER_HASH,s),sessionStorage.setItem(B.VAULT_KEY,t),t}static async unlock(e){const s=await H.hash(e),t=localStorage.getItem(B.MASTER_HASH);if(s===t){const n=await H.deriveVaultKey(e);return sessionStorage.setItem(B.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const s=sessionStorage.getItem(B.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const t=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:t,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(B.BIO_ENABLED,"true"),localStorage.setItem(B.VAULT_KEY,s),!0}catch(t){throw console.error("Biometric setup failed:",t),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(B.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const s=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:s,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const t=localStorage.getItem(B.VAULT_KEY);if(t)return sessionStorage.setItem(B.VAULT_KEY,t),t;throw new Error("Llave no encontrada. Usa contraseña.")}catch(s){throw console.error("Biometric auth failed:",s),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(B.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(B.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(B.BIO_ENABLED)==="true"}}const xe="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Me=[71,79,67,83,80,88,45,112,121,52,68,109,80,83,107,45,100,75,55,99,73,66,116,106,65,81,75,90,70,75,118,95,66,87,95].map(a=>String.fromCharCode(a)).join(""),ht="https://www.googleapis.com/auth/drive.file";class U{static hasToken(){const e=!!this.accessToken;return localStorage.getItem("life-dashboard/drive_connected")==="true"&&e}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,s)=>{const t=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.codeClient=google.accounts.oauth2.initCodeClient({client_id:xe,scope:ht,ux_mode:"popup",access_type:"offline",prompt:"consent",callback:async n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}if(n.code)try{const o=sessionStorage.getItem("life-dashboard/pkce_verifier"),i=localStorage.getItem("life-dashboard/drive_client_secret")||Me,r=await this.exchangeCodeForTokens(n.code,o,xe,i);r.refresh_token&&await this.saveRefreshToken(r.refresh_token),this.saveSession(r),console.log("[Drive] Connected successfully via offline flow."),window.ns&&window.ns.toast("Google Drive vinculado"),typeof window.reRender=="function"&&window.reRender()}catch(o){console.error("[Drive] Token exchange error:",o),window.ns&&window.ns.alert("Error Auth","No se pudieron obtener tokens. Verifica el Client Secret.")}}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&this.ensureValidToken().catch(n=>{console.log("[Drive] Initial silent restoration skipped:",n.message)}),e(!0)}catch(n){console.error("[Drive] Init error:",n),s(n)}}):setTimeout(t,200)};t()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const s=e.expires_in||3600,t=Date.now()+s*1e3;localStorage.setItem("life-dashboard/drive_token_expiry",t.toString())}static async authenticate(){this.codeClient||await this.init();const{verifier:e}=await this.generatePKCE();sessionStorage.setItem("life-dashboard/pkce_verifier",e),this.codeClient.requestCode()}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Access token expired or near expiry, attempting refresh...");const n=await this.getRefreshToken();if(n)try{const o=localStorage.getItem("life-dashboard/drive_client_secret")||Me,i=await this.refreshAccessToken(n,xe,o),r={access_token:i.access_token,expires_in:i.expires_in,refresh_token:i.refresh_token||n};return i.refresh_token&&await this.saveRefreshToken(i.refresh_token),this.saveSession(r),this.accessToken}catch(o){throw console.error("[Drive] Token refresh failed:",o),new Error("Sesión de Google Drive expirada. Por favor reconecta en Configuración.")}else throw console.warn("[Drive] No refresh token found."),new Error("Google Drive no está vinculado para acceso offline.")}return this.accessToken&&(!gapi.client.getToken()||gapi.client.getToken().access_token!==this.accessToken)&&gapi.client.setToken({access_token:this.accessToken}),this.accessToken}static async generatePKCE(){const e=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(i=>("0"+i.toString(16)).slice(-2)).join(""),t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t),o=btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return{verifier:e,challenge:o}}static async exchangeCodeForTokens(e,s,t,n=null){const o=new URLSearchParams({client_id:t,code:e,grant_type:"authorization_code",redirect_uri:"postmessage"});s&&!n&&o.append("code_verifier",s),n&&o.append("client_secret",n);const i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(!i.ok){const r=await i.json();throw new Error(r.error_description||"Failed to exchange code")}return await i.json()}static async refreshAccessToken(e,s,t=null){const n=new URLSearchParams({client_id:s,refresh_token:e,grant_type:"refresh_token"});t&&n.append("client_secret",t);const o=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!o.ok){const i=await o.json();throw new Error(i.error_description||"Failed to refresh token")}return await o.json()}static async saveRefreshToken(e){return new Promise((s,t)=>{const n=indexedDB.open("LifeDashboardAuthDB",1);n.onupgradeneeded=o=>{const i=o.target.result;i.objectStoreNames.contains("tokens")||i.createObjectStore("tokens")},n.onsuccess=o=>{const r=o.target.result.transaction("tokens","readwrite");r.objectStore("tokens").put(e,"drive_refresh_token"),r.oncomplete=()=>s(),r.onerror=l=>t(l)},n.onerror=o=>t(o)})}static async getRefreshToken(){return new Promise((e,s)=>{const t=indexedDB.open("LifeDashboardAuthDB",1);t.onupgradeneeded=n=>{const o=n.target.result;o.objectStoreNames.contains("tokens")||o.createObjectStore("tokens")},t.onsuccess=n=>{const o=n.target.result;if(!o.objectStoreNames.contains("tokens")){e(null);return}const l=o.transaction("tokens","readonly").objectStore("tokens").get("drive_refresh_token");l.onsuccess=()=>e(l.result),l.onerror=m=>s(m)},t.onerror=n=>s(n)})}static async clearTokens(){return localStorage.removeItem("life-dashboard/drive_access_token"),localStorage.removeItem("life-dashboard/drive_connected"),localStorage.removeItem("life-dashboard/drive_token_expiry"),new Promise(e=>{const s=indexedDB.open("LifeDashboardAuthDB",1);s.onsuccess=t=>{const n=t.target.result;if(n.objectStoreNames.contains("tokens")){const o=n.transaction("tokens","readwrite");o.objectStore("tokens").clear(),o.oncomplete=()=>e()}else e()},s.onerror=()=>e()})}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const s=e.split("/").filter(o=>o);let t="root";for(const o of s){const i=`name = '${o}' and mimeType = 'application/vnd.google-apps.folder' and '${t}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(l&&l.length>0)t=l[0].id;else{const m={name:o,mimeType:"application/vnd.google-apps.folder",parents:[t]};t=(await gapi.client.drive.files.create({resource:m,fields:"id"})).result.id}}return t}static async pushData(e,s,t=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pushing encrypted data...${t?" (Retry)":""}`);const n=await this.getOrCreateFolderPath("/backup/life-dashboard/"),o=await H.encrypt(e,s),i="dashboard_vault_v5.bin",r=`name = '${i}' and '${n}' in parents and trashed = false`,m=(await gapi.client.drive.files.list({q:r,fields:"files(id)"})).result.files,c=new Blob([JSON.stringify(o)],{type:"application/json"});if(m&&m.length>0){const d=m[0].id,g=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${d}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:c});if(g.status===401&&!t)return await this.ensureValidToken(),await this.pushData(e,s,!0);if(!g.ok)throw new Error(`Error al actualizar backup: ${g.status}`)}else{const d={name:i,parents:[n]},g=new FormData;g.append("metadata",new Blob([JSON.stringify(d)],{type:"application/json"})),g.append("file",c);const h=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:g});if(h.status===401&&!t)return await this.ensureValidToken(),await this.pushData(e,s,!0);if(!h.ok)throw new Error(`Error al crear backup: ${h.status}`)}return!0}catch(n){throw console.error("[Drive] Push failed:",n),new Error(n.message||"Fallo al subir datos a Drive")}}static async pullData(e,s=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pulling data...${s?" (Retry)":""}`);const o=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,r=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(!r||r.length===0)return null;const l=r[0].id,m=await fetch(`https://www.googleapis.com/drive/v3/files/${l}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(m.status===401&&!s)return await this.ensureValidToken(),await this.pullData(e,!0);if(!m.ok)throw new Error(`Error al descargar backup: ${m.status}`);const c=await m.json();return await H.decrypt(c,e)}catch(t){throw console.error("[Drive] Pull failed:",t),new Error(t.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");const t=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,o=(await gapi.client.drive.files.list({q:t,fields:"files(id)"})).result.files;if(o&&o.length>0){const i=o[0].id;return await gapi.client.drive.files.delete({fileId:i}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(e){throw console.error("[Drive] Deletion failed:",e),new Error(e.message||"Fallo al borrar backup en Drive")}}}ue(U,"codeClient",null),ue(U,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null),ue(U,"_initPromise",null);const Be={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',uploadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12V21"/><path d="m16 16-4-4-4 4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',users:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',messageSquare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',phone:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',facebook:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',linkedin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"/><path d="M5 15.1a7 7 0 0 0 10.9 0"/><path d="M6 13.6a7 7 0 0 0 4.6 2.4"/><path d="M13.4 16a7 7 0 0 0 4.6-2.4"/><path d="M8 12.1a5 5 0 0 0 6.9 0"/><path d="M9.1 11a3 3 0 0 0 3.9 0"/><path d="M12 18.5V20"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',palette:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12c0 0 3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',clock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',barChart2:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',brain:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>',rocket:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>',coffee:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',bookOpen:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',dumbbell:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',code:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',music:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',monitor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'};function p(a,e=""){return(Be[a]||Be.package).replace("<svg",`<svg class="${e}"`)}class yt{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,s="success",t=3e3){const n=document.createElement("div");n.className=`toast toast-${s} stagger-in`;const o=s==="success"?"check":s==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${p(o,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},t)}alert(e,s){return new Promise(t=>{this._showModal({title:e,message:s,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>t(!0)}]})})}confirm(e,s,t="Confirmar",n="Cancelar"){return new Promise(o=>{this._showModal({title:e,message:s,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>o(!1)},{text:t,type:"danger",onClick:()=>o(!0)}]})})}prompt(e,s,t="",n="text"){return new Promise(o=>{const i=`prompt-input-${Date.now()}`;this._showModal({title:e,message:s,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${i}" class="form-input" value="${t}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(i).value;o(r)}}]}),setTimeout(()=>{const r=document.getElementById(i);r&&(r.focus(),r.select&&r.select())},100)})}select(e,s,t=[],n=4){return new Promise(o=>{const i=`display: grid; grid-template-columns: repeat(${n}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:s,centered:!0,content:`
                    <div style="${i}">
                        ${t.map((l,m)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{o(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,s,t="BORRAR"){return new Promise(n=>{const o=`hard-confirm-input-${Date.now()}`,i=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${s}<br><br>Escribe <strong>${t}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${o}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:i,disabled:!0,onClick:()=>n(!0)}]});const r=document.getElementById(o),l=document.getElementById(i);r.addEventListener("input",()=>{const m=r.value.trim().toUpperCase()===t.toUpperCase();l.disabled=!m,l.style.opacity=m?"1":"0.3",l.style.pointerEvents=m?"auto":"none"})})}performance(e,s){const t=[{rating:1,emoji:"🫣",label:"Baja"},{rating:3,emoji:"😐",label:"Media"},{rating:5,emoji:"😎",label:"Alta"}];return new Promise(n=>{this._showModal({title:e,message:s,centered:!0,content:`
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${t.map(i=>`
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${i.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${i.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${i.label}</span>
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(null)}]});const o=document.querySelector(".modal-overlay.active");o&&o.querySelectorAll(".perf-emoji-btn").forEach(i=>{i.addEventListener("click",()=>{n(parseInt(i.dataset.value)),this._closeModal(o)})})})}_showModal({title:e,message:s,content:t="",buttons:n=[],centered:o=!1}){const i=document.createElement("div");i.className=`modal-overlay ${o?"overlay-centered":""}`,i.style.zIndex="9999";const r=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;i.id=r;const l=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${s}</div>
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
        `;i.innerHTML=l,document.body.appendChild(i),i.offsetHeight,i.classList.add("active"),setTimeout(()=>{const d=i.querySelectorAll(".modal-footer button");d.length>0&&d[d.length-1].focus()},100);const m=d=>{d.key==="Escape"&&(n.some(h=>h.type==="danger")||(i.removeEventListener("keydown",m),this._closeModal(i)))};i.tabIndex=-1,i.addEventListener("keydown",m),i.querySelectorAll(".modal-footer button").forEach(d=>{const g=d.dataset.index;if(g!==void 0){const h=n[g];d.addEventListener("click",async f=>{if(f.stopPropagation(),!d.classList.contains("btn-processing")){d.classList.add("btn-processing"),d.style.pointerEvents="none";try{h.onClick&&await h.onClick(),await this._closeModal(i)}catch(y){console.error("Modal button action failed",y),d.classList.remove("btn-processing"),d.style.pointerEvents="auto"}}})}}),i.addEventListener("click",async d=>{if(d.target===i&&!n.some(h=>h.type==="danger")){const h=n.find(f=>f.type==="secondary");h&&h.onClick(),await this._closeModal(i)}})}async _closeModal(e){e.classList.remove("active");const s=e.querySelector(".modal");return s&&s.classList.add("animate-out"),new Promise(t=>{setTimeout(()=>{e.remove(),t()},300)})}}const v=new yt,ke="life-dashboard/data",Pe="life-dashboard/secured",pe={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,weightGoalDate:null,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],social:{people:[],columns:[{id:"1",name:"Chat",color:"#3b82f6",order:0},{id:"2",name:"Phone",color:"#8b5cf6",order:1},{id:"3",name:"Meeting",color:"#10b981",order:2},{id:"4",name:"Closed",color:"#f59e0b",order:3}],communications:[],contactSources:["Instagram","WhatsApp","Bumble","LinkedIn","Evento","Amigo","Otro"],idealLeadProfile:""},lastMarketData:[],marketFavorites:[],wealthGoals:[],inflationRate:3,projectionYears:10,timeInvest:{activities:[{id:"1",name:"Meditar",icon:"brain",color:"#8b5cf6",subActivities:[]},{id:"2",name:"Emprender",icon:"rocket",color:"#f59e0b",subActivities:[{id:"s1",name:"Marketing"},{id:"s2",name:"Desarrollo"},{id:"s3",name:"Ventas"}]}],logs:[],pomodoroTime:25},scheduledTasks:[],skills:[]};class ft{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...pe}}async loadEncrypted(e){const s=localStorage.getItem(Pe),t=localStorage.getItem(ke);if(s)try{const n=JSON.parse(s),o=await H.decrypt(n,e);return this.state={...pe,...o},this.processScheduledTasks(),this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(t)try{const n=JSON.parse(t);return this.state={...pe,...n},await this.saveState(),localStorage.removeItem(ke),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await gt();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=$.getVaultKey();if(e){console.log("[Store] Saving state to encrypted storage...");const s=await H.encrypt(this.state,e);localStorage.setItem(Pe,JSON.stringify(s)),localStorage.removeItem(ke),console.log("[Store] State saved successfully.")}else console.warn("[Store] Attempted to save without Vault Key. Save skipped. Data will be lost on refresh.")}catch(e){console.error("[Store] Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState(),this.notify()}resetState(e){this.state={...pe,...e},this.saveState(),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const s={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:s[e]||"$"})}convertToEUR(e,s){if(!s||s==="EUR")return e||0;const t=this.state.rates[s]||1;return(e||0)*t}convertFromEUR(e,s){if(!s||s==="EUR")return e;const t=this.state.rates[s];return t&&t!==0?e/t:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,s="investment"){const t={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return s==="passive"?this.addPassiveAsset({...t,monthlyIncome:0}):this.addInvestmentAsset(t)}toggleMarketFavorite(e){const s=this.state.marketFavorites||[],t=s.includes(e)?s.filter(n=>n!==e):[...s,e];this.setState({marketFavorites:t})}convertValue(e,s){const t=this.convertToEUR(e,s);return this.convertFromEUR(t,this.state.currency)}addPassiveAsset(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,s]}),s}updatePassiveAsset(e,s){this.setState({passiveAssets:this.state.passiveAssets.map(t=>t.id===e?{...t,...s}:t)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(s=>s.id!==e)})}addActiveIncome(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,s]}),s}updateActiveIncome(e,s){this.setState({activeIncomes:this.state.activeIncomes.map(t=>t.id===e?{...t,...s}:t)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(s=>s.id!==e)})}addLivingExpense(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,s]}),s}updateLivingExpense(e,s){this.setState({livingExpenses:this.state.livingExpenses.map(t=>t.id===e?{...t,...s}:t)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(s=>s.id!==e)})}addOtherExpense(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,s]}),s}updateOtherExpense(e,s){this.setState({otherExpenses:this.state.otherExpenses.map(t=>t.id===e?{...t,...s}:t)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(s=>s.id!==e)})}addInvestmentAsset(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,s]}),s}updateInvestmentAsset(e,s){this.setState({investmentAssets:this.state.investmentAssets.map(t=>t.id===e?{...t,...s}:t)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(s=>s.id!==e)})}addLiability(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,s]}),s}updateLiability(e,s){this.setState({liabilities:this.state.liabilities.map(t=>t.id===e?{...t,...s}:t)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(s=>s.id!==e)})}sumItems(e,s){return e.reduce((t,n)=>{const o=n[s]||0;return t+this.convertValue(o,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),s=this.sumItems(this.state.liabilities,"monthlyPayment");return e+s}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),s=this.sumItems(this.state.investmentAssets,"value");return e+s}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),s=this.sumItems(this.state.activeIncomes,"amount");return e+s}getAllExpenses(){const e=this.getLivingExpenses(),s=this.sumItems(this.state.otherExpenses,"amount");return e+s}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,s){this.setState({health:{...this.state.health,[e]:s}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const s={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,s]}})}addFatLog(e){const s={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,s]}})}saveRoutine(e){const s=this.state.health.routines,n=s.find(o=>o.id===e.id)?s.map(o=>o.id===e.id?e:o):[...s,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(s=>s.id!==e)}})}renameRoutine(e,s){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,name:s}:t)}})}updateExercise(e,s,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const o=[...n.exercises];return o[s]={...o[s],...t},{...n,exercises:o}}return n})}})}addExerciseToRoutine(e,s){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,exercises:[...t.exercises,{weight:50,reps:10,sets:4,...s}]}:t)}})}reorderRoutine(e,s){const t=[...this.state.health.routines],n=s==="up"?e-1:e+1;n<0||n>=t.length||([t[e],t[n]]=[t[n],t[e]],this.setState({health:{...this.state.health,routines:t}}))}reorderExercise(e,s,t){const n=this.state.health.routines.map(o=>{if(o.id===e){const i=[...o.exercises],r=t==="up"?s-1:s+1;return r<0||r>=i.length?o:([i[s],i[r]]=[i[r],i[s]],{...o,exercises:i})}return o});this.setState({health:{...this.state.health,routines:n}})}deleteExerciseFromRoutine(e,s){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>{if(t.id===e){const n=[...t.exercises];return n.splice(s,1),{...t,exercises:n}}return t})}})}addCalorieLog(e,s=""){const t={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:s};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,t]}})}logExercise(e,s,t){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:s,date:Date.now(),rating:parseInt(t)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,s){const n=(this.state.health.exerciseLogs||[]).filter(d=>d.routineId===e&&d.exerciseIndex===s);if(n.length===0)return{color:"green",lastDate:null};n.sort((d,g)=>g.date-d.date);const o=n[0],i=new Date,r=new Date(o.date),l=new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),m=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),c=Math.floor((l-m)/(1e3*60*60*24));return c===0?{color:"danger",status:"done_today",lastLog:o}:c===1?{color:"danger",status:"yesterday",lastLog:o}:c===2?{color:"tertiary",status:"day_before",lastLog:o}:{color:"success",status:"rested",lastLog:o}}addGoal(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,s]})}toggleGoal(e){this.setState({goals:this.state.goals.map(s=>s.id===e?{...s,completed:!s.completed}:s)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(s=>s.id!==e)})}addScheduledTask(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),lastProcessed:null,active:!0,...e};this.setState({scheduledTasks:[...this.state.scheduledTasks,s]})}deleteScheduledTask(e){this.setState({scheduledTasks:this.state.scheduledTasks.filter(s=>s.id!==e)})}updateScheduledTask(e,s){this.setState({scheduledTasks:this.state.scheduledTasks.map(t=>t.id===e?{...t,...s}:t)})}processScheduledTasks(){const e=new Date,s=e.toISOString().split("T")[0],t=e.getDay(),n=e.getDate();let o=!1;const i=[...this.state.scheduledTasks],r=[...this.state.goals];i.forEach(l=>{if(!l.active||l.lastProcessed===s)return;let m=!1;(l.type==="weekly"&&l.days&&l.days.includes(t)||l.type==="monthly"&&l.dayOfMonth==n||l.type==="fixed"&&l.date===s)&&(m=!0),m&&(r.some(d=>d.title===l.title&&d.timeframe==="day"&&!d.completed)||r.push({id:crypto.randomUUID(),title:l.title,timeframe:"day",completed:!1,color:l.color||"#ffffff",createdAt:Date.now(),scheduledTaskId:l.id}),l.lastProcessed=s,o=!0)}),o&&this.setState({goals:r,scheduledTasks:i})}addSkill(e){const s={id:crypto.randomUUID(),name:"",level:0,category:"current",...e,createdAt:Date.now()};this.setState({skills:[...this.state.skills||[],s]})}updateSkill(e,s){this.setState({skills:this.state.skills.map(t=>t.id===e?{...t,...s}:t)})}deleteSkill(e){this.setState({skills:this.state.skills.filter(s=>s.id!==e)})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(s=>s.timeframe!==e||!s.completed)})}updateGoal(e,s){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,...s}:t)})}toggleSubGoal(e,s){const t=this.state.goals.find(o=>o.id===e);if(!t||!t.subGoals)return;const n=[...t.subGoals];n[s].completed=!n[s].completed,this.updateGoal(e,{subGoals:n})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,s){this.updateGoal(e,{color:s})}addEvent(e){const s={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,s]}),this.scheduleNotification(s)}deleteEvent(e){this.setState({events:this.state.events.filter(s=>s.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}addPerson(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({social:{...this.state.social,people:[...this.state.social.people,s]}}),s}updatePerson(e,s){this.setState({social:{...this.state.social,people:this.state.social.people.map(t=>t.id===e?{...t,...s}:t)}})}deletePerson(e){this.setState({social:{...this.state.social,people:this.state.social.people.filter(s=>s.id!==e)}})}movePerson(e,s){this.updatePerson(e,{columnId:s})}addSocialColumn(e){const s={id:crypto.randomUUID(),order:this.state.social.columns.length,...e};this.setState({social:{...this.state.social,columns:[...this.state.social.columns,s]}})}updateSocialColumn(e,s){this.setState({social:{...this.state.social,columns:this.state.social.columns.map(t=>t.id===e?{...t,...s}:t)}})}deleteSocialColumn(e){this.setState({social:{...this.state.social,columns:this.state.social.columns.filter(s=>s.id!==e),people:this.state.social.people.filter(s=>s.columnId!==e)}})}reorderSocialColumns(e){this.setState({social:{...this.state.social,columns:e}})}updateIdealLeadProfile(e){this.setState({social:{...this.state.social,idealLeadProfile:e}})}addCommunication(e){const s={id:crypto.randomUUID(),order:this.state.social.communications.length,rating:1,lastUsed:{},...e};this.setState({social:{...this.state.social,communications:[...this.state.social.communications,s]}})}updateCommunication(e,s){this.setState({social:{...this.state.social,communications:this.state.social.communications.map(t=>t.id===e?{...t,...s}:t)}})}deleteCommunication(e){this.setState({social:{...this.state.social,communications:this.state.social.communications.filter(s=>s.id!==e)}})}reorderCommunications(e){this.setState({social:{...this.state.social,communications:e}})}logCommunicationUsed(e,s){const t=Date.now(),n=this.state.social.communications.map(i=>i.id===e?{...i,lastUsed:{...i.lastUsed||{},[s]:t}}:i),o=this.state.social.people.map(i=>i.id===s?{...i,lastContact:new Date(t).toISOString().split("T")[0]}:i);this.setState({social:{...this.state.social,communications:n,people:o}})}updateContactSources(e){this.setState({social:{...this.state.social,contactSources:e}})}addWealthGoal(e){const s={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({wealthGoals:[...this.state.wealthGoals||[],s]}),s}updateWealthGoal(e,s){this.setState({wealthGoals:this.state.wealthGoals.map(t=>t.id===e?{...t,...s}:t)})}deleteWealthGoal(e){this.setState({wealthGoals:this.state.wealthGoals.filter(s=>s.id!==e)})}reorderWealthGoals(e,s){const t=[...this.state.wealthGoals],n=t.findIndex(i=>i.id===e);if(n===-1)return;const o=s==="up"?n-1:n+1;o<0||o>=t.length||([t[n],t[o]]=[t[o],t[n]],this.setState({wealthGoals:t}))}setInflationRate(e){this.setState({inflationRate:parseFloat(e)})}setProjectionYears(e){this.setState({projectionYears:parseInt(e)})}addTimeActivity(e){const s=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,activities:[...this.state.timeInvest.activities,{...e,id:s}]}})}updateTimeActivity(e,s){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.map(t=>t.id===e?{...t,...s}:t)}})}deleteTimeActivity(e){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.filter(s=>s.id!==e),logs:this.state.timeInvest.logs.filter(s=>s.activityId!==e)}})}addTimeLog(e){const s=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,logs:[...this.state.timeInvest.logs,{...e,id:s}]}})}setPomodoroTime(e){this.setState({timeInvest:{...this.state.timeInvest,pomodoroTime:parseInt(e)}})}}const u=new ft,bt=[{id:"health",icon:"heart",label:"Health"},{id:"finance",icon:"wallet",label:"Finance"},{id:"social",icon:"users",label:"Connections"},{id:"time-invest",icon:"clock",label:"Time Invest"},{id:"goals",icon:"target",label:"Goals"},{id:"menu",icon:"menu",label:"Menu"}];function Se(a="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,s=bt.map(t=>`
        <div class="nav-item ${t.id===a?"active":""}" data-nav="${t.id}">
            ${p(t.icon,"nav-icon")}
            <span class="nav-label">${t.label}</span>
        </div>
    `).join("");return e+s}function Re(a){const e=document.querySelectorAll(".nav-item");e.forEach(s=>{s.addEventListener("click",()=>{const t=s.dataset.nav;e.forEach(n=>n.classList.remove("active")),s.classList.add("active"),a&&a(t)})})}function w(a,e="$"){const s=Math.abs(a);let t=0,n=0;e==="₿"?(t=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(t=0,n=2);const o=new Intl.NumberFormat("en-US",{minimumFractionDigits:t,maximumFractionDigits:n}).format(s);return`${a<0?"-":""}${e}${o}`}function oe(a){return a==null?"0.0%":`${a>=0?"+":""}${a.toFixed(1)}%`}const wt="https://api.coingecko.com/api/v3",b={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},xt=5*60*1e3;let me={data:null,timestamp:0,currency:"USD"};const Y=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:b.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:b.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:b.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:b.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:b.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:b.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:b.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:b.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:b.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:b.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:b.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:b.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:b.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:b.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:b.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:b.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:b.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:b.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:b.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:b.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:b.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:b.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:b.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:b.CRYPTO_ALTS,icon:"bitcoin"}];async function Xe(){const a="usd";if(me.data&&Date.now()-me.timestamp<xt)return me.data;const e=Y.map(t=>t.cgId).filter(Boolean).join(","),s=`${wt}/coins/markets?vs_currency=${a}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const t=await fetch(s),n=t.ok?await t.json():[],o=Y.filter(l=>l.yahooId),i=await kt(o),r=Y.map(l=>{if(l.cgId){const m=n.find(c=>c.id===l.cgId);if(m)return{...l,price:m.current_price,image:m.image,change24h:m.price_change_percentage_24h_in_currency||m.price_change_percentage_24h||0,change7d:m.price_change_percentage_7d_in_currency||0,change30d:m.price_change_percentage_30d_in_currency||0,change1y:m.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&i[l.yahooId]){const m=i[l.yahooId];return{...l,price:m.price,change24h:m.change24h,change7d:m.change7d,change30d:m.change30d,change1y:m.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return me={data:r,timestamp:Date.now(),currency:"USD"},r}catch(t){return console.error("Market fetch failed",t),Y.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function kt(a){const e={};return await Promise.all(a.map(async s=>{try{const t=`https://query1.finance.yahoo.com/v8/finance/chart/${s.yahooId}?interval=1d&range=2y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(t)}`,i=await(await fetch(n)).json(),r=JSON.parse(i.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],m=l.meta,d=l.indicators.quote[0].close.filter(R=>R!==null&&R>0);if(d.length===0)throw new Error("No valid price data");const g=m.regularMarketPrice||d[d.length-1],h=d.length-1,f=d[Math.max(0,h-1)],y=(g-f)/f*100,x=d[Math.max(0,h-5)],k=(g-x)/x*100,L=d[Math.max(0,h-21)],E=(g-L)/L*100,P=d[Math.max(0,h-252)],M=(g-P)/P*100;e[s.yahooId]={price:g,change24h:isNaN(y)?0:y,change7d:isNaN(k)?0:k,change30d:isNaN(E)?0:E,change1y:isNaN(M)?0:M}}catch(t){console.warn(`Failed to fetch ${s.symbol} from Yahoo`,t),e[s.yahooId]=null}})),e}const Et={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let ce=null,ee=null;function Je(a,e){const s=Et[e];if(!s){console.error("Unknown category:",e);return}const o=u.getState()[s.storeKey].find(r=>r.id===a);if(!o){console.error("Item not found:",a);return}ce=o,ee=e;const i=document.createElement("div");i.className="modal-overlay",i.id="edit-modal",i.innerHTML=It(o,s),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("active")}),Lt(s)}const St=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],$t={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function It(a,e){const s=ee==="investment"||ee==="passive",t=$t[ee]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="edit-value" value="${a.value||0}" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${a.monthlyIncome||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("value")?n=`
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="edit-value" value="${a.value||0}" step="any" inputmode="decimal">
      </div>
    `:e.fields.includes("amount")&&e.fields.includes("monthlyPayment")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="edit-amount" value="${a.amount||0}" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${a.monthlyPayment||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("amount")&&(n=`
      <div class="form-group">
        <label class="form-label">${ee==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${a.amount||0}" inputmode="numeric">
      </div>
    `),`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">Editar ${e.label}</h2>
        <button class="modal-close" id="edit-modal-close">
          ${p("x")}
        </button>
      </div>

      <div class="form-row">
          <div class="form-group" style="flex: 1.5;">
              <label class="form-label">Tipo</label>
              <select class="form-input form-select" id="edit-type">
                  ${t.map(o=>`<option value="${o.value}" ${o.value===a.type?"selected":""}>${o.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${St.map(o=>`<option value="${o.value}" ${o.value===a.currency?"selected":""}>${o.label}</option>`).join("")}
                  </optgroup>
                  ${s?`
                  <optgroup label="Mercados Reales">
                      ${Y.map(o=>`<option value="${o.symbol}" ${o.symbol===a.currency?"selected":""}>${o.name} (${o.symbol})</option>`).join("")}
                  </optgroup>
                  `:""}
              </select>
          </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${a.name||""}">
      </div>
      
      ${n}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${a.details||""}" placeholder="Notas adicionales...">
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
        <button class="btn btn-danger" id="btn-delete" style="flex: 0 0 auto; width: auto; padding: 14px 20px;">
          ${p("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function Lt(a){const e=document.getElementById("edit-modal"),s=document.getElementById("edit-modal-close"),t=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",o=>{o.target===e&&ve()}),s.addEventListener("click",ve),t.addEventListener("click",()=>At(a)),n.addEventListener("click",()=>Ct(a))}function At(a){var m,c,d,g,h,f,y,x,k;const e=(c=(m=document.getElementById("edit-name"))==null?void 0:m.value)==null?void 0:c.trim(),s=(d=document.getElementById("edit-type"))==null?void 0:d.value,t=(g=document.getElementById("edit-currency"))==null?void 0:g.value,n=(f=(h=document.getElementById("edit-details"))==null?void 0:h.value)==null?void 0:f.trim(),o=parseFloat((y=document.getElementById("edit-value"))==null?void 0:y.value)||0,i=parseFloat((x=document.getElementById("edit-amount"))==null?void 0:x.value)||0,r=parseFloat((k=document.getElementById("edit-monthly"))==null?void 0:k.value)||0;if(!e){v.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:s,currency:t,details:n};a.fields.includes("value")&&(l.value=o),a.fields.includes("amount")&&(l.amount=i),a.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),a.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),u[a.updateMethod](ce.id,l),ve()}function Ct(a){v.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${ce.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(u[a.deleteMethod](ce.id),v.toast("Eliminado correctamente","info"),ve())})}function ve(){const a=document.getElementById("edit-modal");a&&(a.classList.remove("active"),setTimeout(()=>a.remove(),300)),ce=null,ee=null}let te=!1,se=!1,S={key:"price",direction:"desc"},ne="USD",F=null;function Tt(){const a=u.getState(),e=a.lastMarketData||[],s=a.marketFavorites||[];F===null&&(F=s.length>0?"favorites":"all"),!se&&!te&&Rt();const t=ne==="EUR"?"€":"$";let n=e;F==="favorites"&&(n=e.filter(i=>s.includes(i.id)));const o=Object.values(b);return`
        <div class="market-view animate-fade-in" style="padding: 4px;">
            <!-- Single Line Header Controls -->
            <div class="market-controls-row">
                <div class="market-group">
                    <button class="filter-chip ${F==="all"?"active":""}" id="filter-all">
                        Todos
                    </button>
                    <button class="filter-chip ${F==="favorites"?"active":""}" id="filter-favs">
                        ${p("star","tiny-icon")} Favoritos
                    </button>
                </div>

                <div class="market-status-badge ${te?"market-status-fresh":"market-status-cached"}" title="Tasa de refresco: 5 min">
                    ${se?'<div class="loading-spinner-sm" style="width:10px; height:10px;"></div>':p(te?"check":"save","tiny-icon")}
                    <span>${se?"Updating":te?"Live":"Cached"}</span>
                </div>

                <div class="capsule-toggle">
                    <button class="capsule-btn ${ne==="USD"?"active":""}" data-curr="USD">USD</button>
                    <button class="capsule-btn ${ne==="EUR"?"active":""}" data-curr="EUR">EUR</button>
                </div>
            </div>

            <!-- Content -->
            ${n.length===0&&F==="favorites"?Bt():""}
            ${n.length===0&&F==="all"?Pt():""}
            
            ${o.map(i=>{const r=n.filter(l=>l.category===i);return r.length===0?"":Dt(i,r,t,s)}).join("")}
        </div>
    `}function Dt(a,e,s,t){const n=[...e].sort((o,i)=>{let r=o[S.key],l=i[S.key];return typeof r=="string"&&(r=r.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),r<l?S.direction==="asc"?-1:1:r>l?S.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-top: var(--spacing-lg);">
            <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                    ${a}
                </h3>
                <span style="font-size: 10px; color: var(--text-muted); opacity: 0.5;">${e.length} activos</span>
            </header>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(10, 15, 30, 0.4); border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div class="table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th style="width: 44px;"></th>
                                <th data-sort="name" class="sortable ${S.key==="name"?S.direction:""}">Nombre</th>
                                <th data-sort="price" class="sortable text-right ${S.key==="price"?S.direction:""}">Precio</th>
                                <th data-sort="change24h" class="sortable text-right ${S.key==="change24h"?S.direction:""}">24h</th>
                                <th data-sort="change30d" class="sortable text-right ${S.key==="change30d"?S.direction:""}">30d</th>
                                <th data-sort="change1y" class="sortable text-right ${S.key==="change1y"?S.direction:""}">1y</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${n.map(o=>Mt(o,s,t.includes(o.id))).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}function Mt(a,e,s){let t=a.price;if(a.price!==null&&ne==="EUR"){const r=u.getState().rates.USD||.92;t=a.price*r}const n=Ee(a.change24h),o=Ee(a.change30d),i=Ee(a.change1y);return`
        <tr class="market-row" data-id="${a.id}">
            <td style="padding: 0 0 0 12px; width: 44px;">
                <button class="btn-favorite ${s?"active":""}" data-id="${a.id}">
                    ${p("star")}
                </button>
            </td>
            <td>
                <div class="asset-cell">
                     ${a.image?`<img src="${a.image}" alt="${a.symbol}" style="width: 22px; height: 22px; border-radius: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`:`<div class="asset-icon-tiny" style="background: rgba(255,255,255,0.05); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${p(a.icon||"trendingUp")}</div>`}
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <span class="asset-symbol" style="line-height: 1.2;">${a.symbol.toUpperCase()}</span>
                        <span class="asset-name-tiny">${a.name}</span>
                    </div>
                </div>
            </td>
            <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${t!==null?w(t,e):"-"}</td>
            <td class="text-right font-mono ${n}" style="font-weight: 700;">
                ${a.change24h!==null?oe(a.change24h):"-"}
            </td>
            <td class="text-right font-mono ${o}" style="font-size: 11px; opacity: 0.9;">
                ${a.change30d!==null?oe(a.change30d):"-"}
            </td>
            <td class="text-right font-mono ${i}" style="font-size: 11px; opacity: 0.9;">
                ${a.change1y!==null?oe(a.change1y):"-"}
            </td>
        </tr>
    `}function Ee(a){return a==null?"":te?a>=0?"text-positive":"text-negative":"text-accent-primary"}function Bt(){return`
        <div class="empty-state" style="padding: 60px 20px; text-align: center; background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); border: 1px dashed rgba(255,255,255,0.1); margin-top: 20px;">
            <div style="font-size: 32px; margin-bottom: 12px; filter: grayscale(1);">⭐</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">No hay favoritos todavía</h3>
            <p style="color: var(--text-muted); font-size: 14px; max-width: 250px; margin: 0 auto;">Marca con una estrella los activos que quieres seguir de cerca.</p>
            <button class="btn btn-secondary" id="btn-show-all" style="margin-top: 24px; font-size: 12px; padding: 10px 20px; border-radius: 30px;">Ver todos los activos</button>
        </div>
    `}function Pt(){return`
        <div class="empty-state" style="padding: 100px 0;">
             <div class="loading-spinner"></div>
             <p style="margin-top: 20px; color: var(--text-muted); font-size: 14px; letter-spacing: 0.5px;">CONSULTANDO MERCADOS GLOBALES...</p>
        </div>
    `}async function Rt(){var a,e;if(!se){se=!0,(a=window.reRender)==null||a.call(window);try{const s=await Xe();u.saveMarketData(s),te=!0}catch(s){console.error("Market update failed",s)}finally{se=!1,(e=window.reRender)==null||e.call(window)}}}function jt(){var a,e,s;document.querySelectorAll(".capsule-btn").forEach(t=>{t.addEventListener("click",()=>{var o;const n=t.dataset.curr;n!==ne&&(ne=n,(o=window.reRender)==null||o.call(window))})}),(a=document.getElementById("filter-all"))==null||a.addEventListener("click",()=>{var t;F="all",(t=window.reRender)==null||t.call(window)}),(e=document.getElementById("filter-favs"))==null||e.addEventListener("click",()=>{var t;F="favorites",(t=window.reRender)==null||t.call(window)}),(s=document.getElementById("btn-show-all"))==null||s.addEventListener("click",()=>{var t;F="all",(t=window.reRender)==null||t.call(window)}),document.querySelectorAll(".btn-favorite").forEach(t=>{t.addEventListener("click",n=>{var i;n.stopPropagation();const o=t.dataset.id;u.toggleMarketFavorite(o),(i=window.reRender)==null||i.call(window)})}),document.querySelectorAll(".market-table th.sortable").forEach(t=>{t.addEventListener("click",()=>{var o;const n=t.dataset.sort;S.key===n?S.direction=S.direction==="asc"?"desc":"asc":(S.key=n,S.direction="desc",n==="name"&&(S.direction="asc")),(o=window.reRender)==null||o.call(window)})})}function _t(){const a=u.getState(),{wealthGoals:e=[],inflationRate:s=3,projectionYears:t=10,currencySymbol:n}=a,o=u.getAllExpenses();let i=0;e.forEach(d=>{const g=d.cost*(d.dividendYield/100)/12;i+=u.convertValue(g,d.currency||a.currency)});const r=i-o,l=o*Math.pow(1+s/100,t);let m=0;e.forEach(d=>{const h=d.cost*Math.pow(1+d.annualGrowth/100,t)*(d.dividendYield/100)/12;m+=u.convertValue(h,d.currency||a.currency)});const c=m-l;return`
    <div class="wealth-goals-view animate-fade-in">
        <!-- Projections Summary Card -->
        <div class="card projection-summary-card">
            <div class="card-header">
                <span class="card-title">Proyección de Libertad Financiera</span>
                ${p("trendingUp","card-icon")}
            </div>
            
            <div class="projection-grid">
                <div class="projection-col">
                    <div class="projection-label">Estado Actual</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos</span>
                        <span class="positive">${w(i,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Totales</span>
                        <span class="negative">${w(o,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto</span>
                        <span class="${r>=0?"positive":"negative"}">${w(r,n)}</span>
                    </div>
                </div>

                <div class="projection-divider-vertical"></div>

                <div class="projection-col">
                    <div class="projection-label">En ${t} años (${s}% inf.)</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos Est.</span>
                        <span class="positive">${w(m,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Est.</span>
                        <span class="negative">${w(l,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto Proyectado</span>
                        <span class="${c>=0?"positive":"negative"}">${w(c,n)}</span>
                    </div>
                </div>
            </div>
            
            <div class="projection-settings-row">
                <div class="setting-item">
                    <label>Años proyectados: ${t}</label>
                    <input type="range" id="years-slider" min="1" max="50" step="1" value="${t}">
                </div>
                <div class="setting-item">
                    <label>Inflación anual: ${s}%</label>
                    <input type="range" id="inflation-slider" min="0" max="20" step="0.5" value="${s}">
                </div>
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Objetivos Patrimoniales</span>
            <button class="btn-add-goal-inline btn-large-inline" id="btn-add-wealth-goal">
                ${p("plus")} Agregar
            </button>
        </div>

        <div class="wealth-goals-list">
            ${e.length===0?`
                <div class="empty-state">
                    ${p("target","empty-icon")}
                    <p>No tienes objetivos guardados aún.</p>
                </div>
            `:e.map(d=>Ut(d,a)).join("")}
        </div>
    </div>
    `}function Ut(a,e){const s=e.currencySymbol,t=a.cost*(a.dividendYield/100)/12,n=u.convertValue(t,a.currency||e.currency);return`
    <div class="card wealth-goal-card" data-id="${a.id}">
        <div class="goal-card-main">
            <div class="goal-card-info">
                <div class="goal-name">${a.name}</div>
                <div class="goal-cost">${w(a.cost,a.currency||e.currency)} cost</div>
            </div>
            <div class="goal-card-yield">
                <div class="yield-value">+${w(n,s)}/mes</div>
                <div class="yield-pct">${a.dividendYield}% div.</div>
            </div>
        </div>
        <div class="goal-card-details">
            <div class="detail-item">
                <span class="detail-label">Crecimiento Anual:</span>
                <span class="detail-value">${a.annualGrowth}%</span>
            </div>
            <div class="goal-actions">
                <div class="goal-reorder-actions">
                    <button class="icon-btn reorder-wealth-goal" data-id="${a.id}" data-dir="up">${p("chevronUp")}</button>
                    <button class="icon-btn reorder-wealth-goal" data-id="${a.id}" data-dir="down">${p("chevronDown")}</button>
                </div>
                <div style="flex: 1;"></div>
                <button class="icon-btn edit-wealth-goal" data-id="${a.id}">${p("edit")}</button>
                <button class="icon-btn delete-wealth-goal" data-id="${a.id}">${p("trash")}</button>
            </div>
        </div>
    </div>
    `}function Ot(){var s;(s=document.getElementById("btn-add-wealth-goal"))==null||s.addEventListener("click",async()=>{je()}),document.querySelectorAll(".edit-wealth-goal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=u.getState().wealthGoals.find(r=>r.id===o);i&&je(i)})}),document.querySelectorAll(".delete-wealth-goal").forEach(t=>{t.addEventListener("click",async n=>{var r;n.stopPropagation();const o=t.dataset.id;await v.confirm("Eliminar objetivo","¿Estás seguro de que deseas eliminar este objetivo?")&&(u.deleteWealthGoal(o),(r=window.reRender)==null||r.call(window))})}),document.querySelectorAll(".reorder-wealth-goal").forEach(t=>{t.addEventListener("click",n=>{var r;n.stopPropagation();const o=t.dataset.id,i=t.dataset.dir;u.reorderWealthGoals(o,i),(r=window.reRender)==null||r.call(window)})});const a=document.getElementById("inflation-slider");a&&a.addEventListener("change",t=>{var n;u.setInflationRate(t.target.value),(n=window.reRender)==null||n.call(window)});const e=document.getElementById("years-slider");e&&e.addEventListener("change",t=>{var n;u.setProjectionYears(t.target.value),(n=window.reRender)==null||n.call(window)})}async function je(a=null){const e=!!a,s=e?"Editar Objetivo":"Nuevo Objetivo Patrimonial",t=document.createElement("div");t.className="modal-overlay active overlay-centered",t.innerHTML=`
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${s}</h3>
                <button class="close-modal-btn">${p("x")}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre del Objetivo</label>
                    <input type="text" id="goal-name" class="form-input" placeholder="Ej: Inmueble en Carlos Paz" value="${(a==null?void 0:a.name)||""}">
                </div>
                <div class="form-group">
                    <label class="form-label">Coste / Valor actual</label>
                    <div class="input-with-currency">
                        <input type="number" id="goal-cost" class="form-input" placeholder="100000" value="${(a==null?void 0:a.cost)||""}">
                        <select id="goal-currency" class="currency-mini-select">
                            ${["EUR","USD","ARS","GBP","CHF"].map(r=>`<option value="${r}" ${(a==null?void 0:a.currency)===r?"selected":""}>${r}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Crecimiento % (Anual)</label>
                        <input type="number" id="goal-growth" class="form-input" placeholder="5" value="${(a==null?void 0:a.annualGrowth)||""}" step="0.1">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Dividendos % (Anual)</label>
                        <input type="number" id="goal-dividend" class="form-input" placeholder="4" value="${(a==null?void 0:a.dividendYield)||""}" step="0.1">
                    </div>
                </div>
                <button class="btn btn-primary" id="save-goal-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${e?"Guardar Cambios":"Crear Objetivo"}
                </button>
            </div>
        </div>
    `,document.body.appendChild(t);const n=t.querySelector(".close-modal-btn"),o=t.querySelector("#save-goal-btn"),i=()=>{t.classList.remove("active"),setTimeout(()=>t.remove(),300)};n.addEventListener("click",i),t.addEventListener("click",r=>{r.target===t&&i()}),o.addEventListener("click",()=>{var h;const r=t.querySelector("#goal-name").value,l=parseFloat(t.querySelector("#goal-cost").value),m=parseFloat(t.querySelector("#goal-growth").value)||0,c=parseFloat(t.querySelector("#goal-dividend").value)||0,d=t.querySelector("#goal-currency").value;if(!r||isNaN(l)){v.toast("Completa nombre y coste","error");return}const g={name:r,cost:l,annualGrowth:m,dividendYield:c,currency:d};e?(u.updateWealthGoal(a.id,g),v.toast("Objetivo actualizado")):(u.addWealthGoal(g),v.toast("Objetivo creado")),i(),(h=window.reRender)==null||h.call(window)})}let _="summary";function _e(){const a=u.getState(),e=a.currencySymbol;return setTimeout(_==="markets"||_==="goals"?N:O,0),`
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="margin-bottom: var(--spacing-md);">
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <!-- Finance Tabs (Segmented Control) -->
      <div class="segmented-control">
        <button class="segment-btn ${_==="summary"?"active":""}" id="tab-summary">
            Summary
        </button>
        <button class="segment-btn ${_==="goals"?"active":""}" id="tab-goals">
            Goals
        </button>
        <button class="segment-btn ${_==="markets"?"active":""}" id="tab-markets">
            Markets
        </button>
      </div>
      
      ${_==="summary"?Nt(a,e):_==="goals"?_t():Tt()}
      
    </div>
  `}function Nt(a,e){const s=u.getPassiveIncome(),t=u.getLivingExpenses(),n=u.getNetPassiveIncome(),o=u.getInvestmentAssetsValue(),i=u.getTotalLiabilities(),r=u.getNetWorth(),l=u.getAllIncomes(),m=u.getAllExpenses(),c=u.getNetIncome();return`
      <div class="finance-top-grid animate-fade-in">
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${n<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${p("piggyBank","card-icon")}
          </div>
          <div class="highlight-value ${n<0?"highlight-value-negative":""}">${w(n,e)}</div>
          <div class="highlight-label ${n<0?"highlight-label-negative":""}">
            ${n>=0?"🎉 ¡Libertad financiera alcanzada!":`Faltan ${w(Math.abs(n),e)}/mes`}
          </div>
        </div>

        <!-- PRIMARY METRICS -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Flujo Pasivo Mensual</span>
            ${p("zap","card-icon")}
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot income"></span>
              Ingresos Pasivos
            </span>
            <span class="stat-value positive">${w(s,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${w(t,e)}</span>
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
            <div class="summary-value text-primary-accent">${w(o,e)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${w(i,e)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${p("scale","card-icon")}
          </div>
          <div class="stat-value ${r>=0?"positive":"negative"}" style="font-size: 32px; font-weight: 800; text-align: center; margin-top: var(--spacing-sm);">
            ${w(r,e)}
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
          <span class="stat-value positive">${w(l,e)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot expense"></span>
            Todos los Gastos
          </span>
          <span class="stat-value negative">${w(m,e)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${c>=0?"positive":"negative"}" style="font-size: 20px;">
            ${w(c,e)}
          </span>
        </div>
      </div>
      
      <div class="finance-links-grid">
        <button class="compound-link-btn" id="open-expenses" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%); border-color: rgba(239, 68, 68, 0.3);">
          <div class="compound-link-content">
            <div class="compound-link-icon" style="background: rgba(239,68,68,0.2); color: var(--accent-danger);">
              ${p("creditCard")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Ver Gastos Mensuales</div>
              <div class="compound-link-subtitle">Detalle de salidas y deudas</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${p("chevronRight")}
          </div>
        </button>

        <!-- COMPOUND INTEREST CALCULATOR LINK -->
        <button class="compound-link-btn" id="open-compound">
          <div class="compound-link-content">
            <div class="compound-link-icon">
              ${p("calculator")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Calculadora de Interés Compuesto</div>
              <div class="compound-link-subtitle">Proyecta el crecimiento de tu patrimonio</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${p("chevronRight")}
          </div>
        </button>
      </div>

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${Gt(a)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${Ft(a)}

      <!-- FOOTER BUTTONS & SETTINGS -->
      <div class="section-divider">
        <span class="section-title">Configuración</span>
      </div>

      <div class="footer-actions">
        <div class="card" style="margin-top: var(--spacing-md); padding: var(--spacing-md) !important;">
            <div class="footer-setting-row">
                <div class="setting-info">
                    <div class="setting-label">Divisa de Visualización</div>
                    <div class="setting-desc">Toda la plataforma cambiará a esta moneda</div>
                </div>
                <div class="premium-select-wrapper">
                    <select class="premium-select" id="display-currency-select">
                        <option value="EUR" ${a.currency==="EUR"?"selected":""}>EUR (€)</option>
                        <option value="USD" ${a.currency==="USD"?"selected":""}>USD ($)</option>
                        <option value="CHF" ${a.currency==="CHF"?"selected":""}>CHF (Fr)</option>
                        <option value="GBP" ${a.currency==="GBP"?"selected":""}>GBP (£)</option>
                        <option value="AUD" ${a.currency==="AUD"?"selected":""}>AUD (A$)</option>
                        <option value="ARS" ${a.currency==="ARS"?"selected":""}>ARS ($)</option>
                        <option value="BTC" ${a.currency==="BTC"?"selected":""}>BTC (₿)</option>
                    </select>
                    <div class="premium-select-icon">
                        ${p("chevronDown","tiny-icon")}
                    </div>
                </div>
            </div>
        </div>
      </div>
  `}function Gt(a){const e=[...a.passiveAssets,...a.investmentAssets],s=a.liabilities;if(e.length===0)return"";const t={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(c=>{const d=u.convertValue(c.value||0,c.currency||"EUR");c.currency==="BTC"?t.Bitcoin.value+=d:c.currency==="ETH"||c.currency==="XRP"||c.type==="crypto"?t.Altcoins.value+=d:c.type==="property"||c.type==="rental"?t.Inmuebles.value+=d:c.type==="stocks"||c.type==="etf"||c.currency==="SP500"?t.Bolsa.value+=d:c.currency==="GOLD"?t.Oro.value+=d:t["Otros/Efe."].value+=d});const n=s.filter(c=>c.type==="mortgage").reduce((c,d)=>c+u.convertValue(d.amount||0,d.currency||"EUR"),0);t.Inmuebles.value=Math.max(0,t.Inmuebles.value-n),a.hideRealEstate&&(t.Inmuebles.value=0);const o=Object.entries(t).filter(([c,d])=>d.value>0).sort((c,d)=>d[1].value-c[1].value),i=o.reduce((c,[d,g])=>c+g.value,0);if(i===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${a.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=o.map(([c,d])=>{const g=d.value/i*100,h=r;return r+=g,{name:c,percentage:g,color:d.color,start:h}}),m=l.map(c=>`${c.color} ${c.start}% ${c.start+c.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${a.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${m});">
          <div class="pie-center">
            <div class="pie-total">${w(i,a.currencySymbol)}</div>
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
  `}function Ft(a){const e=[...(a.activeIncomes||[]).map(t=>({...t,category:"activeIncome"})),...a.passiveAssets.map(t=>({...t,category:"passive"})),...a.investmentAssets.map(t=>({...t,category:"investment"})),...a.liabilities.map(t=>({...t,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${p("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const s=a.currencySymbol;return`
    <div class="asset-list">
      ${e.map(t=>{const n=qt(t.currency||t.type),o=Ht(t.currency||t.type),i=t.category==="liability",r=t.value||t.amount||0,l=u.convertValue(r,t.currency||"EUR");let m="";if(t.currency!==a.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[t.currency]||t.currency;m=`<div class="asset-original-value">${r} ${d}</div>`}return`
          <div class="asset-item" data-id="${t.id}" data-category="${t.category}">
            <div class="asset-icon-wrapper ${n}">
              ${p(o,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${t.name}</div>
              <div class="asset-details">${t.details||t.type||""}</div>
              ${m}
            </div>
            <div>
              <div class="asset-value ${i?"text-warning":""}">
                ${t.category==="activeIncome"?"+":i?"-":""}${w(l,s)}
                ${t.category==="activeIncome"?'<span style="font-size: 10px; opacity: 0.7; font-weight: 400;">/mes</span>':""}
              </div>
              ${t.monthlyIncome?`<div class="asset-yield">+${w(u.convertValue(t.monthlyIncome,t.currency),s)}/mes</div>`:""}
              ${t.monthlyPayment?`<div class="asset-yield text-negative">-${w(u.convertValue(t.monthlyPayment,t.currency),s)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function qt(a){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt",salary:"cash",freelance:"cash",business:"property"}[a]||"cash"}function Ht(a){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard",salary:"briefcase",freelance:"users",business:"building"}[a]||"dollarSign"}function Ue(){const a=document.getElementById("tab-summary"),e=document.getElementById("tab-markets"),s=document.getElementById("tab-goals");if(a&&e&&s&&(a.addEventListener("click",()=>{var i;_="summary",(i=window.reRender)==null||i.call(window)}),e.addEventListener("click",()=>{var i;_="markets",(i=window.reRender)==null||i.call(window)}),s.addEventListener("click",()=>{var i;_="goals",(i=window.reRender)==null||i.call(window)})),_==="markets"){jt();return}if(_==="goals"){Ot();return}document.querySelectorAll(".asset-item").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id,l=i.dataset.category;Je(r,l)})});const n=document.getElementById("toggle-real-estate");n&&n.addEventListener("change",()=>{u.toggleRealEstate()});const o=document.getElementById("display-currency-select");o&&o.addEventListener("change",i=>{u.setCurrency(i.target.value)})}let z=10,W=7,J=null,Z=null;function zt(){const e=u.getState().currencySymbol,s=u.getNetWorth(),n=u.getNetIncome()*12,o=J!==null?J:s,i=Z!==null?Z:n,r=Ze(o,i,W,z);return`
    <div class="compound-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
          <button class="back-btn" id="back-to-finance">
            ${p("chevronLeft")}
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
          ${p("settings","card-icon")}
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Capital Inicial</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="principal-input" 
                   value="${o}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-principal" title="Usar Patrimonio Neto">
              ${p("home")}
            </button>
          </div>
          <div class="compound-input-hint">Patrimonio actual: ${w(s,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Aporte Anual</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="contribution-input" 
                   value="${i}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-contribution" title="Usar Ingreso Neto × 12">
              ${p("zap")}
            </button>
          </div>
          <div class="compound-input-hint">Ingreso neto anual: ${w(n,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${W}" step="0.5">
            <span class="slider-value" id="rate-value">${W}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${z}">
            <span class="slider-value" id="years-value">${z} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${z} años</span>
          ${p("trendingUp","card-icon")}
        </div>
        <div class="highlight-value" id="future-value">${w(r.finalValue,e)}</div>
        <div class="highlight-label" id="growth-label">
          ${r.totalGrowth>=0?"📈":"📉"} ${r.growthMultiple.toFixed(1)}x tu capital inicial
        </div>
      </div>
      
      <!-- BREAKDOWN -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Desglose</span>
          ${p("coins","card-icon")}
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot asset"></span>
            Capital Inicial
          </span>
          <span class="stat-value neutral" id="initial-capital">${w(o,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Total Aportado
          </span>
          <span class="stat-value ${r.totalContributions>=0?"positive":"negative"}" id="total-contributed">${w(r.totalContributions,e)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot" style="background: var(--accent-secondary);"></span>
            Intereses Generados
          </span>
          <span class="stat-value" style="color: var(--accent-secondary);" id="total-interest">${w(r.totalInterest,e)}</span>
        </div>
        
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Valor Final
          </span>
          <span class="stat-value positive" style="font-size: 20px;" id="final-value-breakdown">${w(r.finalValue,e)}</span>
        </div>
      </div>
      
      <!-- YEAR BY YEAR PROJECTION -->
      <div class="section-divider">
        <span class="section-title">Proyección Año a Año</span>
      </div>
      
      <div class="projection-chart" id="projection-chart">
        ${Qe(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${et(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function Ze(a,e,s,t){const n=s/100,o=[];let i=a,r=0,l=0;for(let m=1;m<=t;m++){const c=i,d=i*n;i+=d+e,r+=e,l+=d,o.push({year:m,startBalance:c,contribution:e,interest:d,endBalance:i,totalContributions:r,totalInterest:l})}return{finalValue:i,totalContributions:r,totalInterest:l,totalGrowth:i-a,growthMultiple:a>0?i/a:0,yearlyBreakdown:o}}function Qe(a,e){if(a.length===0)return"";const s=Math.max(...a.map(n=>Math.abs(n.endBalance))),t=a.map((n,o)=>{const i=o/(a.length-1)*100,r=100-n.endBalance/s*100;return`${i},${r}`});return`
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
        <span>Año ${Math.floor(a.length/2)}</span>
        <span>Año ${a.length}</span>
      </div>
    </div>
  `}function et(a,e){const s=[];for(let t=0;t<a.length;t++){const n=a[t];(t<5||(t+1)%5===0||t===a.length-1)&&s.push(n)}return`
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
          ${s.map(t=>`
            <tr>
              <td>${t.year}</td>
              <td class="${t.endBalance>=0?"positive":"negative"}">${w(t.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${w(t.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Vt(a){const e=document.getElementById("back-to-finance"),s=document.getElementById("rate-slider"),t=document.getElementById("years-slider"),n=document.getElementById("principal-input"),o=document.getElementById("contribution-input"),i=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",a),n&&n.addEventListener("input",l=>{J=parseFloat(l.target.value)||0,Q()}),o&&o.addEventListener("input",l=>{Z=parseFloat(l.target.value)||0,Q()}),i&&i.addEventListener("click",()=>{J=null;const l=u.getNetWorth();n.value=l,Q()}),r&&r.addEventListener("click",()=>{Z=null;const l=u.getNetIncome()*12;o.value=l,Q()}),s&&s.addEventListener("input",l=>{W=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${W}%`,Q()}),t&&t.addEventListener("input",l=>{z=parseInt(l.target.value),document.getElementById("years-value").textContent=`${z} años`,Q()})}function Q(){const e=u.getState().currencySymbol,s=J!==null?J:u.getNetWorth(),t=Z!==null?Z:u.getNetIncome()*12,n=Ze(s,t,W,z),o=document.getElementById("future-value"),i=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),m=document.getElementById("total-contributed"),c=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),g=document.getElementById("projection-chart"),h=document.getElementById("projection-table");o&&(o.textContent=w(n.finalValue,e)),i&&(i.textContent=`Valor Futuro en ${z} años`),r&&(r.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=w(s,e)),m&&(m.textContent=w(n.totalContributions,e),m.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),c&&(c.textContent=w(n.totalInterest,e)),d&&(d.textContent=w(n.finalValue,e)),g&&(g.innerHTML=Qe(n.yearlyBreakdown)),h&&(h.innerHTML=et(n.yearlyBreakdown,e))}function Kt(){z=10,W=7,J=null,Z=null}let re=u.getState().lastMarketData||[],le=!1,A={key:"price",direction:"desc"},tt="";function Yt(){const a=u.getState(),e=a.currency||"EUR",s=a.currencySymbol||"€";if((re.length===0||tt!==e)&&(le||at(),re.length===0))return`
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
            `;const t=Object.values(b);return`
        <div class="market-page stagger-children" style="padding-bottom: 80px;">
            <header class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <button class="back-btn" id="market-back">
                            ${p("chevronLeft")}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${le?`
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

            ${t.map(n=>{const o=re.filter(i=>i.category===n);return o.length===0?"":Wt(n,o,s)}).join("")}
        </div>
    `}function Wt(a,e,s){const t=[...e].sort((n,o)=>{let i=n[A.key],r=o[A.key];return typeof i=="string"&&(i=i.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),i<r?A.direction==="asc"?-1:1:i>r?A.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${a}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${A.key==="name"?"active "+A.direction:""}" style="padding-left: var(--spacing-md);">Activo</th>
                                <th data-sort="price" class="${A.key==="price"?"active "+A.direction:""}">Precio</th>
                                <th data-sort="change24h" class="${A.key==="change24h"?"active "+A.direction:""}">24h</th>
                                <th data-sort="change30d" class="${A.key==="change30d"?"active "+A.direction:""}" style="padding-right: var(--spacing-md);">30d</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${t.map(n=>`
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${n.image?`<img src="${n.image}" alt="${n.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`:`<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${p(n.icon||"dollarSign")}
                                                </div>`}
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${n.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${n.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?w(n.price,s):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?oe(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?oe(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function at(){const e=u.getState().currency||"EUR";le||(le=!0,tt=e,re=await Xe(),u.saveMarketData(re),le=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function Xt(a){const e=document.getElementById("market-back");e&&e.addEventListener("click",a),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.sort;A.key===o?A.direction=A.direction==="asc"?"desc":"asc":(A.key=o,A.direction="desc",o==="name"&&(A.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.curr;u.setCurrency(o),at()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class Oe{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const s=this.getApiKey();if(!s)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],o=e.type,i=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:i},{inline_data:{mime_type:o,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const d=await l.json();throw new Error(((r=d.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const c=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(c)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((s,t)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>s(n.result),n.onerror=o=>t(o)})}}let ie=localStorage.getItem("life-dashboard/health_current_tab")||"diet";function Jt(){const a=u.getState(),{health:e}=a;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Health & Fitness</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${ie==="diet"?"active":""}" data-tab="diet">
            ${p("apple")} Dieta
        </button>
        <button class="health-tab-btn ${ie==="exercise"?"active":""}" data-tab="exercise">
            ${p("zap")} Ejercicio
        </button>
      </div>

      <div id="health-tab-content">
        ${ie==="diet"?Qt(e):Zt(e)}
      </div>

    </div>
    `}function Zt(a){return`
      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${a.routines.map((e,s)=>`
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${p("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${s}" data-dir="up">${p("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${s}" data-dir="down">${p("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${p("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${s}" data-name="${e.name}">
                    ${p("moreVertical")}
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
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="up">${p("chevronUp")}</button>
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="down">${p("chevronDown")}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${e.id}" data-index="${n}">${t.weight||50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${e.id}" data-index="${n}">${t.reps||10} reps</span>
                                    ${o.lastLog?`
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${ta(o.lastLog.rating)}</span>
                                    `:""}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            ${r?`
                                <div class="exercise-done-badge-solid">
                                    ${p("check","done-icon-solid")}
                                </div>
                            `:`
                                <button class="btn btn-secondary btn-icon-only log-stars-btn" data-rid="${e.id}" data-idx="${n}" title="Marcar como hecho">
                                    <span style="font-size: 20px;">🏋️‍♂️</span>
                                </button>
                            `}
                            <button class="icon-btn mobile-only ex-more-btn" data-routine="${e.id}" data-index="${n}" data-name="${t.name}">
                                ${p("moreVertical")}
                            </button>
                            <button class="ex-delete-mini desktop-only" data-routine="${e.id}" data-index="${n}" title="Eliminar">${p("trash")}</button>
                        </div>
                    </div>
                    `}).join("")}
            </div>
            <div class="add-ex-row" style="margin-top: var(--spacing-md);">
                <button class="btn btn-secondary add-ex-btn w-full" data-id="${e.id}">
                    ${p("plus")} Agregar Ejercicio
                </button>
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-success add-routine-btn w-full" id="add-routine-btn">
                ${p("plus")} Nueva Rutina
            </button>
        </div>
      </div>
    `}function Qt(a){const e=a.weightLogs.length>0?a.weightLogs[a.weightLogs.length-1].weight:"--",s=a.fatLogs.length>0?a.fatLogs[a.fatLogs.length-1].fat:null;let t="var(--text-muted)",n="Sin datos";return s!==null&&(s<12?(t="var(--accent-success)",n="Excelente (Atlético)"):s<=18?(t="var(--accent-tertiary)",n="Bueno (Fitness)"):(t="var(--accent-danger)",n="Atención (Reducción)")),`
      <!-- BODY HIGHLIGHT METRIC (UNIFIED) -->
      <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%); border-color: rgba(255,255,255,0.1); padding: 24px !important;">
          <div class="card-header" style="margin-bottom: 20px;">
              <span class="card-title">Resumen Físico Actual</span>
              ${p("activity","card-icon")}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
              <!-- WEIGHT SIDE -->
              <div class="clickable" id="log-weight-btn" style="text-align: center; border-right: 1px solid rgba(255,255,255,0.05);">
                  <div class="highlight-value" style="color: var(--accent-primary); font-size: 32px; margin: 0; line-height: 1;">${e} <span style="font-size: 14px; opacity: 0.6;">kg</span></div>
                  <div class="highlight-label" style="opacity: 0.8; margin-top: 8px;">Peso Actual</div>
              </div>

              <!-- FAT SIDE -->
              <div class="clickable" id="log-fat-btn" style="text-align: center;">
                  <div class="highlight-value" style="color: ${t}; font-size: 32px; margin: 0; line-height: 1;">${s||"--"} <span style="font-size: 14px; opacity: 0.6;">%</span></div>
                  <div class="highlight-label" style="color: ${t}; opacity: 0.9; margin-top: 8px;">${n}</div>
              </div>
          </div>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-xl);">
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${a.weightGoal} kg</div>
          <div class="summary-label">Peso Objetivo</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-date-btn">
          <div class="summary-value" style="font-size: 16px;">${a.weightGoalDate?new Date(a.weightGoalDate).toLocaleDateString():"--"}</div>
          <div class="summary-label">Fecha Límite</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${a.fatGoal}%</div>
          <div class="summary-label">Meta Grasa</div>
        </div>
      </div>

      <!-- TEARDOWN CHART -->
      ${ea(a)}

      <div class="card ai-calorie-card" id="ai-scan-photo" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 20px !important; margin-bottom: var(--spacing-2xl); cursor: pointer; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);">
          <div style="display: flex; align-items: center; gap: 15px;">
              <div style="background: var(--accent-primary); color: white; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                ${p("camera")}
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${aa(a)} kcal</div>
                <div style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Consumidas hoy</div>
              </div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 10px; font-size: 13px; font-weight: 700; color: var(--accent-primary);">
            Escanear Comida
          </div>
      </div>
    `}function ea(a){const e=[...a.weightLogs||[]].sort((G,we)=>G.date-we.date);if(e.length<1||!a.weightGoalDate)return`
            <div class="card chart-card">
                <div class="card-header">
                    <span class="card-title">Trayectoria de Peso</span>
                    ${p("trendingDown")}
                </div>
                <div class="empty-state" style="padding: var(--spacing-xl); text-align: center; opacity: 0.6;">
                    <p>Registra tu peso y establece una <br><strong>Fecha Objetivo</strong> para ver el gráfico.</p>
                </div>
            </div>
        `;const s=e[0],t=e[e.length-1],n=s.date,o=new Date(a.weightGoalDate).getTime(),i=Date.now(),l=Math.max(o,i)-n,m=e.map(G=>G.weight),c=Math.min(...m,a.weightGoal)-2,g=Math.max(...m,s.weight)+2-c,h=300,f=150,y=G=>(G-n)/l*h,x=G=>f-(G-c)/g*f,k=y(o),L=x(a.weightGoal),E=y(n),P=x(s.weight),M=e.map((G,we)=>`${we===0?"M":"L"} ${y(G.date)} ${x(G.weight)}`).join(" "),R=y(i),V=o-n,K=i-n,lt=Math.min(1,K/V),ct=s.weight-(s.weight-a.weightGoal)*lt,be=t.weight-ct,Ce=a.weightGoal<s.weight?be<0:be>0,Te=V/(1e3*60*60*24*7),dt=Te>0?(s.weight-a.weightGoal)/Te:0;return`
    <div class="card chart-card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header">
            <span class="card-title">Trayectoria de Peso</span>
            <span class="badge ${Ce?"badge-success":"badge-danger"}" style="font-size: 10px;">
                ${Ce?"Vas bien":"Por debajo del ritmo"} (${Math.abs(be).toFixed(1)}kg)
            </span>
        </div>
        
        <div class="teardown-chart-container" style="height: ${f}px; width: 100%; margin-top: 20px; position: relative;">
            <svg viewBox="0 0 ${h} ${f}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
                <!-- Grid -->
                <line x1="0" y1="${x(a.weightGoal)}" x2="${h}" y2="${x(a.weightGoal)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
                
                <!-- Target Line (Ideal) -->
                <line x1="${E}" y1="${P}" x2="${k}" y2="${L}" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5" />
                
                <!-- Real Progress -->
                <path d="${M}" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Markers -->
                <circle cx="${k}" cy="${L}" r="4" fill="var(--accent-primary)" />
                <circle cx="${y(t.date)}" cy="${x(t.weight)}" r="4" fill="var(--accent-primary)" />
                
                <!-- Today Marker -->
                <line x1="${R}" y1="0" x2="${R}" y2="${f}" stroke="var(--accent-tertiary)" stroke-width="1" opacity="0.5" />
            </svg>
        </div>
        
        <div class="chart-legend" style="margin-top: 15px; display: flex; flex-direction: column; gap: 4px; font-size: 10px; color: var(--text-muted);">
            <div style="display: flex; justify-content: space-between;">
                <span>Inicio: ${s.weight}kg</span>
                <span>Objetivo: ${a.weightGoal}kg (${new Date(a.weightGoalDate).toLocaleDateString()})</span>
            </div>
            <div style="display: flex; justify-content: center; font-weight: 600; color: var(--text-secondary); margin-top: 4px;">
                <span>Ritmo requerido: ${dt.toFixed(2)} kg / semana</span>
            </div>
        </div>
    </div>
    `}function ta(a){return a<=2?"😰":a<=4?"😐":"😄"}function aa(a){const e=new Date().toDateString();return(a.calorieLogs||[]).filter(s=>new Date(s.date).toDateString()===e).reduce((s,t)=>s+(t.calories||0),0)}function sa(){document.querySelectorAll(".health-tab-btn").forEach(a=>{a.addEventListener("click",()=>{const e=a.dataset.tab;e!==ie&&(ie=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),ie==="exercise"?na():ia()}function na(){var a;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.id,t=await v.prompt("Nuevo Ejercicio","Nombre del ejercicio:");t&&(u.addExerciseToRoutine(s,{name:t}),v.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.id,t=e.dataset.current,n=await v.prompt("Editar Rutina","Nombre de la rutina:",t);n&&n!==t&&(u.renameRoutine(s,n),v.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.id;await v.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(s),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const t=e.dataset.id,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await v.select(`Menú: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await v.prompt("Editar Rutina","Nuevo nombre:",o);l&&l!==o&&(u.renameRoutine(t,l),v.toast("Rutina renombrada"))}else r==="up"?u.reorderRoutine(n,"up"):r==="down"?u.reorderRoutine(n,"down"):r==="delete"&&await v.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(u.deleteRoutine(t),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.routine,t=parseInt(e.dataset.index),n=e.dataset.current,o=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",n);o&&o!==n&&(u.updateExercise(s,t,{name:o}),v.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.routine,t=parseInt(e.dataset.index);await v.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(s,t),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await v.select(`Ejercicio: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",o);l&&l!==o&&(u.updateExercise(t,n,{name:l}),v.toast("Ejercicio renombrado"))}else r==="up"?u.reorderExercise(t,n,"up"):r==="down"?u.reorderExercise(t,n,"down"):r==="delete"&&await v.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(u.deleteExerciseFromRoutine(t,n),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const t=parseInt(e.dataset.index),n=e.dataset.dir;u.reorderRoutine(t,n)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.dir;u.reorderExercise(t,n,o)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=10;r<=150;r+=2.5)o.push(`${r}kg`);const i=await v.select("Seleccionar Peso","Elige el peso para este ejercicio:",o,4);if(i){const r=parseFloat(i.replace("kg",""));u.updateExercise(t,n,{weight:r}),v.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=7;r<=20;r++)o.push(`${r} reps`);const i=await v.select("Seleccionar Reps","Elige las repeticiones objetivo:",o,4);if(i){const r=parseInt(i.replace(" reps",""));u.updateExercise(t,n,{reps:r}),v.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const t=e.dataset.rid,n=parseInt(e.dataset.idx),o=await v.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");o&&(u.logExercise(t,n,o),v.toast("Ejercicio registrado","success"))})}),(a=document.getElementById("add-routine-btn"))==null||a.addEventListener("click",async()=>{const e=await v.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(u.saveRoutine({name:e,exercises:[]}),v.toast("Rutina creada"))})}function ia(){var a,e,s,t,n,o;(a=document.getElementById("log-weight-btn"))==null||a.addEventListener("click",async()=>{const i=await v.prompt("Registrar Peso","Peso actual (kg):","","number");i&&(u.addWeightLog(parseFloat(i)),v.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const i=await v.prompt("Registrar Grasa","Porcentaje de grasa (%):","","number");i&&(u.addFatLog(parseFloat(i)),v.toast("Grasa registrada"))}),(s=document.getElementById("set-weight-goal-btn"))==null||s.addEventListener("click",async()=>{const i=u.getState().health.weightGoal,r=await v.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",i,"number");r&&(u.updateHealthGoal("weightGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(t=document.getElementById("set-weight-date-btn"))==null||t.addEventListener("click",async()=>{const i=u.getState().health.weightGoalDate||new Date().toISOString().split("T")[0],r=await v.prompt("Fecha Objetivo","¿Cuándo quieres llegar a tu meta?",i,"date");r&&(u.updateHealthGoal("weightGoalDate",r),v.toast("Fecha actualizada"))}),(n=document.getElementById("set-fat-goal-btn"))==null||n.addEventListener("click",async()=>{const i=u.getState().health.fatGoal,r=await v.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",i,"number");r&&(u.updateHealthGoal("fatGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(o=document.getElementById("ai-scan-photo"))==null||o.addEventListener("click",()=>{const i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=async l=>{var c;const m=l.target.files[0];if(m){if(!Oe.hasKey()){if(await v.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(c=document.querySelector('[data-nav="settings"]'))==null||c.click();return}v.toast("Usando simulación...","info"),r();return}try{v.toast("Analizando con Gemini...","info");const d=await Oe.analyzeFood(m);await v.confirm("IA Detectada",`Identificado: "${d.name}" (${d.calories} kcal). ¿Registrar?`)&&(u.addCalorieLog(d.calories,`${d.name} (AI)`),v.toast("Calorías registradas"))}catch(d){v.alert("Error IA",d.message)}}};function r(){setTimeout(async()=>{const l={name:"Bowl Saludable",calories:450};await v.confirm("IA Simulada",`Detectado "${l.name}" con ${l.calories} kcal. ¿Registrar?`)&&(u.addCalorieLog(l.calories,l.name),v.toast("Registrado"))},1e3)}i.click()})}const $e=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];function oa(){const a=u.getState(),{goals:e}=a,s=[{id:"day",label:"Today",icon:"zap",color:"#FFD700"},{id:"week",label:"This Week",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Year 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Long Term",icon:"trendingUp",color:"#EF4444"}];return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Goals & Focus</h1>
            <p class="page-subtitle">Organiza tus prioridades y objetivos dinámicos</p>
        </div>
        <button class="icon-btn" id="go-to-schedule" style="background: rgba(124, 58, 237, 0.1); color: #7c3aed; width: 44px; height: 44px; border-radius: 12px;" title="Programación">
            ${p("calendar")}
        </button>
      </header>

      <div class="goals-grid-layout">
        ${s.map(t=>{const n=e.filter(l=>l.timeframe===t.id),o=n.filter(l=>l.completed).length,i=n.length,r=i>0?o/i*100:0;return`
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${t.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${t.color}22; color: ${t.color}">${p(t.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${t.label}</span>
                        <span class="column-stats">${o}/${i}</span>
                    </div>
                    ${o>0?`
                        <button class="btn-clear-completed" data-tf="${t.id}" title="Limpiar completadas">
                            ${p("trash")}
                        </button>
                    `:""}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${r}%; background: ${t.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${t.id}">
                    ${ra(n,t.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${t.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${t.id}">
                        ${p("plus")}
                    </button>
                </div>
            </div>
          </div>
        `}).join("")}
      </div>
    </div>
  `}function ra(a,e){return a.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${p("package")}</div>
            </div>
        `:[...a].sort((t,n)=>t.completed!==n.completed?t.completed?1:-1:t.order!==void 0&&n.order!==void 0?t.order-n.order:(n.createdAt||0)-(t.createdAt||0)).map(t=>{const n=t.subGoals&&t.subGoals.length>0,o=n?t.subGoals.filter(r=>r.completed).length/t.subGoals.length*100:0,i=t.color||"#ffffff";return`
        <div class="goal-card-premium ${t.completed?"is-completed":""}" 
             data-id="${t.id}" 
             draggable="true"
             style="border-left: 4px solid ${i};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${t.id}" style="border-color: ${i}aa; background: ${t.completed?i:"transparent"}">
                    ${t.completed?p("check","check-icon-white"):""}
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
                            <button class="action-btn-mini add-subgoal" data-id="${t.id}" title="Hito">${p("plus")}</button>
                            <button class="action-btn-mini delete-goal" data-id="${t.id}" title="Borrar">${p("trash")}</button>
                        </div>
                    </div>
                    
                    ${n?`
                        <div class="subgoals-list-premium">
                            ${t.subGoals.map((r,l)=>`
                                <div class="subgoal-item-premium ${r.completed?"sub-done":""} toggle-subgoal" data-id="${t.id}" data-idx="${l}">
                                    <div class="sub-check" style="color: ${i}">${p(r.completed?"check":"plus","sub-check-svg")}</div>
                                    <span class="sub-title" style="color: ${i}ee">${r.title}</span>
                                </div>
                            `).join("")}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${o}%; background: ${i}"></div>
                            </div>
                        </div>
                    `:""}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${t.id}">
                        ${$e.map(r=>`
                            <div class="goal-color-dot ${r===i?"active":""} set-goal-color" 
                                 data-id="${t.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function la(){var t;(t=document.getElementById("go-to-schedule"))==null||t.addEventListener("click",()=>{window.location.hash="#schedule",window.dispatchEvent(new CustomEvent("nav-change",{detail:{page:"schedule"}}))}),document.querySelectorAll(".btn-clear-completed").forEach(n=>{n.addEventListener("click",async o=>{o.stopPropagation();const i=n.dataset.tf;await v.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(u.deleteCompletedGoals(i),v.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const i=n.dataset.id;u.toggleGoal(i)})}),document.querySelectorAll(".open-color-picker").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const i=n.dataset.id,r=document.getElementById(`colors-${i}`);document.querySelectorAll(".color-selector-overlay").forEach(l=>{l.id!==`colors-${i}`&&l.classList.add("hidden")}),r==null||r.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const i=n.dataset.id,r=n.dataset.color;u.updateGoalColor(i,r),v.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation();const i=n.dataset.id,r=parseInt(n.dataset.idx);u.toggleSubGoal(i,r)})}),document.querySelectorAll(".delete-goal").forEach(n=>{n.addEventListener("click",async o=>{o.stopPropagation(),await v.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(u.deleteGoal(n.dataset.id),v.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(n=>{n.addEventListener("click",async o=>{o.stopPropagation();const i=n.dataset.id,r=await v.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(r){const m=[...u.getState().goals.find(c=>c.id===i).subGoals||[],{title:r,completed:!1}];u.updateGoal(i,{subGoals:m}),v.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(n=>{n.addEventListener("click",async()=>{const o=n.dataset.id,i=n.textContent,r=await v.prompt("Editar Meta","Actualiza el texto:",i);r&&r!==i&&u.updateGoal(o,{title:r})})}),document.querySelectorAll(".quick-add-input-premium").forEach(n=>{n.addEventListener("keypress",o=>{if(o.key==="Enter"&&n.value.trim()){const i=n.dataset.timeframe;u.addGoal({title:n.value.trim(),timeframe:i,color:$e[0]}),n.value="",v.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.timeframe,i=n.previousElementSibling;i&&i.value.trim()?(u.addGoal({title:i.value.trim(),timeframe:o,color:$e[0]}),i.value="",v.toast("Creada")):i&&i.focus()})});const a=document.querySelectorAll(".goals-list-premium");let e=null;document.querySelectorAll(".goal-card-premium").forEach(n=>{n.addEventListener("dragstart",o=>{e=n.dataset.id,n.classList.add("dragging"),o.dataTransfer.effectAllowed="move"}),n.addEventListener("dragend",()=>{n.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(o=>o.classList.remove("drag-over"))})}),a.forEach(n=>{n.addEventListener("dragover",o=>{o.preventDefault(),n.classList.add("drag-over"),o.dataTransfer.dropEffect="move"}),n.addEventListener("dragleave",()=>{n.classList.remove("drag-over")}),n.addEventListener("drop",o=>{o.preventDefault(),n.classList.remove("drag-over");const i=n.dataset.timeframe,r=[...u.getState().goals],l=r.findIndex(g=>g.id===e);if(l===-1)return;const m={...r[l]};m.timeframe!==i&&(m.timeframe=i),r.splice(l,1);const c=s(n,o.clientY);if(c==null)r.push(m);else{const g=c.dataset.id,h=r.findIndex(f=>f.id===g);r.splice(h,0,m)}const d=r.map((g,h)=>({...g,order:h}));u.reorderGoals(d),v.toast("Orden actualizado")})});function s(n,o){return[...n.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((r,l)=>{const m=l.getBoundingClientRect(),c=o-m.top-m.height/2;return c<0&&c>r.offset?{offset:c,element:l}:r},{offset:Number.NEGATIVE_INFINITY}).element}}let q=new Date;function ca(){const a=u.getState(),{events:e}=a;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Agenda</h1>
            <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
        </div>
        <button class="btn btn-primary" id="add-event-manual-btn" style="width: auto; padding: 10px 20px;">
            ${p("plus")} Nuevo Evento
        </button>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation prev-month">${p("chevronLeft")}</button>
                <span class="current-month">${ua()}</span>
                <button class="icon-btn-navigation next-month">${p("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${da(e)}
            </div>
        </div>

        <div class="events-list-container" style="margin-top: var(--spacing-xl);">
            <div class="section-divider">
                <span class="section-title">Próximos Eventos</span>
            </div>
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${p("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                    </div>
                `:e.filter(s=>{const t=new Date(s.date);return t.getMonth()===q.getMonth()&&t.getFullYear()===q.getFullYear()}).sort((s,t)=>new Date(s.date)-new Date(t.date)).map(s=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${s.category||"event"}">
                            ${p(ma(s.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${s.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${pa(s.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${s.time}</span>
                                ${s.repeat!=="none"?`<span class="event-repeat-tag">${va(s.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${s.id}">
                            ${p("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function da(a){const e=q.getMonth(),s=q.getFullYear(),t=new Date().getDate(),n=new Date().getMonth()===e&&new Date().getFullYear()===s,o=new Date(s,e+1,0).getDate(),i=new Date(s,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;a.forEach(c=>{const d=new Date(c.date);d.getMonth()===e&&d.getFullYear()===s&&l.add(d.getDate())});let m=r.map(c=>`<div class="calendar-day-label">${c}</div>`).join("");for(let c=0;c<i;c++)m+='<div class="calendar-day empty"></div>';for(let c=1;c<=o;c++){const d=n&&c===t,g=l.has(c);m+=`
            <div class="calendar-day ${d?"today":""} ${g?"has-event":""}">
                ${c}
                ${g?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return m}function ua(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][q.getMonth()]} ${q.getFullYear()}`}function pa(a){const e={day:"numeric",month:"short"};return new Date(a).toLocaleDateString("es-ES",e).toUpperCase()}function ma(a){switch(a){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function va(a){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[a]||""}function ga(){var a,e,s;(a=document.querySelector(".prev-month"))==null||a.addEventListener("click",()=>{q.setMonth(q.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{q.setMonth(q.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(t=>{t.addEventListener("click",async()=>{await v.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(u.deleteEvent(t.dataset.id),v.toast("Evento eliminado"))})}),(s=document.getElementById("add-event-manual-btn"))==null||s.addEventListener("click",async()=>{const t=await v.prompt("Nuevo Evento","Título del evento:");if(!t)return;const n=await v.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!n)return;const o=await v.prompt("Hora","Formato HH:MM:","10:00");if(!o)return;const i=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await v.select("Categoría","Tipo de evento:",i,0);u.addEvent({title:t,date:n,time:o,category:r||"event",repeat:"none"}),v.toast("Evento agendado","success")})}function ha(){const a=u.getState(),e=a.currencySymbol,s=a.livingExpenses,t=a.otherExpenses||[],n=a.liabilities,o=u.sumItems(s,"amount"),i=u.sumItems(t,"amount"),r=u.sumItems(n,"monthlyPayment"),l=o+i+r,m=[...(s||[]).map(c=>({...c,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(t||[]).map(c=>({...c,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(c=>c.monthlyPayment>0).map(c=>({...c,amount:c.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((c,d)=>d.amount-c.amount);return`
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="back-btn" id="back-to-finance">
                ${p("chevronLeft")}
            </button>
            <h1 class="page-title" style="margin-bottom: 0;">Gastos Mensuales</h1>
        </div>
        <p class="page-subtitle" style="margin-left: 40px;">Desglose detallado de tus salidas</p>
      </header>
      
      <!-- PRIMARY METRIC -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Total Mensual</span>
          ${p("creditCard","card-icon")}
        </div>
        <div class="stat-value negative text-center" style="font-size: 32px; margin: var(--spacing-md) 0;">
            ${w(l,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${w(o,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${w(r,e)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${w(i,e)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${ya(m,a)}

    </div>
  `}function ya(a,e){if(a.length===0)return`
            <div class="empty-state">
                ${p("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const s=e.currencySymbol;return`
        <div class="asset-list">
            ${a.map(t=>{const n=u.convertValue(t.amount,t.currency||"EUR"),o=fa(t.category);return`
                <div class="asset-item expense-item" data-id="${t.id}" data-category="${t.category}">
                    <div class="asset-icon-wrapper expense">
                        ${p(o,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${t.name}</div>
                        <div class="asset-details">${t.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${w(n,s)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function fa(a){switch(a){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function ba(a){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",a),document.querySelectorAll(".expense-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=t.dataset.category;Je(n,o)})})}const wa="modulepreload",xa=function(a){return"/life-dashboard/"+a},Ne={},ge=function(e,s,t){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),r=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(s.map(l=>{if(l=xa(l),l in Ne)return;Ne[l]=!0;const m=l.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=m?"stylesheet":wa,m||(d.as="script"),d.crossOrigin="",d.href=l,r&&d.setAttribute("nonce",r),document.head.appendChild(d),m)return new Promise((g,h)=>{d.addEventListener("load",g),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return n.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function ka(){const a=$.isBioEnabled(),e=U.hasToken();return`
    <div class="settings-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Configuración</h1>
            <p class="page-subtitle">Privacidad, Seguridad y Sincronización</p>
        </header>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${p("shield","section-icon")} Seguridad
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Huella Dactilar / Biometría</div>
                        <div class="settings-item-desc">Desbloqueo rápido y seguro sin contraseña.</div>
                    </div>
                    <label class="switch-premium">
                        <input type="checkbox" id="toggle-bio" ${a?"checked":""}>
                        <span class="slider-premium round"></span>
                    </label>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="change-password-link">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Contraseña Maestra</div>
                        <div class="settings-item-desc">Cambiar la clave de acceso de tu bóveda local.</div>
                    </div>
                    <div class="settings-action-icon">${p("chevronRight")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${p("cloud","section-icon")} Nube & Sincronización
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row" id="drive-sync-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">
                            Google Drive 
                            ${e?'<span class="status-badge connected">Conectado</span>':'<span class="status-badge disconnected">Desconectado</span>'}
                        </div>
                        <div class="settings-item-desc">Sincroniza tu bóveda cifrada en la nube.</div>
                    </div>
                    ${e?`
                        <button class="btn btn-secondary btn-icon-only" id="connect-drive-btn" title="Reconfigurar">
                            ${p("refreshCw")}
                        </button>
                    `:`
                        <button class="btn btn-primary" id="connect-drive-btn" style="width: auto; height: 38px; padding: 0 16px;">
                            Conectar
                        </button>
                    `}
                </div>

                ${e?`
                    <div class="sync-actions-split">
                        <button class="btn-settings-action" id="upload-drive-btn">
                            ${p("uploadCloud")}
                            <span>Subir</span>
                        </button>
                        <button class="btn-settings-action" id="download-drive-btn">
                            ${p("downloadCloud")}
                            <span>Bajar</span>
                        </button>
                    </div>
                `:""}

                <div class="settings-divider"></div>

                <div class="advanced-settings-group">
                    <div class="settings-item-info" style="width: 100%;">
                        <div class="settings-item-label" style="font-size: 13px; display: flex; align-items: center; gap: 6px;">
                            ${p("lock","mini-icon")} Google Client Secret
                        </div>
                        <div class="settings-item-desc" style="margin-bottom: 8px;">
                            Si se deja vacío, se usará el valor por defecto.
                        </div>
                        <div class="form-input-container">
                            <input type="password" id="drive-client-secret" class="form-input" 
                                placeholder="••••••••••••••••••••" 
                                value="${localStorage.getItem("life-dashboard/drive_client_secret")||""}"
                                autocomplete="off">
                            <button class="icon-btn-form" id="toggle-drive-secret">
                                ${p("eye")}
                            </button>
                            <button class="btn btn-primary btn-save-mini" id="btn-save-drive-secret">
                                ${p("check")}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="import-backup-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Importar Backup Manual</div>
                        <div class="settings-item-desc">Restaurar desde (.bin).</div>
                    </div>
                    <div class="settings-action-icon">${p("upload")}</div>
                </div>
                <input type="file" id="import-backup-input" accept=".bin" style="display: none;">

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="export-data-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Exportar Backup Manual</div>
                        <div class="settings-item-desc">Descargar copia encriptada.</div>
                    </div>
                    <div class="settings-action-icon">${p("download")}</div>
                </div>
            </div>

            <div class="settings-note">
                ${p("lock","note-icon")} Todos tus datos se encriptan localmente con AES-256-GCM antes de ser enviados a tu Google Drive personal. Nadie más tiene acceso.
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${p("settings","section-icon")} Aplicación
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row clickable" id="btn-logout">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Cerrar Sesión</div>
                        <div class="settings-item-desc">Bloquear acceso y limpiar llaves de sesión.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${p("logOut")}</div>
                </div>



                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-factory-reset">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Borrar todos los datos</div>
                        <div class="settings-item-desc">Elimina permanentemente el almacenamiento local y reinicia la App.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${p("trash")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${p("zap","section-icon")} Inteligencia Artificial
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
            <p>Life Dashboard Pro v1.0.92</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Ea(){var t,n,o,i,r,l,m,c,d,g;(t=document.getElementById("toggle-bio"))==null||t.addEventListener("change",async h=>{if(h.target.checked){const y=await v.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(y)try{await $.registerBiometrics(y),v.toast("Biometría activada correctamente")}catch(x){await v.alert("Error",x.message),h.target.checked=!1}else h.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),v.toast("Biometría desactivada","info")});const a=document.getElementById("btn-install-pwa");a&&setTimeout(()=>{if(window.deferredPrompt){const h=document.getElementById("install-pwa-card");h&&(h.style.display="block"),a.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:f}=await window.deferredPrompt.userChoice;if(f==="accepted"){v.toast("Instalando aplicación...");const y=document.getElementById("install-pwa-card");y&&(y.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("connect-drive-btn"))==null||n.addEventListener("click",async()=>{try{await U.authenticate(),v.toast("Google Drive conectado"),typeof window.reRender=="function"&&window.reRender()}catch(h){v.alert("Error",h.message||"Error al conectar")}}),(o=document.getElementById("upload-drive-btn"))==null||o.addEventListener("click",async()=>{const h=document.getElementById("upload-drive-btn"),f=h.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;h.innerHTML='<div class="loading-spinner-sm"></div>',h.style.pointerEvents="none";const x=$.getVaultKey();await U.pushData(u.getState(),x),v.toast("Bóveda subida correctamente")}catch(y){console.error(y),v.alert("Error al subir",y.message)}finally{h.innerHTML=f,h.style.pointerEvents="auto"}}),(i=document.getElementById("download-drive-btn"))==null||i.addEventListener("click",async()=>{const h=document.getElementById("download-drive-btn"),f=h.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;h.innerHTML='<div class="loading-spinner-sm"></div>',h.style.pointerEvents="none";const x=$.getVaultKey(),k=await U.pullData(x);k?(u.resetState(k),await u.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(y){console.error("[Settings] Download failed:",y),v.alert("Error de Descarga",y.message||"Error desconocido al bajar datos")}finally{h.innerHTML=f,h.style.pointerEvents="auto"}}),(r=document.getElementById("export-data-btn"))==null||r.addEventListener("click",async()=>{try{v.toast("Preparando archivo encriptado...","info");const h=u.getState(),f=$.getVaultKey(),{SecurityService:y}=await ge(async()=>{const{SecurityService:M}=await Promise.resolve().then(()=>De);return{SecurityService:M}},void 0),x=await y.encrypt(h,f),k=new Blob([JSON.stringify(x)],{type:"application/octet-stream"}),L=URL.createObjectURL(k),E=document.createElement("a"),P=new Date().toISOString().split("T")[0];E.href=L,E.download=`life_dashboard_backup_${P}.bin`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL(L),v.toast("Backup exportado correctamente")}catch(h){console.error("Export error:",h),v.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),s=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{s==null||s.click()}),s==null||s.addEventListener("change",async h=>{var x;const f=(x=h.target.files)==null?void 0:x[0];if(!f)return;if(!await v.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){s.value="";return}try{const k=await f.text(),L=JSON.parse(k),E=$.getVaultKey(),{SecurityService:P}=await ge(async()=>{const{SecurityService:R}=await Promise.resolve().then(()=>De);return{SecurityService:R}},void 0),M=await P.decrypt(L,E);if(M)u.setState(M),await u.saveState(),v.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(k){console.error("Import error:",k),v.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{s.value=""}}),(l=document.getElementById("btn-logout"))==null||l.addEventListener("click",async()=>{await v.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&($.logout(),window.location.reload())}),(m=document.getElementById("btn-save-gemini"))==null||m.addEventListener("click",()=>{var f;const h=(f=document.getElementById("gemini-api-key"))==null?void 0:f.value;h!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",h.trim()),v.toast("API Key de Gemini guardada"))}),(c=document.getElementById("btn-save-drive-secret"))==null||c.addEventListener("click",()=>{const f=document.getElementById("drive-client-secret").value.trim();f?(localStorage.setItem("life-dashboard/drive_client_secret",f),v.toast("Secreto guardado correctamente")):(localStorage.removeItem("life-dashboard/drive_client_secret"),v.toast("Secreto eliminado, usando valor por defecto","info")),U.init().catch(console.error)}),(d=document.getElementById("toggle-drive-secret"))==null||d.addEventListener("click",h=>{const f=document.getElementById("drive-client-secret"),y=h.currentTarget,x=f.type==="password";f.type=x?"text":"password",y.innerHTML=p(x?"eyeOff":"eye")}),(g=document.getElementById("btn-factory-reset"))==null||g.addEventListener("click",async()=>{if(await v.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const f="life-dashboard/";if(Object.keys(localStorage).forEach(y=>{y.startsWith(f)&&localStorage.removeItem(y)}),Object.keys(sessionStorage).forEach(y=>{y.startsWith(f)&&sessionStorage.removeItem(y)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(x=>window.indexedDB.deleteDatabase(x.name)),navigator.serviceWorker){const y=await navigator.serviceWorker.getRegistrations();for(let x of y)x.unregister()}v.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now()},1e3)}})}function Sa(){const a=U.hasToken();return`
    <div class="stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Menú</h1>
        </header>

        <div class="menu-grid">
            <button class="menu-card" id="open-skills">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    ${p("brain")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Skills & Mastery</div>
                    <div class="menu-desc">Nivel de expertise y aprendizaje</div>
                </div>
                <div class="menu-arrow">${p("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-calendar">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);">
                    ${p("calendar")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Agenda</div>
                    <div class="menu-desc">Eventos y recordatorios</div>
                </div>
                <div class="menu-arrow">${p("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-schedule">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                    ${p("calendar")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Programación</div>
                    <div class="menu-desc">Tareas y hábitos recurrentes</div>
                </div>
                <div class="menu-arrow">${p("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-settings">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                    ${p("settings")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Ajustes</div>
                    <div class="menu-desc">Configuración general</div>
                </div>
                <div class="menu-arrow">${p("chevronRight")}</div>
            </button>

            ${a?`
                <button class="menu-card" id="btn-upload-menu">
                    <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);">
                        ${p("uploadCloud")}
                    </div>
                    <div class="menu-info">
                        <div class="menu-title">Subir a la nube</div>
                        <div class="menu-desc">Sincronizar local → Drive</div>
                    </div>
                </button>

                <button class="menu-card" id="btn-download-menu">
                    <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%);">
                        ${p("downloadCloud")}
                    </div>
                    <div class="menu-info">
                        <div class="menu-title">Bajar de la nube</div>
                        <div class="menu-desc">Sincronizar Drive → local</div>
                    </div>
                </button>
            `:""}

            <button class="menu-card" id="btn-force-update">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);">
                    ${p("refreshCw")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Forzar Actualización</div>
                    <div class="menu-desc">Recargar la última versión</div>
                </div>
                <div class="menu-arrow">${p("chevronRight")}</div>
            </button>
        </div>
    </div>
    `}function $a(a){var e,s,t,n,o,i,r;(e=document.getElementById("open-calendar"))==null||e.addEventListener("click",()=>{a("calendar")}),(s=document.getElementById("open-skills"))==null||s.addEventListener("click",()=>{a("skills")}),(t=document.getElementById("open-schedule"))==null||t.addEventListener("click",()=>{a("schedule")}),(n=document.getElementById("open-settings"))==null||n.addEventListener("click",()=>{a("settings")}),(o=document.getElementById("btn-upload-menu"))==null||o.addEventListener("click",async()=>{const l=document.getElementById("btn-upload-menu"),m=l.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;l.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',l.style.pointerEvents="none";const d=$.getVaultKey();await U.pushData(u.getState(),d),v.toast("Bóveda subida correctamente")}catch(c){console.error(c),v.alert("Error al subir",c.message)}finally{l.innerHTML=m,l.style.pointerEvents="auto"}}),(i=document.getElementById("btn-download-menu"))==null||i.addEventListener("click",async()=>{const l=document.getElementById("btn-download-menu"),m=l.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;l.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',l.style.pointerEvents="none";const d=$.getVaultKey(),g=await U.pullData(d);g?(u.resetState(g),await u.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(c){console.error("[Menu] Download failed:",c),v.alert("Error de Descarga",c.message||"Error desconocido al bajar datos")}finally{l.innerHTML=m,l.style.pointerEvents="auto"}}),(r=document.getElementById("btn-force-update"))==null||r.addEventListener("click",async()=>{if(await v.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const m=await caches.keys();for(let c of m)await caches.delete(c)}catch(m){console.error("Error clearing cache",m)}window.location.reload(!0)}})}function Ia(){const{social:a}=u.getState(),{people:e,columns:s,idealLeadProfile:t}=a,n=e.length,o=s.find(r=>r.name.toLowerCase().includes("closed")||r.name.toLowerCase().includes("cerrado")||r.name.toLowerCase().includes("exito"));let i=0;if(n>0){const r=t&&t.trim().length>0;(o?e.filter(m=>m.columnId===o.id).length:0)>0?i=r?100:80:(i=Math.min(40,n*5),r&&(i+=10))}return`
    <div class="social-page stagger-children">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <div class="header-content">
                <h1 class="page-title">Connections</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones laborales</p>
                
                <!-- SUCCESS INDEX HIGHLIGHT -->
                <div class="finance-top-grid" style="margin-top: 20px; margin-bottom: 20px;">
                    <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%); border-color: rgba(59, 130, 246, 0.3);">
                        <div class="card-header">
                            <span class="card-title" style="color: var(--accent-primary);">Índice de Éxito</span>
                            ${p("target","card-icon")}
                        </div>
                        <div class="highlight-value" style="color: var(--accent-primary);">${i}%</div>
                        <div class="highlight-label">
                            ${i>=80?"🎯 ¡Excelente tracción y cierres!":i>0?"📈 Pipeline activo y en crecimiento":"⌛ En busca del primer contacto"}
                        </div>
                    </div>
                </div>

                <div class="social-header-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-primary" id="add-person-btn">
                        ${p("plus")} Lead
                    </button>
                    <button class="btn btn-primary" id="add-social-col-btn" style="filter: hue-rotate(45deg);">
                        ${p("plus")} Etapa
                    </button>
                    <button class="btn btn-secondary" id="ideal-lead-btn">
                        ${p("target")} Lead Ideal
                    </button>
                    <button class="btn btn-secondary" id="communications-mgr-btn">
                        ${p("messageSquare")} Comunicaciones
                    </button>
                    <button class="btn btn-secondary" id="contact-sources-btn">
                        ${p("users")} Fuentes
                    </button>
                </div>
            </div>
        </header>

        <div class="kanban-container">
            ${s.sort((r,l)=>r.order-l.order).map(r=>{const l=e.filter(m=>m.columnId===r.id);return`
                <div class="kanban-column" data-col-id="${r.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${r.color}"></span>
                            ${r.name}
                            <span class="kanban-count">${l.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${r.id}">${p("moreVertical")}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${r.id}">
                        ${l.map(m=>La(m)).join("")}
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function La(a){const e=a.lastContact?Math.floor((Date.now()-new Date(a.lastContact).getTime())/864e5):null,s=a.color||"#3b82f6";return`
    <div class="person-card glass-panel" draggable="true" data-id="${a.id}">
        <div class="person-color-strip" style="background: ${s};"></div>
        <div class="person-card-content">
            <div class="person-header" style="margin-bottom: 2px;">
                <h3 class="person-name" style="font-size: 14px;">${a.name}</h3>
                ${a.rating?`<span class="person-rating" style="font-size: 10px; font-weight: 800; color: var(--accent-tertiary);">★${a.rating}</span>`:""}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="person-info-left" style="display: flex; align-items: center; gap: 8px;">
                    <div class="person-detail text-muted" style="font-size: 10px; font-weight: 600;">
                        ${e!==null?`${e===0?"Hoy":`Hace ${e}d`}`:"Contactar"}
                    </div>
                    ${a.source?`<span class="tag" style="font-size: 8px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-muted);">${a.source}</span>`:""}
                </div>
                <button class="icon-btn person-chat-btn" data-id="${a.id}" style="padding: 4px; background: none; color: var(--accent-primary); opacity: 0.7;">
                    ${p("messageSquare","tiny-icon")}
                </button>
            </div>
        </div>
    </div>
    `}function Aa(){window.socialListenersAttached||(window.socialListenersAttached=!0,document.addEventListener("click",a=>{const e=a.target.closest(".col-opts-btn");if(e){a.preventDefault(),a.stopPropagation(),Ba(e.dataset.id,e);return}if(a.target.closest("#add-social-col-btn")){Ca();return}if(a.target.closest("#add-person-btn")){window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person"}}));return}if(a.target.closest("#ideal-lead-btn")){Ta();return}if(a.target.closest("#communications-mgr-btn")){ge(()=>import("./CommunicationsModal-p8NyGvsC.js"),[]).then(n=>n.openCommunicationsModal());return}if(a.target.closest("#contact-sources-btn")){Ra();return}const s=a.target.closest(".person-chat-btn");if(s){a.preventDefault(),a.stopPropagation(),ge(()=>import("./CommunicationsModal-p8NyGvsC.js"),[]).then(n=>n.openCommunicationsModal(s.dataset.id));return}const t=a.target.closest(".person-card");if(t){Da(t.dataset.id);return}}),document.addEventListener("dragstart",a=>{const e=a.target.closest(".person-card");e&&(a.dataTransfer.setData("text/plain",e.dataset.id),e.classList.add("dragging"))}),document.addEventListener("dragend",a=>{const e=a.target.closest(".person-card");e&&e.classList.remove("dragging")}),document.addEventListener("dragover",a=>{const e=a.target.closest(".kanban-cards");e&&(a.preventDefault(),e.classList.add("drag-over"))}),document.addEventListener("dragleave",a=>{const e=a.target.closest(".kanban-cards");e&&e.classList.remove("drag-over")}),document.addEventListener("drop",a=>{const e=a.target.closest(".kanban-cards");if(e){a.preventDefault(),e.classList.remove("drag-over");const s=a.dataTransfer.getData("text/plain"),t=e.dataset.colId;s&&t&&u.movePerson(s,t)}}))}async function Ca(){const a=await v.prompt("Etapa","Nombre de la etapa:");a&&(u.addSocialColumn({name:a,color:"#94a3b8"}),v.toast("Etapa agregada correctamente","success"))}async function Ta(){const a=u.getState().social.idealLeadProfile||"",e=await Ma(a);e!==null&&(u.updateIdealLeadProfile(e),v.toast("Perfil Ideal actualizado"))}function Da(a){const e=u.getState().social.people.find(s=>s.id===a);e&&window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person",person:e}}))}function Ma(a){return new Promise(e=>{const s=document.createElement("div");s.className="modal-overlay active",s.style.zIndex="9999",s.innerHTML=`
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${a||""}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(s);const t=()=>{s.remove(),e(null)};s.querySelector(".modal-close").addEventListener("click",t),s.querySelector("#save-ideal-lead").addEventListener("click",()=>{const n=s.querySelector("#ideal-lead-text").value;s.remove(),e(n)}),s.addEventListener("click",n=>{n.target===s&&t()})})}function Ba(a,e){document.querySelectorAll(".column-options-menu").forEach(i=>i.remove());const s=u.getState().social.columns.find(i=>i.id===a);if(!s)return;const t=document.createElement("div");t.className="column-options-menu",t.innerHTML=`
        <button class="menu-item" data-action="edit">${p("edit")} Editar Nombre</button>
        <button class="menu-item" data-action="color">${p("palette")} Cambiar Color</button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_up">${p("chevronUp")} Mover Arriba (Anterior)</button>
        <button class="menu-item" data-action="move_down">${p("chevronDown")} Mover Abajo (Siguiente)</button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">${p("trash")} Eliminar Etapa</button>
    `;const n=e.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.bottom+8}px`,t.style.right=`${window.innerWidth-n.right}px`,t.style.zIndex="9999",document.body.appendChild(t),t.querySelectorAll(".menu-item").forEach(i=>{i.addEventListener("click",async()=>{const r=i.dataset.action;if(t.remove(),r==="edit"){const l=await v.prompt("Nombre de Columna","Nuevo nombre:",s.name);l!=null&&l.trim()&&u.updateSocialColumn(a,{name:l.trim()})}else if(r==="color"){const l=await Pa(s.color);l&&u.updateSocialColumn(a,{color:l})}else if(r==="delete")await v.confirm("Eliminar Etapa",`¿Eliminar "${s.name}"?`)&&u.deleteSocialColumn(a);else if(r==="move_up"||r==="move_down"){const l=[...u.getState().social.columns].sort((d,g)=>d.order-g.order),m=l.findIndex(d=>d.id===a);if(m===-1)return;const c=r==="move_up"?m-1:m+1;c>=0&&c<l.length&&([l[m].order,l[c].order]=[l[c].order,l[m].order],u.reorderSocialColumns(l))}})});const o=i=>{!t.contains(i.target)&&i.target!==e&&(t.remove(),document.removeEventListener("click",o))};setTimeout(()=>document.addEventListener("click",o),10)}function Pa(a){return new Promise(e=>{const s=document.createElement("div");s.className="modal-overlay active",s.style.zIndex="99999",s.innerHTML=`
            <div class="modal" style="max-width: 320px;">
                <div class="modal-header">
                    <h2 class="modal-title">Color de Etapa</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <input type="color" id="stage-color-input" class="color-picker-input" value="${a||"#3b82f6"}">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px;">
                        ${["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#64748b","#000000"].map(n=>`<div class="color-swatch" data-color="${n}" style="background:${n}; height:30px; border-radius:6px; cursor:pointer; border:2px solid ${a===n?"white":"transparent"}"></div>`).join("")}
                    </div>
                    <button class="btn btn-primary w-full" id="save-stage-color" style="margin-top: 24px;">Aplicar</button>
                </div>
            </div>
        `,document.body.appendChild(s);const t=()=>{s.remove(),e(null)};s.querySelector(".modal-close").addEventListener("click",t),s.querySelectorAll(".color-swatch").forEach(n=>n.addEventListener("click",()=>{s.querySelector("#stage-color-input").value=n.dataset.color,s.querySelectorAll(".color-swatch").forEach(o=>o.style.borderColor="transparent"),n.style.borderColor="white"})),s.querySelector("#save-stage-color").addEventListener("click",()=>{const n=s.querySelector("#stage-color-input").value;s.remove(),e(n)}),s.addEventListener("click",n=>{n.target===s&&t()})})}async function Ra(){const{contactSources:a}=u.getState().social,e=await ja(a);e&&(u.updateContactSources(e),v.toast("Fuentes de contacto actualizadas"))}function ja(a){return new Promise(e=>{const s=document.createElement("div");s.className="modal-overlay active",s.style.zIndex="9999",s.innerHTML=`
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fuentes de Contacto</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">Escribe las fuentes separadas por coma:</p>
                    <textarea id="contact-sources-text" class="form-input" rows="4" placeholder="Ej: Instagram, WhatsApp, Amigo...">${a.join(", ")}</textarea>
                    <button class="btn btn-primary w-full" id="save-contact-sources" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(s);const t=()=>{s.remove(),e(null)};s.querySelector(".modal-close").addEventListener("click",t),s.querySelector("#save-contact-sources").addEventListener("click",()=>{const o=s.querySelector("#contact-sources-text").value.split(",").map(i=>i.trim()).filter(i=>i.length>0);s.remove(),e(o)}),s.addEventListener("click",n=>{n.target===s&&t()})})}let de="tracker",T=null,fe=!1,ae=null;function _a(){const a=u.getState(),{activities:e=[],logs:s=[]}=a.timeInvest||{};return`
    <div class="time-invest-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Time Invest</h1>
            <p class="page-subtitle">Invierte tu tiempo con propósito</p>
        </header>

        <div class="segmented-control">
            <button class="segment-btn ${de==="tracker"?"active":""}" id="tab-tracker">
                Tracker
            </button>
            <button class="segment-btn ${de==="stats"?"active":""}" id="tab-stats">
                Stats
            </button>
        </div>

        ${Ua(e,s)}

        ${T?Fa(e):""}
    </div>
    `}function Ua(a,e){var s;if(ae){const t=a.find(n=>n.id===ae);if(t&&((s=t.subActivities)==null?void 0:s.length)>0)return Oa(t)}return de==="tracker"?Na(a):Ga(a,e)}function Oa(a){return`
    <div class="sub-activity-selector animate-fade-in">
        <div class="section-divider">
            <button class="btn-mini-action" id="btn-back-to-activities">${p("chevronLeft")}</button>
            <span class="section-title">¿En qué vas a trabajar?</span>
        </div>
        
        <div class="activities-grid">
            <div class="activity-btn sub-opt" data-sub-id="none" style="--color: ${a.color}; --color-alpha: ${a.color}20">
                 <span class="activity-label">General</span>
            </div>
            ${a.subActivities.map(e=>`
                <div class="activity-btn sub-opt" data-sub-id="${e.id}" style="--color: ${a.color}; --color-alpha: ${a.color}20">
                    <span class="activity-label">${e.name}</span>
                </div>
            `).join("")}
        </div>
    </div>
    `}function Na(a){return`
    <div class="tracker-view animate-fade-in">
        <div class="section-divider">
            <span class="section-title">Actividades</span>
            <button class="btn-add-goal-inline" id="btn-add-activity">
                ${p("plus")} Configurar
            </button>
        </div>

        <div class="activities-grid">
            ${a.map(e=>`
                <div class="activity-btn" data-id="${e.id}" style="--color: ${e.color}; --color-alpha: ${e.color}20">
                    <div class="activity-icon-container">
                        ${p(e.icon||"brain")}
                    </div>
                    <span class="activity-label">${e.name}</span>
                </div>
            `).join("")}
        </div>

        <div class="card" style="margin-top: var(--spacing-xl);">
            <div class="toggle-row">
                <div class="setting-info">
                    <div class="setting-label">Modo Pomodoro</div>
                    <div class="setting-desc">Avisar cuando termine el tiempo</div>
                </div>
                <input type="checkbox" id="pomodoro-toggle" class="apple-switch" ${fe?"checked":""}>
            </div>
        </div>
    </div>
    `}function Ga(a,e){const s=[];for(let c=6;c>=0;c--){const d=new Date;d.setDate(d.getDate()-c),s.push(d.toISOString().split("T")[0])}const t=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],n=s.map(c=>{const d=e.filter(h=>h.date.startsWith(c)),g={};return d.forEach(h=>{g[h.activityId]=(g[h.activityId]||0)+(h.durationMinutes||0)}),g}),o=Math.max(...n.flatMap(c=>Object.values(c)),60),i=150,r=300,l=r/6,m=c=>n.map((d,g)=>{const h=d[c]||0,f=g*l,y=i-h/o*i;return`${g===0?"M":"L"} ${f} ${y}`}).join(" ");return`
    <div class="stats-view animate-fade-in">
        <div class="card stats-card">
            <div class="card-header">
                <span class="card-title">Inversión 7 días (minutos)</span>
                ${p("trendingUp")}
            </div>
            
            <div class="line-chart-container" style="height: ${i}px; width: 100%; position: relative; margin-top: 20px;">
                <svg viewBox="0 0 ${r} ${i}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
                    <!-- Grid Lines -->
                    <line x1="0" y1="0" x2="${r}" y2="0" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="${i/2}" x2="${r}" y2="${i/2}" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="${i}" x2="${r}" y2="${i}" stroke="rgba(255,255,255,0.1)" />
                    
                    ${a.map(c=>`
                        <path d="${m(c.id)}" fill="none" stroke="${c.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px ${c.color}40)" />
                        ${n.map((d,g)=>{const h=d[c.id]||0;if(h===0)return"";const f=g*l,y=i-h/o*i;return`<circle cx="${f}" cy="${y}" r="4" fill="${c.color}" />`}).join("")}
                    `).join("")}
                </svg>
                
                <div class="chart-labels" style="display: flex; justify-content: space-between; margin-top: 10px;">
                    ${s.map(c=>`<span style="font-size: 10px; color: var(--text-muted);">${t[new Date(c).getUTCDay()]}</span>`).join("")}
                </div>
            </div>
            
            <div class="chart-legend" style="margin-top: 24px; display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${a.map(c=>`
                    <div class="legend-item" style="display: flex; align-items: center; gap: 4px; font-size: 11px;">
                        <div style="width: 12px; height: 3px; border-radius: 2px; background: ${c.color};"></div>
                        <span>${c.name}</span>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Resumen de Inversión</span>
        </div>

        <div class="asset-list">
            ${a.map(c=>{const d=e.filter(g=>g.activityId===c.id).reduce((g,h)=>g+(h.durationMinutes||0),0);return`
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-name">${c.name}</div>
                        <div class="asset-details">Inversión total acumulada</div>
                    </div>
                    <div class="asset-value">
                        ${Math.round(d/60)}h ${d%60}m
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function Fa(a){var n;const e=a.find(o=>o.id===T.activityId),s=(n=e==null?void 0:e.subActivities)==null?void 0:n.find(o=>o.id===T.subActivityId),t=st(T.elapsedSeconds);return`
    <div class="timer-overlay animate-fade-in">
        <div class="timer-active-label">Invirtiendo en...</div>
        <div class="activity-label" style="font-size: 32px; margin-bottom: 4px; color: ${e==null?void 0:e.color}">${e==null?void 0:e.name}</div>
        ${s?`<div class="sub-activity-label" style="font-size: 18px; margin-bottom: var(--spacing-xl); opacity: 0.8;">${s.name}</div>`:'<div style="margin-bottom: var(--spacing-xl);"></div>'}
        
        <div class="timer-display">${t}</div>

        <div class="timer-controls">
            <!-- No pause for now to keep it simple, just stop/complete -->
            <button class="timer-btn stop" id="btn-stop-timer">
                ${p("x")}
            </button>
            <button class="timer-btn" id="btn-complete-timer" style="background: var(--accent-success); color: white;">
                ${p("check")}
            </button>
        </div>
        
        ${fe?`<p style="margin-top: 40px; color: var(--text-muted); font-size: 14px;">Pomodoro activo (${u.getState().timeInvest.pomodoroTime} min)</p>`:""}
    </div>
    `}function st(a){const e=Math.floor(a/3600),s=Math.floor(a%3600/60),t=a%60;return`${e>0?e+":":""}${String(s).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function qa(){var a,e,s,t,n,o,i;(a=document.getElementById("tab-tracker"))==null||a.addEventListener("click",()=>{var r;de="tracker",(r=window.reRender)==null||r.call(window)}),(e=document.getElementById("tab-stats"))==null||e.addEventListener("click",()=>{var r;de="stats",(r=window.reRender)==null||r.call(window)}),document.querySelectorAll(".activity-btn").forEach(r=>{r.classList.contains("sub-opt")||r.addEventListener("click",()=>{var c,d;const l=r.dataset.id;((c=u.getState().timeInvest.activities.find(g=>g.id===l).subActivities)==null?void 0:c.length)>0?(ae=l,(d=window.reRender)==null||d.call(window)):Fe(l)})}),document.querySelectorAll(".sub-opt").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.subId==="none"?null:r.dataset.subId;Fe(ae,l),ae=null})}),(s=document.getElementById("btn-back-to-activities"))==null||s.addEventListener("click",()=>{var r;ae=null,(r=window.reRender)==null||r.call(window)}),(t=document.getElementById("pomodoro-toggle"))==null||t.addEventListener("change",r=>{fe=r.target.checked}),(n=document.getElementById("btn-stop-timer"))==null||n.addEventListener("click",()=>{confirm("¿Deseas cancelar esta sesión? No se guardarán los datos.")&&qe(!1)}),(o=document.getElementById("btn-complete-timer"))==null||o.addEventListener("click",()=>{qe(!0)}),(i=document.getElementById("btn-add-activity"))==null||i.addEventListener("click",()=>{he()})}function he(){var r,l,m;const a=u.getState().timeInvest,{activities:e=[],pomodoroTime:s=25}=a,t=document.createElement("div");t.className="modal-overlay active",t.id="time-invest-config-modal",t.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 500px;">
            <div class="modal-header">
                <h2 class="modal-title">Configurar Time Invest</h2>
                <button class="modal-close" id="close-config-modal">${p("x")}</button>
            </div>
            
            <div class="modal-body">
                <div class="config-group">
                    <div class="config-title">Configuración Pomodoro</div>
                    <div class="setting-item">
                        <label>Duración de sesión (minutos): <span id="pomodoro-val">${s}</span></label>
                        <input type="range" id="pomodoro-input" min="5" max="60" step="5" value="${s}">
                    </div>
                </div>

                <div class="config-group">
                    <div class="config-title">Tus Actividades</div>
                    <div class="activity-edit-list">
                        ${e.map(c=>`
                            <div class="activity-edit-item">
                                <div class="activity-edit-info">
                                    <div style="color: ${c.color}">${p(c.icon||"brain","mini-icon")}</div>
                                    <span style="font-weight: 600;">${c.name}</span>
                                </div>
                                <div class="activity-edit-actions">
                                    <button class="btn-mini-action edit-activity" data-id="${c.id}">${p("edit")}</button>
                                    <button class="btn-mini-action delete delete-activity" data-id="${c.id}">${p("trash")}</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                    <button class="btn btn-secondary" id="btn-new-activity" style="width: 100%; margin-top: var(--spacing-md); border-style: dashed;">
                        ${p("plus")} Añadir Actividad
                    </button>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="save-config" style="width: 100%;">Listo</button>
            </div>
        </div>
    `,document.body.appendChild(t);const n=()=>{var c;t.classList.remove("active"),setTimeout(()=>t.remove(),300),(c=window.reRender)==null||c.call(window)};(r=document.getElementById("close-config-modal"))==null||r.addEventListener("click",n),(l=document.getElementById("save-config"))==null||l.addEventListener("click",n);const o=document.getElementById("pomodoro-input"),i=document.getElementById("pomodoro-val");o==null||o.addEventListener("input",c=>{const d=c.target.value;i.textContent=d,u.setPomodoroTime(d)}),t.querySelectorAll(".edit-activity").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.id,g=e.find(h=>h.id===d);Ge(g),t.remove()})}),t.querySelectorAll(".delete-activity").forEach(c=>{c.addEventListener("click",async()=>{const d=c.dataset.id;await v.confirm("¿Eliminar actividad?","Se perderán también los registros asociados.")&&(u.deleteTimeActivity(d),t.remove(),he())})}),(m=document.getElementById("btn-new-activity"))==null||m.addEventListener("click",()=>{Ge(),t.remove()})}function Ge(a=null){var c,d;const e=!!a,s=["brain","rocket","coffee","bookOpen","zap","heart","briefcase","users","dumbbell","code","music","monitor"],t=["#8b5cf6","#f59e0b","#ef4444","#3b82f6","#10b981","#ec4899","#06b6d4","#f97316","#84cc16","#a855f7","#6366f1","#d946ef"];let n=(a==null?void 0:a.icon)||"brain",o=(a==null?void 0:a.color)||"#8b5cf6";const i=document.createElement("div");i.className="modal-overlay active",i.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 450px;">
            <div class="modal-header">
                <h2 class="modal-title">${e?"Editar":"Nueva"} Actividad</h2>
                <button class="modal-close" id="close-activity-form">${p("x")}</button>
            </div>
            
            <div class="modal-body">
                <div class="config-group">
                    <label class="config-title">Nombre</label>
                    <input type="text" id="activity-name" class="form-input" placeholder="Ej: Meditar, Leer..." value="${(a==null?void 0:a.name)||""}">
                </div>

                <div class="config-group">
                    <label class="config-title">Icono</label>
                    <div class="icon-selection-grid">
                        ${s.map(g=>`
                            <div class="icon-option ${g===n?"selected":""}" data-icon="${g}">
                                ${p(g)}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="config-group">
                    <label class="config-title">Color</label>
                    <div class="color-selection-grid">
                        ${t.map(g=>`
                            <div class="color-option ${g===o?"selected":""}" data-color="${g}" style="background: ${g}"></div>
                        `).join("")}
                    </div>
                </div>

                <div class="config-group">
                    <label class="config-title">Sub-actividades</label>
                    <div id="sub-activities-list">
                        ${((a==null?void 0:a.subActivities)||[]).map(g=>`
                            <div class="activity-edit-item" style="padding: 8px 12px; margin-bottom: 4px;">
                                <span style="flex: 1; font-size: 13px;">${g.name}</span>
                                <button class="btn-mini-action delete-sub" data-sub-name="${g.name}">${p("trash")}</button>
                            </div>
                        `).join("")}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" id="new-sub-name" class="form-input" placeholder="Nombre sub-tarea" style="height: 38px;">
                        <button class="btn btn-secondary" id="btn-add-sub" style="min-width: auto; height: 38px;">${p("plus")}</button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="save-activity" style="width: 100%;">Guardar Actividad</button>
            </div>
        </div>
    `,document.body.appendChild(i);const r=[...(a==null?void 0:a.subActivities)||[]];i.querySelector("#btn-add-sub").addEventListener("click",()=>{const g=i.querySelector("#new-sub-name"),h=g.value.trim();h&&(r.push({id:Date.now().toString(),name:h}),g.value="",l())});function l(){const g=i.querySelector("#sub-activities-list");g.innerHTML=r.map(h=>`
            <div class="activity-edit-item" style="padding: 8px 12px; margin-bottom: 4px;">
                <span style="flex: 1; font-size: 13px;">${h.name}</span>
                <button class="btn-mini-action delete-sub" data-sub-id="${h.id}">${p("trash")}</button>
            </div>
        `).join(""),g.querySelectorAll(".delete-sub").forEach(h=>{h.addEventListener("click",()=>{const f=h.dataset.subId,y=r.findIndex(x=>x.id===f);y!==-1&&r.splice(y,1),l()})})}l();const m=()=>{i.classList.remove("active"),setTimeout(()=>i.remove(),300),he()};(c=document.getElementById("close-activity-form"))==null||c.addEventListener("click",m),i.querySelectorAll(".icon-option").forEach(g=>{g.addEventListener("click",()=>{i.querySelectorAll(".icon-option").forEach(h=>h.classList.remove("selected")),g.classList.add("selected"),n=g.dataset.icon})}),i.querySelectorAll(".color-option").forEach(g=>{g.addEventListener("click",()=>{i.querySelectorAll(".color-option").forEach(h=>h.classList.remove("selected")),g.classList.add("selected"),o=g.dataset.color})}),(d=document.getElementById("save-activity"))==null||d.addEventListener("click",()=>{const g=document.getElementById("activity-name").value.trim();if(!g){v.toast("Por favor, indica un nombre","error");return}const h={name:g,icon:n,color:o,subActivities:r};e?u.updateTimeActivity(a.id,h):u.addTimeActivity(h),i.classList.remove("active"),setTimeout(()=>i.remove(),300),he()})}function Fe(a,e=null){var s;T||(T={activityId:a,subActivityId:e,startTime:Date.now(),elapsedSeconds:0,interval:setInterval(()=>{T.elapsedSeconds=Math.floor((Date.now()-T.startTime)/1e3);const t=document.querySelector(".timer-display");if(t&&(t.textContent=st(T.elapsedSeconds)),fe){const n=u.getState().timeInvest.pomodoroTime||25;T.elapsedSeconds===n*60&&(Ha(),v.toast("¡Tiempo Pomodoro cumplido!","success"))}},1e3)},(s=window.reRender)==null||s.call(window))}function qe(a=!1){var e;if(T){if(clearInterval(T.interval),a){const s=Math.floor(T.elapsedSeconds/60);s>=1?(u.addTimeLog({activityId:T.activityId,subActivityId:T.subActivityId,date:new Date().toISOString(),durationMinutes:s}),v.toast(`¡Excelente! Has invertido ${s} min.`,"success")):v.toast("Sesión muy corta para ser registrada.","info")}T=null,(e=window.reRender)==null||e.call(window)}}function Ha(){try{const a=new(window.AudioContext||window.webkitAudioContext),e=a.createOscillator(),s=a.createGain();e.connect(s),s.connect(a.destination),e.type="sine",e.frequency.setValueAtTime(880,a.currentTime),s.gain.setValueAtTime(0,a.currentTime),s.gain.linearRampToValueAtTime(.5,a.currentTime+.1),s.gain.exponentialRampToValueAtTime(.01,a.currentTime+1),e.start(a.currentTime),e.stop(a.currentTime+1)}catch(a){console.error("Audio error:",a)}}function za(){const e=u.getState().scheduledTasks||[];return`
    <div class="schedule-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Programación</h1>
            <p class="page-subtitle">Tareas recurrentes y programadas</p>
        </header>

        <div class="schedule-actions" style="margin-bottom: var(--spacing-xl);">
            <button class="btn btn-primary w-full" id="add-scheduled-task-btn">
                ${p("plus")} Programar Nueva Tarea
            </button>
        </div>

        <div class="scheduled-tasks-list">
            ${e.length===0?`
                <div class="empty-state">
                    ${p("calendar","empty-icon")}
                    <div class="empty-title">Sin tareas programadas</div>
                    <p class="empty-description">Programa tareas recurrentes o para fechas futuras.</p>
                </div>
            `:e.map(s=>Va(s)).join("")}
        </div>
    </div>
    `}function Va(a){const e=Ka(a),s=a.color||"var(--accent-primary)";return`
    <div class="card schedule-card ${a.active?"":"is-inactive"}" 
         style="border-left: 4px solid ${s}; margin-bottom: var(--spacing-md); background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);">
        <div class="schedule-card-body" style="padding: 16px; display: flex; align-items: center; gap: 16px;">
            <div class="schedule-type-icon" style="background: ${s}22; color: ${s}; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${p(a.type==="weekly"?"refreshCw":a.type==="monthly"?"calendar":"pin")}
            </div>
            <div class="schedule-info" style="flex: 1;">
                <div class="schedule-title" style="color: ${s}; font-weight: 700; font-size: 16px;">${a.title}</div>
                <div class="schedule-meta" style="margin-top: 4px;">
                    <span class="schedule-frequency" style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">${e}</span>
                    ${a.lastProcessed?`<span class="schedule-last" style="opacity: 0.5; font-size: 10px;">Visto: ${a.lastProcessed}</span>`:""}
                </div>
            </div>
            <div class="schedule-actions" style="display: flex; gap: 8px;">
                <button class="icon-btn toggle-schedule" data-id="${a.id}" style="color: ${a.active?"var(--accent-success)":"var(--text-muted)"}; opacity: 1;">
                    ${p(a.active?"checkCircle":"circle")}
                </button>
                <button class="icon-btn delete-schedule" data-id="${a.id}" style="opacity: 0.4;">
                    ${p("trash")}
                </button>
            </div>
        </div>
    </div>
    `}function Ka(a){if(a.type==="fixed")return`Fecha: ${a.date}`;if(a.type==="monthly")return`Día ${a.dayOfMonth} de cada mes`;if(a.type==="weekly"){const e=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];return`Cada ${a.days.map(s=>e[s]).join(", ")}`}return"Desconocido"}function Ya(){var a;(a=document.getElementById("add-scheduled-task-btn"))==null||a.addEventListener("click",async()=>{const e=await v.prompt("Programar Tarea","¿Qué quieres automatizar?");if(!e)return;const s=[{value:"weekly",label:"📅 Semanal (Elegir días)"},{value:"monthly",label:"🗓️ Mensual (Día fijo)"},{value:"fixed",label:"📌 Fecha Concreta"}],t=await v.select("Tipo de Repetición","¿Cómo se repite esta tarea?",s,1);if(!t)return;let n={title:e,type:t};if(t==="weekly"){const r=await v.prompt("Días de la semana","Introduce los días (1=Lun, 7=Dom) separados por coma:","1,4");if(!r)return;const l=r.split(",").map(m=>{let c=parseInt(m.trim());return c===7?0:c}).filter(m=>!isNaN(m));n.days=l}else if(t==="monthly"){const r=await v.prompt("Día del mes","Día (1-31):","1","number");if(!r)return;n.dayOfMonth=parseInt(r)}else if(t==="fixed"){const r=await v.prompt("Fecha Concreta","¿Cuándo?",new Date().toISOString().split("T")[0],"date");if(!r)return;n.date=r}const o=[{value:"#00D4AA",label:"Teal"},{value:"#7C3AED",label:"Purple"},{value:"#F59E0B",label:"Orange"},{value:"#EF4444",label:"Red"},{value:"#3B82F6",label:"Blue"}],i=await v.select("Color","Elige un color:",o,3);n.color=i||"#00D4AA",u.addScheduledTask(n),v.toast("Tarea programada")}),document.querySelectorAll(".delete-schedule").forEach(e=>{e.addEventListener("click",async()=>{const s=e.dataset.id;await v.confirm("Eliminar Programación","¿Seguro que quieres quitar esta automatización?")&&(u.deleteScheduledTask(s),v.toast("Eliminado"))})}),document.querySelectorAll(".toggle-schedule").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.id,t=u.getState().scheduledTasks.find(n=>n.id===s);u.updateScheduledTask(s,{active:!t.active})})})}function Wa(){const{skills:a}=u.getState(),e=(a||[]).filter(n=>n.category==="current"),s=(a||[]).filter(n=>n.category==="next"),t=e.length>0?Math.round(e.reduce((n,o)=>n+o.level,0)/e.length):0;return`
    <div class="skills-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <h1 class="page-title">Skills & Mastery</h1>
            <p class="page-subtitle">Gestiona tu nivel de expertise y planifica tu aprendizaje</p>
        </header>

        <!-- OVERALL MASTERY HIGHLIGHT -->
        <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%); border-color: rgba(124, 58, 237, 0.3);">
            <div class="card-header">
                <span class="card-title" style="color: #7c3aed;">Maestría Promedio</span>
                ${p("brain","card-icon")}
            </div>
            <div class="highlight-value" style="color: #7c3aed;">${t}<span style="font-size: 16px; opacity: 0.6;">%</span></div>
            <div class="highlight-label">
                ${t>80?"👑 Nivel experto en tu stack":t>50?"🛡️ Profesional competente":"🌱 En fase de crecimiento"}
            </div>
        </div>

        <div class="skills-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-xl);">
            <!-- CURRENT EXPERTISE -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Nivel de Expertise</span>
                    <button class="icon-btn add-skill-btn" data-category="current">${p("plus")}</button>
                </div>
                <div class="skills-list">
                    ${e.length===0?He():e.map(n=>Xa(n)).join("")}
                </div>
            </section>

            <!-- NEXT SKILLS TO DEVELOP -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Desafíos</span>
                    <button class="icon-btn add-skill-btn" data-category="next">${p("plus")}</button>
                </div>
                <div class="skills-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${s.length===0?He():s.map(n=>Ja(n)).join("")}
                </div>
            </section>
        </div>
    </div>
    `}function Xa(a){return`
    <div class="card skill-card" style="margin-bottom: 12px; padding: 16px !important;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 16px;">${a.name}</div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-skill" data-id="${a.id}">${p("edit")}</button>
                <button class="icon-btn delete-skill" data-id="${a.id}" style="color: var(--accent-danger);">${p("trash")}</button>
            </div>
        </div>
        <div class="skill-progress-container" style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden; position: relative;">
            <div class="skill-progress-fill" style="width: ${a.level}%; height: 100%; background: var(--accent-primary); border-radius: 4px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; font-weight: 600; color: var(--text-muted);">
            <span>Nivel de dominio</span>
            <span style="color: var(--accent-primary);">${a.level}%</span>
        </div>
    </div>
    `}function Ja(a){return`
    <div class="card next-skill-card clickable edit-skill" data-id="${a.id}" style="padding: 15px !important; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);">
        <div style="background: rgba(124, 58, 237, 0.1); color: #7c3aed; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
            ${p("zap")}
        </div>
        <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${a.name}</div>
    </div>
    `}function He(a){return`
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">Pulse + para añadir su primera skill</p>
    </div>
    `}function Za(){document.querySelectorAll(".add-skill-btn").forEach(a=>{a.addEventListener("click",async()=>{const e=a.dataset.category,s=await v.prompt("Nueva Skill",`¿Qué skill quieres ${e==="current"?"registrar":"aprender"}?`);if(s){let t=0;if(e==="current"){const n=await v.prompt("Nivel de Dominio","Del 0 al 100:","50","number");t=parseInt(n)||0}u.addSkill({name:s,level:t,category:e}),v.toast("Skill añadida")}})}),document.querySelectorAll(".edit-skill").forEach(a=>{a.addEventListener("click",async e=>{e.stopPropagation();const s=a.dataset.id,t=u.getState().skills.find(o=>o.id===s);if(!t)return;const n=await v.prompt("Editar Skill","Nombre:",t.name);if(n){let o=t.level;if(t.category==="current"){const i=await v.prompt("Nivel de Dominio","Del 0 al 100:",t.level.toString(),"number");o=parseInt(i)||0}u.updateSkill(s,{name:n,level:o}),v.toast("Skill actualizada")}})}),document.querySelectorAll(".delete-skill").forEach(a=>{a.addEventListener("click",async e=>{e.stopPropagation();const s=a.dataset.id;await v.confirm("Eliminar Skill","¿Estás seguro de que quieres eliminar esta skill?")&&(u.deleteSkill(s),v.toast("Skill eliminada"))})})}const Ae={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},ze=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let C="passiveAsset";function Ie(a="passiveAsset"){var s,t;C=a,(t=(s=Ae[C])==null?void 0:s.types[0])!=null&&t.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=Qa(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),es()}function Qa(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${C==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${p("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${C!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(Ae).map(([e,s])=>`
          <div class="type-option ${e===C?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${p(s.icon)}
            </div>
            <div class="type-option-label">${s.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${nt()}
      </div>
    </div>
  `}function nt(){const a=Ae[C],e=C==="investmentAsset"||C==="passiveAsset";if(e){const t=Y.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...ze,...t]}let s="";return C==="passiveAsset"||C==="investmentAsset"?s=`
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
      ${C==="passiveAsset"?`
      <div class="form-group">
          <label class="form-label">Ingreso Mensual (en EUR)</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
      </div>`:""}
    `:C==="activeIncome"||C==="livingExpense"?s=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:C==="liability"?s=`
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
    `:C==="event"&&(s=`
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
                ${a.types.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${ze.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${Y.map(t=>`<option value="${t.symbol}">${t.name} (${t.symbol})</option>`).join("")}
                </optgroup>
                `:""}
            </select>
        </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" class="form-input" id="input-name" placeholder="Ej: Mi Wallet BTC">
    </div>
    
    ${s}
    
    <div class="form-group">
      <label class="form-label">Detalles (opcional)</label>
      <input type="text" class="form-input" id="input-details" placeholder="Notas adicionales...">
    </div>
    
    <button class="btn btn-primary" id="btn-save" style="margin-top: var(--spacing-md);">
      ${p("plus")} Agregar
    </button>
  `}function es(){const a=document.getElementById("add-modal"),e=document.getElementById("modal-close");a.addEventListener("click",t=>{t.target===a&&Le()}),e.addEventListener("click",Le);const s=a.querySelectorAll(".category-selector .type-option");s.forEach(t=>{t.addEventListener("click",()=>{C=t.dataset.category,s.forEach(n=>n.classList.remove("active")),t.classList.add("active"),document.getElementById("form-container").innerHTML=nt(),Ve()})}),Ve()}function Ve(){const a=document.getElementById("btn-save");a&&a.addEventListener("click",ts);const e=document.getElementById("mode-qty"),s=document.getElementById("mode-total"),t=document.getElementById("input-qty"),n=document.getElementById("input-value"),o=document.getElementById("input-currency"),i=document.getElementById("input-name");if(e&&s){const l=m=>{m==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",s.style.background="transparent",s.style.color="var(--text-secondary)",t.focus()):(s.style.background="var(--accent-primary)",s.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>l("qty")),s.addEventListener("click",()=>l("total"))}const r=l=>{const m=u.getState().rates,c=o==null?void 0:o.value,d=m[c]||1;if(l==="qty"){const g=parseFloat(t.value)||0;n.value=(g*d).toFixed(2)}else{const g=parseFloat(n.value)||0;t.value=(g/d).toFixed(6)}};t==null||t.addEventListener("input",()=>r("qty")),n==null||n.addEventListener("input",()=>r("total")),o&&o.addEventListener("change",()=>{if(i&&!i.value){const l=o.options[o.selectedIndex].text;i.value=l.split(" (")[0]}r("qty")})}function ts(){var h,f,y,x,k,L,E,P,M,R,V,K;const a=(f=(h=document.getElementById("input-name"))==null?void 0:h.value)==null?void 0:f.trim(),e=(y=document.getElementById("input-type"))==null?void 0:y.value,s=(x=document.getElementById("input-currency"))==null?void 0:x.value,t=(L=(k=document.getElementById("input-details"))==null?void 0:k.value)==null?void 0:L.trim(),n=parseFloat((E=document.getElementById("input-value"))==null?void 0:E.value)||0,o=document.getElementById("input-qty"),i=o?parseFloat(o.value)||0:n,r=parseFloat((P=document.getElementById("input-amount"))==null?void 0:P.value)||0,l=parseFloat((M=document.getElementById("input-monthly"))==null?void 0:M.value)||0,m=(R=document.getElementById("input-date"))==null?void 0:R.value,c=(V=document.getElementById("input-time"))==null?void 0:V.value,d=(K=document.getElementById("input-repeat"))==null?void 0:K.value;if(!a){v.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const g={name:a,type:e,currency:s,details:t};switch(C){case"passiveAsset":u.addPassiveAsset({...g,value:i,monthlyIncome:l});break;case"activeIncome":u.addActiveIncome({...g,amount:r});break;case"livingExpense":u.addLivingExpense({...g,amount:r});break;case"investmentAsset":u.addInvestmentAsset({...g,value:i});break;case"liability":u.addLiability({...g,amount:r,monthlyPayment:l});break;case"event":u.addEvent({title:a,date:m,time:c,repeat:d,category:e});break}Le()}function Le(){const a=document.getElementById("add-modal");a&&(a.classList.remove("active"),setTimeout(()=>a.remove(),300))}let X=null;function it(a=null){console.log("[LeadModal] Opening modal",{personToEdit:a});const e=document.getElementById("add-person-modal");e&&(console.log("[LeadModal] Removing existing modal"),e.remove()),X=a?a.id:null;const s=document.createElement("div");s.className="modal-overlay",s.id="add-person-modal",s.setAttribute("role","dialog"),s.innerHTML=as(a),document.body.appendChild(s),setTimeout(()=>{var t;s.classList.add("active"),(t=s.querySelector("#person-name"))==null||t.focus()},50),ss(s)}function as(a=null){const e=a?"Editar Lead":"Lead",s=a?"Guardar Cambios":"Lead";return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <div class="header-title-wrapper" style="display: flex; align-items: center; gap: 12px;">
            <div style="background: var(--gradient-primary); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-primary); box-shadow: var(--shadow-sm);">
                ${p("plus")}
            </div>
            <h2 class="modal-title">${e}</h2>
        </div>
        <button class="modal-close" id="person-modal-close">
          ${p("x")}
        </button>
      </div>
      
      <div id="person-form-container" style="margin-top: var(--spacing-lg);">
        <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${(a==null?void 0:a.name)||""}">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" id="person-phone" placeholder="+54 9 ..." value="${(a==null?void 0:a.phone)||""}">
            </div>
            <div class="form-group">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-input" id="person-city" placeholder="Ej: Buenos Aires" value="${(a==null?void 0:a.city)||""}">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Fuente de Contacto</label>
                <select class="form-input form-select" id="person-source">
                    ${u.getState().social.contactSources.map(t=>`
                        <option value="${t}" ${(a==null?void 0:a.source)===t?"selected":""}>${t}</option>
                    `).join("")}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Lead Alignment (1-10)</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" class="form-range" id="person-rating-slider" min="1" max="10" value="${(a==null?void 0:a.rating)||5}" style="flex: 1;">
                    <span id="rating-value" style="font-weight: bold; width: 24px; text-align: center;">${(a==null?void 0:a.rating)||5}</span>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Último Contacto</label>
                <input type="date" class="form-input" id="person-last-contact" value="${(a==null?void 0:a.lastContact)||new Date().toISOString().split("T")[0]}">
            </div>
            <div class="form-group">
                <label class="form-label">Color del Lead</label>
                <div class="goal-color-dots" id="person-color-picker" style="justify-content: flex-start; margin-top: 0; background: none; border: none; padding: 5px 0;">
                    ${["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"].map(t=>`
                        <div class="goal-color-dot ${(a==null?void 0:a.color)===t||!(a!=null&&a.color)&&t==="#3b82f6"?"active":""}" 
                             data-color="${t}" 
                             style="background-color: ${t}; width: 28px; height: 28px;"></div>
                    `).join("")}
                </div>
                <input type="hidden" id="person-color-value" value="${(a==null?void 0:a.color)||"#3b82f6"}">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notas / Descripción</label>
            <textarea class="form-input" id="person-desc" rows="3" placeholder="Detalles importantes, gustos, temas de conversación...">${(a==null?void 0:a.description)||""}</textarea>
        </div>

        <div class="form-group" style="margin-top: var(--spacing-md);">
             <label class="form-label">Etapa</label>
             <select class="form-input form-select" id="person-column">
                ${u.getState().social.columns.sort((t,n)=>t.order-n.order).map(t=>`<option value="${t.id}" ${(a==null?void 0:a.columnId)===t.id?"selected":""}>${t.name}</option>`).join("")}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${X?`
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${p("trash")}
            </button>`:""}
            <button class="btn btn-primary w-full" id="btn-save-person-lead" style="padding: 14px;">
                ${p("plus")} ${s}
            </button>
        </div>
      </div>
    </div>
  `}function ss(a){const e=a.querySelector("#person-modal-close"),s=a.querySelector("#btn-save-person-lead"),t=a.querySelector("#btn-delete-person"),n=a.querySelector("#person-rating-slider"),o=a.querySelector("#rating-value");if(a.addEventListener("click",l=>{l.target===a&&(console.log("[LeadModal] Overlay clicked, closing"),ye(a))}),e==null||e.addEventListener("click",()=>{console.log("[LeadModal] Close button clicked"),ye(a)}),n&&o){const l=()=>{console.log("[LeadModal] Slider updated:",n.value),o.textContent=n.value};n.oninput=l,n.onchange=l}s&&(s.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Save button clicked"),os(a)}),t&&(t.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Delete button clicked"),is(a)});const i=a.querySelectorAll(".goal-color-dot"),r=a.querySelector("#person-color-value");i.forEach(l=>{l.addEventListener("click",()=>{i.forEach(m=>m.classList.remove("active")),l.classList.add("active"),r&&(r.value=l.dataset.color),console.log("[LeadModal] Color selected:",l.dataset.color)})})}async function is(a){X&&await v.confirm("Eliminar Lead","¿Estás seguro de eliminar este lead?")&&(u.deletePerson(X),v.toast("Lead eliminado","success"),ye(a))}function os(a){var s,t,n,o,i,r,l,m,c,d,g,h,f;const e=a.querySelector("#btn-save-person-lead");if(e.disabled){console.log("[LeadModal] Save ignored, already processing");return}try{const y=(t=(s=a.querySelector("#person-name"))==null?void 0:s.value)==null?void 0:t.trim(),x=(o=(n=a.querySelector("#person-phone"))==null?void 0:n.value)==null?void 0:o.trim(),k=(r=(i=a.querySelector("#person-city"))==null?void 0:i.value)==null?void 0:r.trim(),L=(l=a.querySelector("#person-source"))==null?void 0:l.value,E=(m=a.querySelector("#person-rating-slider"))==null?void 0:m.value,P=(d=(c=a.querySelector("#person-desc"))==null?void 0:c.value)==null?void 0:d.trim(),M=(g=a.querySelector("#person-column"))==null?void 0:g.value,R=(h=a.querySelector("#person-color-value"))==null?void 0:h.value,V=(f=a.querySelector("#person-last-contact"))==null?void 0:f.value;if(console.log("[LeadModal] Attempting to save",{name:y,rating:E,columnId:M,color:R,lastContact:V}),!y){console.warn("[LeadModal] Save failed: Missing name"),v.toast("El nombre es obligatorio","error");return}e.disabled=!0,e.innerHTML='<span class="loading-spinner-sm"></span> Guardando...';const K={name:y,phone:x,city:k,source:L,rating:parseInt(E)||5,description:P,columnId:M,color:R,lastContact:V};X?(console.log("[LeadModal] Updating person",X),u.updatePerson(X,K),v.toast("Lead actualizado correctamente","success")):(console.log("[LeadModal] Adding new person"),u.addPerson(K),v.toast("Lead guardado correctamente","success")),console.log("[LeadModal] Save successful, closing modal"),ye(a)}catch(y){console.error("[LeadModal] Error saving lead:",y),v.toast("Error al guardar el lead","error"),e.disabled=!1,e.innerHTML=`${p("plus")} Lead`}}function ye(a){a&&(console.log("[LeadModal] Closing modal"),a.classList.remove("active"),setTimeout(()=>{a.parentNode&&(console.log("[LeadModal] Removing modal from DOM"),a.remove())},400))}function rs(){const a=$.isSetup(),e=$.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${p("lock","auth-icon")}
                </div>
                <h1 class="auth-title">${a?"Bienvenida de nuevo":"Configura tu Bóveda"}</h1>
                <p class="auth-subtitle">${a?"Introduce tu contraseña para entrar":"Crea una contraseña maestra para proteger tus datos"}</p>
            </div>

            <div class="auth-form">
                <div class="input-group">
                    <input type="password" id="auth-password" class="form-input" placeholder="Contraseña maestra" autofocus>
                </div>
                
                ${a?"":`
                <div class="input-group">
                    <input type="password" id="auth-confirm" class="form-input" placeholder="Confirmar contraseña">
                </div>
                `}

                <button id="auth-submit-btn" class="btn btn-primary w-full">
                    ${a?"Desbloquear":"Empezar"}
                </button>

                ${a&&e?`
                <button id="auth-bio-btn" class="btn btn-secondary w-full" style="margin-top: var(--spacing-sm);">
                    ${p("fingerprint")} Usar Huella
                </button>
                `:""}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `}function ls(a){var o;const e=document.getElementById("auth-submit-btn"),s=document.getElementById("auth-bio-btn"),t=document.getElementById("auth-password"),n=async()=>{const i=t.value,r=document.getElementById("auth-confirm"),l=$.isSetup();try{let m;if(l)m=await $.unlock(i);else{if(!i||i.length<4)throw new Error("Contraseña demasiado corta");if(i!==r.value)throw new Error("Las contraseñas no coinciden");m=await $.setup(i)}await u.loadEncrypted(m),a()}catch(m){v.alert("Error",m.message)}};e==null||e.addEventListener("click",n),t==null||t.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),(o=document.getElementById("auth-confirm"))==null||o.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),s==null||s.addEventListener("click",async()=>{try{const i=await $.unlockWithBiometrics();await u.loadEncrypted(i),a()}catch(i){v.alert("Identificación",i.message)}}),$.isBioEnabled()&&setTimeout(async()=>{try{const i=await $.unlockWithBiometrics();await u.loadEncrypted(i),a()}catch{console.log("Auto-bio failed or cancelled")}},500)}let D=localStorage.getItem("life-dashboard/app_current_page")||"finance",I=localStorage.getItem("life-dashboard/app_current_sub_page")||null;I==="null"&&(I=null);async function Ke(){window.addEventListener("open-add-modal",e=>{var t,n;const s=(t=e.detail)==null?void 0:t.type;s==="person"?it((n=e.detail)==null?void 0:n.person):Ie(s)}),U.init().catch(e=>console.warn("[Drive] Pre-init failed:",e)),window.addEventListener("nav-change",e=>{var t;const s=(t=e.detail)==null?void 0:t.page;if(s){D=s,I=null,localStorage.setItem("life-dashboard/app_current_page",D),j();const n=document.getElementById("bottom-nav");n&&(n.innerHTML=Se(D))}});const a=$.getVaultKey();a?await u.loadEncrypted(a)?ot():(console.error("[Boot] Decryption failed, invalid vault key in session?"),$.logout(),Ye()):Ye()}function Ye(){const a=document.getElementById("app");a.innerHTML=rs(),ls(()=>{ot()})}function ot(){const a=document.getElementById("app");a.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,rt(),u.subscribe(()=>{j()}),window.reRender=()=>j(),cs()}function cs(){var t,n;const a=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(a&&(Date.now()-parseInt(a))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
        <div class="pwa-install-banner-icon">
            ${p("download")}
        </div>
        <div class="pwa-install-banner-text">
            <div class="pwa-install-banner-title">Instalar Life Dashboard</div>
            <div class="pwa-install-banner-subtitle">Accede más rápido desde tu pantalla de inicio</div>
        </div>
        <button class="pwa-install-btn" id="pwa-banner-install">Instalar</button>
        <button class="pwa-install-close" id="pwa-banner-close">
            ${p("x")}
        </button>
    `,document.body.appendChild(e);const s=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};s(),window.addEventListener("beforeinstallprompt",s),(t=document.getElementById("pwa-banner-install"))==null||t.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:o}=await window.deferredPrompt.userChoice;o==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function rt(){const a=document.getElementById("bottom-nav");a.innerHTML=Se(D),Re(e=>{D=e,I=null,localStorage.setItem("life-dashboard/app_current_page",D),localStorage.setItem("life-dashboard/app_current_sub_page",I),O(),j(),a.innerHTML=Se(D),Re(s=>{D=s,I=null,localStorage.setItem("life-dashboard/app_current_page",D),localStorage.setItem("life-dashboard/app_current_sub_page",I),O(),j(),rt()})}),ds(),j()}function j(){const a=document.getElementById("main-content");if(!a)return;const e=a.scrollTop;if(I==="compound"){a.innerHTML=zt(),Vt(()=>{I=null,Kt(),O(),j()}),a.scrollTop=e;return}if(I==="expenses"){a.innerHTML=ha(),ba(()=>{I=null,O(),j()}),a.scrollTop=e;return}if(I==="market"){a.innerHTML=Yt(),Xt(()=>{I=null,O(),j()}),a.scrollTop=e;return}switch(a.classList.toggle("no-padding-mobile",D==="health"),D){case"finance":O(),a.innerHTML=_e(),Ue(),We();break;case"goals":N(),a.innerHTML=oa(),la();break;case"time-invest":N(),a.innerHTML=_a(),qa();break;case"social":N(),a.innerHTML=Ia(),Aa();break;case"health":a.innerHTML=Jt(),sa(),N();break;case"menu":a.innerHTML=Sa(),$a(s=>{D=s,O(),j()}),N();break;case"calendar":a.innerHTML=ca(),ga(),O();break;case"schedule":a.innerHTML=za(),Ya(),N();break;case"skills":a.innerHTML=Wa(),Za(),O();break;case"settings":a.innerHTML=ka(),Ea(),N();break;default:O(),a.innerHTML=_e(),Ue(),We()}requestAnimationFrame(()=>{a.scrollTop=e})}function We(){const a=document.getElementById("open-compound");a&&a.addEventListener("click",()=>{I="compound",localStorage.setItem("life-dashboard/app_current_sub_page",I),N(),j()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{I="market",localStorage.setItem("life-dashboard/app_current_sub_page",I),N(),j()});const s=document.getElementById("open-expenses");s&&s.addEventListener("click",()=>{I="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",I),N(),j()})}function ds(){const a=document.querySelector(".fab");a&&a.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=p("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{if(D==="calendar")Ie("event");else if(D==="health"){const s=await ns.confirm("Log Metric","What do you want to record today?","Weight","Body Fat");if(s===!0){const t=await ns.prompt("Log Weight","Enter your current weight in kg:","","number");t&&u.addWeightLog(t)}else if(s===!1){const t=await ns.prompt("Body Fat","Enter your body fat %:","","number");t&&u.addFatLog(t)}}else if(D==="social")it();else if(D==="skills"){const s=await ns.confirm("Nueva Skill","¿Qué tipo de skill quieres añadir?","Expertise (Actual)","A aprender (Próxima)");if(s!==null){const t=s===!0?"current":"next",n=await ns.prompt("Nueva Skill",`¿Qué skill quieres ${t==="current"?"registrar":"aprender"}?`);if(n){let o=0;if(t==="current"){const i=await ns.prompt("Nivel de Dominio","Del 0 al 100:","50","number");o=parseInt(i)||0}u.addSkill({name:n,level:o,category:t}),ns.toast("Skill añadida")}}}else Ie()}),document.body.appendChild(e)}function N(){const a=document.getElementById("main-fab");a&&(a.style.display="none")}function O(){const a=document.getElementById("main-fab");a&&(a.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ke):Ke();window.addEventListener("beforeinstallprompt",a=>{a.preventDefault(),window.deferredPrompt=a,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});export{p as g,v as n,u as s};
