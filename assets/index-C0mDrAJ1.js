var et=Object.defineProperty;var tt=(s,e,a)=>e in s?et(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a;var ce=(s,e,a)=>tt(s,typeof e!="symbol"?e+"":e,a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const at="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",st="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function nt(){var e,a,t,n,o,i,r,l,m,c,u,h,g,w,f;const s={EUR:1};try{const k=await(await fetch(at)).json();s.BTC=((e=k.bitcoin)==null?void 0:e.eur)||4e4,s.ETH=((a=k.ethereum)==null?void 0:a.eur)||2200,s.XRP=((t=k.ripple)==null?void 0:t.eur)||.5,s.KAS=((n=k.kaspa)==null?void 0:n.eur)||.1,s.SOL=((o=k.solana)==null?void 0:o.eur)||90,s.XLM=((i=k.stellar)==null?void 0:i.eur)||.11,s.ALGO=((r=k.algorand)==null?void 0:r.eur)||.18,s.LTC=((l=k.litecoin)==null?void 0:l.eur)||65,s.SUI=((m=k.sui)==null?void 0:m.eur)||1.1,s.LINK=((c=k.chainlink)==null?void 0:c.eur)||14,s.RNDR=((u=k["render-token"])==null?void 0:u.eur)||4.5,s.ADA=((h=k.cardano)==null?void 0:h.eur)||.45,s.ONDO=((g=k["ondo-finance"])==null?void 0:g.eur)||.7,(w=k.bitcoin)!=null&&w.ars&&((f=k.bitcoin)!=null&&f.eur)&&(s.ARS=k.bitcoin.eur/k.bitcoin.ars);const L=await fetch(st);if(L.ok){const E=await L.json();s.USD=1/E.rates.USD,s.CHF=1/E.rates.CHF,s.GBP=1/E.rates.GBP,s.AUD=1/E.rates.AUD}s.GOLD=2100,s.SP500=4700}catch(x){console.error("Failed to fetch some prices:",x),s.USD=s.USD||.92,s.CHF=s.CHF||1.05,s.GBP=s.GBP||1.15,s.AUD=s.AUD||.6,s.ARS=s.ARS||.001}return s}class G{static async hash(e,a="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+a),o=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(o)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,a){const t=new TextEncoder,n=await crypto.subtle.importKey("raw",t.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(a),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,a){try{const t=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),o=await this.deriveKey(a,this.bufToBase64(t)),i=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(i),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},o,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(n),salt:this.bufToBase64(t),v:"5.0"}}catch(t){throw console.error("[Security] Encryption failed:",t),new Error("No se pudo encriptar la información")}}static async decrypt(e,a){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:t,iv:n,salt:o}=e,i=await this.deriveKey(a,o),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},i,this.base64ToBuf(t)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(t){throw console.error("[Security] Decryption failed:",t),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(a=>a.charCodeAt(0)))}}const Se=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:G},Symbol.toStringTag,{value:"Module"})),T={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class I{static isSetup(){return!!localStorage.getItem(T.MASTER_HASH)}static async setup(e){const a=await G.hash(e),t=await G.deriveVaultKey(e);return localStorage.setItem(T.MASTER_HASH,a),sessionStorage.setItem(T.VAULT_KEY,t),t}static async unlock(e){const a=await G.hash(e),t=localStorage.getItem(T.MASTER_HASH);if(a===t){const n=await G.deriveVaultKey(e);return sessionStorage.setItem(T.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const a=sessionStorage.getItem(T.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const t=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:t,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(T.BIO_ENABLED,"true"),localStorage.setItem(T.VAULT_KEY,a),!0}catch(t){throw console.error("Biometric setup failed:",t),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(T.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const a=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:a,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const t=localStorage.getItem(T.VAULT_KEY);if(t)return sessionStorage.setItem(T.VAULT_KEY,t),t;throw new Error("Llave no encontrada. Usa contraseña.")}catch(a){throw console.error("Biometric auth failed:",a),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(T.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(T.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(T.BIO_ENABLED)==="true"}}const ye="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",$e=[71,79,67,83,80,88,45,112,121,52,68,109,80,83,107,45,100,75,55,99,73,66,116,106,65,81,75,90,70,75,118,95,66,87,95].map(s=>String.fromCharCode(s)).join(""),ot="https://www.googleapis.com/auth/drive.file";class q{static hasToken(){const e=!!this.accessToken;return localStorage.getItem("life-dashboard/drive_connected")==="true"&&e}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,a)=>{const t=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.codeClient=google.accounts.oauth2.initCodeClient({client_id:ye,scope:ot,ux_mode:"popup",access_type:"offline",prompt:"consent",callback:async n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}if(n.code)try{const o=sessionStorage.getItem("life-dashboard/pkce_verifier"),i=localStorage.getItem("life-dashboard/drive_client_secret")||$e,r=await this.exchangeCodeForTokens(n.code,o,ye,i);r.refresh_token&&await this.saveRefreshToken(r.refresh_token),this.saveSession(r),console.log("[Drive] Connected successfully via offline flow."),window.ns&&window.ns.toast("Google Drive vinculado"),typeof window.reRender=="function"&&window.reRender()}catch(o){console.error("[Drive] Token exchange error:",o),window.ns&&window.ns.alert("Error Auth","No se pudieron obtener tokens. Verifica el Client Secret.")}}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&this.ensureValidToken().catch(n=>{console.log("[Drive] Initial silent restoration skipped:",n.message)}),e(!0)}catch(n){console.error("[Drive] Init error:",n),a(n)}}):setTimeout(t,200)};t()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const a=e.expires_in||3600,t=Date.now()+a*1e3;localStorage.setItem("life-dashboard/drive_token_expiry",t.toString())}static async authenticate(){this.codeClient||await this.init();const{verifier:e}=await this.generatePKCE();sessionStorage.setItem("life-dashboard/pkce_verifier",e),this.codeClient.requestCode()}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Access token expired or near expiry, attempting refresh...");const n=await this.getRefreshToken();if(n)try{const o=localStorage.getItem("life-dashboard/drive_client_secret")||$e,i=await this.refreshAccessToken(n,ye,o),r={access_token:i.access_token,expires_in:i.expires_in,refresh_token:i.refresh_token||n};return i.refresh_token&&await this.saveRefreshToken(i.refresh_token),this.saveSession(r),this.accessToken}catch(o){throw console.error("[Drive] Token refresh failed:",o),new Error("Sesión de Google Drive expirada. Por favor reconecta en Configuración.")}else throw console.warn("[Drive] No refresh token found."),new Error("Google Drive no está vinculado para acceso offline.")}return this.accessToken&&(!gapi.client.getToken()||gapi.client.getToken().access_token!==this.accessToken)&&gapi.client.setToken({access_token:this.accessToken}),this.accessToken}static async generatePKCE(){const e=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(i=>("0"+i.toString(16)).slice(-2)).join(""),t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t),o=btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return{verifier:e,challenge:o}}static async exchangeCodeForTokens(e,a,t,n=null){const o=new URLSearchParams({client_id:t,code:e,grant_type:"authorization_code",redirect_uri:"postmessage"});a&&!n&&o.append("code_verifier",a),n&&o.append("client_secret",n);const i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o});if(!i.ok){const r=await i.json();throw new Error(r.error_description||"Failed to exchange code")}return await i.json()}static async refreshAccessToken(e,a,t=null){const n=new URLSearchParams({client_id:a,refresh_token:e,grant_type:"refresh_token"});t&&n.append("client_secret",t);const o=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!o.ok){const i=await o.json();throw new Error(i.error_description||"Failed to refresh token")}return await o.json()}static async saveRefreshToken(e){return new Promise((a,t)=>{const n=indexedDB.open("LifeDashboardAuthDB",1);n.onupgradeneeded=o=>{const i=o.target.result;i.objectStoreNames.contains("tokens")||i.createObjectStore("tokens")},n.onsuccess=o=>{const r=o.target.result.transaction("tokens","readwrite");r.objectStore("tokens").put(e,"drive_refresh_token"),r.oncomplete=()=>a(),r.onerror=l=>t(l)},n.onerror=o=>t(o)})}static async getRefreshToken(){return new Promise((e,a)=>{const t=indexedDB.open("LifeDashboardAuthDB",1);t.onupgradeneeded=n=>{const o=n.target.result;o.objectStoreNames.contains("tokens")||o.createObjectStore("tokens")},t.onsuccess=n=>{const o=n.target.result;if(!o.objectStoreNames.contains("tokens")){e(null);return}const l=o.transaction("tokens","readonly").objectStore("tokens").get("drive_refresh_token");l.onsuccess=()=>e(l.result),l.onerror=m=>a(m)},t.onerror=n=>a(n)})}static async clearTokens(){return localStorage.removeItem("life-dashboard/drive_access_token"),localStorage.removeItem("life-dashboard/drive_connected"),localStorage.removeItem("life-dashboard/drive_token_expiry"),new Promise(e=>{const a=indexedDB.open("LifeDashboardAuthDB",1);a.onsuccess=t=>{const n=t.target.result;if(n.objectStoreNames.contains("tokens")){const o=n.transaction("tokens","readwrite");o.objectStore("tokens").clear(),o.oncomplete=()=>e()}else e()},a.onerror=()=>e()})}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const a=e.split("/").filter(o=>o);let t="root";for(const o of a){const i=`name = '${o}' and mimeType = 'application/vnd.google-apps.folder' and '${t}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(l&&l.length>0)t=l[0].id;else{const m={name:o,mimeType:"application/vnd.google-apps.folder",parents:[t]};t=(await gapi.client.drive.files.create({resource:m,fields:"id"})).result.id}}return t}static async pushData(e,a,t=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pushing encrypted data...${t?" (Retry)":""}`);const n=await this.getOrCreateFolderPath("/backup/life-dashboard/"),o=await G.encrypt(e,a),i="dashboard_vault_v5.bin",r=`name = '${i}' and '${n}' in parents and trashed = false`,m=(await gapi.client.drive.files.list({q:r,fields:"files(id)"})).result.files,c=new Blob([JSON.stringify(o)],{type:"application/json"});if(m&&m.length>0){const u=m[0].id,h=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${u}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:c});if(h.status===401&&!t)return await this.ensureValidToken(),await this.pushData(e,a,!0);if(!h.ok)throw new Error(`Error al actualizar backup: ${h.status}`)}else{const u={name:i,parents:[n]},h=new FormData;h.append("metadata",new Blob([JSON.stringify(u)],{type:"application/json"})),h.append("file",c);const g=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:h});if(g.status===401&&!t)return await this.ensureValidToken(),await this.pushData(e,a,!0);if(!g.ok)throw new Error(`Error al crear backup: ${g.status}`)}return!0}catch(n){throw console.error("[Drive] Push failed:",n),new Error(n.message||"Fallo al subir datos a Drive")}}static async pullData(e,a=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pulling data...${a?" (Retry)":""}`);const o=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,r=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(!r||r.length===0)return null;const l=r[0].id,m=await fetch(`https://www.googleapis.com/drive/v3/files/${l}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(m.status===401&&!a)return await this.ensureValidToken(),await this.pullData(e,!0);if(!m.ok)throw new Error(`Error al descargar backup: ${m.status}`);const c=await m.json();return await G.decrypt(c,e)}catch(t){throw console.error("[Drive] Pull failed:",t),new Error(t.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");const t=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,o=(await gapi.client.drive.files.list({q:t,fields:"files(id)"})).result.files;if(o&&o.length>0){const i=o[0].id;return await gapi.client.drive.files.delete({fileId:i}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(e){throw console.error("[Drive] Deletion failed:",e),new Error(e.message||"Fallo al borrar backup en Drive")}}}ce(q,"codeClient",null),ce(q,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null),ce(q,"_initPromise",null);const Ie={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',uploadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12V21"/><path d="m16 16-4-4-4 4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',users:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',messageSquare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',phone:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',facebook:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',linkedin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"/><path d="M5 15.1a7 7 0 0 0 10.9 0"/><path d="M6 13.6a7 7 0 0 0 4.6 2.4"/><path d="M13.4 16a7 7 0 0 0 4.6-2.4"/><path d="M8 12.1a5 5 0 0 0 6.9 0"/><path d="M9.1 11a3 3 0 0 0 3.9 0"/><path d="M12 18.5V20"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',palette:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12c0 0 3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',clock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',barChart2:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',brain:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>',rocket:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>',coffee:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',bookOpen:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',dumbbell:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',code:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',music:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',monitor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'};function p(s,e=""){return(Ie[s]||Ie.package).replace("<svg",`<svg class="${e}"`)}class it{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,a="success",t=3e3){const n=document.createElement("div");n.className=`toast toast-${a} stagger-in`;const o=a==="success"?"check":a==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${p(o,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},t)}alert(e,a){return new Promise(t=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>t(!0)}]})})}confirm(e,a,t="Confirmar",n="Cancelar"){return new Promise(o=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>o(!1)},{text:t,type:"danger",onClick:()=>o(!0)}]})})}prompt(e,a,t="",n="text"){return new Promise(o=>{const i=`prompt-input-${Date.now()}`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${i}" class="form-input" value="${t}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(i).value;o(r)}}]}),setTimeout(()=>{const r=document.getElementById(i);r&&(r.focus(),r.select&&r.select())},100)})}select(e,a,t=[],n=4){return new Promise(o=>{const i=`display: grid; grid-template-columns: repeat(${n}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="${i}">
                        ${t.map((l,m)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>o(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{o(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,a,t="BORRAR"){return new Promise(n=>{const o=`hard-confirm-input-${Date.now()}`,i=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${a}<br><br>Escribe <strong>${t}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${o}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:i,disabled:!0,onClick:()=>n(!0)}]});const r=document.getElementById(o),l=document.getElementById(i);r.addEventListener("input",()=>{const m=r.value.trim().toUpperCase()===t.toUpperCase();l.disabled=!m,l.style.opacity=m?"1":"0.3",l.style.pointerEvents=m?"auto":"none"})})}performance(e,a){const t=[{rating:1,emoji:"🫣",label:"Baja"},{rating:3,emoji:"😐",label:"Media"},{rating:5,emoji:"😎",label:"Alta"}];return new Promise(n=>{this._showModal({title:e,message:a,centered:!0,content:`
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
                    ${n.map((u,h)=>`
                        <button class="btn btn-${u.type} w-full" data-index="${h}" style="min-height: 48px; font-size: 16px; ${u.disabled?"opacity: 0.3; pointer-events: none;":""}" ${u.id?`id="${u.id}"`:""}>
                            ${u.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;i.innerHTML=l,document.body.appendChild(i),i.offsetHeight,i.classList.add("active"),setTimeout(()=>{const u=i.querySelectorAll(".modal-footer button");u.length>0&&u[u.length-1].focus()},100);const m=u=>{u.key==="Escape"&&(n.some(g=>g.type==="danger")||(i.removeEventListener("keydown",m),this._closeModal(i)))};i.tabIndex=-1,i.addEventListener("keydown",m),i.querySelectorAll(".modal-footer button").forEach(u=>{const h=u.dataset.index;if(h!==void 0){const g=n[h];u.addEventListener("click",async w=>{if(w.stopPropagation(),!u.classList.contains("btn-processing")){u.classList.add("btn-processing"),u.style.pointerEvents="none";try{g.onClick&&await g.onClick(),await this._closeModal(i)}catch(f){console.error("Modal button action failed",f),u.classList.remove("btn-processing"),u.style.pointerEvents="auto"}}})}}),i.addEventListener("click",async u=>{if(u.target===i&&!n.some(g=>g.type==="danger")){const g=n.find(w=>w.type==="secondary");g&&g.onClick(),await this._closeModal(i)}})}async _closeModal(e){e.classList.remove("active");const a=e.querySelector(".modal");return a&&a.classList.add("animate-out"),new Promise(t=>{setTimeout(()=>{e.remove(),t()},300)})}}const v=new it,fe="life-dashboard/data",Ce="life-dashboard/secured",de={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],social:{people:[],columns:[{id:"1",name:"Chat",color:"#3b82f6",order:0},{id:"2",name:"Phone",color:"#8b5cf6",order:1},{id:"3",name:"Meeting",color:"#10b981",order:2},{id:"4",name:"Closed",color:"#f59e0b",order:3}],communications:[],contactSources:["Instagram","WhatsApp","Bumble","LinkedIn","Evento","Amigo","Otro"],idealLeadProfile:""},lastMarketData:[],marketFavorites:[],wealthGoals:[],inflationRate:3,projectionYears:10,timeInvest:{activities:[{id:"1",name:"Meditar",icon:"brain",color:"#8b5cf6"},{id:"2",name:"Emprender",icon:"rocket",color:"#f59e0b"}],logs:[],pomodoroTime:25}};class rt{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...de}}async loadEncrypted(e){const a=localStorage.getItem(Ce),t=localStorage.getItem(fe);if(a)try{const n=JSON.parse(a),o=await G.decrypt(n,e);return this.state={...de,...o},this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(t)try{const n=JSON.parse(t);return this.state={...de,...n},await this.saveState(),localStorage.removeItem(fe),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await nt();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=I.getVaultKey();if(e){console.log("[Store] Saving state to encrypted storage...");const a=await G.encrypt(this.state,e);localStorage.setItem(Ce,JSON.stringify(a)),localStorage.removeItem(fe),console.log("[Store] State saved successfully.")}else console.warn("[Store] Attempted to save without Vault Key. Save skipped. Data will be lost on refresh.")}catch(e){console.error("[Store] Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState(),this.notify()}resetState(e){this.state={...de,...e},this.saveState(),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const a={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:a[e]||"$"})}convertToEUR(e,a){if(!a||a==="EUR")return e||0;const t=this.state.rates[a]||1;return(e||0)*t}convertFromEUR(e,a){if(!a||a==="EUR")return e;const t=this.state.rates[a];return t&&t!==0?e/t:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,a="investment"){const t={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return a==="passive"?this.addPassiveAsset({...t,monthlyIncome:0}):this.addInvestmentAsset(t)}toggleMarketFavorite(e){const a=this.state.marketFavorites||[],t=a.includes(e)?a.filter(n=>n!==e):[...a,e];this.setState({marketFavorites:t})}convertValue(e,a){const t=this.convertToEUR(e,a);return this.convertFromEUR(t,this.state.currency)}addPassiveAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,a]}),a}updatePassiveAsset(e,a){this.setState({passiveAssets:this.state.passiveAssets.map(t=>t.id===e?{...t,...a}:t)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(a=>a.id!==e)})}addActiveIncome(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,a]}),a}updateActiveIncome(e,a){this.setState({activeIncomes:this.state.activeIncomes.map(t=>t.id===e?{...t,...a}:t)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(a=>a.id!==e)})}addLivingExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,a]}),a}updateLivingExpense(e,a){this.setState({livingExpenses:this.state.livingExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(a=>a.id!==e)})}addOtherExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,a]}),a}updateOtherExpense(e,a){this.setState({otherExpenses:this.state.otherExpenses.map(t=>t.id===e?{...t,...a}:t)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(a=>a.id!==e)})}addInvestmentAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,a]}),a}updateInvestmentAsset(e,a){this.setState({investmentAssets:this.state.investmentAssets.map(t=>t.id===e?{...t,...a}:t)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(a=>a.id!==e)})}addLiability(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,a]}),a}updateLiability(e,a){this.setState({liabilities:this.state.liabilities.map(t=>t.id===e?{...t,...a}:t)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(a=>a.id!==e)})}sumItems(e,a){return e.reduce((t,n)=>{const o=n[a]||0;return t+this.convertValue(o,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),a=this.sumItems(this.state.liabilities,"monthlyPayment");return e+a}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),a=this.sumItems(this.state.investmentAssets,"value");return e+a}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),a=this.sumItems(this.state.activeIncomes,"amount");return e+a}getAllExpenses(){const e=this.getLivingExpenses(),a=this.sumItems(this.state.otherExpenses,"amount");return e+a}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,a){this.setState({health:{...this.state.health,[e]:a}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const a={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,a]}})}addFatLog(e){const a={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,a]}})}saveRoutine(e){const a=this.state.health.routines,n=a.find(o=>o.id===e.id)?a.map(o=>o.id===e.id?e:o):[...a,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(a=>a.id!==e)}})}renameRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,name:a}:t)}})}updateExercise(e,a,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const o=[...n.exercises];return o[a]={...o[a],...t},{...n,exercises:o}}return n})}})}addExerciseToRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>t.id===e?{...t,exercises:[...t.exercises,{weight:50,reps:10,sets:4,...a}]}:t)}})}reorderRoutine(e,a){const t=[...this.state.health.routines],n=a==="up"?e-1:e+1;n<0||n>=t.length||([t[e],t[n]]=[t[n],t[e]],this.setState({health:{...this.state.health,routines:t}}))}reorderExercise(e,a,t){const n=this.state.health.routines.map(o=>{if(o.id===e){const i=[...o.exercises],r=t==="up"?a-1:a+1;return r<0||r>=i.length?o:([i[a],i[r]]=[i[r],i[a]],{...o,exercises:i})}return o});this.setState({health:{...this.state.health,routines:n}})}deleteExerciseFromRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(t=>{if(t.id===e){const n=[...t.exercises];return n.splice(a,1),{...t,exercises:n}}return t})}})}addCalorieLog(e,a=""){const t={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:a};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,t]}})}logExercise(e,a,t){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:a,date:Date.now(),rating:parseInt(t)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,a){const n=(this.state.health.exerciseLogs||[]).filter(u=>u.routineId===e&&u.exerciseIndex===a);if(n.length===0)return{color:"green",lastDate:null};n.sort((u,h)=>h.date-u.date);const o=n[0],i=new Date,r=new Date(o.date),l=new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),m=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),c=Math.floor((l-m)/(1e3*60*60*24));return c===0?{color:"danger",status:"done_today",lastLog:o}:c===1?{color:"danger",status:"yesterday",lastLog:o}:c===2?{color:"tertiary",status:"day_before",lastLog:o}:{color:"success",status:"rested",lastLog:o}}addGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,a]})}toggleGoal(e){this.setState({goals:this.state.goals.map(a=>a.id===e?{...a,completed:!a.completed}:a)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(a=>a.id!==e)})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(a=>a.timeframe!==e||!a.completed)})}updateGoal(e,a){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,...a}:t)})}toggleSubGoal(e,a){const t=this.state.goals.find(o=>o.id===e);if(!t||!t.subGoals)return;const n=[...t.subGoals];n[a].completed=!n[a].completed,this.updateGoal(e,{subGoals:n})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,a){this.updateGoal(e,{color:a})}addEvent(e){const a={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,a]}),this.scheduleNotification(a)}deleteEvent(e){this.setState({events:this.state.events.filter(a=>a.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}addPerson(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({social:{...this.state.social,people:[...this.state.social.people,a]}}),a}updatePerson(e,a){this.setState({social:{...this.state.social,people:this.state.social.people.map(t=>t.id===e?{...t,...a}:t)}})}deletePerson(e){this.setState({social:{...this.state.social,people:this.state.social.people.filter(a=>a.id!==e)}})}movePerson(e,a){this.updatePerson(e,{columnId:a})}addSocialColumn(e){const a={id:crypto.randomUUID(),order:this.state.social.columns.length,...e};this.setState({social:{...this.state.social,columns:[...this.state.social.columns,a]}})}updateSocialColumn(e,a){this.setState({social:{...this.state.social,columns:this.state.social.columns.map(t=>t.id===e?{...t,...a}:t)}})}deleteSocialColumn(e){this.setState({social:{...this.state.social,columns:this.state.social.columns.filter(a=>a.id!==e),people:this.state.social.people.filter(a=>a.columnId!==e)}})}reorderSocialColumns(e){this.setState({social:{...this.state.social,columns:e}})}updateIdealLeadProfile(e){this.setState({social:{...this.state.social,idealLeadProfile:e}})}addCommunication(e){const a={id:crypto.randomUUID(),order:this.state.social.communications.length,rating:1,lastUsed:{},...e};this.setState({social:{...this.state.social,communications:[...this.state.social.communications,a]}})}updateCommunication(e,a){this.setState({social:{...this.state.social,communications:this.state.social.communications.map(t=>t.id===e?{...t,...a}:t)}})}deleteCommunication(e){this.setState({social:{...this.state.social,communications:this.state.social.communications.filter(a=>a.id!==e)}})}reorderCommunications(e){this.setState({social:{...this.state.social,communications:e}})}logCommunicationUsed(e,a){const t=Date.now(),n=this.state.social.communications.map(i=>i.id===e?{...i,lastUsed:{...i.lastUsed||{},[a]:t}}:i),o=this.state.social.people.map(i=>i.id===a?{...i,lastContact:new Date(t).toISOString().split("T")[0]}:i);this.setState({social:{...this.state.social,communications:n,people:o}})}updateContactSources(e){this.setState({social:{...this.state.social,contactSources:e}})}addWealthGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({wealthGoals:[...this.state.wealthGoals||[],a]}),a}updateWealthGoal(e,a){this.setState({wealthGoals:this.state.wealthGoals.map(t=>t.id===e?{...t,...a}:t)})}deleteWealthGoal(e){this.setState({wealthGoals:this.state.wealthGoals.filter(a=>a.id!==e)})}setInflationRate(e){this.setState({inflationRate:parseFloat(e)})}setProjectionYears(e){this.setState({projectionYears:parseInt(e)})}addTimeActivity(e){const a=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,activities:[...this.state.timeInvest.activities,{...e,id:a}]}})}updateTimeActivity(e,a){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.map(t=>t.id===e?{...t,...a}:t)}})}deleteTimeActivity(e){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.filter(a=>a.id!==e),logs:this.state.timeInvest.logs.filter(a=>a.activityId!==e)}})}addTimeLog(e){const a=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,logs:[...this.state.timeInvest.logs,{...e,id:a}]}})}setPomodoroTime(e){this.setState({timeInvest:{...this.state.timeInvest,pomodoroTime:parseInt(e)}})}}const d=new rt,lt=[{id:"health",icon:"heart",label:"Health"},{id:"finance",icon:"wallet",label:"Finance"},{id:"social",icon:"users",label:"Connections"},{id:"time-invest",icon:"clock",label:"Time Invest"},{id:"goals",icon:"target",label:"Goals"},{id:"menu",icon:"menu",label:"Menu"}];function Ae(s="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,a=lt.map(t=>`
        <div class="nav-item ${t.id===s?"active":""}" data-nav="${t.id}">
            ${p(t.icon,"nav-icon")}
            <span class="nav-label">${t.label}</span>
        </div>
    `).join("");return e+a}function Le(s){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",()=>{const t=a.dataset.nav;e.forEach(n=>n.classList.remove("active")),a.classList.add("active"),s&&s(t)})})}function b(s,e="$"){const a=Math.abs(s);let t=0,n=0;e==="₿"?(t=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(t=0,n=2);const o=new Intl.NumberFormat("en-US",{minimumFractionDigits:t,maximumFractionDigits:n}).format(a);return`${s<0?"-":""}${e}${o}`}function ne(s){return s==null?"0.0%":`${s>=0?"+":""}${s.toFixed(1)}%`}const ct="https://api.coingecko.com/api/v3",y={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},dt=5*60*1e3;let ue={data:null,timestamp:0,currency:"USD"};const V=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:y.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:y.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:y.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:y.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:y.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:y.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:y.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:y.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:y.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:y.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:y.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:y.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:y.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:y.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:y.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:y.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:y.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:y.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:y.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:y.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:y.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:y.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:y.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:y.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:y.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:y.CRYPTO_ALTS,icon:"bitcoin"}];async function Ge(){const s="usd";if(ue.data&&Date.now()-ue.timestamp<dt)return ue.data;const e=V.map(t=>t.cgId).filter(Boolean).join(","),a=`${ct}/coins/markets?vs_currency=${s}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const t=await fetch(a),n=t.ok?await t.json():[],o=V.filter(l=>l.yahooId),i=await ut(o),r=V.map(l=>{if(l.cgId){const m=n.find(c=>c.id===l.cgId);if(m)return{...l,price:m.current_price,image:m.image,change24h:m.price_change_percentage_24h_in_currency||m.price_change_percentage_24h||0,change7d:m.price_change_percentage_7d_in_currency||0,change30d:m.price_change_percentage_30d_in_currency||0,change1y:m.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&i[l.yahooId]){const m=i[l.yahooId];return{...l,price:m.price,change24h:m.change24h,change7d:m.change7d,change30d:m.change30d,change1y:m.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return ue={data:r,timestamp:Date.now(),currency:"USD"},r}catch(t){return console.error("Market fetch failed",t),V.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function ut(s){const e={};return await Promise.all(s.map(async a=>{try{const t=`https://query1.finance.yahoo.com/v8/finance/chart/${a.yahooId}?interval=1d&range=2y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(t)}`,i=await(await fetch(n)).json(),r=JSON.parse(i.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],m=l.meta,u=l.indicators.quote[0].close.filter(j=>j!==null&&j>0);if(u.length===0)throw new Error("No valid price data");const h=m.regularMarketPrice||u[u.length-1],g=u.length-1,w=u[Math.max(0,g-1)],f=(h-w)/w*100,x=u[Math.max(0,g-5)],k=(h-x)/x*100,L=u[Math.max(0,g-21)],E=(h-L)/L*100,_=u[Math.max(0,g-252)],D=(h-_)/_*100;e[a.yahooId]={price:h,change24h:isNaN(f)?0:f,change7d:isNaN(k)?0:k,change30d:isNaN(E)?0:E,change1y:isNaN(D)?0:D}}catch(t){console.warn(`Failed to fetch ${a.symbol} from Yahoo`,t),e[a.yahooId]=null}})),e}const pt={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let le=null,J=null;function qe(s,e){const a=pt[e];if(!a){console.error("Unknown category:",e);return}const o=d.getState()[a.storeKey].find(r=>r.id===s);if(!o){console.error("Item not found:",s);return}le=o,J=e;const i=document.createElement("div");i.className="modal-overlay",i.id="edit-modal",i.innerHTML=gt(o,a),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("active")}),ht(a)}const mt=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],vt={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function gt(s,e){const a=J==="investment"||J==="passive",t=vt[J]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
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
        <label class="form-label">${J==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
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
                  ${t.map(o=>`<option value="${o.value}" ${o.value===s.type?"selected":""}>${o.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${mt.map(o=>`<option value="${o.value}" ${o.value===s.currency?"selected":""}>${o.label}</option>`).join("")}
                  </optgroup>
                  ${a?`
                  <optgroup label="Mercados Reales">
                      ${V.map(o=>`<option value="${o.symbol}" ${o.symbol===s.currency?"selected":""}>${o.name} (${o.symbol})</option>`).join("")}
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
          ${p("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function ht(s){const e=document.getElementById("edit-modal"),a=document.getElementById("edit-modal-close"),t=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",o=>{o.target===e&&pe()}),a.addEventListener("click",pe),t.addEventListener("click",()=>yt(s)),n.addEventListener("click",()=>ft(s))}function yt(s){var m,c,u,h,g,w,f,x,k;const e=(c=(m=document.getElementById("edit-name"))==null?void 0:m.value)==null?void 0:c.trim(),a=(u=document.getElementById("edit-type"))==null?void 0:u.value,t=(h=document.getElementById("edit-currency"))==null?void 0:h.value,n=(w=(g=document.getElementById("edit-details"))==null?void 0:g.value)==null?void 0:w.trim(),o=parseFloat((f=document.getElementById("edit-value"))==null?void 0:f.value)||0,i=parseFloat((x=document.getElementById("edit-amount"))==null?void 0:x.value)||0,r=parseFloat((k=document.getElementById("edit-monthly"))==null?void 0:k.value)||0;if(!e){v.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:a,currency:t,details:n};s.fields.includes("value")&&(l.value=o),s.fields.includes("amount")&&(l.amount=i),s.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),s.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),d[s.updateMethod](le.id,l),pe()}function ft(s){v.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${le.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(d[s.deleteMethod](le.id),v.toast("Eliminado correctamente","info"),pe())})}function pe(){const s=document.getElementById("edit-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300)),le=null,J=null}let Z=!1,Q=!1,S={key:"price",direction:"desc"},ee="USD",U=null;function bt(){const s=d.getState(),e=s.lastMarketData||[],a=s.marketFavorites||[];U===null&&(U=a.length>0?"favorites":"all"),!Q&&!Z&&St();const t=ee==="EUR"?"€":"$";let n=e;U==="favorites"&&(n=e.filter(i=>a.includes(i.id)));const o=Object.values(y);return`
        <div class="market-view animate-fade-in" style="padding: 4px;">
            <!-- Single Line Header Controls -->
            <div class="market-controls-row">
                <div class="market-group">
                    <button class="filter-chip ${U==="all"?"active":""}" id="filter-all">
                        Todos
                    </button>
                    <button class="filter-chip ${U==="favorites"?"active":""}" id="filter-favs">
                        ${p("star","tiny-icon")} Favoritos
                    </button>
                </div>

                <div class="market-status-badge ${Z?"market-status-fresh":"market-status-cached"}" title="Tasa de refresco: 5 min">
                    ${Q?'<div class="loading-spinner-sm" style="width:10px; height:10px;"></div>':p(Z?"check":"save","tiny-icon")}
                    <span>${Q?"Updating":Z?"Live":"Cached"}</span>
                </div>

                <div class="capsule-toggle">
                    <button class="capsule-btn ${ee==="USD"?"active":""}" data-curr="USD">USD</button>
                    <button class="capsule-btn ${ee==="EUR"?"active":""}" data-curr="EUR">EUR</button>
                </div>
            </div>

            <!-- Content -->
            ${n.length===0&&U==="favorites"?xt():""}
            ${n.length===0&&U==="all"?Et():""}
            
            ${o.map(i=>{const r=n.filter(l=>l.category===i);return r.length===0?"":wt(i,r,t,a)}).join("")}
        </div>
    `}function wt(s,e,a,t){const n=[...e].sort((o,i)=>{let r=o[S.key],l=i[S.key];return typeof r=="string"&&(r=r.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),r<l?S.direction==="asc"?-1:1:r>l?S.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-top: var(--spacing-lg);">
            <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                    ${s}
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
                            ${n.map(o=>kt(o,a,t.includes(o.id))).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}function kt(s,e,a){let t=s.price;if(s.price!==null&&ee==="EUR"){const r=d.getState().rates.USD||.92;t=s.price*r}const n=be(s.change24h),o=be(s.change30d),i=be(s.change1y);return`
        <tr class="market-row" data-id="${s.id}">
            <td style="padding: 0 0 0 12px; width: 44px;">
                <button class="btn-favorite ${a?"active":""}" data-id="${s.id}">
                    ${p("star")}
                </button>
            </td>
            <td>
                <div class="asset-cell">
                     ${s.image?`<img src="${s.image}" alt="${s.symbol}" style="width: 22px; height: 22px; border-radius: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`:`<div class="asset-icon-tiny" style="background: rgba(255,255,255,0.05); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${p(s.icon||"trendingUp")}</div>`}
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <span class="asset-symbol" style="line-height: 1.2;">${s.symbol.toUpperCase()}</span>
                        <span class="asset-name-tiny">${s.name}</span>
                    </div>
                </div>
            </td>
            <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${t!==null?b(t,e):"-"}</td>
            <td class="text-right font-mono ${n}" style="font-weight: 700;">
                ${s.change24h!==null?ne(s.change24h):"-"}
            </td>
            <td class="text-right font-mono ${o}" style="font-size: 11px; opacity: 0.9;">
                ${s.change30d!==null?ne(s.change30d):"-"}
            </td>
            <td class="text-right font-mono ${i}" style="font-size: 11px; opacity: 0.9;">
                ${s.change1y!==null?ne(s.change1y):"-"}
            </td>
        </tr>
    `}function be(s){return s==null?"":Z?s>=0?"text-positive":"text-negative":"text-accent-primary"}function xt(){return`
        <div class="empty-state" style="padding: 60px 20px; text-align: center; background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); border: 1px dashed rgba(255,255,255,0.1); margin-top: 20px;">
            <div style="font-size: 32px; margin-bottom: 12px; filter: grayscale(1);">⭐</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">No hay favoritos todavía</h3>
            <p style="color: var(--text-muted); font-size: 14px; max-width: 250px; margin: 0 auto;">Marca con una estrella los activos que quieres seguir de cerca.</p>
            <button class="btn btn-secondary" id="btn-show-all" style="margin-top: 24px; font-size: 12px; padding: 10px 20px; border-radius: 30px;">Ver todos los activos</button>
        </div>
    `}function Et(){return`
        <div class="empty-state" style="padding: 100px 0;">
             <div class="loading-spinner"></div>
             <p style="margin-top: 20px; color: var(--text-muted); font-size: 14px; letter-spacing: 0.5px;">CONSULTANDO MERCADOS GLOBALES...</p>
        </div>
    `}async function St(){var s,e;if(!Q){Q=!0,(s=window.reRender)==null||s.call(window);try{const a=await Ge();d.saveMarketData(a),Z=!0}catch(a){console.error("Market update failed",a)}finally{Q=!1,(e=window.reRender)==null||e.call(window)}}}function $t(){var s,e,a;document.querySelectorAll(".capsule-btn").forEach(t=>{t.addEventListener("click",()=>{var o;const n=t.dataset.curr;n!==ee&&(ee=n,(o=window.reRender)==null||o.call(window))})}),(s=document.getElementById("filter-all"))==null||s.addEventListener("click",()=>{var t;U="all",(t=window.reRender)==null||t.call(window)}),(e=document.getElementById("filter-favs"))==null||e.addEventListener("click",()=>{var t;U="favorites",(t=window.reRender)==null||t.call(window)}),(a=document.getElementById("btn-show-all"))==null||a.addEventListener("click",()=>{var t;U="all",(t=window.reRender)==null||t.call(window)}),document.querySelectorAll(".btn-favorite").forEach(t=>{t.addEventListener("click",n=>{var i;n.stopPropagation();const o=t.dataset.id;d.toggleMarketFavorite(o),(i=window.reRender)==null||i.call(window)})}),document.querySelectorAll(".market-table th.sortable").forEach(t=>{t.addEventListener("click",()=>{var o;const n=t.dataset.sort;S.key===n?S.direction=S.direction==="asc"?"desc":"asc":(S.key=n,S.direction="desc",n==="name"&&(S.direction="asc")),(o=window.reRender)==null||o.call(window)})})}function It(){const s=d.getState(),{wealthGoals:e=[],inflationRate:a=3,projectionYears:t=10,currencySymbol:n}=s,o=d.getAllExpenses();let i=0;e.forEach(u=>{const h=u.cost*(u.dividendYield/100)/12;i+=d.convertValue(h,u.currency||s.currency)});const r=i-o,l=o*Math.pow(1+a/100,t);let m=0;e.forEach(u=>{const g=u.cost*Math.pow(1+u.annualGrowth/100,t)*(u.dividendYield/100)/12;m+=d.convertValue(g,u.currency||s.currency)});const c=m-l;return`
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
                        <span class="positive">${b(i,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Totales</span>
                        <span class="negative">${b(o,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto</span>
                        <span class="${r>=0?"positive":"negative"}">${b(r,n)}</span>
                    </div>
                </div>

                <div class="projection-divider-vertical"></div>

                <div class="projection-col">
                    <div class="projection-label">En ${t} años (${a}% inf.)</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos Est.</span>
                        <span class="positive">${b(m,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Est.</span>
                        <span class="negative">${b(l,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto Proyectado</span>
                        <span class="${c>=0?"positive":"negative"}">${b(c,n)}</span>
                    </div>
                </div>
            </div>
            
            <div class="projection-settings-row">
                <div class="setting-item">
                    <label>Años proyectados: ${t}</label>
                    <input type="range" id="years-slider" min="1" max="50" step="1" value="${t}">
                </div>
                <div class="setting-item">
                    <label>Inflación anual: ${a}%</label>
                    <input type="range" id="inflation-slider" min="0" max="20" step="0.5" value="${a}">
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
            `:e.map(u=>Ct(u,s)).join("")}
        </div>
    </div>
    `}function Ct(s,e){const a=e.currencySymbol,t=s.cost*(s.dividendYield/100)/12,n=d.convertValue(t,s.currency||e.currency);return`
    <div class="card wealth-goal-card" data-id="${s.id}">
        <div class="goal-card-main">
            <div class="goal-card-info">
                <div class="goal-name">${s.name}</div>
                <div class="goal-cost">${b(s.cost,s.currency||e.currency)} cost</div>
            </div>
            <div class="goal-card-yield">
                <div class="yield-value">+${b(n,a)}/mes</div>
                <div class="yield-pct">${s.dividendYield}% div.</div>
            </div>
        </div>
        <div class="goal-card-details">
            <div class="detail-item">
                <span class="detail-label">Crecimiento Anual:</span>
                <span class="detail-value">${s.annualGrowth}%</span>
            </div>
            <div class="goal-actions">
                <button class="icon-btn edit-wealth-goal" data-id="${s.id}">${p("edit")}</button>
                <button class="icon-btn delete-wealth-goal" data-id="${s.id}">${p("trash")}</button>
            </div>
        </div>
    </div>
    `}function At(){var a;(a=document.getElementById("btn-add-wealth-goal"))==null||a.addEventListener("click",async()=>{Te()}),document.querySelectorAll(".edit-wealth-goal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=d.getState().wealthGoals.find(r=>r.id===o);i&&Te(i)})}),document.querySelectorAll(".delete-wealth-goal").forEach(t=>{t.addEventListener("click",async n=>{var r;n.stopPropagation();const o=t.dataset.id;await v.confirm("Eliminar objetivo","¿Estás seguro de que deseas eliminar este objetivo?")&&(d.deleteWealthGoal(o),(r=window.reRender)==null||r.call(window))})});const s=document.getElementById("inflation-slider");s&&s.addEventListener("change",t=>{var n;d.setInflationRate(t.target.value),(n=window.reRender)==null||n.call(window)});const e=document.getElementById("years-slider");e&&e.addEventListener("change",t=>{var n;d.setProjectionYears(t.target.value),(n=window.reRender)==null||n.call(window)})}async function Te(s=null){const e=!!s,a=e?"Editar Objetivo":"Nuevo Objetivo Patrimonial",t=document.createElement("div");t.className="modal-overlay active overlay-centered",t.innerHTML=`
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${a}</h3>
                <button class="close-modal-btn">${p("x")}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre del Objetivo</label>
                    <input type="text" id="goal-name" class="form-input" placeholder="Ej: Inmueble en Carlos Paz" value="${(s==null?void 0:s.name)||""}">
                </div>
                <div class="form-group">
                    <label class="form-label">Coste / Valor actual</label>
                    <div class="input-with-currency">
                        <input type="number" id="goal-cost" class="form-input" placeholder="100000" value="${(s==null?void 0:s.cost)||""}">
                        <select id="goal-currency" class="currency-mini-select">
                            ${["EUR","USD","ARS","GBP","CHF"].map(r=>`<option value="${r}" ${(s==null?void 0:s.currency)===r?"selected":""}>${r}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Crecimiento % (Anual)</label>
                        <input type="number" id="goal-growth" class="form-input" placeholder="5" value="${(s==null?void 0:s.annualGrowth)||""}" step="0.1">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Dividendos % (Anual)</label>
                        <input type="number" id="goal-dividend" class="form-input" placeholder="4" value="${(s==null?void 0:s.dividendYield)||""}" step="0.1">
                    </div>
                </div>
                <button class="btn btn-primary" id="save-goal-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${e?"Guardar Cambios":"Crear Objetivo"}
                </button>
            </div>
        </div>
    `,document.body.appendChild(t);const n=t.querySelector(".close-modal-btn"),o=t.querySelector("#save-goal-btn"),i=()=>{t.classList.remove("active"),setTimeout(()=>t.remove(),300)};n.addEventListener("click",i),t.addEventListener("click",r=>{r.target===t&&i()}),o.addEventListener("click",()=>{var g;const r=t.querySelector("#goal-name").value,l=parseFloat(t.querySelector("#goal-cost").value),m=parseFloat(t.querySelector("#goal-growth").value)||0,c=parseFloat(t.querySelector("#goal-dividend").value)||0,u=t.querySelector("#goal-currency").value;if(!r||isNaN(l)){v.toast("Completa nombre y coste","error");return}const h={name:r,cost:l,annualGrowth:m,dividendYield:c,currency:u};e?(d.updateWealthGoal(s.id,h),v.toast("Objetivo actualizado")):(d.addWealthGoal(h),v.toast("Objetivo creado")),i(),(g=window.reRender)==null||g.call(window)})}let B="summary";function Me(){const s=d.getState(),e=s.currencySymbol;return setTimeout(B==="markets"||B==="goals"?N:O,0),`
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="margin-bottom: var(--spacing-md);">
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <!-- Finance Tabs (Segmented Control) -->
      <div class="segmented-control">
        <button class="segment-btn ${B==="summary"?"active":""}" id="tab-summary">
            Summary
        </button>
        <button class="segment-btn ${B==="goals"?"active":""}" id="tab-goals">
            Goals
        </button>
        <button class="segment-btn ${B==="markets"?"active":""}" id="tab-markets">
            Markets
        </button>
      </div>
      
      ${B==="summary"?Lt(s,e):B==="goals"?It():bt()}
      
    </div>
  `}function Lt(s,e){const a=d.getPassiveIncome(),t=d.getLivingExpenses(),n=d.getNetPassiveIncome(),o=d.getInvestmentAssetsValue(),i=d.getTotalLiabilities(),r=d.getNetWorth(),l=d.getAllIncomes(),m=d.getAllExpenses(),c=d.getNetIncome();return`
      <div class="finance-top-grid animate-fade-in">
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
        <div class="card highlight-card ${n<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${p("piggyBank","card-icon")}
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
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${p("scale","card-icon")}
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
      
      ${Tt(s)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${Mt(s)}

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
                        <option value="EUR" ${s.currency==="EUR"?"selected":""}>EUR (€)</option>
                        <option value="USD" ${s.currency==="USD"?"selected":""}>USD ($)</option>
                        <option value="CHF" ${s.currency==="CHF"?"selected":""}>CHF (Fr)</option>
                        <option value="GBP" ${s.currency==="GBP"?"selected":""}>GBP (£)</option>
                        <option value="AUD" ${s.currency==="AUD"?"selected":""}>AUD (A$)</option>
                        <option value="ARS" ${s.currency==="ARS"?"selected":""}>ARS ($)</option>
                        <option value="BTC" ${s.currency==="BTC"?"selected":""}>BTC (₿)</option>
                    </select>
                    <div class="premium-select-icon">
                        ${p("chevronDown","tiny-icon")}
                    </div>
                </div>
            </div>
        </div>
      </div>
  `}function Tt(s){const e=[...s.passiveAssets,...s.investmentAssets],a=s.liabilities;if(e.length===0)return"";const t={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(c=>{const u=d.convertValue(c.value||0,c.currency||"EUR");c.currency==="BTC"?t.Bitcoin.value+=u:c.currency==="ETH"||c.currency==="XRP"||c.type==="crypto"?t.Altcoins.value+=u:c.type==="property"||c.type==="rental"?t.Inmuebles.value+=u:c.type==="stocks"||c.type==="etf"||c.currency==="SP500"?t.Bolsa.value+=u:c.currency==="GOLD"?t.Oro.value+=u:t["Otros/Efe."].value+=u});const n=a.filter(c=>c.type==="mortgage").reduce((c,u)=>c+d.convertValue(u.amount||0,u.currency||"EUR"),0);t.Inmuebles.value=Math.max(0,t.Inmuebles.value-n),s.hideRealEstate&&(t.Inmuebles.value=0);const o=Object.entries(t).filter(([c,u])=>u.value>0).sort((c,u)=>u[1].value-c[1].value),i=o.reduce((c,[u,h])=>c+h.value,0);if(i===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${s.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=o.map(([c,u])=>{const h=u.value/i*100,g=r;return r+=h,{name:c,percentage:h,color:u.color,start:g}}),m=l.map(c=>`${c.color} ${c.start}% ${c.start+c.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${s.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${m});">
          <div class="pie-center">
            <div class="pie-total">${b(i,s.currencySymbol)}</div>
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
  `}function Mt(s){const e=[...(s.activeIncomes||[]).map(t=>({...t,category:"activeIncome"})),...s.passiveAssets.map(t=>({...t,category:"passive"})),...s.investmentAssets.map(t=>({...t,category:"investment"})),...s.liabilities.map(t=>({...t,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${p("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const a=s.currencySymbol;return`
    <div class="asset-list">
      ${e.map(t=>{const n=Dt(t.currency||t.type),o=Bt(t.currency||t.type),i=t.category==="liability",r=t.value||t.amount||0,l=d.convertValue(r,t.currency||"EUR");let m="";if(t.currency!==s.currency){const u={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[t.currency]||t.currency;m=`<div class="asset-original-value">${r} ${u}</div>`}return`
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
                ${t.category==="activeIncome"?"+":i?"-":""}${b(l,a)}
                ${t.category==="activeIncome"?'<span style="font-size: 10px; opacity: 0.7; font-weight: 400;">/mes</span>':""}
              </div>
              ${t.monthlyIncome?`<div class="asset-yield">+${b(d.convertValue(t.monthlyIncome,t.currency),a)}/mes</div>`:""}
              ${t.monthlyPayment?`<div class="asset-yield text-negative">-${b(d.convertValue(t.monthlyPayment,t.currency),a)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function Dt(s){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt",salary:"cash",freelance:"cash",business:"property"}[s]||"cash"}function Bt(s){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard",salary:"briefcase",freelance:"users",business:"building"}[s]||"dollarSign"}function De(){const s=document.getElementById("tab-summary"),e=document.getElementById("tab-markets"),a=document.getElementById("tab-goals");if(s&&e&&a&&(s.addEventListener("click",()=>{var i;B="summary",(i=window.reRender)==null||i.call(window)}),e.addEventListener("click",()=>{var i;B="markets",(i=window.reRender)==null||i.call(window)}),a.addEventListener("click",()=>{var i;B="goals",(i=window.reRender)==null||i.call(window)})),B==="markets"){$t();return}if(B==="goals"){At();return}document.querySelectorAll(".asset-item").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id,l=i.dataset.category;qe(r,l)})});const n=document.getElementById("toggle-real-estate");n&&n.addEventListener("change",()=>{d.toggleRealEstate()});const o=document.getElementById("display-currency-select");o&&o.addEventListener("change",i=>{d.setCurrency(i.target.value)})}let H=10,z=7,Y=null,W=null;function Rt(){const e=d.getState().currencySymbol,a=d.getNetWorth(),n=d.getNetIncome()*12,o=Y!==null?Y:a,i=W!==null?W:n,r=He(o,i,z,H);return`
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
          <div class="compound-input-hint">Patrimonio actual: ${b(a,e)}</div>
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
          <div class="compound-input-hint">Ingreso neto anual: ${b(n,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${z}" step="0.5">
            <span class="slider-value" id="rate-value">${z}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${H}">
            <span class="slider-value" id="years-value">${H} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${H} años</span>
          ${p("trendingUp","card-icon")}
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
          ${p("coins","card-icon")}
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
        ${Ve(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${ze(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function He(s,e,a,t){const n=a/100,o=[];let i=s,r=0,l=0;for(let m=1;m<=t;m++){const c=i,u=i*n;i+=u+e,r+=e,l+=u,o.push({year:m,startBalance:c,contribution:e,interest:u,endBalance:i,totalContributions:r,totalInterest:l})}return{finalValue:i,totalContributions:r,totalInterest:l,totalGrowth:i-s,growthMultiple:s>0?i/s:0,yearlyBreakdown:o}}function Ve(s,e){if(s.length===0)return"";const a=Math.max(...s.map(n=>Math.abs(n.endBalance))),t=s.map((n,o)=>{const i=o/(s.length-1)*100,r=100-n.endBalance/a*100;return`${i},${r}`});return`
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
  `}function ze(s,e){const a=[];for(let t=0;t<s.length;t++){const n=s[t];(t<5||(t+1)%5===0||t===s.length-1)&&a.push(n)}return`
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
  `}function Pt(s){const e=document.getElementById("back-to-finance"),a=document.getElementById("rate-slider"),t=document.getElementById("years-slider"),n=document.getElementById("principal-input"),o=document.getElementById("contribution-input"),i=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",s),n&&n.addEventListener("input",l=>{Y=parseFloat(l.target.value)||0,X()}),o&&o.addEventListener("input",l=>{W=parseFloat(l.target.value)||0,X()}),i&&i.addEventListener("click",()=>{Y=null;const l=d.getNetWorth();n.value=l,X()}),r&&r.addEventListener("click",()=>{W=null;const l=d.getNetIncome()*12;o.value=l,X()}),a&&a.addEventListener("input",l=>{z=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${z}%`,X()}),t&&t.addEventListener("input",l=>{H=parseInt(l.target.value),document.getElementById("years-value").textContent=`${H} años`,X()})}function X(){const e=d.getState().currencySymbol,a=Y!==null?Y:d.getNetWorth(),t=W!==null?W:d.getNetIncome()*12,n=He(a,t,z,H),o=document.getElementById("future-value"),i=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),m=document.getElementById("total-contributed"),c=document.getElementById("total-interest"),u=document.getElementById("final-value-breakdown"),h=document.getElementById("projection-chart"),g=document.getElementById("projection-table");o&&(o.textContent=b(n.finalValue,e)),i&&(i.textContent=`Valor Futuro en ${H} años`),r&&(r.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=b(a,e)),m&&(m.textContent=b(n.totalContributions,e),m.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),c&&(c.textContent=b(n.totalInterest,e)),u&&(u.textContent=b(n.finalValue,e)),h&&(h.innerHTML=Ve(n.yearlyBreakdown)),g&&(g.innerHTML=ze(n.yearlyBreakdown,e))}function _t(){H=10,z=7,Y=null,W=null}let oe=d.getState().lastMarketData||[],ie=!1,$={key:"price",direction:"desc"},Ke="";function jt(){const s=d.getState(),e=s.currency||"EUR",a=s.currencySymbol||"€";if((oe.length===0||Ke!==e)&&(ie||Ye(),oe.length===0))return`
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
                            ${p("chevronLeft")}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${ie?`
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

            ${t.map(n=>{const o=oe.filter(i=>i.category===n);return o.length===0?"":Ut(n,o,a)}).join("")}
        </div>
    `}function Ut(s,e,a){const t=[...e].sort((n,o)=>{let i=n[$.key],r=o[$.key];return typeof i=="string"&&(i=i.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),i<r?$.direction==="asc"?-1:1:i>r?$.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${s}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${$.key==="name"?"active "+$.direction:""}" style="padding-left: var(--spacing-md);">Activo</th>
                                <th data-sort="price" class="${$.key==="price"?"active "+$.direction:""}">Precio</th>
                                <th data-sort="change24h" class="${$.key==="change24h"?"active "+$.direction:""}">24h</th>
                                <th data-sort="change30d" class="${$.key==="change30d"?"active "+$.direction:""}" style="padding-right: var(--spacing-md);">30d</th>
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
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?b(n.price,a):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?ne(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?ne(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function Ye(){const e=d.getState().currency||"EUR";ie||(ie=!0,Ke=e,oe=await Ge(),d.saveMarketData(oe),ie=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function Ot(s){const e=document.getElementById("market-back");e&&e.addEventListener("click",s),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.sort;$.key===o?$.direction=$.direction==="asc"?"desc":"asc":($.key=o,$.direction="desc",o==="name"&&($.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.curr;d.setCurrency(o),Ye()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class Be{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const a=this.getApiKey();if(!a)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],o=e.type,i=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:i},{inline_data:{mime_type:o,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const u=await l.json();throw new Error(((r=u.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const c=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(c)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((a,t)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>a(n.result),n.onerror=o=>t(o)})}}let te=localStorage.getItem("life-dashboard/health_current_tab")||"exercise";function Nt(){const s=d.getState(),{health:e}=s;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Health & Fitness</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${te==="exercise"?"active":""}" data-tab="exercise">
            ${p("zap")} Ejercicio
        </button>
        <button class="health-tab-btn ${te==="diet"?"active":""}" data-tab="diet">
            ${p("apple")} Dieta
        </button>
      </div>

      <div id="health-tab-content">
        ${te==="exercise"?Ft(e):Gt(e)}
      </div>

    </div>
    `}function Ft(s){return`
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
                        ${p("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="up">${p("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="down">${p("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${p("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${a}" data-name="${e.name}">
                    ${p("moreVertical")}
                </button>
            </header>

            <div class="exercise-list-health">
                ${e.exercises.map((t,n)=>{const o=d.getExerciseStatus(e.id,n),i=`var(--accent-${o.color})`,r=o.status==="done_today";return`
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
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${qt(o.lastLog.rating)}</span>
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
    `}function Gt(s){return`
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
          <div class="summary-value" style="font-size: 28px;">${Ht(s)} kcal</div>
          <div class="summary-label">Calorías Registradas Hoy</div>
          <button class="btn btn-primary" id="ai-scan-photo" style="margin-top: var(--spacing-md); width: auto; padding: 10px 20px;">
             ${p("camera")} Escanear Comida (AI)
          </button>
      </div>
    `}function qt(s){return s<=2?"😰":s<=4?"😐":"😄"}function Ht(s){const e=new Date().toDateString();return(s.calorieLogs||[]).filter(a=>new Date(a.date).toDateString()===e).reduce((a,t)=>a+(t.calories||0),0)}function Vt(){document.querySelectorAll(".health-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.tab;e!==te&&(te=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),te==="exercise"?zt():Kt()}function zt(){var s;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=await v.prompt("Nuevo Ejercicio","Nombre del ejercicio:");t&&(d.addExerciseToRoutine(a,{name:t}),v.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,t=e.dataset.current,n=await v.prompt("Editar Rutina","Nombre de la rutina:",t);n&&n!==t&&(d.renameRoutine(a,n),v.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id;await v.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(d.deleteRoutine(a),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.id,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await v.select(`Menú: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await v.prompt("Editar Rutina","Nuevo nombre:",o);l&&l!==o&&(d.renameRoutine(t,l),v.toast("Rutina renombrada"))}else r==="up"?d.reorderRoutine(n,"up"):r==="down"?d.reorderRoutine(n,"down"):r==="delete"&&await v.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(d.deleteRoutine(t),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index),n=e.dataset.current,o=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",n);o&&o!==n&&(d.updateExercise(a,t,{name:o}),v.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,t=parseInt(e.dataset.index);await v.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(d.deleteExerciseFromRoutine(a,t),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.name,i=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await v.select(`Ejercicio: ${o}`,"Elige una acción:",i,1);if(r==="rename"){const l=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",o);l&&l!==o&&(d.updateExercise(t,n,{name:l}),v.toast("Ejercicio renombrado"))}else r==="up"?d.reorderExercise(t,n,"up"):r==="down"?d.reorderExercise(t,n,"down"):r==="delete"&&await v.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(d.deleteExerciseFromRoutine(t,n),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=parseInt(e.dataset.index),n=e.dataset.dir;d.reorderRoutine(t,n)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=e.dataset.dir;d.reorderExercise(t,n,o)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=10;r<=150;r+=2.5)o.push(`${r}kg`);const i=await v.select("Seleccionar Peso","Elige el peso para este ejercicio:",o,4);if(i){const r=parseFloat(i.replace("kg",""));d.updateExercise(t,n,{weight:r}),v.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.routine,n=parseInt(e.dataset.index),o=[];for(let r=7;r<=20;r++)o.push(`${r} reps`);const i=await v.select("Seleccionar Reps","Elige las repeticiones objetivo:",o,4);if(i){const r=parseInt(i.replace(" reps",""));d.updateExercise(t,n,{reps:r}),v.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const t=e.dataset.rid,n=parseInt(e.dataset.idx),o=await v.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");o&&(d.logExercise(t,n,o),v.toast("Ejercicio registrado","success"))})}),(s=document.getElementById("add-routine-btn"))==null||s.addEventListener("click",async()=>{const e=await v.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(d.saveRoutine({name:e,exercises:[]}),v.toast("Rutina creada"))})}function Kt(){var s,e,a,t,n;(s=document.getElementById("log-weight-btn"))==null||s.addEventListener("click",async()=>{const o=await v.prompt("Registrar Peso","Peso actual (kg):");o&&(d.addWeightLog(parseFloat(o)),v.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const o=await v.prompt("Registrar Grasa","Porcentaje de grasa (%):");o&&(d.addFatLog(parseFloat(o)),v.toast("Grasa registrada"))}),(a=document.getElementById("set-weight-goal-btn"))==null||a.addEventListener("click",async()=>{const o=d.getState().health.weightGoal,i=await v.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",o);i&&(d.updateHealthGoal("weightGoal",parseFloat(i)),v.toast("Objetivo actualizado"))}),(t=document.getElementById("set-fat-goal-btn"))==null||t.addEventListener("click",async()=>{const o=d.getState().health.fatGoal,i=await v.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",o);i&&(d.updateHealthGoal("fatGoal",parseFloat(i)),v.toast("Objetivo actualizado"))}),(n=document.getElementById("ai-scan-photo"))==null||n.addEventListener("click",()=>{const o=document.createElement("input");o.type="file",o.accept="image/*",o.onchange=async r=>{var m;const l=r.target.files[0];if(l){if(!Be.hasKey()){if(await v.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(m=document.querySelector('[data-nav="settings"]'))==null||m.click();return}v.toast("Usando simulación...","info"),i();return}try{v.toast("Analizando con Gemini...","info");const c=await Be.analyzeFood(l);await v.confirm("IA Detectada",`Identificado: "${c.name}" (${c.calories} kcal). ¿Registrar?`)&&(d.addCalorieLog(c.calories,`${c.name} (AI)`),v.toast("Calorías registradas"))}catch(c){v.alert("Error IA",c.message)}}};function i(){setTimeout(async()=>{const r={name:"Bowl Saludable",calories:450};await v.confirm("IA Simulada",`Detectado "${r.name}" con ${r.calories} kcal. ¿Registrar?`)&&(d.addCalorieLog(r.calories,r.name),v.toast("Registrado"))},1e3)}o.click()})}const we=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];function Yt(){const s=d.getState(),{goals:e}=s;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Goals & Focus</h1>
        <p class="page-subtitle">Organiza tus prioridades con colores y objetivos dinámicos</p>
      </header>

      <div class="goals-grid-layout">
        ${[{id:"day",label:"Today",icon:"zap",color:"#FFD700"},{id:"week",label:"This Week",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Year 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Long Term",icon:"trendingUp",color:"#EF4444"}].map(t=>{const n=e.filter(l=>l.timeframe===t.id),o=n.filter(l=>l.completed).length,i=n.length,r=i>0?o/i*100:0;return`
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
                    ${Wt(n,t.id)}
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
  `}function Wt(s,e){return s.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${p("package")}</div>
            </div>
        `:[...s].sort((t,n)=>t.completed!==n.completed?t.completed?1:-1:t.order!==void 0&&n.order!==void 0?t.order-n.order:(n.createdAt||0)-(t.createdAt||0)).map(t=>{const n=t.subGoals&&t.subGoals.length>0,o=n?t.subGoals.filter(r=>r.completed).length/t.subGoals.length*100:0,i=t.color||"#ffffff";return`
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
                        ${we.map(r=>`
                            <div class="goal-color-dot ${r===i?"active":""} set-goal-color" 
                                 data-id="${t.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function Xt(){document.querySelectorAll(".btn-clear-completed").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=t.dataset.tf;await v.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(d.deleteCompletedGoals(o),v.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id;d.toggleGoal(o)})}),document.querySelectorAll(".open-color-picker").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=document.getElementById(`colors-${o}`);document.querySelectorAll(".color-selector-overlay").forEach(r=>{r.id!==`colors-${o}`&&r.classList.add("hidden")}),i==null||i.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=t.dataset.color;d.updateGoalColor(o,i),v.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=t.dataset.id,i=parseInt(t.dataset.idx);d.toggleSubGoal(o,i)})}),document.querySelectorAll(".delete-goal").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation(),await v.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(d.deleteGoal(t.dataset.id),v.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(t=>{t.addEventListener("click",async n=>{n.stopPropagation();const o=t.dataset.id,i=await v.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(i){const l=[...d.getState().goals.find(m=>m.id===o).subGoals||[],{title:i,completed:!1}];d.updateGoal(o,{subGoals:l}),v.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(t=>{t.addEventListener("click",async()=>{const n=t.dataset.id,o=t.textContent,i=await v.prompt("Editar Meta","Actualiza el texto:",o);i&&i!==o&&d.updateGoal(n,{title:i})})}),document.querySelectorAll(".quick-add-input-premium").forEach(t=>{t.addEventListener("keypress",n=>{if(n.key==="Enter"&&t.value.trim()){const o=t.dataset.timeframe;d.addGoal({title:t.value.trim(),timeframe:o,color:we[0]}),t.value="",v.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.timeframe,o=t.previousElementSibling;o&&o.value.trim()?(d.addGoal({title:o.value.trim(),timeframe:n,color:we[0]}),o.value="",v.toast("Creada")):o&&o.focus()})});const s=document.querySelectorAll(".goals-list-premium");let e=null;document.querySelectorAll(".goal-card-premium").forEach(t=>{t.addEventListener("dragstart",n=>{e=t.dataset.id,t.classList.add("dragging"),n.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(n=>n.classList.remove("drag-over"))})}),s.forEach(t=>{t.addEventListener("dragover",n=>{n.preventDefault(),t.classList.add("drag-over"),n.dataTransfer.dropEffect="move"}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",n=>{n.preventDefault(),t.classList.remove("drag-over");const o=t.dataset.timeframe,i=[...d.getState().goals],r=i.findIndex(u=>u.id===e);if(r===-1)return;const l={...i[r]};l.timeframe!==o&&(l.timeframe=o),i.splice(r,1);const m=a(t,n.clientY);if(m==null)i.push(l);else{const u=m.dataset.id,h=i.findIndex(g=>g.id===u);i.splice(h,0,l)}const c=i.map((u,h)=>({...u,order:h}));d.reorderGoals(c),v.toast("Orden actualizado")})});function a(t,n){return[...t.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((i,r)=>{const l=r.getBoundingClientRect(),m=n-l.top-l.height/2;return m<0&&m>i.offset?{offset:m,element:r}:i},{offset:Number.NEGATIVE_INFINITY}).element}}let F=new Date;function Jt(){const s=d.getState(),{events:e}=s;return`
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
                <span class="current-month">${Qt()}</span>
                <button class="icon-btn-navigation next-month">${p("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${Zt(e)}
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
                `:e.filter(a=>{const t=new Date(a.date);return t.getMonth()===F.getMonth()&&t.getFullYear()===F.getFullYear()}).sort((a,t)=>new Date(a.date)-new Date(t.date)).map(a=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${a.category||"event"}">
                            ${p(ta(a.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${a.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${ea(a.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${a.time}</span>
                                ${a.repeat!=="none"?`<span class="event-repeat-tag">${aa(a.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${a.id}">
                            ${p("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function Zt(s){const e=F.getMonth(),a=F.getFullYear(),t=new Date().getDate(),n=new Date().getMonth()===e&&new Date().getFullYear()===a,o=new Date(a,e+1,0).getDate(),i=new Date(a,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;s.forEach(c=>{const u=new Date(c.date);u.getMonth()===e&&u.getFullYear()===a&&l.add(u.getDate())});let m=r.map(c=>`<div class="calendar-day-label">${c}</div>`).join("");for(let c=0;c<i;c++)m+='<div class="calendar-day empty"></div>';for(let c=1;c<=o;c++){const u=n&&c===t,h=l.has(c);m+=`
            <div class="calendar-day ${u?"today":""} ${h?"has-event":""}">
                ${c}
                ${h?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return m}function Qt(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][F.getMonth()]} ${F.getFullYear()}`}function ea(s){const e={day:"numeric",month:"short"};return new Date(s).toLocaleDateString("es-ES",e).toUpperCase()}function ta(s){switch(s){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function aa(s){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[s]||""}function sa(){var s,e,a;(s=document.querySelector(".prev-month"))==null||s.addEventListener("click",()=>{F.setMonth(F.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{F.setMonth(F.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(t=>{t.addEventListener("click",async()=>{await v.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(d.deleteEvent(t.dataset.id),v.toast("Evento eliminado"))})}),(a=document.getElementById("add-event-manual-btn"))==null||a.addEventListener("click",async()=>{const t=await v.prompt("Nuevo Evento","Título del evento:");if(!t)return;const n=await v.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!n)return;const o=await v.prompt("Hora","Formato HH:MM:","10:00");if(!o)return;const i=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await v.select("Categoría","Tipo de evento:",i,0);d.addEvent({title:t,date:n,time:o,category:r||"event",repeat:"none"}),v.toast("Evento agendado","success")})}function na(){const s=d.getState(),e=s.currencySymbol,a=s.livingExpenses,t=s.otherExpenses||[],n=s.liabilities,o=d.sumItems(a,"amount"),i=d.sumItems(t,"amount"),r=d.sumItems(n,"monthlyPayment"),l=o+i+r,m=[...(a||[]).map(c=>({...c,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(t||[]).map(c=>({...c,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(c=>c.monthlyPayment>0).map(c=>({...c,amount:c.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((c,u)=>u.amount-c.amount);return`
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
            ${b(l,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${b(o,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${b(r,e)}</div>
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
      
      ${oa(m,s)}

    </div>
  `}function oa(s,e){if(s.length===0)return`
            <div class="empty-state">
                ${p("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const a=e.currencySymbol;return`
        <div class="asset-list">
            ${s.map(t=>{const n=d.convertValue(t.amount,t.currency||"EUR"),o=ia(t.category);return`
                <div class="asset-item expense-item" data-id="${t.id}" data-category="${t.category}">
                    <div class="asset-icon-wrapper expense">
                        ${p(o,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${t.name}</div>
                        <div class="asset-details">${t.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${b(n,a)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function ia(s){switch(s){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function ra(s){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",s),document.querySelectorAll(".expense-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=t.dataset.category;qe(n,o)})})}const la="modulepreload",ca=function(s){return"/life-dashboard/"+s},Re={},me=function(e,a,t){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),r=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(a.map(l=>{if(l=ca(l),l in Re)return;Re[l]=!0;const m=l.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":la,m||(u.as="script"),u.crossOrigin="",u.href=l,r&&u.setAttribute("nonce",r),document.head.appendChild(u),m)return new Promise((h,g)=>{u.addEventListener("load",h),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return n.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function da(){const s=I.isBioEnabled(),e=q.hasToken();return`
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
            <p>Life Dashboard Pro v1.0.86</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function ua(){var t,n,o,i,r,l,m,c,u,h;(t=document.getElementById("toggle-bio"))==null||t.addEventListener("change",async g=>{if(g.target.checked){const f=await v.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(f)try{await I.registerBiometrics(f),v.toast("Biometría activada correctamente")}catch(x){await v.alert("Error",x.message),g.target.checked=!1}else g.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),v.toast("Biometría desactivada","info")});const s=document.getElementById("btn-install-pwa");s&&setTimeout(()=>{if(window.deferredPrompt){const g=document.getElementById("install-pwa-card");g&&(g.style.display="block"),s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:w}=await window.deferredPrompt.userChoice;if(w==="accepted"){v.toast("Instalando aplicación...");const f=document.getElementById("install-pwa-card");f&&(f.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("connect-drive-btn"))==null||n.addEventListener("click",async()=>{try{await q.authenticate(),v.toast("Google Drive conectado"),typeof window.reRender=="function"&&window.reRender()}catch(g){v.alert("Error",g.message||"Error al conectar")}}),(o=document.getElementById("upload-drive-btn"))==null||o.addEventListener("click",async()=>{const g=document.getElementById("upload-drive-btn"),w=g.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;g.innerHTML='<div class="loading-spinner-sm"></div>',g.style.pointerEvents="none";const x=I.getVaultKey();await q.pushData(d.getState(),x),v.toast("Bóveda subida correctamente")}catch(f){console.error(f),v.alert("Error al subir",f.message)}finally{g.innerHTML=w,g.style.pointerEvents="auto"}}),(i=document.getElementById("download-drive-btn"))==null||i.addEventListener("click",async()=>{const g=document.getElementById("download-drive-btn"),w=g.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;g.innerHTML='<div class="loading-spinner-sm"></div>',g.style.pointerEvents="none";const x=I.getVaultKey(),k=await q.pullData(x);k?(d.resetState(k),await d.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(f){console.error("[Settings] Download failed:",f),v.alert("Error de Descarga",f.message||"Error desconocido al bajar datos")}finally{g.innerHTML=w,g.style.pointerEvents="auto"}}),(r=document.getElementById("export-data-btn"))==null||r.addEventListener("click",async()=>{try{v.toast("Preparando archivo encriptado...","info");const g=d.getState(),w=I.getVaultKey(),{SecurityService:f}=await me(async()=>{const{SecurityService:D}=await Promise.resolve().then(()=>Se);return{SecurityService:D}},void 0),x=await f.encrypt(g,w),k=new Blob([JSON.stringify(x)],{type:"application/octet-stream"}),L=URL.createObjectURL(k),E=document.createElement("a"),_=new Date().toISOString().split("T")[0];E.href=L,E.download=`life_dashboard_backup_${_}.bin`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL(L),v.toast("Backup exportado correctamente")}catch(g){console.error("Export error:",g),v.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),a=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{a==null||a.click()}),a==null||a.addEventListener("change",async g=>{var x;const w=(x=g.target.files)==null?void 0:x[0];if(!w)return;if(!await v.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){a.value="";return}try{const k=await w.text(),L=JSON.parse(k),E=I.getVaultKey(),{SecurityService:_}=await me(async()=>{const{SecurityService:j}=await Promise.resolve().then(()=>Se);return{SecurityService:j}},void 0),D=await _.decrypt(L,E);if(D)d.setState(D),await d.saveState(),v.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(k){console.error("Import error:",k),v.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{a.value=""}}),(l=document.getElementById("btn-logout"))==null||l.addEventListener("click",async()=>{await v.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(I.logout(),window.location.reload())}),(m=document.getElementById("btn-save-gemini"))==null||m.addEventListener("click",()=>{var w;const g=(w=document.getElementById("gemini-api-key"))==null?void 0:w.value;g!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",g.trim()),v.toast("API Key de Gemini guardada"))}),(c=document.getElementById("btn-save-drive-secret"))==null||c.addEventListener("click",()=>{const w=document.getElementById("drive-client-secret").value.trim();w?(localStorage.setItem("life-dashboard/drive_client_secret",w),v.toast("Secreto guardado correctamente")):(localStorage.removeItem("life-dashboard/drive_client_secret"),v.toast("Secreto eliminado, usando valor por defecto","info")),q.init().catch(console.error)}),(u=document.getElementById("toggle-drive-secret"))==null||u.addEventListener("click",g=>{const w=document.getElementById("drive-client-secret"),f=g.currentTarget,x=w.type==="password";w.type=x?"text":"password",f.innerHTML=p(x?"eyeOff":"eye")}),(h=document.getElementById("btn-factory-reset"))==null||h.addEventListener("click",async()=>{if(await v.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const w="life-dashboard/";if(Object.keys(localStorage).forEach(f=>{f.startsWith(w)&&localStorage.removeItem(f)}),Object.keys(sessionStorage).forEach(f=>{f.startsWith(w)&&sessionStorage.removeItem(f)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(x=>window.indexedDB.deleteDatabase(x.name)),navigator.serviceWorker){const f=await navigator.serviceWorker.getRegistrations();for(let x of f)x.unregister()}v.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now()},1e3)}})}function pa(){return`
    <div class="stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Menú</h1>
        </header>

        <div class="menu-grid">
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
    `}function ma(s){var e,a,t;(e=document.getElementById("open-calendar"))==null||e.addEventListener("click",()=>{s("calendar")}),(a=document.getElementById("open-settings"))==null||a.addEventListener("click",()=>{s("settings")}),(t=document.getElementById("btn-force-update"))==null||t.addEventListener("click",async()=>{if(await v.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const o=await caches.keys();for(let i of o)await caches.delete(i)}catch(o){console.error("Error clearing cache",o)}window.location.reload(!0)}})}function va(){const{social:s}=d.getState(),{people:e,columns:a}=s;return`
    <div class="social-page stagger-children">
        <header class="page-header" style="margin-bottom: var(--spacing-sm);">
            <div class="header-content">
                <h1 class="page-title">Connections</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones</p>
                
                <div class="social-header-actions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
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
            ${a.sort((t,n)=>t.order-n.order).map(t=>{const n=e.filter(o=>o.columnId===t.id);return`
                <div class="kanban-column" data-col-id="${t.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${t.color}"></span>
                            ${t.name}
                            <span class="kanban-count">${n.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${t.id}">${p("moreVertical")}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${t.id}">
                        ${n.map(o=>ga(o)).join("")}
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function ga(s){const e=s.lastContact?Math.floor((Date.now()-new Date(s.lastContact).getTime())/864e5):null,a=s.color||"#3b82f6";return`
    <div class="person-card glass-panel" draggable="true" data-id="${s.id}">
        <div class="person-color-strip" style="background: ${a};"></div>
        <div class="person-card-content">
            <div class="person-header" style="margin-bottom: 2px;">
                <h3 class="person-name" style="font-size: 14px;">${s.name}</h3>
                ${s.rating?`<span class="person-rating" style="font-size: 10px; font-weight: 800; color: var(--accent-tertiary);">★${s.rating}</span>`:""}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="person-info-left" style="display: flex; align-items: center; gap: 8px;">
                    <div class="person-detail text-muted" style="font-size: 10px; font-weight: 600;">
                        ${e!==null?`${e===0?"Hoy":`Hace ${e}d`}`:"Contactar"}
                    </div>
                    ${s.source?`<span class="tag" style="font-size: 8px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-muted);">${s.source}</span>`:""}
                </div>
                <button class="icon-btn person-chat-btn" data-id="${s.id}" style="padding: 4px; background: none; color: var(--accent-primary); opacity: 0.7;">
                    ${p("messageSquare","tiny-icon")}
                </button>
            </div>
        </div>
    </div>
    `}function ha(){window.socialListenersAttached||(window.socialListenersAttached=!0,document.addEventListener("click",s=>{const e=s.target.closest(".col-opts-btn");if(e){s.preventDefault(),s.stopPropagation(),ka(e.dataset.id,e);return}if(s.target.closest("#add-social-col-btn")){ya();return}if(s.target.closest("#add-person-btn")){window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person"}}));return}if(s.target.closest("#ideal-lead-btn")){fa();return}if(s.target.closest("#communications-mgr-btn")){me(()=>import("./CommunicationsModal-CbDz7Gxn.js"),[]).then(n=>n.openCommunicationsModal());return}if(s.target.closest("#contact-sources-btn")){Ea();return}const a=s.target.closest(".person-chat-btn");if(a){s.preventDefault(),s.stopPropagation(),me(()=>import("./CommunicationsModal-CbDz7Gxn.js"),[]).then(n=>n.openCommunicationsModal(a.dataset.id));return}const t=s.target.closest(".person-card");if(t){ba(t.dataset.id);return}}),document.addEventListener("dragstart",s=>{const e=s.target.closest(".person-card");e&&(s.dataTransfer.setData("text/plain",e.dataset.id),e.classList.add("dragging"))}),document.addEventListener("dragend",s=>{const e=s.target.closest(".person-card");e&&e.classList.remove("dragging")}),document.addEventListener("dragover",s=>{const e=s.target.closest(".kanban-cards");e&&(s.preventDefault(),e.classList.add("drag-over"))}),document.addEventListener("dragleave",s=>{const e=s.target.closest(".kanban-cards");e&&e.classList.remove("drag-over")}),document.addEventListener("drop",s=>{const e=s.target.closest(".kanban-cards");if(e){s.preventDefault(),e.classList.remove("drag-over");const a=s.dataTransfer.getData("text/plain"),t=e.dataset.colId;a&&t&&d.movePerson(a,t)}}))}async function ya(){const s=await v.prompt("Etapa","Nombre de la etapa:");s&&(d.addSocialColumn({name:s,color:"#94a3b8"}),v.toast("Etapa agregada correctamente","success"))}async function fa(){const s=d.getState().social.idealLeadProfile||"",e=await wa(s);e!==null&&(d.updateIdealLeadProfile(e),v.toast("Perfil Ideal actualizado"))}function ba(s){const e=d.getState().social.people.find(a=>a.id===s);e&&window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person",person:e}}))}function wa(s){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="9999",a.innerHTML=`
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${s||""}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const t=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#save-ideal-lead").addEventListener("click",()=>{const n=a.querySelector("#ideal-lead-text").value;a.remove(),e(n)}),a.addEventListener("click",n=>{n.target===a&&t()})})}function ka(s,e){document.querySelectorAll(".column-options-menu").forEach(i=>i.remove());const a=d.getState().social.columns.find(i=>i.id===s);if(!a)return;const t=document.createElement("div");t.className="column-options-menu",t.innerHTML=`
        <button class="menu-item" data-action="edit">${p("edit")} Editar Nombre</button>
        <button class="menu-item" data-action="color">${p("palette")} Cambiar Color</button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_up">${p("chevronUp")} Mover Arriba (Anterior)</button>
        <button class="menu-item" data-action="move_down">${p("chevronDown")} Mover Abajo (Siguiente)</button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">${p("trash")} Eliminar Etapa</button>
    `;const n=e.getBoundingClientRect();t.style.position="fixed",t.style.top=`${n.bottom+8}px`,t.style.right=`${window.innerWidth-n.right}px`,t.style.zIndex="9999",document.body.appendChild(t),t.querySelectorAll(".menu-item").forEach(i=>{i.addEventListener("click",async()=>{const r=i.dataset.action;if(t.remove(),r==="edit"){const l=await v.prompt("Nombre de Columna","Nuevo nombre:",a.name);l!=null&&l.trim()&&d.updateSocialColumn(s,{name:l.trim()})}else if(r==="color"){const l=await xa(a.color);l&&d.updateSocialColumn(s,{color:l})}else if(r==="delete")await v.confirm("Eliminar Etapa",`¿Eliminar "${a.name}"?`)&&d.deleteSocialColumn(s);else if(r==="move_up"||r==="move_down"){const l=[...d.getState().social.columns].sort((u,h)=>u.order-h.order),m=l.findIndex(u=>u.id===s);if(m===-1)return;const c=r==="move_up"?m-1:m+1;c>=0&&c<l.length&&([l[m].order,l[c].order]=[l[c].order,l[m].order],d.reorderSocialColumns(l))}})});const o=i=>{!t.contains(i.target)&&i.target!==e&&(t.remove(),document.removeEventListener("click",o))};setTimeout(()=>document.addEventListener("click",o),10)}function xa(s){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="99999",a.innerHTML=`
            <div class="modal" style="max-width: 320px;">
                <div class="modal-header">
                    <h2 class="modal-title">Color de Etapa</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <input type="color" id="stage-color-input" class="color-picker-input" value="${s||"#3b82f6"}">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px;">
                        ${["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#64748b","#000000"].map(n=>`<div class="color-swatch" data-color="${n}" style="background:${n}; height:30px; border-radius:6px; cursor:pointer; border:2px solid ${s===n?"white":"transparent"}"></div>`).join("")}
                    </div>
                    <button class="btn btn-primary w-full" id="save-stage-color" style="margin-top: 24px;">Aplicar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const t=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",t),a.querySelectorAll(".color-swatch").forEach(n=>n.addEventListener("click",()=>{a.querySelector("#stage-color-input").value=n.dataset.color,a.querySelectorAll(".color-swatch").forEach(o=>o.style.borderColor="transparent"),n.style.borderColor="white"})),a.querySelector("#save-stage-color").addEventListener("click",()=>{const n=a.querySelector("#stage-color-input").value;a.remove(),e(n)}),a.addEventListener("click",n=>{n.target===a&&t()})})}async function Ea(){const{contactSources:s}=d.getState().social,e=await Sa(s);e&&(d.updateContactSources(e),v.toast("Fuentes de contacto actualizadas"))}function Sa(s){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="9999",a.innerHTML=`
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fuentes de Contacto</h2>
                    <button class="modal-close">${p("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">Escribe las fuentes separadas por coma:</p>
                    <textarea id="contact-sources-text" class="form-input" rows="4" placeholder="Ej: Instagram, WhatsApp, Amigo...">${s.join(", ")}</textarea>
                    <button class="btn btn-primary w-full" id="save-contact-sources" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const t=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",t),a.querySelector("#save-contact-sources").addEventListener("click",()=>{const o=a.querySelector("#contact-sources-text").value.split(",").map(i=>i.trim()).filter(i=>i.length>0);a.remove(),e(o)}),a.addEventListener("click",n=>{n.target===a&&t()})})}let re="tracker",M=null,he=!1;function $a(){const s=d.getState(),{activities:e=[],logs:a=[]}=s.timeInvest||{};return`
    <div class="time-invest-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Time Invest</h1>
            <p class="page-subtitle">Invierte tu tiempo con propósito</p>
        </header>

        <div class="segmented-control">
            <button class="segment-btn ${re==="tracker"?"active":""}" id="tab-tracker">
                Tracker
            </button>
            <button class="segment-btn ${re==="stats"?"active":""}" id="tab-stats">
                Stats
            </button>
        </div>

        ${re==="tracker"?Ia(e):Ca(e,a)}

        ${M?Aa(e):""}
    </div>
    `}function Ia(s){return`
    <div class="tracker-view animate-fade-in">
        <div class="section-divider">
            <span class="section-title">Actividades</span>
            <button class="btn-add-goal-inline" id="btn-add-activity">
                ${p("plus")} Configurar
            </button>
        </div>

        <div class="activities-grid">
            ${s.map(e=>`
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
                <input type="checkbox" id="pomodoro-toggle" class="apple-switch" ${he?"checked":""}>
            </div>
        </div>
    </div>
    `}function Ca(s,e){const a=new Date,t=new Date(a.getTime()-7*24*60*60*1e3),n=s.map(i=>{const l=e.filter(c=>c.activityId===i.id&&new Date(c.date)>=t).reduce((c,u)=>c+(u.durationMinutes||0),0),m=l/7;return{name:i.name,totalMinutes:l,dailyAverage:m,color:i.color}}),o=Math.max(...n.map(i=>i.totalMinutes),60);return`
    <div class="stats-view animate-fade-in">
        <div class="card stats-card">
            <div class="card-header">
                <span class="card-title">Inversión Semanal (minutos)</span>
                ${p("barChart2")}
            </div>
            
            <div class="chart-placeholder">
                ${n.map(i=>`
                    <div class="chart-bar" style="height: ${i.totalMinutes/o*100}%; background: ${i.color};">
                        <div class="chart-bar-value">${Math.round(i.totalMinutes)}m</div>
                    </div>
                `).join("")}
            </div>
            
            <div class="chart-legend" style="margin-top: var(--spacing-md); display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${n.map(i=>`
                    <div class="legend-item" style="display: flex; align-items: center; gap: 4px; font-size: 11px;">
                        <div style="width: 8px; height: 8px; border-radius: 2px; background: ${i.color};"></div>
                        <span>${i.name}</span>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Promedios de Inversión</span>
        </div>

        <div class="asset-list">
            ${n.map(i=>`
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-name">${i.name}</div>
                        <div class="asset-details">Promedio diario esta semana</div>
                    </div>
                    <div class="asset-value">
                        ${Math.round(i.dailyAverage)}m <span style="font-size: 10px; opacity: 0.6;">/día</span>
                    </div>
                </div>
            `).join("")}
        </div>
    </div>
    `}function Aa(s){const e=s.find(t=>t.id===M.activityId),a=We(M.elapsedSeconds);return`
    <div class="timer-overlay animate-fade-in">
        <div class="timer-active-label">Invirtiendo en...</div>
        <div class="activity-label" style="font-size: 32px; margin-bottom: var(--spacing-xl); color: ${e==null?void 0:e.color}">${e==null?void 0:e.name}</div>
        
        <div class="timer-display">${a}</div>

        <div class="timer-controls">
            <!-- No pause for now to keep it simple, just stop/complete -->
            <button class="timer-btn stop" id="btn-stop-timer">
                ${p("x")}
            </button>
            <button class="timer-btn" id="btn-complete-timer" style="background: var(--accent-success); color: white;">
                ${p("check")}
            </button>
        </div>
        
        ${he?`<p style="margin-top: 40px; color: var(--text-muted); font-size: 14px;">Pomodoro activo (${d.getState().timeInvest.pomodoroTime} min)</p>`:""}
    </div>
    `}function We(s){const e=Math.floor(s/3600),a=Math.floor(s%3600/60),t=s%60;return`${e>0?e+":":""}${String(a).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function La(){var s,e,a,t,n,o;(s=document.getElementById("tab-tracker"))==null||s.addEventListener("click",()=>{var i;re="tracker",(i=window.reRender)==null||i.call(window)}),(e=document.getElementById("tab-stats"))==null||e.addEventListener("click",()=>{var i;re="stats",(i=window.reRender)==null||i.call(window)}),document.querySelectorAll(".activity-btn").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id;Ta(r)})}),(a=document.getElementById("pomodoro-toggle"))==null||a.addEventListener("change",i=>{he=i.target.checked}),(t=document.getElementById("btn-stop-timer"))==null||t.addEventListener("click",()=>{confirm("¿Deseas cancelar esta sesión? No se guardarán los datos.")&&_e(!1)}),(n=document.getElementById("btn-complete-timer"))==null||n.addEventListener("click",()=>{_e(!0)}),(o=document.getElementById("btn-add-activity"))==null||o.addEventListener("click",()=>{ve()})}function ve(){var r,l,m;const s=d.getState().timeInvest,{activities:e=[],pomodoroTime:a=25}=s,t=document.createElement("div");t.className="modal-overlay active",t.id="time-invest-config-modal",t.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 500px;">
            <div class="modal-header">
                <h2 class="modal-title">Configurar Time Invest</h2>
                <button class="modal-close" id="close-config-modal">${p("x")}</button>
            </div>
            
            <div class="modal-body">
                <div class="config-group">
                    <div class="config-title">Configuración Pomodoro</div>
                    <div class="setting-item">
                        <label>Duración de sesión (minutos): <span id="pomodoro-val">${a}</span></label>
                        <input type="range" id="pomodoro-input" min="5" max="60" step="5" value="${a}">
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
    `,document.body.appendChild(t);const n=()=>{var c;t.classList.remove("active"),setTimeout(()=>t.remove(),300),(c=window.reRender)==null||c.call(window)};(r=document.getElementById("close-config-modal"))==null||r.addEventListener("click",n),(l=document.getElementById("save-config"))==null||l.addEventListener("click",n);const o=document.getElementById("pomodoro-input"),i=document.getElementById("pomodoro-val");o==null||o.addEventListener("input",c=>{const u=c.target.value;i.textContent=u,d.setPomodoroTime(u)}),t.querySelectorAll(".edit-activity").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.id,h=e.find(g=>g.id===u);Pe(h),t.remove()})}),t.querySelectorAll(".delete-activity").forEach(c=>{c.addEventListener("click",async()=>{const u=c.dataset.id;await v.confirm("¿Eliminar actividad?","Se perderán también los registros asociados.")&&(d.deleteTimeActivity(u),t.remove(),ve())})}),(m=document.getElementById("btn-new-activity"))==null||m.addEventListener("click",()=>{Pe(),t.remove()})}function Pe(s=null){var l,m;const e=!!s,a=["brain","rocket","coffee","bookOpen","zap","heart","briefcase","users","dumbbell","code","music","monitor"],t=["#8b5cf6","#f59e0b","#ef4444","#3b82f6","#10b981","#ec4899","#06b6d4","#f97316","#84cc16","#a855f7","#6366f1","#d946ef"];let n=(s==null?void 0:s.icon)||"brain",o=(s==null?void 0:s.color)||"#8b5cf6";const i=document.createElement("div");i.className="modal-overlay active",i.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 450px;">
            <div class="modal-header">
                <h2 class="modal-title">${e?"Editar":"Nueva"} Actividad</h2>
                <button class="modal-close" id="close-activity-form">${p("x")}</button>
            </div>
            
            <div class="modal-body">
                <div class="config-group">
                    <label class="config-title">Nombre</label>
                    <input type="text" id="activity-name" class="form-input" placeholder="Ej: Meditar, Leer..." value="${(s==null?void 0:s.name)||""}">
                </div>

                <div class="config-group">
                    <label class="config-title">Icono</label>
                    <div class="icon-selection-grid">
                        ${a.map(c=>`
                            <div class="icon-option ${c===n?"selected":""}" data-icon="${c}">
                                ${p(c)}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="config-group">
                    <label class="config-title">Color</label>
                    <div class="color-selection-grid">
                        ${t.map(c=>`
                            <div class="color-option ${c===o?"selected":""}" data-color="${c}" style="background: ${c}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="save-activity" style="width: 100%;">Guardar Actividad</button>
            </div>
        </div>
    `,document.body.appendChild(i);const r=()=>{i.classList.remove("active"),setTimeout(()=>i.remove(),300),ve()};(l=document.getElementById("close-activity-form"))==null||l.addEventListener("click",r),i.querySelectorAll(".icon-option").forEach(c=>{c.addEventListener("click",()=>{i.querySelectorAll(".icon-option").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),n=c.dataset.icon})}),i.querySelectorAll(".color-option").forEach(c=>{c.addEventListener("click",()=>{i.querySelectorAll(".color-option").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),o=c.dataset.color})}),(m=document.getElementById("save-activity"))==null||m.addEventListener("click",()=>{const c=document.getElementById("activity-name").value.trim();if(!c){v.toast("Por favor, indica un nombre","error");return}const u={name:c,icon:n,color:o};e?d.updateTimeActivity(s.id,u):d.addTimeActivity(u),i.classList.remove("active"),setTimeout(()=>i.remove(),300),ve()})}function Ta(s){var e;M||(M={activityId:s,startTime:Date.now(),elapsedSeconds:0,interval:setInterval(()=>{M.elapsedSeconds=Math.floor((Date.now()-M.startTime)/1e3);const a=document.querySelector(".timer-display");if(a&&(a.textContent=We(M.elapsedSeconds)),he){const t=d.getState().timeInvest.pomodoroTime||25;M.elapsedSeconds===t*60&&(Ma(),v.toast("¡Tiempo Pomodoro cumplido!","success"))}},1e3)},(e=window.reRender)==null||e.call(window))}function _e(s=!1){var e;if(M){if(clearInterval(M.interval),s){const a=Math.floor(M.elapsedSeconds/60);a>=1?(d.addTimeLog({activityId:M.activityId,date:new Date().toISOString(),durationMinutes:a}),v.toast(`¡Excelente! Has invertido ${a} min.`,"success")):v.toast("Sesión muy corta para ser registrada.","info")}M=null,(e=window.reRender)==null||e.call(window)}}function Ma(){try{const s=new(window.AudioContext||window.webkitAudioContext),e=s.createOscillator(),a=s.createGain();e.connect(a),a.connect(s.destination),e.type="sine",e.frequency.setValueAtTime(880,s.currentTime),a.gain.setValueAtTime(0,s.currentTime),a.gain.linearRampToValueAtTime(.5,s.currentTime+.1),a.gain.exponentialRampToValueAtTime(.01,s.currentTime+1),e.start(s.currentTime),e.stop(s.currentTime+1)}catch(s){console.error("Audio error:",s)}}const Ee={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},je=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let A="passiveAsset";function ke(s="passiveAsset"){var a,t;A=s,(t=(a=Ee[A])==null?void 0:a.types[0])!=null&&t.value;const e=document.createElement("div");e.className="modal-overlay",e.id="add-modal",e.innerHTML=Da(),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("active")}),Ba()}function Da(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${A==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${p("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${A!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(Ee).map(([e,a])=>`
          <div class="type-option ${e===A?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${p(a.icon)}
            </div>
            <div class="type-option-label">${a.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${Xe()}
      </div>
    </div>
  `}function Xe(){const s=Ee[A],e=A==="investmentAsset"||A==="passiveAsset";if(e){const t=V.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...je,...t]}let a="";return A==="passiveAsset"||A==="investmentAsset"?a=`
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
    `:A==="activeIncome"||A==="livingExpense"?a=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:A==="liability"?a=`
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
    `:A==="event"&&(a=`
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
                    ${je.map(t=>`<option value="${t.value}">${t.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${V.map(t=>`<option value="${t.symbol}">${t.name} (${t.symbol})</option>`).join("")}
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
      ${p("plus")} Agregar
    </button>
  `}function Ba(){const s=document.getElementById("add-modal"),e=document.getElementById("modal-close");s.addEventListener("click",t=>{t.target===s&&xe()}),e.addEventListener("click",xe);const a=s.querySelectorAll(".category-selector .type-option");a.forEach(t=>{t.addEventListener("click",()=>{A=t.dataset.category,a.forEach(n=>n.classList.remove("active")),t.classList.add("active"),document.getElementById("form-container").innerHTML=Xe(),Ue()})}),Ue()}function Ue(){const s=document.getElementById("btn-save");s&&s.addEventListener("click",Ra);const e=document.getElementById("mode-qty"),a=document.getElementById("mode-total"),t=document.getElementById("input-qty"),n=document.getElementById("input-value"),o=document.getElementById("input-currency"),i=document.getElementById("input-name");if(e&&a){const l=m=>{m==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",a.style.background="transparent",a.style.color="var(--text-secondary)",t.focus()):(a.style.background="var(--accent-primary)",a.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>l("qty")),a.addEventListener("click",()=>l("total"))}const r=l=>{const m=d.getState().rates,c=o==null?void 0:o.value,u=m[c]||1;if(l==="qty"){const h=parseFloat(t.value)||0;n.value=(h*u).toFixed(2)}else{const h=parseFloat(n.value)||0;t.value=(h/u).toFixed(6)}};t==null||t.addEventListener("input",()=>r("qty")),n==null||n.addEventListener("input",()=>r("total")),o&&o.addEventListener("change",()=>{if(i&&!i.value){const l=o.options[o.selectedIndex].text;i.value=l.split(" (")[0]}r("qty")})}function Ra(){var g,w,f,x,k,L,E,_,D,j,ae,se;const s=(w=(g=document.getElementById("input-name"))==null?void 0:g.value)==null?void 0:w.trim(),e=(f=document.getElementById("input-type"))==null?void 0:f.value,a=(x=document.getElementById("input-currency"))==null?void 0:x.value,t=(L=(k=document.getElementById("input-details"))==null?void 0:k.value)==null?void 0:L.trim(),n=parseFloat((E=document.getElementById("input-value"))==null?void 0:E.value)||0,o=document.getElementById("input-qty"),i=o?parseFloat(o.value)||0:n,r=parseFloat((_=document.getElementById("input-amount"))==null?void 0:_.value)||0,l=parseFloat((D=document.getElementById("input-monthly"))==null?void 0:D.value)||0,m=(j=document.getElementById("input-date"))==null?void 0:j.value,c=(ae=document.getElementById("input-time"))==null?void 0:ae.value,u=(se=document.getElementById("input-repeat"))==null?void 0:se.value;if(!s){v.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const h={name:s,type:e,currency:a,details:t};switch(A){case"passiveAsset":d.addPassiveAsset({...h,value:i,monthlyIncome:l});break;case"activeIncome":d.addActiveIncome({...h,amount:r});break;case"livingExpense":d.addLivingExpense({...h,amount:r});break;case"investmentAsset":d.addInvestmentAsset({...h,value:i});break;case"liability":d.addLiability({...h,amount:r,monthlyPayment:l});break;case"event":d.addEvent({title:s,date:m,time:c,repeat:u,category:e});break}xe()}function xe(){const s=document.getElementById("add-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}let K=null;function Je(s=null){console.log("[LeadModal] Opening modal",{personToEdit:s});const e=document.getElementById("add-person-modal");e&&(console.log("[LeadModal] Removing existing modal"),e.remove()),K=s?s.id:null;const a=document.createElement("div");a.className="modal-overlay",a.id="add-person-modal",a.setAttribute("role","dialog"),a.innerHTML=Pa(s),document.body.appendChild(a),setTimeout(()=>{var t;a.classList.add("active"),(t=a.querySelector("#person-name"))==null||t.focus()},50),_a(a)}function Pa(s=null){const e=s?"Editar Lead":"Lead",a=s?"Guardar Cambios":"Lead";return`
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
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${(s==null?void 0:s.name)||""}">
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
                    ${d.getState().social.contactSources.map(t=>`
                        <option value="${t}" ${(s==null?void 0:s.source)===t?"selected":""}>${t}</option>
                    `).join("")}
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

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Último Contacto</label>
                <input type="date" class="form-input" id="person-last-contact" value="${(s==null?void 0:s.lastContact)||new Date().toISOString().split("T")[0]}">
            </div>
            <div class="form-group">
                <label class="form-label">Color del Lead</label>
                <div class="goal-color-dots" id="person-color-picker" style="justify-content: flex-start; margin-top: 0; background: none; border: none; padding: 5px 0;">
                    ${["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"].map(t=>`
                        <div class="goal-color-dot ${(s==null?void 0:s.color)===t||!(s!=null&&s.color)&&t==="#3b82f6"?"active":""}" 
                             data-color="${t}" 
                             style="background-color: ${t}; width: 28px; height: 28px;"></div>
                    `).join("")}
                </div>
                <input type="hidden" id="person-color-value" value="${(s==null?void 0:s.color)||"#3b82f6"}">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notas / Descripción</label>
            <textarea class="form-input" id="person-desc" rows="3" placeholder="Detalles importantes, gustos, temas de conversación...">${(s==null?void 0:s.description)||""}</textarea>
        </div>

        <div class="form-group" style="margin-top: var(--spacing-md);">
             <label class="form-label">Etapa</label>
             <select class="form-input form-select" id="person-column">
                ${d.getState().social.columns.sort((t,n)=>t.order-n.order).map(t=>`<option value="${t.id}" ${(s==null?void 0:s.columnId)===t.id?"selected":""}>${t.name}</option>`).join("")}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${K?`
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${p("trash")}
            </button>`:""}
            <button class="btn btn-primary w-full" id="btn-save-person-lead" style="padding: 14px;">
                ${p("plus")} ${a}
            </button>
        </div>
      </div>
    </div>
  `}function _a(s){const e=s.querySelector("#person-modal-close"),a=s.querySelector("#btn-save-person-lead"),t=s.querySelector("#btn-delete-person"),n=s.querySelector("#person-rating-slider"),o=s.querySelector("#rating-value");if(s.addEventListener("click",l=>{l.target===s&&(console.log("[LeadModal] Overlay clicked, closing"),ge(s))}),e==null||e.addEventListener("click",()=>{console.log("[LeadModal] Close button clicked"),ge(s)}),n&&o){const l=()=>{console.log("[LeadModal] Slider updated:",n.value),o.textContent=n.value};n.oninput=l,n.onchange=l}a&&(a.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Save button clicked"),Ua(s)}),t&&(t.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Delete button clicked"),ja(s)});const i=s.querySelectorAll(".goal-color-dot"),r=s.querySelector("#person-color-value");i.forEach(l=>{l.addEventListener("click",()=>{i.forEach(m=>m.classList.remove("active")),l.classList.add("active"),r&&(r.value=l.dataset.color),console.log("[LeadModal] Color selected:",l.dataset.color)})})}async function ja(s){K&&await v.confirm("Eliminar Lead","¿Estás seguro de eliminar este lead?")&&(d.deletePerson(K),v.toast("Lead eliminado","success"),ge(s))}function Ua(s){var a,t,n,o,i,r,l,m,c,u,h,g,w;const e=s.querySelector("#btn-save-person-lead");if(e.disabled){console.log("[LeadModal] Save ignored, already processing");return}try{const f=(t=(a=s.querySelector("#person-name"))==null?void 0:a.value)==null?void 0:t.trim(),x=(o=(n=s.querySelector("#person-phone"))==null?void 0:n.value)==null?void 0:o.trim(),k=(r=(i=s.querySelector("#person-city"))==null?void 0:i.value)==null?void 0:r.trim(),L=(l=s.querySelector("#person-source"))==null?void 0:l.value,E=(m=s.querySelector("#person-rating-slider"))==null?void 0:m.value,_=(u=(c=s.querySelector("#person-desc"))==null?void 0:c.value)==null?void 0:u.trim(),D=(h=s.querySelector("#person-column"))==null?void 0:h.value,j=(g=s.querySelector("#person-color-value"))==null?void 0:g.value,ae=(w=s.querySelector("#person-last-contact"))==null?void 0:w.value;if(console.log("[LeadModal] Attempting to save",{name:f,rating:E,columnId:D,color:j,lastContact:ae}),!f){console.warn("[LeadModal] Save failed: Missing name"),v.toast("El nombre es obligatorio","error");return}e.disabled=!0,e.innerHTML='<span class="loading-spinner-sm"></span> Guardando...';const se={name:f,phone:x,city:k,source:L,rating:parseInt(E)||5,description:_,columnId:D,color:j,lastContact:ae};K?(console.log("[LeadModal] Updating person",K),d.updatePerson(K,se),v.toast("Lead actualizado correctamente","success")):(console.log("[LeadModal] Adding new person"),d.addPerson(se),v.toast("Lead guardado correctamente","success")),console.log("[LeadModal] Save successful, closing modal"),ge(s)}catch(f){console.error("[LeadModal] Error saving lead:",f),v.toast("Error al guardar el lead","error"),e.disabled=!1,e.innerHTML=`${p("plus")} Lead`}}function ge(s){s&&(console.log("[LeadModal] Closing modal"),s.classList.remove("active"),setTimeout(()=>{s.parentNode&&(console.log("[LeadModal] Removing modal from DOM"),s.remove())},400))}function Oa(){const s=I.isSetup(),e=I.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${p("lock","auth-icon")}
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
                    ${p("fingerprint")} Usar Huella
                </button>
                `:""}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `}function Na(s){var o;const e=document.getElementById("auth-submit-btn"),a=document.getElementById("auth-bio-btn"),t=document.getElementById("auth-password"),n=async()=>{const i=t.value,r=document.getElementById("auth-confirm"),l=I.isSetup();try{let m;if(l)m=await I.unlock(i);else{if(!i||i.length<4)throw new Error("Contraseña demasiado corta");if(i!==r.value)throw new Error("Las contraseñas no coinciden");m=await I.setup(i)}await d.loadEncrypted(m),s()}catch(m){v.alert("Error",m.message)}};e==null||e.addEventListener("click",n),t==null||t.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),(o=document.getElementById("auth-confirm"))==null||o.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())}),a==null||a.addEventListener("click",async()=>{try{const i=await I.unlockWithBiometrics();await d.loadEncrypted(i),s()}catch(i){v.alert("Identificación",i.message)}}),I.isBioEnabled()&&setTimeout(async()=>{try{const i=await I.unlockWithBiometrics();await d.loadEncrypted(i),s()}catch{console.log("Auto-bio failed or cancelled")}},500)}let R=localStorage.getItem("life-dashboard/app_current_page")||"finance",C=localStorage.getItem("life-dashboard/app_current_sub_page")||null;C==="null"&&(C=null);async function Oe(){window.addEventListener("open-add-modal",e=>{var t,n;const a=(t=e.detail)==null?void 0:t.type;a==="person"?Je((n=e.detail)==null?void 0:n.person):ke(a)}),q.init().catch(e=>console.warn("[Drive] Pre-init failed:",e));const s=I.getVaultKey();s?await d.loadEncrypted(s)?Ze():(console.error("[Boot] Decryption failed, invalid vault key in session?"),I.logout(),Ne()):Ne()}function Ne(){const s=document.getElementById("app");s.innerHTML=Oa(),Na(()=>{Ze()})}function Ze(){const s=document.getElementById("app");s.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,Qe(),d.subscribe(()=>{P()}),window.reRender=()=>P(),Fa()}function Fa(){var t,n;const s=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(s&&(Date.now()-parseInt(s))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
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
    `,document.body.appendChild(e);const a=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};a(),window.addEventListener("beforeinstallprompt",a),(t=document.getElementById("pwa-banner-install"))==null||t.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:o}=await window.deferredPrompt.userChoice;o==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function Qe(){const s=document.getElementById("bottom-nav");s.innerHTML=Ae(R),Le(e=>{R=e,C=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",C),O(),P(),s.innerHTML=Ae(R),Le(a=>{R=a,C=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",C),O(),P(),Qe()})}),Ga(),P()}function P(){const s=document.getElementById("main-content");if(!s)return;const e=s.scrollTop;if(C==="compound"){s.innerHTML=Rt(),Pt(()=>{C=null,_t(),O(),P()}),s.scrollTop=e;return}if(C==="expenses"){s.innerHTML=na(),ra(()=>{C=null,O(),P()}),s.scrollTop=e;return}if(C==="market"){s.innerHTML=jt(),Ot(()=>{C=null,O(),P()}),s.scrollTop=e;return}switch(s.classList.toggle("no-padding-mobile",R==="health"),R){case"finance":O(),s.innerHTML=Me(),De(),Fe();break;case"goals":N(),s.innerHTML=Yt(),Xt();break;case"time-invest":N(),s.innerHTML=$a(),La();break;case"social":N(),s.innerHTML=va(),ha();break;case"health":s.innerHTML=Nt(),Vt(),N();break;case"menu":s.innerHTML=pa(),ma(a=>{R=a,O(),P()}),N();break;case"calendar":s.innerHTML=Jt(),sa(),O();break;case"settings":s.innerHTML=da(),ua(),N();break;default:O(),s.innerHTML=Me(),De(),Fe()}requestAnimationFrame(()=>{s.scrollTop=e})}function Fe(){const s=document.getElementById("open-compound");s&&s.addEventListener("click",()=>{C="compound",localStorage.setItem("life-dashboard/app_current_sub_page",C),N(),P()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{C="market",localStorage.setItem("life-dashboard/app_current_sub_page",C),N(),P()});const a=document.getElementById("open-expenses");a&&a.addEventListener("click",()=>{C="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",C),N(),P()})}function Ga(){const s=document.querySelector(".fab");s&&s.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=p("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{if(R==="calendar")ke("event");else if(R==="health"){const a=await ns.confirm("Log Metric","What do you want to record today?","Weight","Body Fat");if(a===!0){const t=await ns.prompt("Log Weight","Enter your current weight in kg:","","number");t&&d.addWeightLog(t)}else if(a===!1){const t=await ns.prompt("Body Fat","Enter your body fat %:","","number");t&&d.addFatLog(t)}}else R==="social"?Je():ke()}),document.body.appendChild(e)}function N(){const s=document.getElementById("main-fab");s&&(s.style.display="none")}function O(){const s=document.getElementById("main-fab");s&&(s.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Oe):Oe();window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),window.deferredPrompt=s,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});export{p as g,v as n,d as s};
