var pt=Object.defineProperty;var mt=(s,e,t)=>e in s?pt(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var de=(s,e,t)=>mt(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const vt="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",gt="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function ht(){var e,t,a,n,i,o,r,l,u,p,c,h,g,f,y;const s={EUR:1};try{const x=await(await fetch(vt)).json();s.BTC=((e=x.bitcoin)==null?void 0:e.eur)||4e4,s.ETH=((t=x.ethereum)==null?void 0:t.eur)||2200,s.XRP=((a=x.ripple)==null?void 0:a.eur)||.5,s.KAS=((n=x.kaspa)==null?void 0:n.eur)||.1,s.SOL=((i=x.solana)==null?void 0:i.eur)||90,s.XLM=((o=x.stellar)==null?void 0:o.eur)||.11,s.ALGO=((r=x.algorand)==null?void 0:r.eur)||.18,s.LTC=((l=x.litecoin)==null?void 0:l.eur)||65,s.SUI=((u=x.sui)==null?void 0:u.eur)||1.1,s.LINK=((p=x.chainlink)==null?void 0:p.eur)||14,s.RNDR=((c=x["render-token"])==null?void 0:c.eur)||4.5,s.ADA=((h=x.cardano)==null?void 0:h.eur)||.45,s.ONDO=((g=x["ondo-finance"])==null?void 0:g.eur)||.7,(f=x.bitcoin)!=null&&f.ars&&((y=x.bitcoin)!=null&&y.eur)&&(s.ARS=x.bitcoin.eur/x.bitcoin.ars);const S=await fetch(gt);if(S.ok){const E=await S.json();s.USD=1/E.rates.USD,s.CHF=1/E.rates.CHF,s.GBP=1/E.rates.GBP,s.AUD=1/E.rates.AUD}s.GOLD=2100,s.SP500=4700}catch(k){console.error("Failed to fetch some prices:",k),s.USD=s.USD||.92,s.CHF=s.CHF||1.05,s.GBP=s.GBP||1.15,s.AUD=s.AUD||.6,s.ARS=s.ARS||.001}return s}class H{static async hash(e,t="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+t),i=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,t){const a=new TextEncoder,n=await crypto.subtle.importKey("raw",a.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:a.encode(t),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,t){try{const a=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),i=await this.deriveKey(t,this.bufToBase64(a)),o=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(o),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},i,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(n),salt:this.bufToBase64(a),v:"5.0"}}catch(a){throw console.error("[Security] Encryption failed:",a),new Error("No se pudo encriptar la información")}}static async decrypt(e,t){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:a,iv:n,salt:i}=e,o=await this.deriveKey(t,i),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},o,this.base64ToBuf(a)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(a){throw console.error("[Security] Decryption failed:",a),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(t=>t.charCodeAt(0)))}}const Me=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:H},Symbol.toStringTag,{value:"Module"})),M={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class I{static isSetup(){return!!localStorage.getItem(M.MASTER_HASH)}static async setup(e){const t=await H.hash(e),a=await H.deriveVaultKey(e);return localStorage.setItem(M.MASTER_HASH,t),sessionStorage.setItem(M.VAULT_KEY,a),a}static async unlock(e){const t=await H.hash(e),a=localStorage.getItem(M.MASTER_HASH);if(t===a){const n=await H.deriveVaultKey(e);return sessionStorage.setItem(M.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const t=sessionStorage.getItem(M.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const a=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:a,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(M.BIO_ENABLED,"true"),localStorage.setItem(M.VAULT_KEY,t),!0}catch(a){throw console.error("Biometric setup failed:",a),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(M.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const t=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:t,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const a=localStorage.getItem(M.VAULT_KEY);if(a)return sessionStorage.setItem(M.VAULT_KEY,a),a;throw new Error("Llave no encontrada. Usa contraseña.")}catch(t){throw console.error("Biometric auth failed:",t),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(M.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(M.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(M.BIO_ENABLED)==="true"}}const be="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Be=[71,79,67,83,80,88,45,112,121,52,68,109,80,83,107,45,100,75,55,99,73,66,116,106,65,81,75,90,70,75,118,95,66,87,95].map(s=>String.fromCharCode(s)).join(""),yt="https://www.googleapis.com/auth/drive.file";class U{static hasToken(){const e=!!this.accessToken;return localStorage.getItem("life-dashboard/drive_connected")==="true"&&e}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,t)=>{const a=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.codeClient=google.accounts.oauth2.initCodeClient({client_id:be,scope:yt,ux_mode:"popup",access_type:"offline",prompt:"consent",callback:async n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}if(n.code)try{const i=sessionStorage.getItem("life-dashboard/pkce_verifier"),o=localStorage.getItem("life-dashboard/drive_client_secret")||Be,r=await this.exchangeCodeForTokens(n.code,i,be,o);r.refresh_token&&await this.saveRefreshToken(r.refresh_token),this.saveSession(r),console.log("[Drive] Connected successfully via offline flow."),window.ns&&window.ns.toast("Google Drive vinculado"),typeof window.reRender=="function"&&window.reRender()}catch(i){console.error("[Drive] Token exchange error:",i),window.ns&&window.ns.alert("Error Auth","No se pudieron obtener tokens. Verifica el Client Secret.")}}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&this.ensureValidToken().catch(n=>{console.log("[Drive] Initial silent restoration skipped:",n.message)}),e(!0)}catch(n){console.error("[Drive] Init error:",n),t(n)}}):setTimeout(a,200)};a()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const t=e.expires_in||3600,a=Date.now()+t*1e3;localStorage.setItem("life-dashboard/drive_token_expiry",a.toString())}static async authenticate(){this.codeClient||await this.init();const{verifier:e}=await this.generatePKCE();sessionStorage.setItem("life-dashboard/pkce_verifier",e),this.codeClient.requestCode()}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Access token expired or near expiry, attempting refresh...");const n=await this.getRefreshToken();if(n)try{const i=localStorage.getItem("life-dashboard/drive_client_secret")||Be,o=await this.refreshAccessToken(n,be,i),r={access_token:o.access_token,expires_in:o.expires_in,refresh_token:o.refresh_token||n};return o.refresh_token&&await this.saveRefreshToken(o.refresh_token),this.saveSession(r),this.accessToken}catch(i){throw console.error("[Drive] Token refresh failed:",i),new Error("Sesión de Google Drive expirada. Por favor reconecta en Configuración.")}else throw console.warn("[Drive] No refresh token found."),new Error("Google Drive no está vinculado para acceso offline.")}return this.accessToken&&(!gapi.client.getToken()||gapi.client.getToken().access_token!==this.accessToken)&&gapi.client.setToken({access_token:this.accessToken}),this.accessToken}static async generatePKCE(){const e=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(o=>("0"+o.toString(16)).slice(-2)).join(""),a=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",a),i=btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return{verifier:e,challenge:i}}static async exchangeCodeForTokens(e,t,a,n=null){const i=new URLSearchParams({client_id:a,code:e,grant_type:"authorization_code",redirect_uri:"postmessage"});t&&!n&&i.append("code_verifier",t),n&&i.append("client_secret",n);const o=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:i});if(!o.ok){const r=await o.json();throw new Error(r.error_description||"Failed to exchange code")}return await o.json()}static async refreshAccessToken(e,t,a=null){const n=new URLSearchParams({client_id:t,refresh_token:e,grant_type:"refresh_token"});a&&n.append("client_secret",a);const i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!i.ok){const o=await i.json();throw new Error(o.error_description||"Failed to refresh token")}return await i.json()}static async saveRefreshToken(e){return new Promise((t,a)=>{const n=indexedDB.open("LifeDashboardAuthDB",1);n.onupgradeneeded=i=>{const o=i.target.result;o.objectStoreNames.contains("tokens")||o.createObjectStore("tokens")},n.onsuccess=i=>{const r=i.target.result.transaction("tokens","readwrite");r.objectStore("tokens").put(e,"drive_refresh_token"),r.oncomplete=()=>t(),r.onerror=l=>a(l)},n.onerror=i=>a(i)})}static async getRefreshToken(){return new Promise((e,t)=>{const a=indexedDB.open("LifeDashboardAuthDB",1);a.onupgradeneeded=n=>{const i=n.target.result;i.objectStoreNames.contains("tokens")||i.createObjectStore("tokens")},a.onsuccess=n=>{const i=n.target.result;if(!i.objectStoreNames.contains("tokens")){e(null);return}const l=i.transaction("tokens","readonly").objectStore("tokens").get("drive_refresh_token");l.onsuccess=()=>e(l.result),l.onerror=u=>t(u)},a.onerror=n=>t(n)})}static async clearTokens(){return localStorage.removeItem("life-dashboard/drive_access_token"),localStorage.removeItem("life-dashboard/drive_connected"),localStorage.removeItem("life-dashboard/drive_token_expiry"),new Promise(e=>{const t=indexedDB.open("LifeDashboardAuthDB",1);t.onsuccess=a=>{const n=a.target.result;if(n.objectStoreNames.contains("tokens")){const i=n.transaction("tokens","readwrite");i.objectStore("tokens").clear(),i.oncomplete=()=>e()}else e()},t.onerror=()=>e()})}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const t=e.split("/").filter(i=>i);let a="root";for(const i of t){const o=`name = '${i}' and mimeType = 'application/vnd.google-apps.folder' and '${a}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(l&&l.length>0)a=l[0].id;else{const u={name:i,mimeType:"application/vnd.google-apps.folder",parents:[a]};a=(await gapi.client.drive.files.create({resource:u,fields:"id"})).result.id}}return a}static async pushData(e,t,a=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pushing encrypted data...${a?" (Retry)":""}`);const n=await this.getOrCreateFolderPath("/backup/life-dashboard/"),i=await H.encrypt(e,t),o="dashboard_vault_v5.bin",r=`name = '${o}' and '${n}' in parents and trashed = false`,u=(await gapi.client.drive.files.list({q:r,fields:"files(id)"})).result.files,p=new Blob([JSON.stringify(i)],{type:"application/json"});if(u&&u.length>0){const c=u[0].id,h=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${c}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:p});if(h.status===401&&!a)return await this.ensureValidToken(),await this.pushData(e,t,!0);if(!h.ok)throw new Error(`Error al actualizar backup: ${h.status}`)}else{const c={name:o,parents:[n]},h=new FormData;h.append("metadata",new Blob([JSON.stringify(c)],{type:"application/json"})),h.append("file",p);const g=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:h});if(g.status===401&&!a)return await this.ensureValidToken(),await this.pushData(e,t,!0);if(!g.ok)throw new Error(`Error al crear backup: ${g.status}`)}return!0}catch(n){throw console.error("[Drive] Push failed:",n),new Error(n.message||"Fallo al subir datos a Drive")}}static async pullData(e,t=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pulling data...${t?" (Retry)":""}`);const i=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,r=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(!r||r.length===0)return null;const l=r[0].id,u=await fetch(`https://www.googleapis.com/drive/v3/files/${l}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(u.status===401&&!t)return await this.ensureValidToken(),await this.pullData(e,!0);if(!u.ok)throw new Error(`Error al descargar backup: ${u.status}`);const p=await u.json();return await H.decrypt(p,e)}catch(a){throw console.error("[Drive] Pull failed:",a),new Error(a.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");const a=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,i=(await gapi.client.drive.files.list({q:a,fields:"files(id)"})).result.files;if(i&&i.length>0){const o=i[0].id;return await gapi.client.drive.files.delete({fileId:o}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(e){throw console.error("[Drive] Deletion failed:",e),new Error(e.message||"Fallo al borrar backup en Drive")}}}de(U,"codeClient",null),de(U,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null),de(U,"_initPromise",null);const Re={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',uploadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12V21"/><path d="m16 16-4-4-4 4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',users:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',messageSquare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',phone:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',facebook:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',linkedin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"/><path d="M5 15.1a7 7 0 0 0 10.9 0"/><path d="M6 13.6a7 7 0 0 0 4.6 2.4"/><path d="M13.4 16a7 7 0 0 0 4.6-2.4"/><path d="M8 12.1a5 5 0 0 0 6.9 0"/><path d="M9.1 11a3 3 0 0 0 3.9 0"/><path d="M12 18.5V20"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',palette:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12c0 0 3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',clock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',barChart2:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',brain:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>',rocket:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>',coffee:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',bookOpen:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',dumbbell:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',code:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',music:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',monitor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',sparkles:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>'};function m(s,e=""){return(Re[s]||Re.package).replace("<svg",`<svg class="${e}"`)}class ft{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,t="success",a=3e3){const n=document.createElement("div");n.className=`toast toast-${t} stagger-in`;const i=t==="success"?"check":t==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${m(i,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},a)}alert(e,t){return new Promise(a=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>a(!0)}]})})}confirm(e,t,a="Confirmar",n="Cancelar"){return new Promise(i=>{this._showModal({title:e,message:t,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>i(!1)},{text:a,type:"danger",onClick:()=>i(!0)}]})})}prompt(e,t,a="",n="text"){return new Promise(i=>{const o=`prompt-input-${Date.now()}`;this._showModal({title:e,message:t,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${o}" class="form-input" value="${a}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(o).value;i(r)}}]}),setTimeout(()=>{const r=document.getElementById(o);r&&(r.focus(),r.select&&r.select())},100)})}select(e,t,a=[],n=4){return new Promise(i=>{const o=`display: grid; grid-template-columns: repeat(${n}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:t,centered:!0,content:`
                    <div style="${o}">
                        ${a.map((l,u)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{i(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,t,a="BORRAR"){return new Promise(n=>{const i=`hard-confirm-input-${Date.now()}`,o=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${t}<br><br>Escribe <strong>${a}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${i}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:o,disabled:!0,onClick:()=>n(!0)}]});const r=document.getElementById(i),l=document.getElementById(o);r.addEventListener("input",()=>{const u=r.value.trim().toUpperCase()===a.toUpperCase();l.disabled=!u,l.style.opacity=u?"1":"0.3",l.style.pointerEvents=u?"auto":"none"})})}performance(e,t){const a=[{rating:1,emoji:"🫣",label:"Baja"},{rating:3,emoji:"😐",label:"Media"},{rating:5,emoji:"😎",label:"Alta"}];return new Promise(n=>{this._showModal({title:e,message:t,centered:!0,content:`
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${a.map(o=>`
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${o.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${o.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${o.label}</span>
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(null)}]});const i=document.querySelector(".modal-overlay.active");i&&i.querySelectorAll(".perf-emoji-btn").forEach(o=>{o.addEventListener("click",()=>{n(parseInt(o.dataset.value)),this._closeModal(i)})})})}_showModal({title:e,message:t,content:a="",buttons:n=[],centered:i=!1}){const o=document.createElement("div");o.className=`modal-overlay ${i?"overlay-centered":""}`,o.style.zIndex="9999";const r=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;o.id=r;const l=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${t}</div>
                    ${a}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    ${n.map((c,h)=>`
                        <button class="btn btn-${c.type} w-full" data-index="${h}" style="min-height: 48px; font-size: 16px; ${c.disabled?"opacity: 0.3; pointer-events: none;":""}" ${c.id?`id="${c.id}"`:""}>
                            ${c.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;o.innerHTML=l,document.body.appendChild(o),o.offsetHeight,o.classList.add("active"),setTimeout(()=>{const c=o.querySelectorAll(".modal-footer button");c.length>0&&c[c.length-1].focus()},100);const u=c=>{c.key==="Escape"&&(n.some(g=>g.type==="danger")||(o.removeEventListener("keydown",u),this._closeModal(o)))};o.tabIndex=-1,o.addEventListener("keydown",u),o.querySelectorAll(".modal-footer button").forEach(c=>{const h=c.dataset.index;if(h!==void 0){const g=n[h];c.addEventListener("click",async f=>{if(f.stopPropagation(),!c.classList.contains("btn-processing")){c.classList.add("btn-processing"),c.style.pointerEvents="none";try{g.onClick&&await g.onClick(),await this._closeModal(o)}catch(y){console.error("Modal button action failed",y),c.classList.remove("btn-processing"),c.style.pointerEvents="auto"}}})}}),o.addEventListener("click",async c=>{if(c.target===o&&!n.some(g=>g.type==="danger")){const g=n.find(f=>f.type==="secondary");g&&g.onClick(),await this._closeModal(o)}})}async _closeModal(e){e.classList.remove("active");const t=e.querySelector(".modal");return t&&t.classList.add("animate-out"),new Promise(a=>{setTimeout(()=>{e.remove(),a()},300)})}}const v=new ft,we="life-dashboard/data",Pe="life-dashboard/secured",ue={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,weightGoalDate:null,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],social:{people:[],columns:[{id:"1",name:"Chat",color:"#3b82f6",order:0},{id:"2",name:"Phone",color:"#8b5cf6",order:1},{id:"3",name:"Meeting",color:"#10b981",order:2},{id:"4",name:"Closed",color:"#f59e0b",order:3}],communications:[],contactSources:["Instagram","WhatsApp","Bumble","LinkedIn","Evento","Amigo","Otro"],idealLeadProfile:""},lastMarketData:[],marketFavorites:[],wealthGoals:[],inflationRate:3,projectionYears:10,timeInvest:{activities:[{id:"1",name:"Meditar",icon:"brain",color:"#8b5cf6",subActivities:[]},{id:"2",name:"Emprender",icon:"rocket",color:"#f59e0b",subActivities:[{id:"s1",name:"Marketing"},{id:"s2",name:"Desarrollo"},{id:"s3",name:"Ventas"}]}],logs:[],pomodoroTime:25},scheduledTasks:[],skills:[],aesthetics:[],habits:[{id:"1",name:"Levantarse",time:"08:00",icon:"zap",color:"#f59e0b"},{id:"2",name:"Meditar",time:"08:15",icon:"brain",color:"#8b5cf6"},{id:"3",name:"Entrenar",time:"09:00",icon:"dumbbell",color:"#ef4444"}],habitLogs:{}};class bt{constructor(){this.state=this.loadState(),this.listeners=new Set,this.isHydrated=!1,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...ue}}async loadEncrypted(e){const t=localStorage.getItem(Pe),a=localStorage.getItem(we);if(t)try{const n=JSON.parse(t),i=await H.decrypt(n,e);return this.state={...ue,...i},this.isHydrated=!0,this.processScheduledTasks(),this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(a)try{const n=JSON.parse(a);return this.state={...ue,...n},this.isHydrated=!0,await this.saveState(),localStorage.removeItem(we),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return this.isHydrated=!0,!0}async refreshRates(){const e=await ht();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){if(!this.isHydrated){console.warn("[Store] Blocked save: Store not yet hydrated with persistent data.");return}try{const e=I.getVaultKey();if(e){console.log("[Store] Saving state to encrypted storage...");const t=await H.encrypt(this.state,e);localStorage.setItem(Pe,JSON.stringify(t)),localStorage.removeItem(we),console.log("[Store] State saved successfully.")}else console.warn("[Store] Attempted to save without Vault Key. Save skipped. Data will be lost on refresh.")}catch(e){console.error("[Store] Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState(),this.notify()}resetState(e){this.state={...ue,...e},this.saveState(),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const t={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:t[e]||"$"})}convertToEUR(e,t){if(!t||t==="EUR")return e||0;const a=this.state.rates[t]||1;return(e||0)*a}convertFromEUR(e,t){if(!t||t==="EUR")return e;const a=this.state.rates[t];return a&&a!==0?e/a:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,t="investment"){const a={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return t==="passive"?this.addPassiveAsset({...a,monthlyIncome:0}):this.addInvestmentAsset(a)}toggleMarketFavorite(e){const t=this.state.marketFavorites||[],a=t.includes(e)?t.filter(n=>n!==e):[...t,e];this.setState({marketFavorites:a})}convertValue(e,t){const a=this.convertToEUR(e,t);return this.convertFromEUR(a,this.state.currency)}addPassiveAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,t]}),t}updatePassiveAsset(e,t){this.setState({passiveAssets:this.state.passiveAssets.map(a=>a.id===e?{...a,...t}:a)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(t=>t.id!==e)})}addActiveIncome(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,t]}),t}updateActiveIncome(e,t){this.setState({activeIncomes:this.state.activeIncomes.map(a=>a.id===e?{...a,...t}:a)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(t=>t.id!==e)})}addLivingExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,t]}),t}updateLivingExpense(e,t){this.setState({livingExpenses:this.state.livingExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(t=>t.id!==e)})}addOtherExpense(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,t]}),t}updateOtherExpense(e,t){this.setState({otherExpenses:this.state.otherExpenses.map(a=>a.id===e?{...a,...t}:a)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(t=>t.id!==e)})}addInvestmentAsset(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,t]}),t}updateInvestmentAsset(e,t){this.setState({investmentAssets:this.state.investmentAssets.map(a=>a.id===e?{...a,...t}:a)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(t=>t.id!==e)})}addLiability(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,t]}),t}updateLiability(e,t){this.setState({liabilities:this.state.liabilities.map(a=>a.id===e?{...a,...t}:a)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(t=>t.id!==e)})}sumItems(e,t){return e.reduce((a,n)=>{const i=n[t]||0;return a+this.convertValue(i,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),t=this.sumItems(this.state.liabilities,"monthlyPayment");return e+t}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),t=this.sumItems(this.state.investmentAssets,"value");return e+t}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),t=this.sumItems(this.state.activeIncomes,"amount");return e+t}getAllExpenses(){const e=this.getLivingExpenses(),t=this.sumItems(this.state.otherExpenses,"amount");return e+t}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,t){this.setState({health:{...this.state.health,[e]:t}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const t={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,t]}})}addFatLog(e){const t={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,t]}})}saveRoutine(e){const t=this.state.health.routines,n=t.find(i=>i.id===e.id)?t.map(i=>i.id===e.id?e:i):[...t,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(t=>t.id!==e)}})}renameRoutine(e,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(a=>a.id===e?{...a,name:t}:a)}})}updateExercise(e,t,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const i=[...n.exercises];return i[t]={...i[t],...a},{...n,exercises:i}}return n})}})}addExerciseToRoutine(e,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(a=>a.id===e?{...a,exercises:[...a.exercises,{weight:50,reps:10,sets:4,...t}]}:a)}})}reorderRoutine(e,t){const a=[...this.state.health.routines],n=t==="up"?e-1:e+1;n<0||n>=a.length||([a[e],a[n]]=[a[n],a[e]],this.setState({health:{...this.state.health,routines:a}}))}reorderExercise(e,t,a){const n=this.state.health.routines.map(i=>{if(i.id===e){const o=[...i.exercises],r=a==="up"?t-1:t+1;return r<0||r>=o.length?i:([o[t],o[r]]=[o[r],o[t]],{...i,exercises:o})}return i});this.setState({health:{...this.state.health,routines:n}})}deleteExerciseFromRoutine(e,t){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(a=>{if(a.id===e){const n=[...a.exercises];return n.splice(t,1),{...a,exercises:n}}return a})}})}addCalorieLog(e,t=""){const a={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:t};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,a]}})}logExercise(e,t,a){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:t,date:Date.now(),rating:parseInt(a)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,t){const n=(this.state.health.exerciseLogs||[]).filter(c=>c.routineId===e&&c.exerciseIndex===t);if(n.length===0)return{color:"green",lastDate:null};n.sort((c,h)=>h.date-c.date);const i=n[0],o=new Date,r=new Date(i.date),l=new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),p=Math.floor((l-u)/(1e3*60*60*24));return p===0?{color:"danger",status:"done_today",lastLog:i}:p===1?{color:"danger",status:"yesterday",lastLog:i}:p===2?{color:"tertiary",status:"day_before",lastLog:i}:{color:"success",status:"rested",lastLog:i}}addGoal(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,t]})}toggleGoal(e){this.setState({goals:this.state.goals.map(t=>t.id===e?{...t,completed:!t.completed}:t)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(t=>t.id!==e)})}addScheduledTask(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),lastProcessed:null,active:!0,...e};this.setState({scheduledTasks:[...this.state.scheduledTasks,t]})}deleteScheduledTask(e){this.setState({scheduledTasks:this.state.scheduledTasks.filter(t=>t.id!==e)})}updateScheduledTask(e,t){this.setState({scheduledTasks:this.state.scheduledTasks.map(a=>a.id===e?{...a,...t}:a)})}processScheduledTasks(){const e=new Date,t=e.toISOString().split("T")[0],a=e.getDay(),n=e.getDate();let i=!1;const o=[...this.state.scheduledTasks],r=[...this.state.goals];o.forEach(l=>{if(!l.active||l.lastProcessed===t)return;let u=!1;(l.type==="weekly"&&l.days&&l.days.includes(a)||l.type==="monthly"&&l.dayOfMonth==n||l.type==="fixed"&&l.date===t)&&(u=!0),u&&(r.some(c=>c.title===l.title&&c.timeframe==="day"&&!c.completed)||r.push({id:crypto.randomUUID(),title:l.title,timeframe:"day",completed:!1,color:l.color||"#ffffff",createdAt:Date.now(),scheduledTaskId:l.id}),l.lastProcessed=t,i=!0)}),i&&this.setState({goals:r,scheduledTasks:o})}addSkill(e){const t={id:crypto.randomUUID(),name:"",level:0,category:"current",...e,createdAt:Date.now()};this.setState({skills:[...this.state.skills||[],t]})}updateSkill(e,t){this.setState({skills:this.state.skills.map(a=>a.id===e?{...a,...t}:a)})}deleteSkill(e){this.setState({skills:this.state.skills.filter(t=>t.id!==e)})}reorderSkills(e,t){const a=[...this.state.skills||[]],n=a.findIndex(c=>c.id===e);if(n===-1)return;const i=a[n].category,o=a.filter(c=>c.category===i),r=o.findIndex(c=>c.id===e),l=t==="up"?r-1:r+1;if(l<0||l>=o.length)return;const u=o[l].id,p=a.findIndex(c=>c.id===u);[a[n],a[p]]=[a[p],a[n]],this.setState({skills:a})}reorderSkillsList(e){this.setState({skills:e})}addAesthetic(e){const t={id:crypto.randomUUID(),name:"",level:0,category:"current",...e,createdAt:Date.now()};this.setState({aesthetics:[...this.state.aesthetics||[],t]})}updateAesthetic(e,t){this.setState({aesthetics:this.state.aesthetics.map(a=>a.id===e?{...a,...t}:a)})}deleteAesthetic(e){this.setState({aesthetics:this.state.aesthetics.filter(t=>t.id!==e)})}reorderAestheticsList(e){this.setState({aesthetics:e})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(t=>t.timeframe!==e||!t.completed)})}updateGoal(e,t){this.setState({goals:this.state.goals.map(a=>a.id===e?{...a,...t}:a)})}toggleSubGoal(e,t){const a=this.state.goals.find(i=>i.id===e);if(!a||!a.subGoals)return;const n=[...a.subGoals];n[t].completed=!n[t].completed,this.updateGoal(e,{subGoals:n})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,t){this.updateGoal(e,{color:t})}addEvent(e){const t={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,t]}),this.scheduleNotification(t)}deleteEvent(e){this.setState({events:this.state.events.filter(t=>t.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}addPerson(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({social:{...this.state.social,people:[...this.state.social.people,t]}}),t}updatePerson(e,t){this.setState({social:{...this.state.social,people:this.state.social.people.map(a=>a.id===e?{...a,...t}:a)}})}deletePerson(e){this.setState({social:{...this.state.social,people:this.state.social.people.filter(t=>t.id!==e)}})}movePerson(e,t){this.updatePerson(e,{columnId:t})}addSocialColumn(e){const t={id:crypto.randomUUID(),order:this.state.social.columns.length,...e};this.setState({social:{...this.state.social,columns:[...this.state.social.columns,t]}})}updateSocialColumn(e,t){this.setState({social:{...this.state.social,columns:this.state.social.columns.map(a=>a.id===e?{...a,...t}:a)}})}deleteSocialColumn(e){this.setState({social:{...this.state.social,columns:this.state.social.columns.filter(t=>t.id!==e),people:this.state.social.people.filter(t=>t.columnId!==e)}})}reorderSocialColumns(e){this.setState({social:{...this.state.social,columns:e}})}updateIdealLeadProfile(e){this.setState({social:{...this.state.social,idealLeadProfile:e}})}addCommunication(e){const t={id:crypto.randomUUID(),order:this.state.social.communications.length,rating:1,lastUsed:{},...e};this.setState({social:{...this.state.social,communications:[...this.state.social.communications,t]}})}updateCommunication(e,t){this.setState({social:{...this.state.social,communications:this.state.social.communications.map(a=>a.id===e?{...a,...t}:a)}})}deleteCommunication(e){this.setState({social:{...this.state.social,communications:this.state.social.communications.filter(t=>t.id!==e)}})}reorderCommunications(e){this.setState({social:{...this.state.social,communications:e}})}logCommunicationUsed(e,t){const a=Date.now(),n=this.state.social.communications.map(o=>o.id===e?{...o,lastUsed:{...o.lastUsed||{},[t]:a}}:o),i=this.state.social.people.map(o=>o.id===t?{...o,lastContact:new Date(a).toISOString().split("T")[0]}:o);this.setState({social:{...this.state.social,communications:n,people:i}})}updateContactSources(e){this.setState({social:{...this.state.social,contactSources:e}})}addWealthGoal(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({wealthGoals:[...this.state.wealthGoals||[],t]}),t}updateWealthGoal(e,t){this.setState({wealthGoals:this.state.wealthGoals.map(a=>a.id===e?{...a,...t}:a)})}deleteWealthGoal(e){this.setState({wealthGoals:this.state.wealthGoals.filter(t=>t.id!==e)})}reorderWealthGoals(e,t){const a=[...this.state.wealthGoals],n=a.findIndex(o=>o.id===e);if(n===-1)return;const i=t==="up"?n-1:n+1;i<0||i>=a.length||([a[n],a[i]]=[a[i],a[n]],this.setState({wealthGoals:a}))}setInflationRate(e){this.setState({inflationRate:parseFloat(e)})}setProjectionYears(e){this.setState({projectionYears:parseInt(e)})}addTimeActivity(e){const t=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,activities:[...this.state.timeInvest.activities,{...e,id:t}]}})}updateTimeActivity(e,t){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.map(a=>a.id===e?{...a,...t}:a)}})}deleteTimeActivity(e){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.filter(t=>t.id!==e),logs:this.state.timeInvest.logs.filter(t=>t.activityId!==e)}})}addTimeLog(e){const t=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,logs:[...this.state.timeInvest.logs,{...e,id:t}]}})}setPomodoroTime(e){this.setState({timeInvest:{...this.state.timeInvest,pomodoroTime:parseInt(e)}})}addHabit(e){const t={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({habits:[...this.state.habits||[],t]}),t}updateHabit(e,t){this.setState({habits:this.state.habits.map(a=>a.id===e?{...a,...t}:a)})}deleteHabit(e){this.setState({habits:this.state.habits.filter(t=>t.id!==e)})}toggleHabit(e,t){const a={...this.state.habitLogs||{}},n=a[t]||[];n.includes(e)?a[t]=n.filter(i=>i!==e):a[t]=[...n,e],this.setState({habitLogs:a})}reorderHabits(e){this.setState({habits:e})}}const d=new bt,wt=[{id:"health",icon:"heart",label:"Health"},{id:"finance",icon:"wallet",label:"Finance"},{id:"social",icon:"users",label:"Connections"},{id:"habits",icon:"zap",label:"Habits"},{id:"goals",icon:"target",label:"Goals"},{id:"menu",icon:"menu",label:"Menu"}];function ke(s="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,t=wt.map(a=>`
        <div class="nav-item ${a.id===s?"active":""}" data-nav="${a.id}">
            ${m(a.icon,"nav-icon")}
            <span class="nav-label">${a.label}</span>
        </div>
    `).join("");return e+t}function _e(s){const e=document.querySelectorAll(".nav-item");e.forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.nav;e.forEach(n=>n.classList.remove("active")),t.classList.add("active"),s&&s(a)})})}function w(s,e="$"){const t=Math.abs(s);let a=0,n=0;e==="₿"?(a=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(a=0,n=2);const i=new Intl.NumberFormat("en-US",{minimumFractionDigits:a,maximumFractionDigits:n}).format(t);return`${s<0?"-":""}${e}${i}`}function ie(s){return s==null?"0.0%":`${s>=0?"+":""}${s.toFixed(1)}%`}const xt="https://api.coingecko.com/api/v3",b={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},kt=5*60*1e3;let pe={data:null,timestamp:0,currency:"USD"};const Y=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:b.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:b.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:b.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:b.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:b.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:b.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:b.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:b.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:b.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:b.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:b.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:b.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:b.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:b.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:b.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:b.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:b.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:b.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:b.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:b.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:b.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:b.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:b.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:b.CRYPTO_ALTS,icon:"bitcoin"}];async function Je(){const s="usd";if(pe.data&&Date.now()-pe.timestamp<kt)return pe.data;const e=Y.map(a=>a.cgId).filter(Boolean).join(","),t=`${xt}/coins/markets?vs_currency=${s}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const a=await fetch(t),n=a.ok?await a.json():[],i=Y.filter(l=>l.yahooId),o=await Et(i),r=Y.map(l=>{if(l.cgId){const u=n.find(p=>p.id===l.cgId);if(u)return{...l,price:u.current_price,image:u.image,change24h:u.price_change_percentage_24h_in_currency||u.price_change_percentage_24h||0,change7d:u.price_change_percentage_7d_in_currency||0,change30d:u.price_change_percentage_30d_in_currency||0,change1y:u.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&o[l.yahooId]){const u=o[l.yahooId];return{...l,price:u.price,change24h:u.change24h,change7d:u.change7d,change30d:u.change30d,change1y:u.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return pe={data:r,timestamp:Date.now(),currency:"USD"},r}catch(a){return console.error("Market fetch failed",a),Y.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function Et(s){const e={};return await Promise.all(s.map(async t=>{try{const a=`https://query1.finance.yahoo.com/v8/finance/chart/${t.yahooId}?interval=1d&range=2y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(a)}`,o=await(await fetch(n)).json(),r=JSON.parse(o.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],u=l.meta,c=l.indicators.quote[0].close.filter(B=>B!==null&&B>0);if(c.length===0)throw new Error("No valid price data");const h=u.regularMarketPrice||c[c.length-1],g=c.length-1,f=c[Math.max(0,g-1)],y=(h-f)/f*100,k=c[Math.max(0,g-5)],x=(h-k)/k*100,S=c[Math.max(0,g-21)],E=(h-S)/S*100,D=c[Math.max(0,g-252)],C=(h-D)/D*100;e[t.yahooId]={price:h,change24h:isNaN(y)?0:y,change7d:isNaN(x)?0:x,change30d:isNaN(E)?0:E,change1y:isNaN(C)?0:C}}catch(a){console.warn(`Failed to fetch ${t.symbol} from Yahoo`,a),e[t.yahooId]=null}})),e}const St={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let le=null,Q=null;function Ze(s,e){const t=St[e];if(!t){console.error("Unknown category:",e);return}const i=d.getState()[t.storeKey].find(r=>r.id===s);if(!i){console.error("Item not found:",s);return}le=i,Q=e;const o=document.createElement("div");o.className="modal-overlay",o.id="edit-modal",o.innerHTML=Lt(i,t),document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("active")}),At(t)}const $t=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],It={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function Lt(s,e){const t=Q==="investment"||Q==="passive",a=It[Q]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
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
        <label class="form-label">${Q==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${s.amount||0}" inputmode="numeric">
      </div>
    `),`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">Editar ${e.label}</h2>
        <button class="modal-close" id="edit-modal-close">
          ${m("x")}
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
                      ${$t.map(i=>`<option value="${i.value}" ${i.value===s.currency?"selected":""}>${i.label}</option>`).join("")}
                  </optgroup>
                  ${t?`
                  <optgroup label="Mercados Reales">
                      ${Y.map(i=>`<option value="${i.symbol}" ${i.symbol===s.currency?"selected":""}>${i.name} (${i.symbol})</option>`).join("")}
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
          ${m("trash")}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `}function At(s){const e=document.getElementById("edit-modal"),t=document.getElementById("edit-modal-close"),a=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",i=>{i.target===e&&ve()}),t.addEventListener("click",ve),a.addEventListener("click",()=>Ct(s)),n.addEventListener("click",()=>Tt(s))}function Ct(s){var u,p,c,h,g,f,y,k,x;const e=(p=(u=document.getElementById("edit-name"))==null?void 0:u.value)==null?void 0:p.trim(),t=(c=document.getElementById("edit-type"))==null?void 0:c.value,a=(h=document.getElementById("edit-currency"))==null?void 0:h.value,n=(f=(g=document.getElementById("edit-details"))==null?void 0:g.value)==null?void 0:f.trim(),i=parseFloat((y=document.getElementById("edit-value"))==null?void 0:y.value)||0,o=parseFloat((k=document.getElementById("edit-amount"))==null?void 0:k.value)||0,r=parseFloat((x=document.getElementById("edit-monthly"))==null?void 0:x.value)||0;if(!e){v.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:t,currency:a,details:n};s.fields.includes("value")&&(l.value=i),s.fields.includes("amount")&&(l.amount=o),s.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),s.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),d[s.updateMethod](le.id,l),ve()}function Tt(s){v.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${le.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(d[s.deleteMethod](le.id),v.toast("Eliminado correctamente","info"),ve())})}function ve(){const s=document.getElementById("edit-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300)),le=null,Q=null}let ee=!1,te=!1,$={key:"price",direction:"desc"},ae="USD",N=null;function Dt(){const s=d.getState(),e=s.lastMarketData||[],t=s.marketFavorites||[];N===null&&(N=t.length>0?"favorites":"all"),!te&&!ee&&_t();const a=ae==="EUR"?"€":"$";let n=e;N==="favorites"&&(n=e.filter(o=>t.includes(o.id)));const i=Object.values(b);return`
        <div class="market-view animate-fade-in" style="padding: 4px;">
            <!-- Single Line Header Controls -->
            <div class="market-controls-row">
                <div class="market-group">
                    <button class="filter-chip ${N==="all"?"active":""}" id="filter-all">
                        Todos
                    </button>
                    <button class="filter-chip ${N==="favorites"?"active":""}" id="filter-favs">
                        ${m("star","tiny-icon")} Favoritos
                    </button>
                </div>

                <div class="market-status-badge ${ee?"market-status-fresh":"market-status-cached"}" title="Tasa de refresco: 5 min">
                    ${te?'<div class="loading-spinner-sm" style="width:10px; height:10px;"></div>':m(ee?"check":"save","tiny-icon")}
                    <span>${te?"Updating":ee?"Live":"Cached"}</span>
                </div>

                <div class="capsule-toggle">
                    <button class="capsule-btn ${ae==="USD"?"active":""}" data-curr="USD">USD</button>
                    <button class="capsule-btn ${ae==="EUR"?"active":""}" data-curr="EUR">EUR</button>
                </div>
            </div>

            <!-- Content -->
            ${n.length===0&&N==="favorites"?Rt():""}
            ${n.length===0&&N==="all"?Pt():""}
            
            ${i.map(o=>{const r=n.filter(l=>l.category===o);return r.length===0?"":Mt(o,r,a,t)}).join("")}
        </div>
    `}function Mt(s,e,t,a){const n=[...e].sort((i,o)=>{let r=i[$.key],l=o[$.key];return typeof r=="string"&&(r=r.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),r<l?$.direction==="asc"?-1:1:r>l?$.direction==="asc"?1:-1:0});return`
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
                                <th data-sort="name" class="sortable ${$.key==="name"?$.direction:""}">Nombre</th>
                                <th data-sort="price" class="sortable text-right ${$.key==="price"?$.direction:""}">Precio</th>
                                <th data-sort="change24h" class="sortable text-right ${$.key==="change24h"?$.direction:""}">24h</th>
                                <th data-sort="change30d" class="sortable text-right ${$.key==="change30d"?$.direction:""}">30d</th>
                                <th data-sort="change1y" class="sortable text-right ${$.key==="change1y"?$.direction:""}">1y</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${n.map(i=>Bt(i,t,a.includes(i.id))).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}function Bt(s,e,t){let a=s.price;if(s.price!==null&&ae==="EUR"){const r=d.getState().rates.USD||.92;a=s.price*r}const n=xe(s.change24h),i=xe(s.change30d),o=xe(s.change1y);return`
        <tr class="market-row" data-id="${s.id}">
            <td style="padding: 0 0 0 12px; width: 44px;">
                <button class="btn-favorite ${t?"active":""}" data-id="${s.id}">
                    ${m("star")}
                </button>
            </td>
            <td>
                <div class="asset-cell">
                     ${s.image?`<img src="${s.image}" alt="${s.symbol}" style="width: 22px; height: 22px; border-radius: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`:`<div class="asset-icon-tiny" style="background: rgba(255,255,255,0.05); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${m(s.icon||"trendingUp")}</div>`}
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <span class="asset-symbol" style="line-height: 1.2;">${s.symbol.toUpperCase()}</span>
                        <span class="asset-name-tiny">${s.name}</span>
                    </div>
                </div>
            </td>
            <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${a!==null?w(a,e):"-"}</td>
            <td class="text-right font-mono ${n}" style="font-weight: 700;">
                ${s.change24h!==null?ie(s.change24h):"-"}
            </td>
            <td class="text-right font-mono ${i}" style="font-size: 11px; opacity: 0.9;">
                ${s.change30d!==null?ie(s.change30d):"-"}
            </td>
            <td class="text-right font-mono ${o}" style="font-size: 11px; opacity: 0.9;">
                ${s.change1y!==null?ie(s.change1y):"-"}
            </td>
        </tr>
    `}function xe(s){return s==null?"":ee?s>=0?"text-positive":"text-negative":"text-accent-primary"}function Rt(){return`
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
    `}async function _t(){var s,e;if(!te){te=!0,(s=window.reRender)==null||s.call(window);try{const t=await Je();d.saveMarketData(t),ee=!0}catch(t){console.error("Market update failed",t)}finally{te=!1,(e=window.reRender)==null||e.call(window)}}}function jt(){var s,e,t;document.querySelectorAll(".capsule-btn").forEach(a=>{a.addEventListener("click",()=>{var i;const n=a.dataset.curr;n!==ae&&(ae=n,(i=window.reRender)==null||i.call(window))})}),(s=document.getElementById("filter-all"))==null||s.addEventListener("click",()=>{var a;N="all",(a=window.reRender)==null||a.call(window)}),(e=document.getElementById("filter-favs"))==null||e.addEventListener("click",()=>{var a;N="favorites",(a=window.reRender)==null||a.call(window)}),(t=document.getElementById("btn-show-all"))==null||t.addEventListener("click",()=>{var a;N="all",(a=window.reRender)==null||a.call(window)}),document.querySelectorAll(".btn-favorite").forEach(a=>{a.addEventListener("click",n=>{var o;n.stopPropagation();const i=a.dataset.id;d.toggleMarketFavorite(i),(o=window.reRender)==null||o.call(window)})}),document.querySelectorAll(".market-table th.sortable").forEach(a=>{a.addEventListener("click",()=>{var i;const n=a.dataset.sort;$.key===n?$.direction=$.direction==="asc"?"desc":"asc":($.key=n,$.direction="desc",n==="name"&&($.direction="asc")),(i=window.reRender)==null||i.call(window)})})}function Ut(){const s=d.getState(),{wealthGoals:e=[],inflationRate:t=3,projectionYears:a=10,currencySymbol:n}=s,i=d.getAllExpenses();let o=0;e.forEach(c=>{const h=c.cost*(c.dividendYield/100)/12;o+=d.convertValue(h,c.currency||s.currency)});const r=o-i,l=i*Math.pow(1+t/100,a);let u=0;e.forEach(c=>{const g=c.cost*Math.pow(1+c.annualGrowth/100,a)*(c.dividendYield/100)/12;u+=d.convertValue(g,c.currency||s.currency)});const p=u-l;return`
    <div class="wealth-goals-view animate-fade-in">
        <!-- Projections Summary Card -->
        <div class="card projection-summary-card">
            <div class="card-header">
                <span class="card-title">Proyección de Libertad Financiera</span>
                ${m("trendingUp","card-icon")}
            </div>
            
            <div class="projection-grid">
                <div class="projection-col">
                    <div class="projection-label">Estado Actual</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos</span>
                        <span class="stat-value positive">${w(o,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Totales</span>
                        <span class="stat-value negative">${w(i,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto</span>
                        <span class="stat-value ${r>=0?"positive":"negative"}">${w(r,n)}</span>
                    </div>
                </div>

                <div class="projection-divider-vertical"></div>

                <div class="projection-col">
                    <div class="projection-label">En <span id="years-val-title">${a}</span> años (<span id="inflation-val-title">${t}</span>% inf.)</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos Est.</span>
                        <span class="stat-value positive" id="future-passive-val">${w(u,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Est.</span>
                        <span class="stat-value negative" id="future-expenses-val">${w(l,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto Proyectado</span>
                        <span class="stat-value ${p>=0?"positive":"negative"}" id="future-net-val">${w(p,n)}</span>
                    </div>
                </div>
            </div>
            
            <div class="projection-settings-row">
                <div class="setting-item">
                    <label>Años proyectados: <span id="years-val">${a}</span></label>
                    <input type="range" id="years-slider" min="1" max="50" step="1" value="${a}">
                </div>
                <div class="setting-item">
                    <label>Inflación anual: <span id="inflation-val">${t}</span>%</label>
                    <input type="range" id="inflation-slider" min="0" max="20" step="0.5" value="${t}">
                </div>
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Objetivos Patrimoniales</span>
            <button class="btn-add-goal-inline btn-large-inline" id="btn-add-wealth-goal">
                ${m("plus")} Agregar
            </button>
        </div>

        <div class="wealth-goals-list">
            ${e.length===0?`
                <div class="empty-state">
                    ${m("target","empty-icon")}
                    <p>No tienes objetivos guardados aún.</p>
                </div>
            `:e.map(c=>Ot(c,s)).join("")}
        </div>
    </div>
    `}function Ot(s,e){const t=e.currencySymbol,a=s.cost*(s.dividendYield/100)/12,n=d.convertValue(a,s.currency||e.currency);return`
    <div class="card wealth-goal-card" data-id="${s.id}">
        <div class="goal-card-main">
            <div class="goal-card-info">
                <div class="goal-name">${s.name}</div>
                <div class="goal-cost">${w(s.cost,s.currency||e.currency)} cost</div>
            </div>
            <div class="goal-card-yield">
                <div class="yield-value stat-value positive">+${w(n,t)}/mes</div>
                <div class="yield-pct">${s.dividendYield}% div.</div>
            </div>
        </div>
        <div class="goal-card-details">
            <div class="detail-item">
                <span class="detail-label">Crecimiento Anual:</span>
                <span class="detail-value">${s.annualGrowth}%</span>
            </div>
            <div class="goal-actions">
                <div class="goal-reorder-actions">
                    <button class="icon-btn reorder-wealth-goal" data-id="${s.id}" data-dir="up">${m("chevronUp")}</button>
                    <button class="icon-btn reorder-wealth-goal" data-id="${s.id}" data-dir="down">${m("chevronDown")}</button>
                </div>
                <div style="flex: 1;"></div>
                <button class="icon-btn edit-wealth-goal" data-id="${s.id}">${m("edit")}</button>
                <button class="icon-btn delete-wealth-goal" data-id="${s.id}">${m("trash")}</button>
            </div>
        </div>
    </div>
    `}function Nt(){var a;(a=document.getElementById("btn-add-wealth-goal"))==null||a.addEventListener("click",async()=>{je()}),document.querySelectorAll(".edit-wealth-goal").forEach(n=>{n.addEventListener("click",i=>{i.stopPropagation();const o=n.dataset.id,r=d.getState().wealthGoals.find(l=>l.id===o);r&&je(r)})}),document.querySelectorAll(".delete-wealth-goal").forEach(n=>{n.addEventListener("click",async i=>{var l;i.stopPropagation();const o=n.dataset.id;await v.confirm("Eliminar objetivo","¿Estás seguro de que deseas eliminar este objetivo?")&&(d.deleteWealthGoal(o),(l=window.reRender)==null||l.call(window))})}),document.querySelectorAll(".reorder-wealth-goal").forEach(n=>{n.addEventListener("click",i=>{var l;i.stopPropagation();const o=n.dataset.id,r=n.dataset.dir;d.reorderWealthGoals(o,r),(l=window.reRender)==null||l.call(window)})});const s=document.getElementById("inflation-slider"),e=document.getElementById("years-slider"),t=()=>{const n=parseFloat(e.value),i=parseFloat(s.value),o=document.getElementById("years-val"),r=document.getElementById("inflation-val"),l=document.getElementById("years-val-title"),u=document.getElementById("inflation-val-title");o&&(o.textContent=n),l&&(l.textContent=n),r&&(r.textContent=i),u&&(u.textContent=i);const p=d.getState(),h=d.getAllExpenses()*Math.pow(1+i/100,n);let g=0;p.wealthGoals.forEach(E=>{const C=E.cost*Math.pow(1+E.annualGrowth/100,n)*(E.dividendYield/100)/12;g+=d.convertValue(C,E.currency||p.currency)});const f=g-h,y=p.currencySymbol,k=document.getElementById("future-passive-val"),x=document.getElementById("future-expenses-val"),S=document.getElementById("future-net-val");k&&(k.textContent=w(g,y)),x&&(x.textContent=w(h,y)),S&&(S.textContent=w(f,y),S.className=`stat-value ${f>=0?"positive":"negative"}`)};s&&(s.addEventListener("input",t),s.addEventListener("change",n=>{d.setInflationRate(n.target.value)})),e&&(e.addEventListener("input",t),e.addEventListener("change",n=>{d.setProjectionYears(n.target.value)}))}async function je(s=null){const e=!!s,t=e?"Editar Objetivo":"Nuevo Objetivo Patrimonial",a=document.createElement("div");a.className="modal-overlay active overlay-centered",a.innerHTML=`
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${t}</h3>
                <button class="close-modal-btn">${m("x")}</button>
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
    `,document.body.appendChild(a);const n=a.querySelector(".close-modal-btn"),i=a.querySelector("#save-goal-btn"),o=()=>{a.classList.remove("active"),setTimeout(()=>a.remove(),300)};n.addEventListener("click",o),a.addEventListener("click",r=>{r.target===a&&o()}),i.addEventListener("click",()=>{var g;const r=a.querySelector("#goal-name").value,l=parseFloat(a.querySelector("#goal-cost").value),u=parseFloat(a.querySelector("#goal-growth").value)||0,p=parseFloat(a.querySelector("#goal-dividend").value)||0,c=a.querySelector("#goal-currency").value;if(!r||isNaN(l)){v.toast("Completa nombre y coste","error");return}const h={name:r,cost:l,annualGrowth:u,dividendYield:p,currency:c};e?(d.updateWealthGoal(s.id,h),v.toast("Objetivo actualizado")):(d.addWealthGoal(h),v.toast("Objetivo creado")),o(),(g=window.reRender)==null||g.call(window)})}let j="summary";function Ue(){const s=d.getState(),e=s.currencySymbol;return setTimeout(j==="markets"||j==="goals"?R:G,0),`
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="margin-bottom: var(--spacing-md);">
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <!-- Finance Tabs (Segmented Control) -->
      <div class="segmented-control">
        <button class="segment-btn ${j==="summary"?"active":""}" id="tab-summary">
            Summary
        </button>
        <button class="segment-btn ${j==="goals"?"active":""}" id="tab-goals">
            Goals
        </button>
        <button class="segment-btn ${j==="markets"?"active":""}" id="tab-markets">
            Markets
        </button>
      </div>
      
      ${j==="summary"?Gt(s,e):j==="goals"?Ut():Dt()}
      
    </div>
  `}function Gt(s,e){const t=d.getPassiveIncome(),a=d.getLivingExpenses(),n=d.getNetPassiveIncome(),i=d.getInvestmentAssetsValue(),o=d.getTotalLiabilities(),r=d.getNetWorth(),l=d.getAllIncomes(),u=d.getAllExpenses(),p=d.getNetIncome();return`
      <div class="finance-top-grid animate-fade-in">
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${n<0?"highlight-card-negative":""}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${m("piggyBank","card-icon")}
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
            ${m("zap","card-icon")}
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot income"></span>
              Ingresos Pasivos
            </span>
            <span class="stat-value positive">${w(t,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${w(a,e)}</span>
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
            <div class="summary-value text-primary-accent">${w(i,e)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${w(o,e)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${m("scale","card-icon")}
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
          <span class="stat-value negative">${w(u,e)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${p>=0?"positive":"negative"}" style="font-size: 20px;">
            ${w(p,e)}
          </span>
        </div>
      </div>
      
      <div class="finance-links-grid">
        <button class="compound-link-btn" id="open-expenses" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%); border-color: rgba(239, 68, 68, 0.3);">
          <div class="compound-link-content">
            <div class="compound-link-icon" style="background: rgba(239,68,68,0.2); color: var(--accent-danger);">
              ${m("creditCard")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Ver Gastos Mensuales</div>
              <div class="compound-link-subtitle">Detalle de salidas y deudas</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${m("chevronRight")}
          </div>
        </button>

        <!-- COMPOUND INTEREST CALCULATOR LINK -->
        <button class="compound-link-btn" id="open-compound">
          <div class="compound-link-content">
            <div class="compound-link-icon">
              ${m("calculator")}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Calculadora de Interés Compuesto</div>
              <div class="compound-link-subtitle">Proyecta el crecimiento de tu patrimonio</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${m("chevronRight")}
          </div>
        </button>
      </div>

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${Ft(s)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${Ht(s)}

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
                        ${m("chevronDown","tiny-icon")}
                    </div>
                </div>
            </div>
        </div>
      </div>
  `}function Ft(s){const e=[...s.passiveAssets,...s.investmentAssets],t=s.liabilities;if(e.length===0)return"";const a={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(p=>{const c=d.convertValue(p.value||0,p.currency||"EUR");p.currency==="BTC"?a.Bitcoin.value+=c:p.currency==="ETH"||p.currency==="XRP"||p.type==="crypto"?a.Altcoins.value+=c:p.type==="property"||p.type==="rental"?a.Inmuebles.value+=c:p.type==="stocks"||p.type==="etf"||p.currency==="SP500"?a.Bolsa.value+=c:p.currency==="GOLD"?a.Oro.value+=c:a["Otros/Efe."].value+=c});const n=t.filter(p=>p.type==="mortgage").reduce((p,c)=>p+d.convertValue(c.amount||0,c.currency||"EUR"),0);a.Inmuebles.value=Math.max(0,a.Inmuebles.value-n),s.hideRealEstate&&(a.Inmuebles.value=0);const i=Object.entries(a).filter(([p,c])=>c.value>0).sort((p,c)=>c[1].value-p[1].value),o=i.reduce((p,[c,h])=>p+h.value,0);if(o===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${s.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=i.map(([p,c])=>{const h=c.value/o*100,g=r;return r+=h,{name:p,percentage:h,color:c.color,start:g}}),u=l.map(p=>`${p.color} ${p.start}% ${p.start+p.percentage}%`).join(", ");return`
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
            <div class="pie-total">${w(o,s.currencySymbol)}</div>
            <div class="pie-total-label">Total Neto</div>
          </div>
        </div>
        <div class="allocation-legend">
          ${l.map(p=>`
            <div class="legend-item">
              <div class="legend-color" style="background: ${p.color};"></div>
              <div class="legend-info">
                <span class="legend-name">${p.name}</span>
                <span class="legend-pct">${p.percentage.toFixed(1)}%</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function Ht(s){const e=[...(s.activeIncomes||[]).map(a=>({...a,category:"activeIncome"})),...s.passiveAssets.map(a=>({...a,category:"passive"})),...s.investmentAssets.map(a=>({...a,category:"investment"})),...s.liabilities.map(a=>({...a,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${m("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const t=s.currencySymbol;return`
    <div class="asset-list">
      ${e.map(a=>{const n=qt(a.currency||a.type),i=zt(a.currency||a.type),o=a.category==="liability",r=a.value||a.amount||0,l=d.convertValue(r,a.currency||"EUR");let u="";if(a.currency!==s.currency){const c={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[a.currency]||a.currency;u=`<div class="asset-original-value">${r} ${c}</div>`}return`
          <div class="asset-item" data-id="${a.id}" data-category="${a.category}">
            <div class="asset-icon-wrapper ${n}">
              ${m(i,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${a.name}</div>
              <div class="asset-details">${a.details||a.type||""}</div>
              ${u}
            </div>
            <div>
              <div class="asset-value ${o?"text-warning":""}">
                ${a.category==="activeIncome"?"+":o?"-":""}${w(l,t)}
                ${a.category==="activeIncome"?'<span style="font-size: 10px; opacity: 0.7; font-weight: 400;">/mes</span>':""}
              </div>
              ${a.monthlyIncome?`<div class="asset-yield">+${w(d.convertValue(a.monthlyIncome,a.currency),t)}/mes</div>`:""}
              ${a.monthlyPayment?`<div class="asset-yield text-negative">-${w(d.convertValue(a.monthlyPayment,a.currency),t)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function qt(s){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt",salary:"cash",freelance:"cash",business:"property"}[s]||"cash"}function zt(s){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard",salary:"briefcase",freelance:"users",business:"building"}[s]||"dollarSign"}function Oe(){const s=document.getElementById("tab-summary"),e=document.getElementById("tab-markets"),t=document.getElementById("tab-goals");if(s&&e&&t&&(s.addEventListener("click",()=>{var o;j="summary",(o=window.reRender)==null||o.call(window)}),e.addEventListener("click",()=>{var o;j="markets",(o=window.reRender)==null||o.call(window)}),t.addEventListener("click",()=>{var o;j="goals",(o=window.reRender)==null||o.call(window)})),j==="markets"){jt();return}if(j==="goals"){Nt();return}document.querySelectorAll(".asset-item").forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.id,l=o.dataset.category;Ze(r,l)})});const n=document.getElementById("toggle-real-estate");n&&n.addEventListener("change",()=>{d.toggleRealEstate()});const i=document.getElementById("display-currency-select");i&&i.addEventListener("change",o=>{d.setCurrency(o.target.value)})}let q=10,K=7,X=null,J=null;function Vt(){const e=d.getState().currencySymbol,t=d.getNetWorth(),n=d.getNetIncome()*12,i=X!==null?X:t,o=J!==null?J:n,r=Qe(i,o,K,q);return`
    <div class="compound-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
          <button class="back-btn" id="back-to-finance">
            ${m("chevronLeft")}
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
          ${m("settings","card-icon")}
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Capital Inicial</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="principal-input" 
                   value="${i}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-principal" title="Usar Patrimonio Neto">
              ${m("home")}
            </button>
          </div>
          <div class="compound-input-hint">Patrimonio actual: ${w(t,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Aporte Anual</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${e}</span>
            <input type="number" class="compound-number-input" id="contribution-input" 
                   value="${o}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-contribution" title="Usar Ingreso Neto × 12">
              ${m("zap")}
            </button>
          </div>
          <div class="compound-input-hint">Ingreso neto anual: ${w(n,e)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${K}" step="0.5">
            <span class="slider-value" id="rate-value">${K}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${q}">
            <span class="slider-value" id="years-value">${q} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${q} años</span>
          ${m("trendingUp","card-icon")}
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
          ${m("coins","card-icon")}
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot asset"></span>
            Capital Inicial
          </span>
          <span class="stat-value neutral" id="initial-capital">${w(i,e)}</span>
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
        ${et(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${tt(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function Qe(s,e,t,a){const n=t/100,i=[];let o=s,r=0,l=0;for(let u=1;u<=a;u++){const p=o,c=o*n;o+=c+e,r+=e,l+=c,i.push({year:u,startBalance:p,contribution:e,interest:c,endBalance:o,totalContributions:r,totalInterest:l})}return{finalValue:o,totalContributions:r,totalInterest:l,totalGrowth:o-s,growthMultiple:s>0?o/s:0,yearlyBreakdown:i}}function et(s,e){if(s.length===0)return"";const t=Math.max(...s.map(n=>Math.abs(n.endBalance))),a=s.map((n,i)=>{const o=i/(s.length-1)*100,r=100-n.endBalance/t*100;return`${o},${r}`});return`
    <div class="line-chart-container" style="height: 200px; width: 100%; position: relative; margin-top: 20px;">
      <svg viewBox="0 0 100 100" class="projection-line-chart" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
        <!-- Grid horizontal lines -->
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        
        <!-- Area under curve -->
        <path d="M0,100 L${a.join(" L")} L100,100 Z" fill="url(#chart-gradient)" opacity="0.2" />
        
        <!-- Main line -->
        <path d="M${a.join(" L")}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        
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
  `}function tt(s,e){const t=[];for(let a=0;a<s.length;a++){const n=s[a];(a<5||(a+1)%5===0||a===s.length-1)&&t.push(n)}return`
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
              <td class="${a.endBalance>=0?"positive":"negative"}">${w(a.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${w(a.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Yt(s){const e=document.getElementById("back-to-finance"),t=document.getElementById("rate-slider"),a=document.getElementById("years-slider"),n=document.getElementById("principal-input"),i=document.getElementById("contribution-input"),o=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",s),n&&n.addEventListener("input",l=>{X=parseFloat(l.target.value)||0,Z()}),i&&i.addEventListener("input",l=>{J=parseFloat(l.target.value)||0,Z()}),o&&o.addEventListener("click",()=>{X=null;const l=d.getNetWorth();n.value=l,Z()}),r&&r.addEventListener("click",()=>{J=null;const l=d.getNetIncome()*12;i.value=l,Z()}),t&&t.addEventListener("input",l=>{K=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${K}%`,Z()}),a&&a.addEventListener("input",l=>{q=parseInt(l.target.value),document.getElementById("years-value").textContent=`${q} años`,Z()})}function Z(){const e=d.getState().currencySymbol,t=X!==null?X:d.getNetWorth(),a=J!==null?J:d.getNetIncome()*12,n=Qe(t,a,K,q),i=document.getElementById("future-value"),o=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),u=document.getElementById("total-contributed"),p=document.getElementById("total-interest"),c=document.getElementById("final-value-breakdown"),h=document.getElementById("projection-chart"),g=document.getElementById("projection-table");i&&(i.textContent=w(n.finalValue,e)),o&&(o.textContent=`Valor Futuro en ${q} años`),r&&(r.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=w(t,e)),u&&(u.textContent=w(n.totalContributions,e),u.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),p&&(p.textContent=w(n.totalInterest,e)),c&&(c.textContent=w(n.finalValue,e)),h&&(h.innerHTML=et(n.yearlyBreakdown)),g&&(g.innerHTML=tt(n.yearlyBreakdown,e))}function Kt(){q=10,K=7,X=null,J=null}let oe=d.getState().lastMarketData||[],re=!1,A={key:"price",direction:"desc"},at="";function Wt(){const s=d.getState(),e=s.currency||"EUR",t=s.currencySymbol||"€";if((oe.length===0||at!==e)&&(re||st(),oe.length===0))return`
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
            `;const a=Object.values(b);return`
        <div class="market-page stagger-children" style="padding-bottom: 80px;">
            <header class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <button class="back-btn" id="market-back">
                            ${m("chevronLeft")}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${re?`
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

            ${a.map(n=>{const i=oe.filter(o=>o.category===n);return i.length===0?"":Xt(n,i,t)}).join("")}
        </div>
    `}function Xt(s,e,t){const a=[...e].sort((n,i)=>{let o=n[A.key],r=i[A.key];return typeof o=="string"&&(o=o.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),o<r?A.direction==="asc"?-1:1:o>r?A.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${s}
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
                            ${a.map(n=>`
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${n.image?`<img src="${n.image}" alt="${n.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`:`<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${m(n.icon||"dollarSign")}
                                                </div>`}
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${n.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${n.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?w(n.price,t):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?ie(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?ie(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function st(){const e=d.getState().currency||"EUR";re||(re=!0,at=e,oe=await Je(),d.saveMarketData(oe),re=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function Jt(s){const e=document.getElementById("market-back");e&&e.addEventListener("click",s),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.sort;A.key===i?A.direction=A.direction==="asc"?"desc":"asc":(A.key=i,A.direction="desc",i==="name"&&(A.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.curr;d.setCurrency(i),st()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class Ne{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const t=this.getApiKey();if(!t)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],i=e.type,o=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o},{inline_data:{mime_type:i,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const c=await l.json();throw new Error(((r=c.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const p=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(p)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((t,a)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>t(n.result),n.onerror=i=>a(i)})}}let se=localStorage.getItem("life-dashboard/health_current_tab")||"diet";function Zt(){const s=d.getState(),{health:e}=s;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Health & Fitness</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${se==="diet"?"active":""}" data-tab="diet">
            ${m("apple")} Dieta
        </button>
        <button class="health-tab-btn ${se==="exercise"?"active":""}" data-tab="exercise">
            ${m("zap")} Ejercicio
        </button>
      </div>

      <div id="health-tab-content">
        ${se==="diet"?ea(e):Qt(e)}
      </div>

    </div>
    `}function Qt(s){return`
      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${s.routines.map((e,t)=>`
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${m("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${t}" data-dir="up">${m("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${t}" data-dir="down">${m("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${m("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${t}" data-name="${e.name}">
                    ${m("moreVertical")}
                </button>
            </header>

            <div class="exercise-list-health">
                ${e.exercises.map((a,n)=>{const i=d.getExerciseStatus(e.id,n),o=`var(--accent-${i.color})`,r=i.status==="done_today";return`
                    <div class="exercise-item-health ${r?"exercise-done":""}">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot-wear" style="background-color: ${o}; box-shadow: 0 0 10px ${o};"></div>
                            <div class="ex-health-info">
                                <div class="ex-health-name-row">
                                    <span class="ex-health-name clickable rename-exercise" data-routine="${e.id}" data-index="${n}" data-current="${a.name}">${a.name}</span>
                                    <div class="ex-reorder-btns desktop-only">
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="up">${m("chevronUp")}</button>
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="down">${m("chevronDown")}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${e.id}" data-index="${n}">${a.weight||50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${e.id}" data-index="${n}">${a.reps||10} reps</span>
                                    ${i.lastLog?`
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${aa(i.lastLog.rating)}</span>
                                    `:""}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            ${r?`
                                <div class="exercise-done-badge-solid">
                                    ${m("check","done-icon-solid")}
                                </div>
                            `:`
                                <button class="btn btn-secondary btn-icon-only log-stars-btn" data-rid="${e.id}" data-idx="${n}" title="Marcar como hecho">
                                    <span style="font-size: 20px;">🏋️‍♂️</span>
                                </button>
                            `}
                            <button class="icon-btn mobile-only ex-more-btn" data-routine="${e.id}" data-index="${n}" data-name="${a.name}">
                                ${m("moreVertical")}
                            </button>
                            <button class="ex-delete-mini desktop-only" data-routine="${e.id}" data-index="${n}" title="Eliminar">${m("trash")}</button>
                        </div>
                    </div>
                    `}).join("")}
            </div>
            <div class="add-ex-row" style="margin-top: var(--spacing-md);">
                <button class="btn btn-secondary add-ex-btn w-full" data-id="${e.id}">
                    ${m("plus")} Agregar Ejercicio
                </button>
            </div>
          </div>
        `).join("")}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-success add-routine-btn w-full" id="add-routine-btn">
                ${m("plus")} Nueva Rutina
            </button>
        </div>
      </div>
    `}function ea(s){const e=s.weightLogs.length>0?s.weightLogs[s.weightLogs.length-1].weight:"--",t=s.fatLogs.length>0?s.fatLogs[s.fatLogs.length-1].fat:null;let a="rgba(255,255,255,0.1)",n="linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)",i="var(--text-primary)",o="Sin datos";return t!==null&&(t<12?(a="var(--accent-success)",n="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",i="var(--accent-success)",o="Excelente (Atlético)"):t<=18?(a="var(--accent-tertiary)",n="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)",i="var(--accent-tertiary)",o="Bueno (Fitness)"):(a="var(--accent-danger)",n="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",i="var(--accent-danger)",o="Atención (Reducción)")),`
      <!-- BODY HIGHLIGHT METRIC (UNIFIED & DYNAMIC) -->
      <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: ${n}; border-color: ${a}; padding: 24px !important; transition: all 0.3s ease;">
          <div class="card-header" style="margin-bottom: 20px;">
              <span class="card-title" style="color: ${i};">Resumen Físico Actual</span>
              <div style="color: ${a}">${m("activity","card-icon")}</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
              <!-- WEIGHT SIDE -->
              <div class="clickable" id="log-weight-btn" style="text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">
                  <div class="highlight-value" style="color: ${i} !important; background: none !important; -webkit-text-fill-color: initial !important; font-size: 32px; margin: 0; line-height: 1;">${e} <span style="font-size: 14px; opacity: 0.6;">kg</span></div>
                  <div class="highlight-label" style="opacity: 0.8; margin-top: 8px; color: ${i};">Peso Actual</div>
              </div>

              <!-- FAT SIDE -->
              <div class="clickable" id="log-fat-btn" style="text-align: center;">
                  <div class="highlight-value" style="color: ${i} !important; background: none !important; -webkit-text-fill-color: initial !important; font-size: 32px; margin: 0; line-height: 1;">${t!==null?t+"%":"--"}</div>
                  <div class="highlight-label" style="color: ${i}; opacity: 0.9; margin-top: 8px;">${o}</div>
              </div>
          </div>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-xl);">
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${s.weightGoal} kg</div>
          <div class="summary-label">Peso Objetivo</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-date-btn">
          <div class="summary-value" style="font-size: 16px;">${s.weightGoalDate?new Date(s.weightGoalDate).toLocaleDateString():"--"}</div>
          <div class="summary-label">Fecha Límite</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${s.fatGoal}%</div>
          <div class="summary-label">Meta Grasa</div>
        </div>
      </div>

      <!-- TEARDOWN CHART -->
      ${ta(s)}

      <div class="card ai-calorie-card" id="ai-scan-photo" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 20px !important; margin-bottom: var(--spacing-2xl); cursor: pointer; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);">
          <div style="display: flex; align-items: center; gap: 15px;">
              <div style="background: var(--accent-primary); color: white; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                ${m("camera")}
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${sa(s)} kcal</div>
                <div style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Consumidas hoy</div>
              </div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 10px; font-size: 13px; font-weight: 700; color: var(--accent-primary);">
            Escanear Comida
          </div>
      </div>
    `}function ta(s){const e=[...s.weightLogs||[]].sort((O,fe)=>O.date-fe.date);if(e.length<1||!s.weightGoalDate)return`
            <div class="card chart-card">
                <div class="card-header">
                    <span class="card-title">Trayectoria de Peso</span>
                    ${m("trendingDown")}
                </div>
                <div class="empty-state" style="padding: var(--spacing-xl); text-align: center; opacity: 0.6;">
                    <p>Registra tu peso y establece una <br><strong>Fecha Objetivo</strong> para ver el gráfico.</p>
                </div>
            </div>
        `;const t=e[0],a=e[e.length-1],n=t.date,i=new Date(s.weightGoalDate).getTime(),o=Date.now(),l=Math.max(i,o)-n,u=e.map(O=>O.weight),p=Math.min(...u,s.weightGoal)-2,h=Math.max(...u,t.weight)+2-p,g=300,f=150,y=O=>(O-n)/l*g,k=O=>f-(O-p)/h*f,x=y(i),S=k(s.weightGoal),E=y(n),D=k(t.weight),C=e.map((O,fe)=>`${fe===0?"M":"L"} ${y(O.date)} ${k(O.weight)}`).join(" "),B=y(o),z=i-n,V=o-n,ct=Math.min(1,V/z),dt=t.weight-(t.weight-s.weightGoal)*ct,ye=a.weight-dt,Te=s.weightGoal<t.weight?ye<0:ye>0,De=z/(1e3*60*60*24*7),ut=De>0?(t.weight-s.weightGoal)/De:0;return`
    <div class="card chart-card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header">
            <span class="card-title">Trayectoria de Peso</span>
            <span class="badge ${Te?"badge-success":"badge-danger"}" style="font-size: 10px;">
                ${Te?"Vas bien":"Por debajo del ritmo"} (${Math.abs(ye).toFixed(1)}kg)
            </span>
        </div>
        
        <div class="teardown-chart-container" style="height: ${f}px; width: 100%; margin-top: 20px; position: relative;">
            <svg viewBox="0 0 ${g} ${f}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
                <!-- Grid -->
                <line x1="0" y1="${k(s.weightGoal)}" x2="${g}" y2="${k(s.weightGoal)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
                
                <!-- Target Line (Ideal) -->
                <line x1="${E}" y1="${D}" x2="${x}" y2="${S}" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5" />
                
                <!-- Real Progress -->
                <path d="${C}" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Markers -->
                <circle cx="${x}" cy="${S}" r="4" fill="var(--accent-primary)" />
                <circle cx="${y(a.date)}" cy="${k(a.weight)}" r="4" fill="var(--accent-primary)" />
                
                <!-- Today Marker -->
                <line x1="${B}" y1="0" x2="${B}" y2="${f}" stroke="var(--accent-tertiary)" stroke-width="1" opacity="0.5" />
            </svg>
        </div>
        
        <div class="chart-legend" style="margin-top: 15px; display: flex; flex-direction: column; gap: 4px; font-size: 10px; color: var(--text-muted);">
            <div style="display: flex; justify-content: space-between;">
                <span>Inicio: ${t.weight}kg</span>
                <span>Objetivo: ${s.weightGoal}kg (${new Date(s.weightGoalDate).toLocaleDateString()})</span>
            </div>
            <div style="display: flex; justify-content: center; font-weight: 600; color: var(--text-secondary); margin-top: 4px;">
                <span>Ritmo requerido: ${ut.toFixed(2)} kg / semana</span>
            </div>
        </div>
    </div>
    `}function aa(s){return s<=2?"😰":s<=4?"😐":"😄"}function sa(s){const e=new Date().toDateString();return(s.calorieLogs||[]).filter(t=>new Date(t.date).toDateString()===e).reduce((t,a)=>t+(a.calories||0),0)}function na(){document.querySelectorAll(".health-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.tab;e!==se&&(se=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),se==="exercise"?ia():oa()}function ia(){var s;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id,a=await v.prompt("Nuevo Ejercicio","Nombre del ejercicio:");a&&(d.addExerciseToRoutine(t,{name:a}),v.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id,a=e.dataset.current,n=await v.prompt("Editar Rutina","Nombre de la rutina:",a);n&&n!==a&&(d.renameRoutine(t,n),v.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;await v.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(d.deleteRoutine(t),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.id,n=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await v.select(`Menú: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await v.prompt("Editar Rutina","Nuevo nombre:",i);l&&l!==i&&(d.renameRoutine(a,l),v.toast("Rutina renombrada"))}else r==="up"?d.reorderRoutine(n,"up"):r==="down"?d.reorderRoutine(n,"down"):r==="delete"&&await v.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(d.deleteRoutine(a),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.routine,a=parseInt(e.dataset.index),n=e.dataset.current,i=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",n);i&&i!==n&&(d.updateExercise(t,a,{name:i}),v.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.routine,a=parseInt(e.dataset.index);await v.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(d.deleteExerciseFromRoutine(t,a),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.routine,n=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await v.select(`Ejercicio: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",i);l&&l!==i&&(d.updateExercise(a,n,{name:l}),v.toast("Ejercicio renombrado"))}else r==="up"?d.reorderExercise(a,n,"up"):r==="down"?d.reorderExercise(a,n,"down"):r==="delete"&&await v.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(d.deleteExerciseFromRoutine(a,n),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=parseInt(e.dataset.index),n=e.dataset.dir;d.reorderRoutine(a,n)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.dataset.routine,n=parseInt(e.dataset.index),i=e.dataset.dir;d.reorderExercise(a,n,i)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.routine,n=parseInt(e.dataset.index),i=[];for(let r=10;r<=150;r+=2.5)i.push(`${r}kg`);const o=await v.select("Seleccionar Peso","Elige el peso para este ejercicio:",i,4);if(o){const r=parseFloat(o.replace("kg",""));d.updateExercise(a,n,{weight:r}),v.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.routine,n=parseInt(e.dataset.index),i=[];for(let r=7;r<=20;r++)i.push(`${r} reps`);const o=await v.select("Seleccionar Reps","Elige las repeticiones objetivo:",i,4);if(o){const r=parseInt(o.replace(" reps",""));d.updateExercise(a,n,{reps:r}),v.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.rid,n=parseInt(e.dataset.idx),i=await v.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");i&&(d.logExercise(a,n,i),v.toast("Ejercicio registrado","success"))})}),(s=document.getElementById("add-routine-btn"))==null||s.addEventListener("click",async()=>{const e=await v.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(d.saveRoutine({name:e,exercises:[]}),v.toast("Rutina creada"))})}function oa(){var s,e,t,a,n,i;(s=document.getElementById("log-weight-btn"))==null||s.addEventListener("click",async()=>{const o=await v.prompt("Registrar Peso","Peso actual (kg):","","number");o&&(d.addWeightLog(parseFloat(o)),v.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const o=await v.prompt("Registrar Grasa","Porcentaje de grasa (%):","","number");o&&(d.addFatLog(parseFloat(o)),v.toast("Grasa registrada"))}),(t=document.getElementById("set-weight-goal-btn"))==null||t.addEventListener("click",async()=>{const o=d.getState().health.weightGoal,r=await v.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",o,"number");r&&(d.updateHealthGoal("weightGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(a=document.getElementById("set-weight-date-btn"))==null||a.addEventListener("click",async()=>{const o=d.getState().health.weightGoalDate||new Date().toISOString().split("T")[0],r=await v.prompt("Fecha Objetivo","¿Cuándo quieres llegar a tu meta?",o,"date");r&&(d.updateHealthGoal("weightGoalDate",r),v.toast("Fecha actualizada"))}),(n=document.getElementById("set-fat-goal-btn"))==null||n.addEventListener("click",async()=>{const o=d.getState().health.fatGoal,r=await v.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",o,"number");r&&(d.updateHealthGoal("fatGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(i=document.getElementById("ai-scan-photo"))==null||i.addEventListener("click",()=>{const o=document.createElement("input");o.type="file",o.accept="image/*",o.onchange=async l=>{var p;const u=l.target.files[0];if(u){if(!Ne.hasKey()){if(await v.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(p=document.querySelector('[data-nav="settings"]'))==null||p.click();return}v.toast("Usando simulación...","info"),r();return}try{v.toast("Analizando con Gemini...","info");const c=await Ne.analyzeFood(u);await v.confirm("IA Detectada",`Identificado: "${c.name}" (${c.calories} kcal). ¿Registrar?`)&&(d.addCalorieLog(c.calories,`${c.name} (AI)`),v.toast("Calorías registradas"))}catch(c){v.alert("Error IA",c.message)}}};function r(){setTimeout(async()=>{const l={name:"Bowl Saludable",calories:450};await v.confirm("IA Simulada",`Detectado "${l.name}" con ${l.calories} kcal. ¿Registrar?`)&&(d.addCalorieLog(l.calories,l.name),v.toast("Registrado"))},1e3)}o.click()})}const Ee=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];let ne="focus";function Ge(){const s=d.getState(),{goals:e,scheduledTasks:t}=s;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Goals & Focus</h1>
        <p class="page-subtitle">Gestiona tus prioridades y automatizaciones</p>
      </header>

      <!-- Goals Tabs (Segmented Control) -->
      <div class="segmented-control" style="margin-bottom: var(--spacing-lg);">
        <button class="segment-btn ${ne==="focus"?"active":""}" id="tab-goals-focus">
            Focus
        </button>
        <button class="segment-btn ${ne==="schedule"?"active":""}" id="tab-goals-schedule">
            Schedule
        </button>
      </div>

      ${ne==="focus"?ra(e):la(t)}
    </div>
  `}function ra(s){return`
      <div class="goals-grid-layout">
        ${[{id:"day",label:"Today",icon:"zap",color:"#FFD700"},{id:"week",label:"This Week",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Year 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Long Term",icon:"trendingUp",color:"#EF4444"}].map(t=>{const a=s.filter(r=>r.timeframe===t.id),n=a.filter(r=>r.completed).length,i=a.length,o=i>0?n/i*100:0;return`
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${t.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${t.color}22; color: ${t.color}">${m(t.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${t.label}</span>
                        <span class="column-stats">${n}/${i}</span>
                    </div>
                    ${n>0?`
                        <button class="btn-clear-completed" data-tf="${t.id}" title="Limpiar completadas">
                            ${m("trash")}
                        </button>
                    `:""}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${o}%; background: ${t.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${t.id}">
                    ${ua(a,t.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${t.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${t.id}">
                        ${m("plus")}
                    </button>
                </div>
            </div>
          </div>
        `}).join("")}
      </div>
    `}function la(s){return`
        <div class="animate-fade-in">
            <div class="schedule-actions" style="margin-bottom: var(--spacing-xl);">
                <button class="btn btn-primary w-full" id="add-scheduled-task-btn" style="padding: 15px; font-weight: 800; border-radius: 15px; box-shadow: 0 10px 20px rgba(0, 212, 170, 0.2);">
                    ${m("plus")} Programar Nueva Tarea Automática
                </button>
            </div>

            <div class="scheduled-tasks-list">
                ${s.length===0?`
                    <div class="empty-state">
                        ${m("calendar","empty-icon")}
                        <div class="empty-title">Sin tareas programadas</div>
                        <p class="empty-description">Programa tareas recurrentes que aparecerán automáticamente en tu columna de "Hoy".</p>
                    </div>
                `:s.map(e=>ca(e)).join("")}
            </div>
        </div>
    `}function ca(s){const e=da(s),t=s.color||"var(--accent-primary)";return`
    <div class="card schedule-card ${s.active?"":"is-inactive"}" 
         style="border-left: 4px solid ${t}; margin-bottom: var(--spacing-md); background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);">
        <div class="schedule-card-body" style="padding: 16px; display: flex; align-items: center; gap: 16px;">
            <div class="schedule-type-icon" style="background: ${t}22; color: ${t}; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${m(s.type==="weekly"?"refreshCw":s.type==="monthly"?"calendar":"pin")}
            </div>
            <div class="schedule-info" style="flex: 1;">
                <div class="schedule-title" style="color: ${t}; font-weight: 700; font-size: 16px;">${s.title}</div>
                <div class="schedule-meta" style="margin-top: 4px;">
                    <span class="schedule-frequency" style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">${e}</span>
                    ${s.lastProcessed?`<span class="schedule-last" style="opacity: 0.5; font-size: 10px; margin-left: 10px;">Última vez: ${s.lastProcessed}</span>`:""}
                </div>
            </div>
            <div class="schedule-actions" style="display: flex; gap: 12px;">
                <button class="icon-btn toggle-schedule" data-id="${s.id}" style="color: ${s.active?"var(--accent-success)":"var(--text-muted)"}; background: none; width: 32px; height: 32px;">
                    ${m(s.active?"checkCircle":"circle")}
                </button>
                <button class="icon-btn delete-schedule" data-id="${s.id}" style="opacity: 0.5; background: none; width: 32px; height: 32px;">
                    ${m("trash")}
                </button>
            </div>
        </div>
    </div>
    `}function da(s){if(s.type==="fixed")return`Fecha: ${s.date}`;if(s.type==="monthly")return`Día ${s.dayOfMonth}`;if(s.type==="weekly"){const e=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];return`${s.days.map(t=>e[t]).join(", ")}`}return"Recurrente"}function ua(s,e){return s.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${m("package")}</div>
            </div>
        `:[...s].sort((a,n)=>a.completed!==n.completed?a.completed?1:-1:a.order!==void 0&&n.order!==void 0?a.order-n.order:(n.createdAt||0)-(a.createdAt||0)).map(a=>{const n=a.subGoals&&a.subGoals.length>0,i=n?a.subGoals.filter(r=>r.completed).length/a.subGoals.length*100:0,o=a.color||"#ffffff";return`
        <div class="goal-card-premium ${a.completed?"is-completed":""}" 
             data-id="${a.id}" 
             draggable="true"
             style="border-left: 4px solid ${o};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${a.id}" style="border-color: ${o}aa; background: ${a.completed?o:"transparent"}">
                    ${a.completed?m("check","check-icon-white"):""}
                </div>
                <div class="goal-main-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div class="goal-title-premium clickable-edit-goal" 
                             data-id="${a.id}" 
                             style="color: ${o}; font-weight: 700; flex: 1;">${a.title}</div>
                        <button class="open-color-picker" data-id="${a.id}" 
                                style="width: 14px; height: 14px; background: ${o}; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; margin-top: 4px;" 
                                title="Cambiar color"></button>
                    </div>
                    
                    <div class="goal-header-row" style="margin-top: 4px;">
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${a.id}" title="Hito">${m("plus")}</button>
                            <button class="action-btn-mini delete-goal" data-id="${a.id}" title="Borrar">${m("trash")}</button>
                        </div>
                    </div>
                    
                    ${n?`
                        <div class="subgoals-list-premium">
                            ${a.subGoals.map((r,l)=>`
                                <div class="subgoal-item-premium ${r.completed?"sub-done":""} toggle-subgoal" data-id="${a.id}" data-idx="${l}">
                                    <div class="sub-check" style="color: ${o}">${m(r.completed?"check":"plus","sub-check-svg")}</div>
                                    <span class="sub-title" style="color: ${o}ee">${r.title}</span>
                                </div>
                            `).join("")}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${i}%; background: ${o}"></div>
                            </div>
                        </div>
                    `:""}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${a.id}">
                        ${Ee.map(r=>`
                            <div class="goal-color-dot ${r===o?"active":""} set-goal-color" 
                                 data-id="${a.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function Fe(){const s=document.getElementById("tab-goals-focus"),e=document.getElementById("tab-goals-schedule");if(s&&e&&(s.addEventListener("click",()=>{var i;ne="focus",(i=window.reRender)==null||i.call(window)}),e.addEventListener("click",()=>{var i;ne="schedule",(i=window.reRender)==null||i.call(window)})),ne==="schedule"){pa();return}document.querySelectorAll(".btn-clear-completed").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const r=i.dataset.tf;await v.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(d.deleteCompletedGoals(r),v.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id;d.toggleGoal(r)})}),document.querySelectorAll(".open-color-picker").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=document.getElementById(`colors-${r}`);document.querySelectorAll(".color-selector-overlay").forEach(u=>{u.id!==`colors-${r}`&&u.classList.add("hidden")}),l==null||l.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=i.dataset.color;d.updateGoalColor(r,l),v.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=parseInt(i.dataset.idx);d.toggleSubGoal(r,l)})}),document.querySelectorAll(".delete-goal").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation(),await v.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(d.deleteGoal(i.dataset.id),v.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const r=i.dataset.id,l=await v.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(l){const p=[...d.getState().goals.find(c=>c.id===r).subGoals||[],{title:l,completed:!1}];d.updateGoal(r,{subGoals:p}),v.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.id,r=i.textContent,l=await v.prompt("Editar Meta","Actualiza el texto:",r);l&&l!==r&&d.updateGoal(o,{title:l})})}),document.querySelectorAll(".quick-add-input-premium").forEach(i=>{i.addEventListener("keypress",o=>{if(o.key==="Enter"&&i.value.trim()){const r=i.dataset.timeframe;d.addGoal({title:i.value.trim(),timeframe:r,color:Ee[0]}),i.value="",v.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.timeframe,r=i.previousElementSibling;r&&r.value.trim()?(d.addGoal({title:r.value.trim(),timeframe:o,color:Ee[0]}),r.value="",v.toast("Creada")):r&&r.focus()})});const t=document.querySelectorAll(".goals-list-premium");let a=null;document.querySelectorAll(".goal-card-premium").forEach(i=>{i.addEventListener("dragstart",o=>{a=i.dataset.id,i.classList.add("dragging"),o.dataTransfer.effectAllowed="move"}),i.addEventListener("dragend",()=>{i.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(o=>o.classList.remove("drag-over"))})}),t.forEach(i=>{i.addEventListener("dragover",o=>{o.preventDefault(),i.classList.add("drag-over"),o.dataTransfer.dropEffect="move"}),i.addEventListener("dragleave",()=>{i.classList.remove("drag-over")}),i.addEventListener("drop",o=>{o.preventDefault(),i.classList.remove("drag-over");const r=i.dataset.timeframe,l=[...d.getState().goals],u=l.findIndex(g=>g.id===a);if(u===-1)return;const p={...l[u]};p.timeframe!==r&&(p.timeframe=r),l.splice(u,1);const c=n(i,o.clientY);if(c==null)l.push(p);else{const g=c.dataset.id,f=l.findIndex(y=>y.id===g);l.splice(f,0,p)}const h=l.map((g,f)=>({...g,order:f}));d.reorderGoals(h),v.toast("Orden actualizado")})});function n(i,o){return[...i.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((l,u)=>{const p=u.getBoundingClientRect(),c=o-p.top-p.height/2;return c<0&&c>l.offset?{offset:c,element:u}:l},{offset:Number.NEGATIVE_INFINITY}).element}}function pa(){var s;(s=document.getElementById("add-scheduled-task-btn"))==null||s.addEventListener("click",async()=>{const e=await v.prompt("Programar Tarea","¿Qué quieres automatizar?");if(!e)return;const t=[{value:"weekly",label:"📅 Semanal (Elegir días)"},{value:"monthly",label:"🗓️ Mensual (Día fijo)"},{value:"fixed",label:"📌 Fecha Concreta"}],a=await v.select("Tipo de Repetición","¿Cómo se repite esta tarea?",t,1);if(!a)return;let n={title:e,type:a};if(a==="weekly"){const r=await v.prompt("Días de la semana","Introduce los días (1=Lun, 7=Dom) separados por coma:","1,4");if(!r)return;const l=r.split(",").map(u=>{let p=parseInt(u.trim());return p===7?0:p}).filter(u=>!isNaN(u));n.days=l}else if(a==="monthly"){const r=await v.prompt("Día del mes","Día (1-31):","1","number");if(!r)return;n.dayOfMonth=parseInt(r)}else if(a==="fixed"){const r=await v.prompt("Fecha Concreta","¿Cuándo?",new Date().toISOString().split("T")[0],"date");if(!r)return;n.date=r}const i=[{value:"#00D4AA",label:"Teal"},{value:"#7C3AED",label:"Purple"},{value:"#F59E0B",label:"Orange"},{value:"#EF4444",label:"Red"},{value:"#3B82F6",label:"Blue"}],o=await v.select("Color","Elige un color:",i,3);n.color=o||"#00D4AA",d.addScheduledTask(n),v.toast("Tarea programada")}),document.querySelectorAll(".delete-schedule").forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.id;await v.confirm("Eliminar Programación","¿Seguro que quieres quitar esta automatización?")&&(d.deleteScheduledTask(t),v.toast("Eliminado"))})}),document.querySelectorAll(".toggle-schedule").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.id,a=d.getState().scheduledTasks.find(n=>n.id===t);d.updateScheduledTask(t,{active:!a.active})})})}let F=new Date;function ma(){const s=d.getState(),{events:e}=s;return`
    <div class="calendar-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Agenda</h1>
            <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
        </div>
        <button class="btn btn-primary" id="add-event-manual-btn" style="width: auto; padding: 10px 20px;">
            ${m("plus")} Nuevo Evento
        </button>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation prev-month">${m("chevronLeft")}</button>
                <span class="current-month">${ga()}</span>
                <button class="icon-btn-navigation next-month">${m("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${va(e)}
            </div>
        </div>

        <div class="events-list-container" style="margin-top: var(--spacing-xl);">
            <div class="section-divider">
                <span class="section-title">Próximos Eventos</span>
            </div>
            <div class="events-list">
                ${e.length===0?`
                    <div class="empty-state">
                        ${m("calendar","empty-icon")}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                    </div>
                `:e.filter(t=>{const a=new Date(t.date);return a.getMonth()===F.getMonth()&&a.getFullYear()===F.getFullYear()}).sort((t,a)=>new Date(t.date)-new Date(a.date)).map(t=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${t.category||"event"}">
                            ${m(ya(t.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${t.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${ha(t.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${t.time}</span>
                                ${t.repeat!=="none"?`<span class="event-repeat-tag">${fa(t.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${t.id}">
                            ${m("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function va(s){const e=F.getMonth(),t=F.getFullYear(),a=new Date().getDate(),n=new Date().getMonth()===e&&new Date().getFullYear()===t,i=new Date(t,e+1,0).getDate(),o=new Date(t,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;s.forEach(p=>{const c=new Date(p.date);c.getMonth()===e&&c.getFullYear()===t&&l.add(c.getDate())});let u=r.map(p=>`<div class="calendar-day-label">${p}</div>`).join("");for(let p=0;p<o;p++)u+='<div class="calendar-day empty"></div>';for(let p=1;p<=i;p++){const c=n&&p===a,h=l.has(p);u+=`
            <div class="calendar-day ${c?"today":""} ${h?"has-event":""}">
                ${p}
                ${h?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return u}function ga(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][F.getMonth()]} ${F.getFullYear()}`}function ha(s){const e={day:"numeric",month:"short"};return new Date(s).toLocaleDateString("es-ES",e).toUpperCase()}function ya(s){switch(s){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function fa(s){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[s]||""}function ba(){var s,e,t;(s=document.querySelector(".prev-month"))==null||s.addEventListener("click",()=>{F.setMonth(F.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{F.setMonth(F.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{await v.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(d.deleteEvent(a.dataset.id),v.toast("Evento eliminado"))})}),(t=document.getElementById("add-event-manual-btn"))==null||t.addEventListener("click",async()=>{const a=await v.prompt("Nuevo Evento","Título del evento:");if(!a)return;const n=await v.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!n)return;const i=await v.prompt("Hora","Formato HH:MM:","10:00");if(!i)return;const o=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await v.select("Categoría","Tipo de evento:",o,0);d.addEvent({title:a,date:n,time:i,category:r||"event",repeat:"none"}),v.toast("Evento agendado","success")})}function wa(){const s=d.getState(),e=s.currencySymbol,t=s.livingExpenses,a=s.otherExpenses||[],n=s.liabilities,i=d.sumItems(t,"amount"),o=d.sumItems(a,"amount"),r=d.sumItems(n,"monthlyPayment"),l=i+o+r,u=[...(t||[]).map(p=>({...p,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(a||[]).map(p=>({...p,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(p=>p.monthlyPayment>0).map(p=>({...p,amount:p.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((p,c)=>c.amount-p.amount);return`
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="back-btn" id="back-to-finance">
                ${m("chevronLeft")}
            </button>
            <h1 class="page-title" style="margin-bottom: 0;">Gastos Mensuales</h1>
        </div>
        <p class="page-subtitle" style="margin-left: 40px;">Desglose detallado de tus salidas</p>
      </header>
      
      <!-- PRIMARY METRIC -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Total Mensual</span>
          ${m("creditCard","card-icon")}
        </div>
        <div class="stat-value negative text-center" style="font-size: 32px; margin: var(--spacing-md) 0;">
            ${w(l,e)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${w(i,e)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${w(r,e)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${w(o,e)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${xa(u,s)}

    </div>
  `}function xa(s,e){if(s.length===0)return`
            <div class="empty-state">
                ${m("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const t=e.currencySymbol;return`
        <div class="asset-list">
            ${s.map(a=>{const n=d.convertValue(a.amount,a.currency||"EUR"),i=ka(a.category);return`
                <div class="asset-item expense-item" data-id="${a.id}" data-category="${a.category}">
                    <div class="asset-icon-wrapper expense">
                        ${m(i,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${a.name}</div>
                        <div class="asset-details">${a.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${w(n,t)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function ka(s){switch(s){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function Ea(s){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",s),document.querySelectorAll(".expense-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,i=a.dataset.category;Ze(n,i)})})}const Sa="modulepreload",$a=function(s){return"/life-dashboard/"+s},He={},ge=function(e,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(t.map(l=>{if(l=$a(l),l in He)return;He[l]=!0;const u=l.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${p}`))return;const c=document.createElement("link");if(c.rel=u?"stylesheet":Sa,u||(c.as="script"),c.crossOrigin="",c.href=l,r&&c.setAttribute("nonce",r),document.head.appendChild(c),u)return new Promise((h,g)=>{c.addEventListener("load",h),c.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return n.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function Ia(){const s=I.isBioEnabled(),e=U.hasToken();return`
    <div class="settings-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Configuración</h1>
            <p class="page-subtitle">Privacidad, Seguridad y Sincronización</p>
        </header>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${m("shield","section-icon")} Seguridad
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
                    <div class="settings-action-icon">${m("chevronRight")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${m("cloud","section-icon")} Nube & Sincronización
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
                            ${m("refreshCw")}
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
                            ${m("uploadCloud")}
                            <span>Subir</span>
                        </button>
                        <button class="btn-settings-action" id="download-drive-btn">
                            ${m("downloadCloud")}
                            <span>Bajar</span>
                        </button>
                    </div>
                `:""}

                <div class="settings-divider"></div>

                <div class="advanced-settings-group">
                    <div class="settings-item-info" style="width: 100%;">
                        <div class="settings-item-label" style="font-size: 13px; display: flex; align-items: center; gap: 6px;">
                            ${m("lock","mini-icon")} Google Client Secret
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
                                ${m("eye")}
                            </button>
                            <button class="btn btn-primary btn-save-mini" id="btn-save-drive-secret">
                                ${m("check")}
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
                    <div class="settings-action-icon">${m("upload")}</div>
                </div>
                <input type="file" id="import-backup-input" accept=".bin" style="display: none;">

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="export-data-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Exportar Backup Manual</div>
                        <div class="settings-item-desc">Descargar copia encriptada.</div>
                    </div>
                    <div class="settings-action-icon">${m("download")}</div>
                </div>
            </div>

            <div class="settings-note">
                ${m("lock","note-icon")} Todos tus datos se encriptan localmente con AES-256-GCM antes de ser enviados a tu Google Drive personal. Nadie más tiene acceso.
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${m("settings","section-icon")} Aplicación
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row clickable" id="btn-logout">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Cerrar Sesión</div>
                        <div class="settings-item-desc">Bloquear acceso y limpiar llaves de sesión.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${m("logOut")}</div>
                </div>



                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-factory-reset">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Borrar todos los datos</div>
                        <div class="settings-item-desc">Elimina permanentemente el almacenamiento local y reinicia la App.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${m("trash")}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${m("zap","section-icon")} Inteligencia Artificial
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
            <p>Life Dashboard Pro v1.0.102</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function La(){var a,n,i,o,r,l,u,p,c,h;(a=document.getElementById("toggle-bio"))==null||a.addEventListener("change",async g=>{if(g.target.checked){const y=await v.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(y)try{await I.registerBiometrics(y),v.toast("Biometría activada correctamente")}catch(k){await v.alert("Error",k.message),g.target.checked=!1}else g.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),v.toast("Biometría desactivada","info")});const s=document.getElementById("btn-install-pwa");s&&setTimeout(()=>{if(window.deferredPrompt){const g=document.getElementById("install-pwa-card");g&&(g.style.display="block"),s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:f}=await window.deferredPrompt.userChoice;if(f==="accepted"){v.toast("Instalando aplicación...");const y=document.getElementById("install-pwa-card");y&&(y.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("connect-drive-btn"))==null||n.addEventListener("click",async()=>{try{await U.authenticate(),v.toast("Google Drive conectado"),typeof window.reRender=="function"&&window.reRender()}catch(g){v.alert("Error",g.message||"Error al conectar")}}),(i=document.getElementById("upload-drive-btn"))==null||i.addEventListener("click",async()=>{const g=document.getElementById("upload-drive-btn"),f=g.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;g.innerHTML='<div class="loading-spinner-sm"></div>',g.style.pointerEvents="none";const k=I.getVaultKey();await U.pushData(d.getState(),k),v.toast("Bóveda subida correctamente")}catch(y){console.error(y),v.alert("Error al subir",y.message)}finally{g.innerHTML=f,g.style.pointerEvents="auto"}}),(o=document.getElementById("download-drive-btn"))==null||o.addEventListener("click",async()=>{const g=document.getElementById("download-drive-btn"),f=g.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;g.innerHTML='<div class="loading-spinner-sm"></div>',g.style.pointerEvents="none";const k=I.getVaultKey(),x=await U.pullData(k);x?(d.resetState(x),await d.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(y){console.error("[Settings] Download failed:",y),v.alert("Error de Descarga",y.message||"Error desconocido al bajar datos")}finally{g.innerHTML=f,g.style.pointerEvents="auto"}}),(r=document.getElementById("export-data-btn"))==null||r.addEventListener("click",async()=>{try{v.toast("Preparando archivo encriptado...","info");const g=d.getState(),f=I.getVaultKey(),{SecurityService:y}=await ge(async()=>{const{SecurityService:C}=await Promise.resolve().then(()=>Me);return{SecurityService:C}},void 0),k=await y.encrypt(g,f),x=new Blob([JSON.stringify(k)],{type:"application/octet-stream"}),S=URL.createObjectURL(x),E=document.createElement("a"),D=new Date().toISOString().split("T")[0];E.href=S,E.download=`life_dashboard_backup_${D}.bin`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL(S),v.toast("Backup exportado correctamente")}catch(g){console.error("Export error:",g),v.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),t=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{t==null||t.click()}),t==null||t.addEventListener("change",async g=>{var k;const f=(k=g.target.files)==null?void 0:k[0];if(!f)return;if(!await v.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){t.value="";return}try{const x=await f.text(),S=JSON.parse(x),E=I.getVaultKey(),{SecurityService:D}=await ge(async()=>{const{SecurityService:B}=await Promise.resolve().then(()=>Me);return{SecurityService:B}},void 0),C=await D.decrypt(S,E);if(C)d.setState(C),await d.saveState(),v.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(x){console.error("Import error:",x),v.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{t.value=""}}),(l=document.getElementById("btn-logout"))==null||l.addEventListener("click",async()=>{await v.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(I.logout(),window.location.reload())}),(u=document.getElementById("btn-save-gemini"))==null||u.addEventListener("click",()=>{var f;const g=(f=document.getElementById("gemini-api-key"))==null?void 0:f.value;g!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",g.trim()),v.toast("API Key de Gemini guardada"))}),(p=document.getElementById("btn-save-drive-secret"))==null||p.addEventListener("click",()=>{const f=document.getElementById("drive-client-secret").value.trim();f?(localStorage.setItem("life-dashboard/drive_client_secret",f),v.toast("Secreto guardado correctamente")):(localStorage.removeItem("life-dashboard/drive_client_secret"),v.toast("Secreto eliminado, usando valor por defecto","info")),U.init().catch(console.error)}),(c=document.getElementById("toggle-drive-secret"))==null||c.addEventListener("click",g=>{const f=document.getElementById("drive-client-secret"),y=g.currentTarget,k=f.type==="password";f.type=k?"text":"password",y.innerHTML=m(k?"eyeOff":"eye")}),(h=document.getElementById("btn-factory-reset"))==null||h.addEventListener("click",async()=>{if(await v.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const f="life-dashboard/";if(Object.keys(localStorage).forEach(y=>{y.startsWith(f)&&localStorage.removeItem(y)}),Object.keys(sessionStorage).forEach(y=>{y.startsWith(f)&&sessionStorage.removeItem(y)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(k=>window.indexedDB.deleteDatabase(k.name)),navigator.serviceWorker){const y=await navigator.serviceWorker.getRegistrations();for(let k of y)k.unregister()}v.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now()},1e3)}})}function Aa(){const s=U.hasToken();return`
    <div class="stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Menú</h1>
        </header>

        <div class="menu-grid">
            <button class="menu-card" id="open-skills">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    ${m("brain")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Skills & Mastery</div>
                    <div class="menu-desc">Nivel de expertise y aprendizaje</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-calendar">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);">
                    ${m("calendar")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Agenda</div>
                    <div class="menu-desc">Eventos y recordatorios</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-aesthetics">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);">
                    ${m("sparkles")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Aesthetics & Appearance</div>
                    <div class="menu-desc">Optimización física y plan de mejora</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-habits">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
                    ${m("zap")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Habits & Routine</div>
                    <div class="menu-desc">Hábitos diarios y disciplina</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>

            <button class="menu-card" id="open-settings">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                    ${m("settings")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Ajustes</div>
                    <div class="menu-desc">Configuración general</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>

            ${s?`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; grid-column: 1 / -1;">
                    <button class="menu-card" id="btn-upload-menu" style="flex-direction: column; text-align: center; padding: 20px 10px; align-items: center;">
                        <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); margin-right: 0; margin-bottom: 12px; width: 44px; height: 44px;">
                            ${m("uploadCloud")}
                        </div>
                        <div class="menu-info">
                            <div class="menu-title" style="font-size: 14px;">Subir nube</div>
                            <div class="menu-desc" style="font-size: 10px;">Local → Drive</div>
                        </div>
                    </button>

                    <button class="menu-card" id="btn-download-menu" style="flex-direction: column; text-align: center; padding: 20px 10px; align-items: center;">
                        <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); margin-right: 0; margin-bottom: 12px; width: 44px; height: 44px;">
                            ${m("downloadCloud")}
                        </div>
                        <div class="menu-info">
                            <div class="menu-title" style="font-size: 14px;">Bajar nube</div>
                            <div class="menu-desc" style="font-size: 10px;">Drive → Local</div>
                        </div>
                    </button>
                </div>
            `:""}

            <button class="menu-card" id="btn-force-update">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);">
                    ${m("refreshCw")}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Forzar Actualización</div>
                    <div class="menu-desc">Recargar la última versión</div>
                </div>
                <div class="menu-arrow">${m("chevronRight")}</div>
            </button>
        </div>
    </div>
    `}function Ca(s){var e,t,a,n,i,o,r,l,u;(e=document.getElementById("open-calendar"))==null||e.addEventListener("click",()=>{s("calendar")}),(t=document.getElementById("open-skills"))==null||t.addEventListener("click",()=>{s("skills")}),(a=document.getElementById("open-aesthetics"))==null||a.addEventListener("click",()=>{s("aesthetics")}),(n=document.getElementById("open-habits"))==null||n.addEventListener("click",()=>{s("habits")}),(i=document.getElementById("open-schedule"))==null||i.addEventListener("click",()=>{s("goals")}),(o=document.getElementById("open-settings"))==null||o.addEventListener("click",()=>{s("settings")}),(r=document.getElementById("btn-upload-menu"))==null||r.addEventListener("click",async()=>{const p=document.getElementById("btn-upload-menu"),c=p.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;p.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',p.style.pointerEvents="none";const g=I.getVaultKey();await U.pushData(d.getState(),g),v.toast("Bóveda subida correctamente")}catch(h){console.error(h),v.alert("Error al subir",h.message)}finally{p.innerHTML=c,p.style.pointerEvents="auto"}}),(l=document.getElementById("btn-download-menu"))==null||l.addEventListener("click",async()=>{const p=document.getElementById("btn-download-menu"),c=p.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;p.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',p.style.pointerEvents="none";const g=I.getVaultKey(),f=await U.pullData(g);f?(d.resetState(f),await d.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(h){console.error("[Menu] Download failed:",h),v.alert("Error de Descarga",h.message||"Error desconocido al bajar datos")}finally{p.innerHTML=c,p.style.pointerEvents="auto"}}),(u=document.getElementById("btn-force-update"))==null||u.addEventListener("click",async()=>{if(await v.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const c=await caches.keys();for(let h of c)await caches.delete(h)}catch(c){console.error("Error clearing cache",c)}window.location.reload(!0)}})}function Ta(){const{social:s}=d.getState(),{people:e,columns:t,idealLeadProfile:a}=s,n=e.length,i=t.find(u=>u.name.toLowerCase().includes("closed")||u.name.toLowerCase().includes("cerrado")||u.name.toLowerCase().includes("exito"));let o=0;if(n>0){const u=a&&a.trim().length>0;(i?e.filter(c=>c.columnId===i.id).length:0)>0?o=u?100:80:(o=Math.min(40,n*5),u&&(o+=10))}let r="var(--accent-danger)",l="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)";return o>=60?(r="var(--accent-success)",l="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"):o>=25&&(r="var(--accent-tertiary)",l="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"),`
    <div class="social-page stagger-children">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <div class="header-content">
                <h1 class="page-title">Connections</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones laborales</p>
                
                <!-- SUCCESS INDEX HIGHLIGHT (FIXED COLORS) -->
                <div class="finance-top-grid" style="margin-top: 20px; margin-bottom: 20px;">
                    <div class="card highlight-card" style="background: ${l}; border-color: ${r}; transition: all 0.3s ease;">
                        <div class="card-header">
                            <span class="card-title" style="color: ${r} !important;">Índice de Éxito</span>
                            <div style="color: ${r} !important;">${m("target","card-icon")}</div>
                        </div>
                        <div class="highlight-value" style="color: ${r} !important; background: none !important; -webkit-text-fill-color: initial !important;">${o}%</div>
                        <div class="highlight-label" style="color: ${r} !important; opacity: 0.9;">
                            ${o>=60?"🎯 ¡Excelente tracción y cierres!":o>=25?"📈 Pipeline activo y en crecimiento":"⌛ En busca del primer contacto"}
                        </div>
                    </div>
                </div>

                <div class="social-header-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-primary" id="add-person-btn">
                        ${m("plus")} Lead
                    </button>
                    <button class="btn btn-primary" id="add-social-col-btn" style="filter: hue-rotate(45deg);">
                        ${m("plus")} Etapa
                    </button>
                    <button class="btn btn-secondary" id="ideal-lead-btn">
                        ${m("target")} Lead Ideal
                    </button>
                    <button class="btn btn-secondary" id="communications-mgr-btn">
                        ${m("messageSquare")} Comunicaciones
                    </button>
                    <button class="btn btn-secondary" id="contact-sources-btn">
                        ${m("users")} Fuentes
                    </button>
                </div>
            </div>
        </header>

        <div class="kanban-container">
            ${t.sort((u,p)=>u.order-p.order).map(u=>{const p=e.filter(c=>c.columnId===u.id);return`
                <div class="kanban-column" data-col-id="${u.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${u.color}"></span>
                            ${u.name}
                            <span class="kanban-count">${p.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${u.id}">${m("moreVertical")}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${u.id}">
                        ${p.map(c=>Da(c)).join("")}
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function Da(s){const e=s.lastContact?Math.floor((Date.now()-new Date(s.lastContact).getTime())/864e5):null,t=s.color||"#3b82f6";return`
    <div class="person-card glass-panel" draggable="true" data-id="${s.id}">
        <div class="person-color-strip" style="background: ${t};"></div>
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
                    ${m("messageSquare","tiny-icon")}
                </button>
            </div>
        </div>
    </div>
    `}function Ma(){window.socialListenersAttached||(window.socialListenersAttached=!0,document.addEventListener("click",s=>{const e=s.target.closest(".col-opts-btn");if(e){s.preventDefault(),s.stopPropagation(),ja(e.dataset.id,e);return}if(s.target.closest("#add-social-col-btn")){Ba();return}if(s.target.closest("#add-person-btn")){window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person"}}));return}if(s.target.closest("#ideal-lead-btn")){Ra();return}if(s.target.closest("#communications-mgr-btn")){ge(()=>import("./CommunicationsModal-ByeV40NP.js"),[]).then(n=>n.openCommunicationsModal());return}if(s.target.closest("#contact-sources-btn")){Oa();return}const t=s.target.closest(".person-chat-btn");if(t){s.preventDefault(),s.stopPropagation(),ge(()=>import("./CommunicationsModal-ByeV40NP.js"),[]).then(n=>n.openCommunicationsModal(t.dataset.id));return}const a=s.target.closest(".person-card");if(a){Pa(a.dataset.id);return}}),document.addEventListener("dragstart",s=>{const e=s.target.closest(".person-card");e&&(s.dataTransfer.setData("text/plain",e.dataset.id),e.classList.add("dragging"))}),document.addEventListener("dragend",s=>{const e=s.target.closest(".person-card");e&&e.classList.remove("dragging")}),document.addEventListener("dragover",s=>{const e=s.target.closest(".kanban-cards");e&&(s.preventDefault(),e.classList.add("drag-over"))}),document.addEventListener("dragleave",s=>{const e=s.target.closest(".kanban-cards");e&&e.classList.remove("drag-over")}),document.addEventListener("drop",s=>{const e=s.target.closest(".kanban-cards");if(e){s.preventDefault(),e.classList.remove("drag-over");const t=s.dataTransfer.getData("text/plain"),a=e.dataset.colId;t&&a&&d.movePerson(t,a)}}))}async function Ba(){const s=await v.prompt("Etapa","Nombre de la etapa:");s&&(d.addSocialColumn({name:s,color:"#94a3b8"}),v.toast("Etapa agregada correctamente","success"))}async function Ra(){const s=d.getState().social.idealLeadProfile||"",e=await _a(s);e!==null&&(d.updateIdealLeadProfile(e),v.toast("Perfil Ideal actualizado"))}function Pa(s){const e=d.getState().social.people.find(t=>t.id===s);e&&window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person",person:e}}))}function _a(s){return new Promise(e=>{const t=document.createElement("div");t.className="modal-overlay active",t.style.zIndex="9999",t.innerHTML=`
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${s||""}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(t);const a=()=>{t.remove(),e(null)};t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#save-ideal-lead").addEventListener("click",()=>{const n=t.querySelector("#ideal-lead-text").value;t.remove(),e(n)}),t.addEventListener("click",n=>{n.target===t&&a()})})}function ja(s,e){document.querySelectorAll(".column-options-menu").forEach(o=>o.remove());const t=d.getState().social.columns.find(o=>o.id===s);if(!t)return;const a=document.createElement("div");a.className="column-options-menu",a.innerHTML=`
        <button class="menu-item" data-action="edit">${m("edit")} Editar Nombre</button>
        <button class="menu-item" data-action="color">${m("palette")} Cambiar Color</button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_up">${m("chevronUp")} Mover Arriba (Anterior)</button>
        <button class="menu-item" data-action="move_down">${m("chevronDown")} Mover Abajo (Siguiente)</button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">${m("trash")} Eliminar Etapa</button>
    `;const n=e.getBoundingClientRect();a.style.position="fixed",a.style.top=`${n.bottom+8}px`,a.style.right=`${window.innerWidth-n.right}px`,a.style.zIndex="9999",document.body.appendChild(a),a.querySelectorAll(".menu-item").forEach(o=>{o.addEventListener("click",async()=>{const r=o.dataset.action;if(a.remove(),r==="edit"){const l=await v.prompt("Nombre de Columna","Nuevo nombre:",t.name);l!=null&&l.trim()&&d.updateSocialColumn(s,{name:l.trim()})}else if(r==="color"){const l=await Ua(t.color);l&&d.updateSocialColumn(s,{color:l})}else if(r==="delete")await v.confirm("Eliminar Etapa",`¿Eliminar "${t.name}"?`)&&d.deleteSocialColumn(s);else if(r==="move_up"||r==="move_down"){const l=[...d.getState().social.columns].sort((c,h)=>c.order-h.order),u=l.findIndex(c=>c.id===s);if(u===-1)return;const p=r==="move_up"?u-1:u+1;p>=0&&p<l.length&&([l[u].order,l[p].order]=[l[p].order,l[u].order],d.reorderSocialColumns(l))}})});const i=o=>{!a.contains(o.target)&&o.target!==e&&(a.remove(),document.removeEventListener("click",i))};setTimeout(()=>document.addEventListener("click",i),10)}function Ua(s){return new Promise(e=>{const t=document.createElement("div");t.className="modal-overlay active",t.style.zIndex="99999",t.innerHTML=`
            <div class="modal" style="max-width: 320px;">
                <div class="modal-header">
                    <h2 class="modal-title">Color de Etapa</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <input type="color" id="stage-color-input" class="color-picker-input" value="${s||"#3b82f6"}">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px;">
                        ${["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#64748b","#000000"].map(n=>`<div class="color-swatch" data-color="${n}" style="background:${n}; height:30px; border-radius:6px; cursor:pointer; border:2px solid ${s===n?"white":"transparent"}"></div>`).join("")}
                    </div>
                    <button class="btn btn-primary w-full" id="save-stage-color" style="margin-top: 24px;">Aplicar</button>
                </div>
            </div>
        `,document.body.appendChild(t);const a=()=>{t.remove(),e(null)};t.querySelector(".modal-close").addEventListener("click",a),t.querySelectorAll(".color-swatch").forEach(n=>n.addEventListener("click",()=>{t.querySelector("#stage-color-input").value=n.dataset.color,t.querySelectorAll(".color-swatch").forEach(i=>i.style.borderColor="transparent"),n.style.borderColor="white"})),t.querySelector("#save-stage-color").addEventListener("click",()=>{const n=t.querySelector("#stage-color-input").value;t.remove(),e(n)}),t.addEventListener("click",n=>{n.target===t&&a()})})}async function Oa(){const{contactSources:s}=d.getState().social,e=await Na(s);e&&(d.updateContactSources(e),v.toast("Fuentes de contacto actualizadas"))}function Na(s){return new Promise(e=>{const t=document.createElement("div");t.className="modal-overlay active",t.style.zIndex="9999",t.innerHTML=`
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fuentes de Contacto</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">Escribe las fuentes separadas por coma:</p>
                    <textarea id="contact-sources-text" class="form-input" rows="4" placeholder="Ej: Instagram, WhatsApp, Amigo...">${s.join(", ")}</textarea>
                    <button class="btn btn-primary w-full" id="save-contact-sources" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(t);const a=()=>{t.remove(),e(null)};t.querySelector(".modal-close").addEventListener("click",a),t.querySelector("#save-contact-sources").addEventListener("click",()=>{const i=t.querySelector("#contact-sources-text").value.split(",").map(o=>o.trim()).filter(o=>o.length>0);t.remove(),e(i)}),t.addEventListener("click",n=>{n.target===t&&a()})})}const Se=(s=new Date)=>{const e=s.getTimezoneOffset();return new Date(s.getTime()-e*60*1e3).toISOString().split("T")[0]};let ce=Se();function Ga(){const s=d.getState(),e=s.habits||[],t=s.habitLogs||{},a=t[ce]||[],n=[...e].sort((o,r)=>(o.time||"00:00").localeCompare(r.time||"00:00")),i=e.length>0?Math.round(a.length/e.length*100):0;return`
    <div class="habits-page stagger-children">
        <header class="page-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div>
                    <h1 class="page-title">Habits & Routine</h1>
                    <p class="page-subtitle">Construye tu mejor versión</p>
                </div>
                <div class="date-display-habits">
                    ${Ka(ce)}
                </div>
            </div>
        </header>

        <!-- Stats Overview -->
        <div class="card habits-overview-card">
            <div class="habits-progress-info">
                <div class="habits-progress-text">
                    <div class="habits-completion-pct">${i}%</div>
                    <div class="habits-completion-label">Completado hoy</div>
                </div>
                <div class="habits-stats-mini">
                    <div class="mini-stat">
                        <span class="mini-stat-val">${a.length}</span>
                        <span class="mini-stat-label">Hechos</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-val">${e.length-a.length}</span>
                        <span class="mini-stat-label">Pendientes</span>
                    </div>
                </div>
            </div>
            <div class="habits-progress-bar-bg">
                <div class="habits-progress-bar-fill" style="width: ${i}%"></div>
            </div>
        </div>

        <!-- Weekly Strip -->
        <div class="habits-week-strip">
            ${Fa()}
        </div>

        <!-- History Stats -->
        <div class="section-divider">
            <span class="section-title">Actividad Reciente</span>
        </div>
        <div class="card habits-history-card">
            ${Ha(t,e.length)}
        </div>

        <div class="section-divider">
            <span class="section-title">Tu Rutina</span>
            <button class="btn-add-goal-inline" id="btn-add-habit">
                ${m("plus")} Nuevo
            </button>
        </div>

        <div class="habits-list drag-container" id="habits-container">
            ${n.length===0?`
                <div class="empty-state">
                    ${m("calendar","empty-icon")}
                    <p>No hay hábitos configurados.</p>
                </div>
            `:n.map(o=>qa(o,a.includes(o.id))).join("")}
        </div>
    </div>
    `}function Fa(){const s=[],e=new Date,t=Se();for(let a=-3;a<=3;a++){const n=new Date;n.setDate(e.getDate()+a);const i=Se(n),o=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][n.getDay()],r=n.getDate();s.push(`
            <div class="week-day-btn ${i===ce?"active":""}" data-date="${i}">
                <div class="week-day-name">${o}</div>
                <div class="week-day-num">${r}</div>
                ${i===t?'<div class="today-dot"></div>':""}
            </div>
        `)}return s.join("")}function Ha(s,e){const t=[],a=["D","L","M","X","J","V","S"];for(let n=6;n>=0;n--){const i=new Date;i.setDate(i.getDate()-n);const o=i.toISOString().split("T")[0],r=s[o]||[],l=e>0?Math.round(r.length/e*100):0;t.push({name:a[i.getDay()],pct:l,isToday:n===0})}return`
    <div class="habits-history-grid">
        ${t.map(n=>`
            <div class="history-day-col">
                <div class="history-bar-container">
                    <div class="history-bar-fill" style="height: ${n.pct}%"></div>
                </div>
                <div class="history-day-label ${n.isToday?"active":""}">${n.name}</div>
            </div>
        `).join("")}
    </div>
    <div class="history-legend">
        Completitud de los últimos 7 días
    </div>
    `}function qa(s,e){return`
    <div class="card habit-card draggable-habit ${e?"completed":""}" 
         data-id="${s.id}" 
         draggable="true">
        <div class="habit-check-wrapper" data-id="${s.id}">
            <div class="habit-checkbox ${e?"checked":""}">
                ${e?m("check"):""}
            </div>
        </div>
        <div class="habit-main-info">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="habit-icon-circle" style="background: ${s.color}20; color: ${s.color}">
                    ${m(s.icon||"star")}
                </div>
                <div>
                    <div class="habit-name">${s.name}</div>
                    <div class="habit-time-label">${s.time||"--:--"}</div>
                </div>
            </div>
        </div>
        <div class="habit-actions">
            <button class="icon-btn edit-habit" data-id="${s.id}">${m("edit")}</button>
            <button class="icon-btn delete-habit" data-id="${s.id}">${m("trash")}</button>
        </div>
    </div>
    `}function za(){var s;document.querySelectorAll(".week-day-btn").forEach(e=>{e.addEventListener("click",()=>{var t;ce=e.dataset.date,(t=window.reRender)==null||t.call(window)})}),document.querySelectorAll(".habit-check-wrapper").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.dataset.id;d.toggleHabit(a,ce)})}),(s=document.getElementById("btn-add-habit"))==null||s.addEventListener("click",()=>{$e()}),document.querySelectorAll(".edit-habit").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.dataset.id,n=d.getState().habits.find(i=>i.id===a);n&&$e(n)})}),document.querySelectorAll(".delete-habit").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.id;await v.confirm("¿Eliminar hábito?","Esta acción no se puede deshacer.")&&d.deleteHabit(a)})}),Va()}function Va(){const s=document.getElementById("habits-container");s&&(document.querySelectorAll(".draggable-habit").forEach(e=>{e.addEventListener("dragstart",t=>{e.dataset.id,e.classList.add("dragging"),e.style.opacity="0.4",t.dataTransfer.effectAllowed="move"}),e.addEventListener("dragend",()=>{e.classList.remove("dragging"),e.style.opacity="1"})}),s.addEventListener("dragover",e=>{e.preventDefault();const t=Ya(s,e.clientY),a=document.querySelector(".dragging");t==null?s.appendChild(a):s.insertBefore(a,t)}),s.addEventListener("drop",e=>{e.preventDefault();const a=Array.from(s.querySelectorAll(".draggable-habit")).map(n=>{const i=n.dataset.id;return d.getState().habits.find(o=>o.id===i)});d.reorderHabits(a)}))}function Ya(s,e){return[...s.querySelectorAll(".draggable-habit:not(.dragging)")].reduce((a,n)=>{const i=n.getBoundingClientRect(),o=e-i.top-i.height/2;return o<0&&o>a.offset?{offset:o,element:n}:a},{offset:Number.NEGATIVE_INFINITY}).element}function $e(s=null){const e=!!s,t=e?"Editar Hábito":"Nuevo Hábito",a=["zap","brain","dumbbell","coffee","bookOpen","heart","droplet","sun","moon","star","check","bell"],n=["#f59e0b","#8b5cf6","#ef4444","#3b82f6","#10b981","#ec4899","#06b6d4","#f97316","#84cc16","#a855f7","#6366f1","#d946ef"];let i=(s==null?void 0:s.icon)||"zap",o=(s==null?void 0:s.color)||"#3b82f6";const r=document.createElement("div");r.className="modal-overlay active overlay-centered",r.innerHTML=`
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${t}</h3>
                <button class="close-modal-btn">${m("x")}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" id="habit-name" class="form-input" placeholder="Ej: Levantarse, Meditar..." value="${(s==null?void 0:s.name)||""}">
                </div>
                <div class="form-group">
                    <label class="form-label">Hora (Opcional)</label>
                    <input type="time" id="habit-time" class="form-input" value="${(s==null?void 0:s.time)||""}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Icono</label>
                    <div class="icon-selection-grid">
                        ${a.map(c=>`
                            <div class="icon-option ${c===i?"selected":""}" data-icon="${c}">
                                ${m(c)}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Color</label>
                    <div class="color-selection-grid">
                        ${n.map(c=>`
                            <div class="color-option ${c===o?"selected":""}" data-color="${c}" style="background: ${c}"></div>
                        `).join("")}
                    </div>
                </div>

                <button class="btn btn-primary" id="save-habit-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${e?"Guardar Cambios":"Crear Hábito"}
                </button>
            </div>
        </div>
    `,document.body.appendChild(r);const l=r.querySelector(".close-modal-btn"),u=r.querySelector("#save-habit-btn"),p=()=>{r.classList.remove("active"),setTimeout(()=>r.remove(),300)};l.addEventListener("click",p),r.addEventListener("click",c=>{c.target===r&&p()}),r.querySelectorAll(".icon-option").forEach(c=>{c.addEventListener("click",()=>{r.querySelectorAll(".icon-option").forEach(h=>h.classList.remove("selected")),c.classList.add("selected"),i=c.dataset.icon})}),r.querySelectorAll(".color-option").forEach(c=>{c.addEventListener("click",()=>{r.querySelectorAll(".color-option").forEach(h=>h.classList.remove("selected")),c.classList.add("selected"),o=c.dataset.color})}),u.addEventListener("click",()=>{const c=r.querySelector("#habit-name").value.trim(),h=r.querySelector("#habit-time").value;if(!c){v.toast("El nombre es obligatorio","error");return}const g={name:c,time:h,icon:i,color:o};e?(d.updateHabit(s.id,g),v.toast("Hábito actualizado")):(d.addHabit(g),v.toast("Hábito creado")),p()})}function Ka(s){const e=new Date(s+"T00:00:00"),t=new Date;if(t.setHours(0,0,0,0),e.getTime()===t.getTime())return"Hoy";const a={weekday:"long",day:"numeric",month:"long"};return e.toLocaleDateString("es-ES",a)}function Wa(){$e()}function Xa(){const{skills:s}=d.getState(),e=(s||[]).filter(n=>n.category==="current"),t=(s||[]).filter(n=>n.category==="next"),a=e.length>0?Math.round(e.reduce((n,i)=>n+i.level,0)/e.length):0;return`
    <div class="skills-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <h1 class="page-title">Skills & Mastery</h1>
            <p class="page-subtitle">Gestiona tu nivel de expertise y planifica tu aprendizaje</p>
        </header>

        <!-- OVERALL MASTERY HIGHLIGHT -->
        <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%); border-color: rgba(124, 58, 237, 0.3);">
            <div class="card-header">
                <span class="card-title" style="color: #7c3aed;">Maestría Promedio</span>
                ${m("brain","card-icon")}
            </div>
            <div class="highlight-value" style="color: #7c3aed; background: none !important; -webkit-text-fill-color: initial !important;">${a}<span style="font-size: 16px; opacity: 0.6;">%</span></div>
            <div class="highlight-label">
                ${a>80?"👑 Nivel experto en tu stack":a>50?"🛡️ Profesional competente":"🌱 En fase de crecimiento"}
            </div>
        </div>

        <div class="skills-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-xl);">
            <!-- CURRENT EXPERTISE -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Nivel de Expertise</span>
                    <button class="icon-btn add-skill-btn" data-category="current" style="color: white !important;">${m("plus")}</button>
                </div>
                <div class="skills-list">
                    ${e.length===0?qe():e.map(n=>Ja(n)).join("")}
                </div>
            </section>

            <!-- NEXT SKILLS TO DEVELOP -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Desafíos</span>
                    <button class="icon-btn add-skill-btn" data-category="next" style="color: white !important;">${m("plus")}</button>
                </div>
                <div class="skills-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${t.length===0?qe():t.map(n=>Za(n)).join("")}
                </div>
            </section>
        </div>
    </div>
    `}function Ja(s){return`
    <div class="card skill-card draggable-skill" 
         data-id="${s.id}" 
         data-category="${s.category}" 
         draggable="true"
         style="margin-bottom: 8px; padding: 10px 16px !important; cursor: grab;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="color: var(--text-muted); opacity: 0.5; cursor: grab; display: flex; align-items: center;">
                    ${m("menu")}
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${s.name}</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-skill" data-id="${s.id}" style="color: white !important; width: 30px; height: 30px; padding: 0;">${m("edit")}</button>
                <button class="icon-btn delete-skill" data-id="${s.id}" style="color: var(--accent-danger); width: 30px; height: 30px; padding: 0;">${m("trash")}</button>
            </div>
        </div>
        <div class="skill-progress-container" style="background: rgba(255,255,255,0.05); height: 5px; border-radius: 3px; overflow: hidden; position: relative;">
            <div class="skill-progress-fill" style="width: ${s.level}%; height: 100%; background: var(--accent-primary); border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; font-weight: 600; color: var(--text-muted);">
            <span>Maestría</span>
            <span style="color: var(--accent-primary);">${s.level}%</span>
        </div>
    </div>
    `}function Za(s){return`
    <div class="card next-skill-card draggable-skill edit-skill" 
         data-id="${s.id}" 
         data-category="${s.category}" 
         draggable="true"
         style="padding: 10px 12px !important; display: flex; align-items: center; justify-content: space-between; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); height: auto; cursor: grab;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="color: var(--text-muted); opacity: 0.5; display: flex; align-items: center;">
                ${m("menu")}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text-primary); text-align: left;">${s.name}</div>
        </div>
        <div style="color: #7c3aed; opacity: 0.6;">${m("zap")}</div>
    </div>
    `}function qe(s){return`
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">Pulse + para añadir su primera skill</p>
    </div>
    `}function Qa(){document.querySelectorAll(".add-skill-btn").forEach(t=>{t.addEventListener("click",()=>{Ie(null,t.dataset.category)})}),document.querySelectorAll(".edit-skill").forEach(t=>{t.addEventListener("click",a=>{var o;a.stopPropagation();const n=t.dataset.id||((o=t.closest(".edit-skill"))==null?void 0:o.dataset.id),i=d.getState().skills.find(r=>r.id===n);i&&Ie(i)})}),document.querySelectorAll(".delete-skill").forEach(t=>{t.addEventListener("click",async a=>{a.stopPropagation();const n=t.dataset.id;await v.confirm("Eliminar Habilidad","¿Estás seguro de que quieres eliminar esta skill?")&&(d.deleteSkill(n),v.toast("Habilidad eliminada"))})});const s=document.querySelectorAll(".skills-list");let e=null;document.querySelectorAll(".draggable-skill").forEach(t=>{t.addEventListener("dragstart",a=>{e=t.dataset.id,t.classList.add("dragging"),t.style.opacity="0.4",a.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),t.style.opacity="1",document.querySelectorAll(".skills-list").forEach(a=>a.classList.remove("drag-over"))})}),s.forEach(t=>{t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("drag-over"),a.dataTransfer.dropEffect="move"}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("drag-over");const n=[...d.getState().skills||[]],i=n.findIndex(l=>l.id===e);if(i===-1)return;const o={...n[i]};n.splice(i,1);const r=es(t,a.clientY);if(r==null)n.push(o);else{const l=r.dataset.id,u=n.findIndex(p=>p.id===l);n.splice(u,0,o)}d.reorderSkillsList(n)})})}function es(s,e){return[...s.querySelectorAll(".draggable-skill:not(.dragging)")].reduce((a,n)=>{const i=n.getBoundingClientRect(),o=e-i.top-i.height/2;return o<0&&o>a.offset?{offset:o,element:n}:a},{offset:Number.NEGATIVE_INFINITY}).element}function Ie(s=null,e="current"){const t=!!s,a=t?s.category:e,n=t?s.level:50,i=`modal-skills-${Date.now()}`;v._showModal({title:t?"Editar Habilidad":"Gestión de Mastery",message:t?"Actualiza los detalles de tu skill":"Añade una nueva habilidad a tu ecosistema",centered:!0,content:`
            <div id="${i}" style="margin-top: var(--spacing-md);">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Tipo de Habilidad</label>
                    <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 12px;">
                        <button type="button" class="btn cat-btn ${a==="current"?"active":""}" id="cat-current" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${a==="current"?"#7c3aed":"transparent"}; color: ${a==="current"?"#fff":"var(--text-muted)"}; border: none;">ACTUAL (EXPERTISE)</button>
                        <button type="button" class="btn cat-btn ${a==="next"?"active":""}" id="cat-next" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${a==="next"?"#7c3aed":"transparent"}; color: ${a==="next"?"#fff":"var(--text-muted)"}; border: none;">PRÓXIMA (A APRENDER)</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Nombre de la Skill</label>
                    <input type="text" id="skill-name" class="form-input" placeholder="Ej: React Native, Python, UI Design..." value="${t?s.name:""}" autofocus>
                </div>

                <div id="level-container" style="display: ${a==="current"?"block":"none"};">
                    <div class="form-group">
                        <label class="form-label">Nivel de Dominio: <span id="level-val" style="color: #7c3aed; font-weight: 800;">${n}%</span></label>
                        <input type="range" id="skill-level" min="1" max="100" value="${n}" style="width: 100%; accent-color: #7c3aed; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); cursor: pointer;">
                    </div>
                </div>
            </div>
        `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>{}},{text:t?"Actualizar":"Guardar Skill",type:"primary",style:"background: #7c3aed; border: none; font-weight: 800;",onClick:()=>{const o=document.getElementById("skill-name").value.trim(),r=document.getElementById("cat-current").classList.contains("active")?"current":"next",l=parseInt(document.getElementById("skill-level").value);if(!o){v.toast("El nombre es obligatorio","error");return}t?(d.updateSkill(s.id,{name:o,category:r,level:r==="current"?l:0}),v.toast("Skill actualizada")):(d.addSkill({name:o,category:r,level:r==="current"?l:0}),v.toast("Nueva skill añadida al stack"))}}]}),setTimeout(()=>{const o=document.getElementById("cat-current"),r=document.getElementById("cat-next"),l=document.getElementById("level-container"),u=document.getElementById("skill-level"),p=document.getElementById("level-val"),c=h=>{h==="current"?(o.style.background="#7c3aed",o.style.color="#fff",o.classList.add("active"),r.style.background="transparent",r.style.color="var(--text-muted)",r.classList.remove("active"),l.style.display="block"):(r.style.background="#7c3aed",r.style.color="#fff",r.classList.add("active"),o.style.background="transparent",o.style.color="var(--text-muted)",o.classList.remove("active"),l.style.display="none")};o.onclick=()=>c("current"),r.onclick=()=>c("next"),u.oninput=()=>{p.textContent=u.value+"%"}},100)}function ts(){const{aesthetics:s}=d.getState(),e=s||[],t=e.filter(i=>i.category==="current"),a=e.filter(i=>i.category==="next"),n=t.length>0?Math.round(t.reduce((i,o)=>i+o.level,0)/t.length):0;return`
    <div class="aesthetics-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <h1 class="page-title">Aesthetics & Appearance</h1>
            <p class="page-subtitle">Optimiza tu imagen personal y planifica mejoras visuales</p>
        </header>

        <!-- OVERALL SCORE HIGHLIGHT -->
        <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%); border-color: rgba(236, 72, 153, 0.3);">
            <div class="card-header">
                <span class="card-title" style="color: #ec4899;">Aesthetics Score</span>
                ${m("user","card-icon")}
            </div>
            <div class="highlight-value" style="color: #ec4899; background: none !important; -webkit-text-fill-color: initial !important;">${n}<span style="font-size: 16px; opacity: 0.6;">/100</span></div>
            <div class="highlight-label">
                ${n>85?"✨ Nivel Model Look":n>65?"🔥 Atractivo Superior":"👌 En fase de optimización"}
            </div>
        </div>

        <div class="aesthetics-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-xl);">
            <!-- CURRENT ATTRIBUTES -->
            <section class="aesthetics-section">
                <div class="section-divider">
                    <span class="section-title">Atributos Actuales</span>
                    <button class="icon-btn add-aesthetic-btn" data-category="current" style="color: white !important;">${m("plus")}</button>
                </div>
                <div class="aesthetics-list" data-category="current">
                    ${t.length===0?ze("current"):t.map(i=>as(i)).join("")}
                </div>
            </section>

            <!-- UPCOMING REFINEMENTS -->
            <section class="aesthetics-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Refinamientos (To-Do)</span>
                    <button class="icon-btn add-aesthetic-btn" data-category="next" style="color: white !important;">${m("plus")}</button>
                </div>
                <div class="aesthetics-list" data-category="next" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                    ${a.length===0?ze("next"):a.map(i=>ss(i)).join("")}
                </div>
            </section>
        </div>
    </div>
    `}function as(s){return`
    <div class="card aesthetic-card draggable-aesthetic" 
         data-id="${s.id}" 
         data-category="${s.category}" 
         draggable="true"
         style="margin-bottom: 8px; padding: 10px 16px !important; cursor: grab; border-left: 3px solid #ec4899;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="color: var(--text-muted); opacity: 0.5; cursor: grab; display: flex; align-items: center;">
                    ${m("menu")}
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${s.name}</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-aesthetic" data-id="${s.id}" style="color: white !important; width: 30px; height: 30px; padding: 0;">${m("edit")}</button>
                <button class="icon-btn delete-aesthetic" data-id="${s.id}" style="color: var(--accent-danger); width: 30px; height: 30px; padding: 0;">${m("trash")}</button>
            </div>
        </div>
        <div class="aesthetic-progress-container" style="background: rgba(255,255,255,0.05); height: 5px; border-radius: 3px; overflow: hidden; position: relative;">
            <div class="aesthetic-progress-fill" style="width: ${s.level}%; height: 100%; background: #ec4899; border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; font-weight: 600; color: var(--text-muted);">
            <span>Nivel de Atractivo</span>
            <span style="color: #ec4899;">${s.level}%</span>
        </div>
    </div>
    `}function ss(s){return`
    <div class="card next-aesthetic-card draggable-aesthetic edit-aesthetic" 
         data-id="${s.id}" 
         data-category="${s.category}" 
         draggable="true"
         style="padding: 12px 15px !important; display: flex; align-items: center; justify-content: space-between; border: 1px dashed rgba(236, 72, 153, 0.2); background: rgba(236, 72, 153, 0.02); height: auto; cursor: grab;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="color: var(--text-muted); opacity: 0.5; display: flex; align-items: center;">
                ${m("menu")}
            </div>
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary); text-align: left;">${s.name}</div>
        </div>
        <div style="color: #ec4899; opacity: 0.6;">${m("target")}</div>
    </div>
    `}function ze(s){return`
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">${s==="current"?"Añade tus rasgos físicos a optimizar":"Planifica tu próximo glow up"}</p>
    </div>
    `}function is(){document.querySelectorAll(".add-aesthetic-btn").forEach(t=>{t.addEventListener("click",()=>{Le(null,t.dataset.category)})}),document.querySelectorAll(".edit-aesthetic").forEach(t=>{t.addEventListener("click",a=>{var o;a.stopPropagation();const n=t.dataset.id||((o=t.closest(".edit-aesthetic"))==null?void 0:o.dataset.id),i=d.getState().aesthetics.find(r=>r.id===n);i&&Le(i)})}),document.querySelectorAll(".delete-aesthetic").forEach(t=>{t.addEventListener("click",async a=>{a.stopPropagation();const n=t.dataset.id;await v.confirm("Eliminar Atributo","¿Estás seguro de que quieres eliminar este elemento?")&&(d.deleteAesthetic(n),v.toast("Eliminado del perfil"))})});const s=document.querySelectorAll(".aesthetics-list");let e=null;document.querySelectorAll(".draggable-aesthetic").forEach(t=>{t.addEventListener("dragstart",a=>{e=t.dataset.id,t.classList.add("dragging"),t.style.opacity="0.4",a.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),t.style.opacity="1",document.querySelectorAll(".aesthetics-list").forEach(a=>a.classList.remove("drag-over"))})}),s.forEach(t=>{t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("drag-over");const n=[...d.getState().aesthetics||[]],i=n.findIndex(l=>l.id===e);if(i===-1)return;const o={...n[i]};n.splice(i,1);const r=os(t,a.clientY);if(r==null)n.push(o);else{const l=r.dataset.id,u=n.findIndex(p=>p.id===l);n.splice(u,0,o)}d.reorderAestheticsList(n)})})}function os(s,e){return[...s.querySelectorAll(".draggable-aesthetic:not(.dragging)")].reduce((a,n)=>{const i=n.getBoundingClientRect(),o=e-i.top-i.height/2;return o<0&&o>a.offset?{offset:o,element:n}:a},{offset:Number.NEGATIVE_INFINITY}).element}function Le(s=null,e="current"){const t=!!s,a=t?s.category:e,n=t?s.level:50,i=`modal-aesthetics-${Date.now()}`;v._showModal({title:t?"Editar Atributo":"Aesthetic Upgrade",message:t?"Actualiza los detalles de tu rasgo físico":"Define un nuevo rasgo para tu perfil estético",centered:!0,content:`
            <div id="${i}" style="margin-top: var(--spacing-md);">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Tipo de Elemento</label>
                    <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 12px;">
                        <button type="button" class="btn cat-btn ${a==="current"?"active":""}" id="aes-cat-current" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${a==="current"?"#ec4899":"transparent"}; color: ${a==="current"?"#fff":"var(--text-muted)"}; border: none;">ATRIBUTO ACTUAL</button>
                        <button type="button" class="btn cat-btn ${a==="next"?"active":""}" id="aes-cat-next" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${a==="next"?"#ec4899":"transparent"}; color: ${a==="next"?"#fff":"var(--text-muted)"}; border: none;">MEJORA FUTURA</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Nombre del Atributo/Mejora</label>
                    <input type="text" id="aes-name" class="form-input" placeholder="Ej: Pelo, Mandíbula, Piel..." value="${t?s.name:""}" autofocus>
                </div>

                <div id="aes-level-container" style="display: ${a==="current"?"block":"none"};">
                    <div class="form-group">
                        <label class="form-label">Nivel Actual: <span id="aes-level-val" style="color: #ec4899; font-weight: 800;">${n}%</span></label>
                        <input type="range" id="aes-level" min="1" max="100" value="${n}" style="width: 100%; accent-color: #ec4899; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); cursor: pointer;">
                    </div>
                </div>
            </div>
        `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>{}},{text:t?"Actualizar":"Guardar Cambio",type:"primary",style:"background: #ec4899; border: none; font-weight: 800;",onClick:()=>{const o=document.getElementById("aes-name").value.trim(),r=document.getElementById("aes-cat-current").classList.contains("active")?"current":"next",l=parseInt(document.getElementById("aes-level").value);if(!o){v.toast("El nombre es obligatorio","error");return}t?(d.updateAesthetic(s.id,{name:o,category:r,level:r==="current"?l:0}),v.toast("Perfil estético actualizado")):(d.addAesthetic({name:o,category:r,level:r==="current"?l:0}),v.toast("Nuevo rasgo añadido"))}}]}),setTimeout(()=>{const o=document.getElementById("aes-cat-current"),r=document.getElementById("aes-cat-next"),l=document.getElementById("aes-level-container"),u=document.getElementById("aes-level"),p=document.getElementById("aes-level-val"),c=h=>{h==="current"?(o.style.background="#ec4899",o.style.color="#fff",o.classList.add("active"),r.style.background="transparent",r.style.color="var(--text-muted)",r.classList.remove("active"),l.style.display="block"):(r.style.background="#ec4899",r.style.color="#fff",r.classList.add("active"),o.style.background="transparent",o.style.color="var(--text-muted)",o.classList.remove("active"),l.style.display="none")};o.onclick=()=>c("current"),r.onclick=()=>c("next"),u.oninput=()=>{p.textContent=u.value+"%"}},100)}const Ce={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},Ve=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let T="passiveAsset",nt=[];function me(s="passiveAsset",e=[]){var a,n;T=s,nt=e,(n=(a=Ce[T])==null?void 0:a.types[0])!=null&&n.value;const t=document.createElement("div");t.className="modal-overlay",t.id="add-modal",t.innerHTML=rs(),document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("active")}),ls()}function rs(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${T==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${m("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${T!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(Ce).filter(([e])=>!nt.includes(e)).map(([e,t])=>`
          <div class="type-option ${e===T?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${m(t.icon)}
            </div>
            <div class="type-option-label">${t.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${it()}
      </div>
    </div>
  `}function it(){const s=Ce[T],e=T==="investmentAsset"||T==="passiveAsset";if(e){const a=Y.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...Ve,...a]}let t="";return T==="passiveAsset"||T==="investmentAsset"?t=`
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
      ${T==="passiveAsset"?`
      <div class="form-group">
          <label class="form-label">Ingreso Mensual (en EUR)</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
      </div>`:""}
    `:T==="activeIncome"||T==="livingExpense"?t=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:T==="liability"?t=`
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
    `:T==="event"&&(t=`
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
                    ${Ve.map(a=>`<option value="${a.value}">${a.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${Y.map(a=>`<option value="${a.symbol}">${a.name} (${a.symbol})</option>`).join("")}
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
      ${m("plus")} Agregar
    </button>
  `}function ls(){const s=document.getElementById("add-modal"),e=document.getElementById("modal-close");s.addEventListener("click",a=>{a.target===s&&Ae()}),e.addEventListener("click",Ae);const t=s.querySelectorAll(".category-selector .type-option");t.forEach(a=>{a.addEventListener("click",()=>{T=a.dataset.category,t.forEach(n=>n.classList.remove("active")),a.classList.add("active"),document.getElementById("form-container").innerHTML=it(),Ye()})}),Ye()}function Ye(){const s=document.getElementById("btn-save");s&&s.addEventListener("click",cs);const e=document.getElementById("mode-qty"),t=document.getElementById("mode-total"),a=document.getElementById("input-qty"),n=document.getElementById("input-value"),i=document.getElementById("input-currency"),o=document.getElementById("input-name");if(e&&t){const l=u=>{u==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",t.style.background="transparent",t.style.color="var(--text-secondary)",a.focus()):(t.style.background="var(--accent-primary)",t.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>l("qty")),t.addEventListener("click",()=>l("total"))}const r=l=>{const u=d.getState().rates,p=i==null?void 0:i.value,c=u[p]||1;if(l==="qty"){const h=parseFloat(a.value)||0;n.value=(h*c).toFixed(2)}else{const h=parseFloat(n.value)||0;a.value=(h/c).toFixed(6)}};a==null||a.addEventListener("input",()=>r("qty")),n==null||n.addEventListener("input",()=>r("total")),i&&i.addEventListener("change",()=>{if(o&&!o.value){const l=i.options[i.selectedIndex].text;o.value=l.split(" (")[0]}r("qty")})}function cs(){var g,f,y,k,x,S,E,D,C,B,z,V;const s=(f=(g=document.getElementById("input-name"))==null?void 0:g.value)==null?void 0:f.trim(),e=(y=document.getElementById("input-type"))==null?void 0:y.value,t=(k=document.getElementById("input-currency"))==null?void 0:k.value,a=(S=(x=document.getElementById("input-details"))==null?void 0:x.value)==null?void 0:S.trim(),n=parseFloat((E=document.getElementById("input-value"))==null?void 0:E.value)||0,i=document.getElementById("input-qty"),o=i?parseFloat(i.value)||0:n,r=parseFloat((D=document.getElementById("input-amount"))==null?void 0:D.value)||0,l=parseFloat((C=document.getElementById("input-monthly"))==null?void 0:C.value)||0,u=(B=document.getElementById("input-date"))==null?void 0:B.value,p=(z=document.getElementById("input-time"))==null?void 0:z.value,c=(V=document.getElementById("input-repeat"))==null?void 0:V.value;if(!s){v.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const h={name:s,type:e,currency:t,details:a};switch(T){case"passiveAsset":d.addPassiveAsset({...h,value:o,monthlyIncome:l});break;case"activeIncome":d.addActiveIncome({...h,amount:r});break;case"livingExpense":d.addLivingExpense({...h,amount:r});break;case"investmentAsset":d.addInvestmentAsset({...h,value:o});break;case"liability":d.addLiability({...h,amount:r,monthlyPayment:l});break;case"event":d.addEvent({title:s,date:u,time:p,repeat:c,category:e});break}Ae()}function Ae(){const s=document.getElementById("add-modal");s&&(s.classList.remove("active"),setTimeout(()=>s.remove(),300))}let W=null;function ot(s=null){console.log("[LeadModal] Opening modal",{personToEdit:s});const e=document.getElementById("add-person-modal");e&&(console.log("[LeadModal] Removing existing modal"),e.remove()),W=s?s.id:null;const t=document.createElement("div");t.className="modal-overlay",t.id="add-person-modal",t.setAttribute("role","dialog"),t.innerHTML=ds(s),document.body.appendChild(t),setTimeout(()=>{var a;t.classList.add("active"),(a=t.querySelector("#person-name"))==null||a.focus()},50),us(t)}function ds(s=null){const e=s?"Editar Lead":"Lead",t=s?"Guardar Cambios":"Lead";return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <div class="header-title-wrapper" style="display: flex; align-items: center; gap: 12px;">
            <div style="background: var(--gradient-primary); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-primary); box-shadow: var(--shadow-sm);">
                ${m("plus")}
            </div>
            <h2 class="modal-title">${e}</h2>
        </div>
        <button class="modal-close" id="person-modal-close">
          ${m("x")}
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
                    ${d.getState().social.contactSources.map(a=>`
                        <option value="${a}" ${(s==null?void 0:s.source)===a?"selected":""}>${a}</option>
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
                    ${["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"].map(a=>`
                        <div class="goal-color-dot ${(s==null?void 0:s.color)===a||!(s!=null&&s.color)&&a==="#3b82f6"?"active":""}" 
                             data-color="${a}" 
                             style="background-color: ${a}; width: 28px; height: 28px;"></div>
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
                ${d.getState().social.columns.sort((a,n)=>a.order-n.order).map(a=>`<option value="${a.id}" ${(s==null?void 0:s.columnId)===a.id?"selected":""}>${a.name}</option>`).join("")}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${W?`
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${m("trash")}
            </button>`:""}
            <button class="btn btn-primary w-full" id="btn-save-person-lead" style="padding: 14px;">
                ${m("plus")} ${t}
            </button>
        </div>
      </div>
    </div>
  `}function us(s){const e=s.querySelector("#person-modal-close"),t=s.querySelector("#btn-save-person-lead"),a=s.querySelector("#btn-delete-person"),n=s.querySelector("#person-rating-slider"),i=s.querySelector("#rating-value");if(s.addEventListener("click",l=>{l.target===s&&(console.log("[LeadModal] Overlay clicked, closing"),he(s))}),e==null||e.addEventListener("click",()=>{console.log("[LeadModal] Close button clicked"),he(s)}),n&&i){const l=()=>{console.log("[LeadModal] Slider updated:",n.value),i.textContent=n.value};n.oninput=l,n.onchange=l}t&&(t.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Save button clicked"),ms(s)}),a&&(a.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Delete button clicked"),ps(s)});const o=s.querySelectorAll(".goal-color-dot"),r=s.querySelector("#person-color-value");o.forEach(l=>{l.addEventListener("click",()=>{o.forEach(u=>u.classList.remove("active")),l.classList.add("active"),r&&(r.value=l.dataset.color),console.log("[LeadModal] Color selected:",l.dataset.color)})})}async function ps(s){W&&await v.confirm("Eliminar Lead","¿Estás seguro de eliminar este lead?")&&(d.deletePerson(W),v.toast("Lead eliminado","success"),he(s))}function ms(s){var t,a,n,i,o,r,l,u,p,c,h,g,f;const e=s.querySelector("#btn-save-person-lead");if(e.disabled){console.log("[LeadModal] Save ignored, already processing");return}try{const y=(a=(t=s.querySelector("#person-name"))==null?void 0:t.value)==null?void 0:a.trim(),k=(i=(n=s.querySelector("#person-phone"))==null?void 0:n.value)==null?void 0:i.trim(),x=(r=(o=s.querySelector("#person-city"))==null?void 0:o.value)==null?void 0:r.trim(),S=(l=s.querySelector("#person-source"))==null?void 0:l.value,E=(u=s.querySelector("#person-rating-slider"))==null?void 0:u.value,D=(c=(p=s.querySelector("#person-desc"))==null?void 0:p.value)==null?void 0:c.trim(),C=(h=s.querySelector("#person-column"))==null?void 0:h.value,B=(g=s.querySelector("#person-color-value"))==null?void 0:g.value,z=(f=s.querySelector("#person-last-contact"))==null?void 0:f.value;if(console.log("[LeadModal] Attempting to save",{name:y,rating:E,columnId:C,color:B,lastContact:z}),!y){console.warn("[LeadModal] Save failed: Missing name"),v.toast("El nombre es obligatorio","error");return}e.disabled=!0,e.innerHTML='<span class="loading-spinner-sm"></span> Guardando...';const V={name:y,phone:k,city:x,source:S,rating:parseInt(E)||5,description:D,columnId:C,color:B,lastContact:z};W?(console.log("[LeadModal] Updating person",W),d.updatePerson(W,V),v.toast("Lead actualizado correctamente","success")):(console.log("[LeadModal] Adding new person"),d.addPerson(V),v.toast("Lead guardado correctamente","success")),console.log("[LeadModal] Save successful, closing modal"),he(s)}catch(y){console.error("[LeadModal] Error saving lead:",y),v.toast("Error al guardar el lead","error"),e.disabled=!1,e.innerHTML=`${m("plus")} Lead`}}function he(s){s&&(console.log("[LeadModal] Closing modal"),s.classList.remove("active"),setTimeout(()=>{s.parentNode&&(console.log("[LeadModal] Removing modal from DOM"),s.remove())},400))}function vs(){const s=I.isSetup(),e=I.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${m("lock","auth-icon")}
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
                    ${m("fingerprint")} Usar Huella
                </button>
                `:""}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `}function gs(s){var i;const e=document.getElementById("auth-submit-btn"),t=document.getElementById("auth-bio-btn"),a=document.getElementById("auth-password"),n=async()=>{const o=a.value,r=document.getElementById("auth-confirm"),l=I.isSetup();try{let u;if(l)u=await I.unlock(o);else{if(!o||o.length<4)throw new Error("Contraseña demasiado corta");if(o!==r.value)throw new Error("Las contraseñas no coinciden");u=await I.setup(o)}await d.loadEncrypted(u),s()}catch(u){v.alert("Error",u.message)}};e==null||e.addEventListener("click",n),a==null||a.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),n())}),(i=document.getElementById("auth-confirm"))==null||i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),n())}),t==null||t.addEventListener("click",async()=>{try{const o=await I.unlockWithBiometrics();await d.loadEncrypted(o),s()}catch(o){v.alert("Identificación",o.message)}}),I.isBioEnabled()&&setTimeout(async()=>{try{const o=await I.unlockWithBiometrics();await d.loadEncrypted(o),s()}catch{console.log("Auto-bio failed or cancelled")}},500)}let P=localStorage.getItem("life-dashboard/app_current_page")||"finance",L=localStorage.getItem("life-dashboard/app_current_sub_page")||null;L==="null"&&(L=null);async function Ke(){window.addEventListener("open-add-modal",e=>{var a,n;const t=(a=e.detail)==null?void 0:a.type;t==="person"?ot((n=e.detail)==null?void 0:n.person):me(t)}),U.init().catch(e=>console.warn("[Drive] Pre-init failed:",e)),window.addEventListener("nav-change",e=>{var a;const t=(a=e.detail)==null?void 0:a.page;if(t){P=t,L=null,localStorage.setItem("life-dashboard/app_current_page",P),_();const n=document.getElementById("bottom-nav");n&&(n.innerHTML=ke(P))}});const s=I.getVaultKey();s?await d.loadEncrypted(s)?rt():(console.error("[Boot] Decryption failed, invalid vault key in session?"),I.logout(),We()):We()}function We(){const s=document.getElementById("app");s.innerHTML=vs(),gs(()=>{rt()})}function rt(){const s=document.getElementById("app");s.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,lt(),d.subscribe(()=>{_()}),window.reRender=()=>_(),hs()}function hs(){var a,n;const s=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(s&&(Date.now()-parseInt(s))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
        <div class="pwa-install-banner-icon">
            ${m("download")}
        </div>
        <div class="pwa-install-banner-text">
            <div class="pwa-install-banner-title">Instalar Life Dashboard</div>
            <div class="pwa-install-banner-subtitle">Accede más rápido desde tu pantalla de inicio</div>
        </div>
        <button class="pwa-install-btn" id="pwa-banner-install">Instalar</button>
        <button class="pwa-install-close" id="pwa-banner-close">
            ${m("x")}
        </button>
    `,document.body.appendChild(e);const t=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};t(),window.addEventListener("beforeinstallprompt",t),(a=document.getElementById("pwa-banner-install"))==null||a.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:i}=await window.deferredPrompt.userChoice;i==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function lt(){const s=document.getElementById("bottom-nav");s.innerHTML=ke(P),_e(e=>{P=e,L=null,localStorage.setItem("life-dashboard/app_current_page",P),localStorage.setItem("life-dashboard/app_current_sub_page",L),G(),_(),s.innerHTML=ke(P),_e(t=>{P=t,L=null,localStorage.setItem("life-dashboard/app_current_page",P),localStorage.setItem("life-dashboard/app_current_sub_page",L),G(),_(),lt()})}),ys(),_()}function _(){const s=document.getElementById("main-content");if(!s)return;const e=s.scrollTop;if(L==="compound"){s.innerHTML=Vt(),Yt(()=>{L=null,Kt(),G(),_()}),s.scrollTop=e;return}if(L==="expenses"){s.innerHTML=wa(),Ea(()=>{L=null,G(),_()}),s.scrollTop=e;return}if(L==="market"){s.innerHTML=Wt(),Jt(()=>{L=null,G(),_()}),s.scrollTop=e;return}switch(s.classList.toggle("no-padding-mobile",P==="health"),P){case"finance":G(),s.innerHTML=Ue(),Oe(),Xe();break;case"goals":R(),s.innerHTML=Ge(),Fe();break;case"habits":R(),s.innerHTML=Ga(),za();break;case"social":R(),s.innerHTML=Ta(),Ma();break;case"health":s.innerHTML=Zt(),na(),R();break;case"menu":s.innerHTML=Aa(),Ca(t=>{P=t,G(),_()}),R();break;case"calendar":s.innerHTML=ma(),ba(),G();break;case"goals":R(),s.innerHTML=Ge(),Fe();break;case"skills":s.innerHTML=Xa(),Qa(),R();break;case"aesthetics":s.innerHTML=ts(),is(),R();break;case"settings":s.innerHTML=Ia(),La(),R();break;default:G(),s.innerHTML=Ue(),Oe(),Xe()}requestAnimationFrame(()=>{s.scrollTop=e})}function Xe(){const s=document.getElementById("open-compound");s&&s.addEventListener("click",()=>{L="compound",localStorage.setItem("life-dashboard/app_current_sub_page",L),R(),_()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{L="market",localStorage.setItem("life-dashboard/app_current_sub_page",L),R(),_()});const t=document.getElementById("open-expenses");t&&t.addEventListener("click",()=>{L="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",L),R(),_()})}function ys(){const s=document.querySelector(".fab");s&&s.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=m("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{const t=localStorage.getItem("life-dashboard/app_current_page")||P;if(t==="calendar")me("event");else if(t==="health"){const a=await ns.confirm("Log Metric","What do you want to record today?","Weight","Body Fat");if(a===!0){const n=await ns.prompt("Log Weight","Enter your current weight in kg:","","number");n&&d.addWeightLog(n)}else if(a===!1){const n=await ns.prompt("Body Fat","Enter your body fat %:","","number");n&&d.addFatLog(n)}}else t==="social"?ot():t==="skills"?Ie():t==="aesthetics"?Le():t==="habits"?Wa():t==="finance"||t==="goals"||!t?me("passiveAsset",["event"]):me()}),document.body.appendChild(e)}function R(){const s=document.getElementById("main-fab");s&&(s.style.display="none")}function G(){const s=document.getElementById("main-fab");s&&(s.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ke):Ke();window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),window.deferredPrompt=s,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});export{m as g,v as n,d as s};
