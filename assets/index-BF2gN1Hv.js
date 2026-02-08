var ht=Object.defineProperty;var yt=(t,e,a)=>e in t?ht(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var pe=(t,e,a)=>yt(t,typeof e!="symbol"?e+"":e,a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const ft="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token,cardano,ondo-finance&vs_currencies=eur,ars",bt="https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD";async function wt(){var e,a,s,n,i,o,r,l,u,c,d,g,h,f,y;const t={EUR:1};try{const k=await(await fetch(ft)).json();t.BTC=((e=k.bitcoin)==null?void 0:e.eur)||4e4,t.ETH=((a=k.ethereum)==null?void 0:a.eur)||2200,t.XRP=((s=k.ripple)==null?void 0:s.eur)||.5,t.KAS=((n=k.kaspa)==null?void 0:n.eur)||.1,t.SOL=((i=k.solana)==null?void 0:i.eur)||90,t.XLM=((o=k.stellar)==null?void 0:o.eur)||.11,t.ALGO=((r=k.algorand)==null?void 0:r.eur)||.18,t.LTC=((l=k.litecoin)==null?void 0:l.eur)||65,t.SUI=((u=k.sui)==null?void 0:u.eur)||1.1,t.LINK=((c=k.chainlink)==null?void 0:c.eur)||14,t.RNDR=((d=k["render-token"])==null?void 0:d.eur)||4.5,t.ADA=((g=k.cardano)==null?void 0:g.eur)||.45,t.ONDO=((h=k["ondo-finance"])==null?void 0:h.eur)||.7,(f=k.bitcoin)!=null&&f.ars&&((y=k.bitcoin)!=null&&y.eur)&&(t.ARS=k.bitcoin.eur/k.bitcoin.ars);const L=await fetch(bt);if(L.ok){const E=await L.json();t.USD=1/E.rates.USD,t.CHF=1/E.rates.CHF,t.GBP=1/E.rates.GBP,t.AUD=1/E.rates.AUD}t.GOLD=2100,t.SP500=4700}catch(x){console.error("Failed to fetch some prices:",x),t.USD=t.USD||.92,t.CHF=t.CHF||1.05,t.GBP=t.GBP||1.15,t.AUD=t.AUD||.6,t.ARS=t.ARS||.001}return t}class H{static async hash(e,a="salt_life_dashboard_2026"){const n=new TextEncoder().encode(e+a),i=await crypto.subtle.digest("SHA-512",n);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}static async deriveVaultKey(e){return await this.hash(e,"vault_v4_dashboard_key")}static async deriveKey(e,a){const s=new TextEncoder,n=await crypto.subtle.importKey("raw",s.encode(e),{name:"PBKDF2"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"PBKDF2",salt:s.encode(a),iterations:25e4,hash:"SHA-512"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async encrypt(e,a){try{const s=crypto.getRandomValues(new Uint8Array(16)),n=crypto.getRandomValues(new Uint8Array(12)),i=await this.deriveKey(a,this.bufToBase64(s)),o=typeof e=="string"?e:JSON.stringify(e),r=new TextEncoder().encode(o),l=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},i,r);return{payload:this.bufToBase64(new Uint8Array(l)),iv:this.bufToBase64(n),salt:this.bufToBase64(s),v:"5.0"}}catch(s){throw console.error("[Security] Encryption failed:",s),new Error("No se pudo encriptar la información")}}static async decrypt(e,a){try{if(!e||!e.payload||!e.iv||!e.salt)throw new Error("Formato de datos encriptados inválido");const{payload:s,iv:n,salt:i}=e,o=await this.deriveKey(a,i),r=await crypto.subtle.decrypt({name:"AES-GCM",iv:this.base64ToBuf(n)},o,this.base64ToBuf(s)),l=new TextDecoder().decode(r);try{return JSON.parse(l)}catch{return l}}catch(s){throw console.error("[Security] Decryption failed:",s),new Error("Contraseña incorrecta o datos corruptos")}}static bufToBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static base64ToBuf(e){return new Uint8Array(atob(e).split("").map(a=>a.charCodeAt(0)))}}const Be=Object.freeze(Object.defineProperty({__proto__:null,SecurityService:H},Symbol.toStringTag,{value:"Module"})),M={MASTER_HASH:"life-dashboard/db_master_hash",VAULT_KEY:"life-dashboard/db_vault_key",BIO_ENABLED:"life-dashboard/db_bio_enabled"};class S{static isSetup(){return!!localStorage.getItem(M.MASTER_HASH)}static async setup(e){const a=await H.hash(e),s=await H.deriveVaultKey(e);return localStorage.setItem(M.MASTER_HASH,a),sessionStorage.setItem(M.VAULT_KEY,s),s}static async unlock(e){const a=await H.hash(e),s=localStorage.getItem(M.MASTER_HASH);if(a===s){const n=await H.deriveVaultKey(e);return sessionStorage.setItem(M.VAULT_KEY,n),n}throw new Error("Contraseña incorrecta")}static async registerBiometrics(e){await this.unlock(e);const a=sessionStorage.getItem(M.VAULT_KEY);if(!window.PublicKeyCredential)throw new Error("Biometría no soportada en este dispositivo");try{const s=crypto.getRandomValues(new Uint8Array(32));return await navigator.credentials.create({publicKey:{challenge:s,rp:{name:"Life Dashboard",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"User"},pubKeyCredParams:[{alg:-7,type:"public-key"}],timeout:6e4,authenticatorSelection:{authenticatorAttachment:"platform"},attestation:"none"}}),localStorage.setItem(M.BIO_ENABLED,"true"),localStorage.setItem(M.VAULT_KEY,a),!0}catch(s){throw console.error("Biometric setup failed:",s),new Error("Error al configurar biometría")}}static async unlockWithBiometrics(){if(!(localStorage.getItem(M.BIO_ENABLED)==="true"))throw new Error("Biometría no activada");try{const a=crypto.getRandomValues(new Uint8Array(32));await navigator.credentials.get({publicKey:{challenge:a,rpId:window.location.hostname,userVerification:"required",timeout:6e4}});const s=localStorage.getItem(M.VAULT_KEY);if(s)return sessionStorage.setItem(M.VAULT_KEY,s),s;throw new Error("Llave no encontrada. Usa contraseña.")}catch(a){throw console.error("Biometric auth failed:",a),new Error("Fallo de identificación biométrica")}}static logout(){sessionStorage.removeItem(M.VAULT_KEY)}static getVaultKey(){return sessionStorage.getItem(M.VAULT_KEY)}static isBioEnabled(){return localStorage.getItem(M.BIO_ENABLED)==="true"}}const Ee="974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com",Pe=[71,79,67,83,80,88,45,112,121,52,68,109,80,83,107,45,100,75,55,99,73,66,116,106,65,81,75,90,70,75,118,95,66,87,95].map(t=>String.fromCharCode(t)).join(""),xt="https://www.googleapis.com/auth/drive.file";class O{static hasToken(){const e=!!this.accessToken;return localStorage.getItem("life-dashboard/drive_connected")==="true"&&e}static async init(){return this._initPromise?this._initPromise:(this._initPromise=new Promise((e,a)=>{const s=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}),this.codeClient=google.accounts.oauth2.initCodeClient({client_id:Ee,scope:xt,ux_mode:"popup",access_type:"offline",prompt:"consent",callback:async n=>{if(n.error){console.error("[Drive] Auth callback error:",n);return}if(n.code)try{const i=sessionStorage.getItem("life-dashboard/pkce_verifier"),o=localStorage.getItem("life-dashboard/drive_client_secret")||Pe,r=await this.exchangeCodeForTokens(n.code,i,Ee,o);r.refresh_token&&await this.saveRefreshToken(r.refresh_token),this.saveSession(r),console.log("[Drive] Connected successfully via offline flow."),window.ns&&window.ns.toast("Google Drive vinculado"),typeof window.reRender=="function"&&window.reRender()}catch(i){console.error("[Drive] Token exchange error:",i),window.ns&&window.ns.alert("Error Auth","No se pudieron obtener tokens. Verifica el Client Secret.")}}}),localStorage.getItem("life-dashboard/drive_connected")==="true"&&this.ensureValidToken().catch(n=>{console.log("[Drive] Initial silent restoration skipped:",n.message)}),e(!0)}catch(n){console.error("[Drive] Init error:",n),a(n)}}):setTimeout(s,200)};s()}),this._initPromise)}static saveSession(e){this.accessToken=e.access_token,gapi.client.setToken({access_token:e.access_token}),localStorage.setItem("life-dashboard/drive_access_token",e.access_token),localStorage.setItem("life-dashboard/drive_connected","true");const a=e.expires_in||3600,s=Date.now()+a*1e3;localStorage.setItem("life-dashboard/drive_token_expiry",s.toString())}static async authenticate(){this.codeClient||await this.init();const{verifier:e}=await this.generatePKCE();sessionStorage.setItem("life-dashboard/pkce_verifier",e),this.codeClient.requestCode()}static async ensureValidToken(){const e=parseInt(localStorage.getItem("life-dashboard/drive_token_expiry")||"0");if(!(localStorage.getItem("life-dashboard/drive_connected")==="true"))return null;if(!this.accessToken||Date.now()>e-3e5){console.log("[Drive] Access token expired or near expiry, attempting refresh...");const n=await this.getRefreshToken();if(n)try{const i=localStorage.getItem("life-dashboard/drive_client_secret")||Pe,o=await this.refreshAccessToken(n,Ee,i),r={access_token:o.access_token,expires_in:o.expires_in,refresh_token:o.refresh_token||n};return o.refresh_token&&await this.saveRefreshToken(o.refresh_token),this.saveSession(r),this.accessToken}catch(i){throw console.error("[Drive] Token refresh failed:",i),new Error("Sesión de Google Drive expirada. Por favor reconecta en Configuración.")}else throw console.warn("[Drive] No refresh token found."),new Error("Google Drive no está vinculado para acceso offline.")}return this.accessToken&&(!gapi.client.getToken()||gapi.client.getToken().access_token!==this.accessToken)&&gapi.client.setToken({access_token:this.accessToken}),this.accessToken}static async generatePKCE(){const e=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(o=>("0"+o.toString(16)).slice(-2)).join(""),s=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",s),i=btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return{verifier:e,challenge:i}}static async exchangeCodeForTokens(e,a,s,n=null){const i=new URLSearchParams({client_id:s,code:e,grant_type:"authorization_code",redirect_uri:"postmessage"});a&&!n&&i.append("code_verifier",a),n&&i.append("client_secret",n);const o=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:i});if(!o.ok){const r=await o.json();throw new Error(r.error_description||"Failed to exchange code")}return await o.json()}static async refreshAccessToken(e,a,s=null){const n=new URLSearchParams({client_id:a,refresh_token:e,grant_type:"refresh_token"});s&&n.append("client_secret",s);const i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!i.ok){const o=await i.json();throw new Error(o.error_description||"Failed to refresh token")}return await i.json()}static async saveRefreshToken(e){return new Promise((a,s)=>{const n=indexedDB.open("LifeDashboardAuthDB",1);n.onupgradeneeded=i=>{const o=i.target.result;o.objectStoreNames.contains("tokens")||o.createObjectStore("tokens")},n.onsuccess=i=>{const r=i.target.result.transaction("tokens","readwrite");r.objectStore("tokens").put(e,"drive_refresh_token"),r.oncomplete=()=>a(),r.onerror=l=>s(l)},n.onerror=i=>s(i)})}static async getRefreshToken(){return new Promise((e,a)=>{const s=indexedDB.open("LifeDashboardAuthDB",1);s.onupgradeneeded=n=>{const i=n.target.result;i.objectStoreNames.contains("tokens")||i.createObjectStore("tokens")},s.onsuccess=n=>{const i=n.target.result;if(!i.objectStoreNames.contains("tokens")){e(null);return}const l=i.transaction("tokens","readonly").objectStore("tokens").get("drive_refresh_token");l.onsuccess=()=>e(l.result),l.onerror=u=>a(u)},s.onerror=n=>a(n)})}static async clearTokens(){return localStorage.removeItem("life-dashboard/drive_access_token"),localStorage.removeItem("life-dashboard/drive_connected"),localStorage.removeItem("life-dashboard/drive_token_expiry"),new Promise(e=>{const a=indexedDB.open("LifeDashboardAuthDB",1);a.onsuccess=s=>{const n=s.target.result;if(n.objectStoreNames.contains("tokens")){const i=n.transaction("tokens","readwrite");i.objectStore("tokens").clear(),i.oncomplete=()=>e()}else e()},a.onerror=()=>e()})}static async getOrCreateFolderPath(e){var n;await this.ensureValidToken(),(n=gapi.client)!=null&&n.drive||await this.init();const a=e.split("/").filter(i=>i);let s="root";for(const i of a){const o=`name = '${i}' and mimeType = 'application/vnd.google-apps.folder' and '${s}' in parents and trashed = false`,l=(await gapi.client.drive.files.list({q:o,fields:"files(id, name)"})).result.files;if(l&&l.length>0)s=l[0].id;else{const u={name:i,mimeType:"application/vnd.google-apps.folder",parents:[s]};s=(await gapi.client.drive.files.create({resource:u,fields:"id"})).result.id}}return s}static async pushData(e,a,s=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pushing encrypted data...${s?" (Retry)":""}`);const n=await this.getOrCreateFolderPath("/backup/life-dashboard/"),i=await H.encrypt(e,a),o="dashboard_vault_v5.bin",r=`name = '${o}' and '${n}' in parents and trashed = false`,u=(await gapi.client.drive.files.list({q:r,fields:"files(id)"})).result.files,c=new Blob([JSON.stringify(i)],{type:"application/json"});if(u&&u.length>0){const d=u[0].id,g=await fetch(`https://www.googleapis.com/upload/drive/v3/files/${d}?uploadType=media`,{method:"PATCH",headers:{Authorization:`Bearer ${this.accessToken}`},body:c});if(g.status===401&&!s)return await this.ensureValidToken(),await this.pushData(e,a,!0);if(!g.ok)throw new Error(`Error al actualizar backup: ${g.status}`)}else{const d={name:o,parents:[n]},g=new FormData;g.append("metadata",new Blob([JSON.stringify(d)],{type:"application/json"})),g.append("file",c);const h=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:`Bearer ${this.accessToken}`},body:g});if(h.status===401&&!s)return await this.ensureValidToken(),await this.pushData(e,a,!0);if(!h.ok)throw new Error(`Error al crear backup: ${h.status}`)}return!0}catch(n){throw console.error("[Drive] Push failed:",n),new Error(n.message||"Fallo al subir datos a Drive")}}static async pullData(e,a=!1){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");console.log(`[Drive] Pulling data...${a?" (Retry)":""}`);const i=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,r=(await gapi.client.drive.files.list({q:i,fields:"files(id, name)"})).result.files;if(!r||r.length===0)return null;const l=r[0].id,u=await fetch(`https://www.googleapis.com/drive/v3/files/${l}?alt=media`,{headers:{Authorization:`Bearer ${this.accessToken}`}});if(u.status===401&&!a)return await this.ensureValidToken(),await this.pullData(e,!0);if(!u.ok)throw new Error(`Error al descargar backup: ${u.status}`);const c=await u.json();return await H.decrypt(c,e)}catch(s){throw console.error("[Drive] Pull failed:",s),new Error(s.message||"Fallo al recuperar datos de Drive")}}static async deleteBackup(){try{if(await this.ensureValidToken(),!this.accessToken)throw new Error("Cloud not connected");const s=`name = 'dashboard_vault_v5.bin' and '${await this.getOrCreateFolderPath("/backup/life-dashboard/")}' in parents and trashed = false`,i=(await gapi.client.drive.files.list({q:s,fields:"files(id)"})).result.files;if(i&&i.length>0){const o=i[0].id;return await gapi.client.drive.files.delete({fileId:o}),console.log("[Drive] Backup deleted successfully"),!0}return!1}catch(e){throw console.error("[Drive] Deletion failed:",e),new Error(e.message||"Fallo al borrar backup en Drive")}}}pe(O,"codeClient",null),pe(O,"accessToken",localStorage.getItem("life-dashboard/drive_access_token")||null),pe(O,"_initPromise",null);const Re={wallet:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',target:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',settings:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',building:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',bitcoin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>',dollarSign:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',car:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',creditCard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',landmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',x:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',chevronUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',calculator:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',arrowUpRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',arrowDownRight:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>',piggyBank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>',receipt:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',coins:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',scale:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',briefcase:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',zap:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',download:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',downloadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',uploadCloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12V21"/><path d="m16 16-4-4-4 4"/></svg>',cloud:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',refreshCw:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',logOut:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',package:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',moreVertical:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',users:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',messageSquare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',phone:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',instagram:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',facebook:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',linkedin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',alertCircle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"/><path d="M5 15.1a7 7 0 0 0 10.9 0"/><path d="M6 13.6a7 7 0 0 0 4.6 2.4"/><path d="M13.4 16a7 7 0 0 0 4.6-2.4"/><path d="M8 12.1a5 5 0 0 0 6.9 0"/><path d="M9.1 11a3 3 0 0 0 3.9 0"/><path d="M12 18.5V20"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',palette:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12c0 0 3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',clock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',barChart2:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',brain:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>',rocket:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>',coffee:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',bookOpen:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',trendingUp:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',dumbbell:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',code:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',music:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',monitor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'};function m(t,e=""){return(Re[t]||Re.package).replace("<svg",`<svg class="${e}"`)}class kt{constructor(){this.toastContainer=null,this._initToastContainer()}_initToastContainer(){document.getElementById("toast-container")||(this.toastContainer=document.createElement("div"),this.toastContainer.id="toast-container",this.toastContainer.className="toast-container",document.body.appendChild(this.toastContainer))}toast(e,a="success",s=3e3){const n=document.createElement("div");n.className=`toast toast-${a} stagger-in`;const i=a==="success"?"check":a==="error"?"alertCircle":"info";n.innerHTML=`
            <div class="toast-content">
                ${m(i,"toast-icon")}
                <span>${e}</span>
            </div>
        `,this.toastContainer.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),500)},s)}alert(e,a){return new Promise(s=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:"Entendido",type:"primary",onClick:()=>s(!0)}]})})}confirm(e,a,s="Confirmar",n="Cancelar"){return new Promise(i=>{this._showModal({title:e,message:a,centered:!0,buttons:[{text:n,type:"secondary",onClick:()=>i(!1)},{text:s,type:"danger",onClick:()=>i(!0)}]})})}prompt(e,a,s="",n="text"){return new Promise(i=>{const o=`prompt-input-${Date.now()}`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${n}" id="${o}" class="form-input" value="${s}" autofocus>
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)},{text:"Aceptar",type:"primary",onClick:()=>{const r=document.getElementById(o).value;i(r)}}]}),setTimeout(()=>{const r=document.getElementById(o);r&&(r.focus(),r.select&&r.select())},100)})}select(e,a,s=[],n=4){return new Promise(i=>{const o=`display: grid; grid-template-columns: repeat(${n}, 1fr); gap: 8px; margin-top: 16px;`;this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="${o}">
                        ${s.map((l,u)=>`
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${l.value||l}">
                                ${l.label||l}
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>i(null)}]});const r=document.querySelector(".modal-overlay.active");r&&r.querySelectorAll(".select-option-btn").forEach(l=>{l.addEventListener("click",()=>{i(l.dataset.value),this._closeModal(r)})})})}hardConfirm(e,a,s="BORRAR"){return new Promise(n=>{const i=`hard-confirm-input-${Date.now()}`,o=`hard-confirm-btn-${Date.now()}`;this._showModal({title:e,message:`<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${a}<br><br>Escribe <strong>${s}</strong> para confirmar:`,centered:!0,content:`
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${i}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(!1)},{text:"Borrar Todo",type:"danger",id:o,disabled:!0,onClick:()=>n(!0)}]});const r=document.getElementById(i),l=document.getElementById(o);r.addEventListener("input",()=>{const u=r.value.trim().toUpperCase()===s.toUpperCase();l.disabled=!u,l.style.opacity=u?"1":"0.3",l.style.pointerEvents=u?"auto":"none"})})}performance(e,a){const s=[{rating:1,emoji:"🫣",label:"Baja"},{rating:3,emoji:"😐",label:"Media"},{rating:5,emoji:"😎",label:"Alta"}];return new Promise(n=>{this._showModal({title:e,message:a,centered:!0,content:`
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${s.map(o=>`
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${o.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${o.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${o.label}</span>
                            </button>
                        `).join("")}
                    </div>
                `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>n(null)}]});const i=document.querySelector(".modal-overlay.active");i&&i.querySelectorAll(".perf-emoji-btn").forEach(o=>{o.addEventListener("click",()=>{n(parseInt(o.dataset.value)),this._closeModal(i)})})})}_showModal({title:e,message:a,content:s="",buttons:n=[],centered:i=!1}){const o=document.createElement("div");o.className=`modal-overlay ${i?"overlay-centered":""}`,o.style.zIndex="9999";const r=`modal-${Date.now()}-${Math.floor(Math.random()*1e3)}`;o.id=r;const l=`
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${e}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${a}</div>
                    ${s}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    ${n.map((d,g)=>`
                        <button class="btn btn-${d.type} w-full" data-index="${g}" style="min-height: 48px; font-size: 16px; ${d.disabled?"opacity: 0.3; pointer-events: none;":""}" ${d.id?`id="${d.id}"`:""}>
                            ${d.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;o.innerHTML=l,document.body.appendChild(o),o.offsetHeight,o.classList.add("active"),setTimeout(()=>{const d=o.querySelectorAll(".modal-footer button");d.length>0&&d[d.length-1].focus()},100);const u=d=>{d.key==="Escape"&&(n.some(h=>h.type==="danger")||(o.removeEventListener("keydown",u),this._closeModal(o)))};o.tabIndex=-1,o.addEventListener("keydown",u),o.querySelectorAll(".modal-footer button").forEach(d=>{const g=d.dataset.index;if(g!==void 0){const h=n[g];d.addEventListener("click",async f=>{if(f.stopPropagation(),!d.classList.contains("btn-processing")){d.classList.add("btn-processing"),d.style.pointerEvents="none";try{h.onClick&&await h.onClick(),await this._closeModal(o)}catch(y){console.error("Modal button action failed",y),d.classList.remove("btn-processing"),d.style.pointerEvents="auto"}}})}}),o.addEventListener("click",async d=>{if(d.target===o&&!n.some(h=>h.type==="danger")){const h=n.find(f=>f.type==="secondary");h&&h.onClick(),await this._closeModal(o)}})}async _closeModal(e){e.classList.remove("active");const a=e.querySelector(".modal");return a&&a.classList.add("animate-out"),new Promise(s=>{setTimeout(()=>{e.remove(),s()},300)})}}const v=new kt,$e="life-dashboard/data",je="life-dashboard/secured",me={passiveAssets:[],activeIncomes:[],livingExpenses:[],otherExpenses:[],investmentAssets:[],liabilities:[],currency:"EUR",currencySymbol:"€",rates:{EUR:1,USD:.92,BTC:37e3,ETH:2100,XRP:.45,GOLD:1900,SP500:4500,CHF:1.05,GBP:1.15,AUD:.6,ARS:.001,RNDR:4.5},hideRealEstate:!1,health:{weightLogs:[],weightGoal:70,weightGoalDate:null,fatLogs:[],fatGoal:15,exerciseLogs:[],routines:[{id:"1",name:"Día 1: Empuje",exercises:[{name:"Press Banca",weight:60,reps:14,sets:4},{name:"Press Militar",weight:40,reps:14,sets:4}]},{id:"2",name:"Día 2: Tirón",exercises:[{name:"Dominadas",weight:0,reps:14,sets:4},{name:"Remo con Barra",weight:50,reps:14,sets:4}]}],calorieLogs:[]},goals:[{id:"1",title:"Ejemplo de Meta Diaria",timeframe:"day",completed:!1,category:"Personal"}],events:[],social:{people:[],columns:[{id:"1",name:"Chat",color:"#3b82f6",order:0},{id:"2",name:"Phone",color:"#8b5cf6",order:1},{id:"3",name:"Meeting",color:"#10b981",order:2},{id:"4",name:"Closed",color:"#f59e0b",order:3}],communications:[],contactSources:["Instagram","WhatsApp","Bumble","LinkedIn","Evento","Amigo","Otro"],idealLeadProfile:""},lastMarketData:[],marketFavorites:[],wealthGoals:[],inflationRate:3,projectionYears:10,timeInvest:{activities:[{id:"1",name:"Meditar",icon:"brain",color:"#8b5cf6",subActivities:[]},{id:"2",name:"Emprender",icon:"rocket",color:"#f59e0b",subActivities:[{id:"s1",name:"Marketing"},{id:"s2",name:"Desarrollo"},{id:"s3",name:"Ventas"}]}],logs:[],pomodoroTime:25},scheduledTasks:[],skills:[]};class Et{constructor(){this.state=this.loadState(),this.listeners=new Set,this.refreshRates(),setInterval(()=>this.refreshRates(),5*60*1e3),this.syncTimeout=null}loadState(){return{...me}}async loadEncrypted(e){const a=localStorage.getItem(je),s=localStorage.getItem($e);if(a)try{const n=JSON.parse(a),i=await H.decrypt(n,e);return this.state={...me,...i},this.processScheduledTasks(),this.notify(),!0}catch(n){return console.error("Failed to decrypt state:",n),!1}else if(s)try{const n=JSON.parse(s);return this.state={...me,...n},await this.saveState(),localStorage.removeItem($e),console.log("Migration to encrypted storage successful"),this.notify(),!0}catch(n){return console.error("Migration failed:",n),!1}return!1}async refreshRates(){const e=await wt();this.setState({rates:{...this.state.rates,...e},lastRatesUpdate:Date.now()})}async saveState(){try{const e=S.getVaultKey();if(e){console.log("[Store] Saving state to encrypted storage...");const a=await H.encrypt(this.state,e);localStorage.setItem(je,JSON.stringify(a)),localStorage.removeItem($e),console.log("[Store] State saved successfully.")}else console.warn("[Store] Attempted to save without Vault Key. Save skipped. Data will be lost on refresh.")}catch(e){console.error("[Store] Failed to save state:",e)}}getState(){return this.state}setState(e){this.state={...this.state,...e},this.saveState(),this.notify()}resetState(e){this.state={...me,...e},this.saveState(),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}toggleRealEstate(){this.setState({hideRealEstate:!this.state.hideRealEstate})}setCurrency(e){const a={EUR:"€",USD:"$",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$",BTC:"₿"};this.setState({currency:e,currencySymbol:a[e]||"$"})}convertToEUR(e,a){if(!a||a==="EUR")return e||0;const s=this.state.rates[a]||1;return(e||0)*s}convertFromEUR(e,a){if(!a||a==="EUR")return e;const s=this.state.rates[a];return s&&s!==0?e/s:e}saveMarketData(e){this.setState({lastMarketData:e})}addAssetFromMarket(e,a="investment"){const s={name:e.name,currency:e.symbol.toUpperCase(),value:1,details:`Añadido desde Mercados del Mundo (${e.id})`};return a==="passive"?this.addPassiveAsset({...s,monthlyIncome:0}):this.addInvestmentAsset(s)}toggleMarketFavorite(e){const a=this.state.marketFavorites||[],s=a.includes(e)?a.filter(n=>n!==e):[...a,e];this.setState({marketFavorites:s})}convertValue(e,a){const s=this.convertToEUR(e,a);return this.convertFromEUR(s,this.state.currency)}addPassiveAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({passiveAssets:[...this.state.passiveAssets,a]}),a}updatePassiveAsset(e,a){this.setState({passiveAssets:this.state.passiveAssets.map(s=>s.id===e?{...s,...a}:s)})}deletePassiveAsset(e){this.setState({passiveAssets:this.state.passiveAssets.filter(a=>a.id!==e)})}addActiveIncome(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({activeIncomes:[...this.state.activeIncomes,a]}),a}updateActiveIncome(e,a){this.setState({activeIncomes:this.state.activeIncomes.map(s=>s.id===e?{...s,...a}:s)})}deleteActiveIncome(e){this.setState({activeIncomes:this.state.activeIncomes.filter(a=>a.id!==e)})}addLivingExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({livingExpenses:[...this.state.livingExpenses,a]}),a}updateLivingExpense(e,a){this.setState({livingExpenses:this.state.livingExpenses.map(s=>s.id===e?{...s,...a}:s)})}deleteLivingExpense(e){this.setState({livingExpenses:this.state.livingExpenses.filter(a=>a.id!==e)})}addOtherExpense(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({otherExpenses:[...this.state.otherExpenses,a]}),a}updateOtherExpense(e,a){this.setState({otherExpenses:this.state.otherExpenses.map(s=>s.id===e?{...s,...a}:s)})}deleteOtherExpense(e){this.setState({otherExpenses:this.state.otherExpenses.filter(a=>a.id!==e)})}addInvestmentAsset(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",isQuantity:!1,...e};return this.setState({investmentAssets:[...this.state.investmentAssets,a]}),a}updateInvestmentAsset(e,a){this.setState({investmentAssets:this.state.investmentAssets.map(s=>s.id===e?{...s,...a}:s)})}deleteInvestmentAsset(e){this.setState({investmentAssets:this.state.investmentAssets.filter(a=>a.id!==e)})}addLiability(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),currency:"EUR",...e};return this.setState({liabilities:[...this.state.liabilities,a]}),a}updateLiability(e,a){this.setState({liabilities:this.state.liabilities.map(s=>s.id===e?{...s,...a}:s)})}deleteLiability(e){this.setState({liabilities:this.state.liabilities.filter(a=>a.id!==e)})}sumItems(e,a){return e.reduce((s,n)=>{const i=n[a]||0;return s+this.convertValue(i,n.currency)},0)}getPassiveIncome(){return this.sumItems(this.state.passiveAssets,"monthlyIncome")}getLivingExpenses(){const e=this.sumItems(this.state.livingExpenses,"amount"),a=this.sumItems(this.state.liabilities,"monthlyPayment");return e+a}getNetPassiveIncome(){return this.getPassiveIncome()-this.getLivingExpenses()}getInvestmentAssetsValue(){const e=this.sumItems(this.state.passiveAssets,"value"),a=this.sumItems(this.state.investmentAssets,"value");return e+a}getTotalLiabilities(){return this.sumItems(this.state.liabilities,"amount")}getNetWorth(){return this.getInvestmentAssetsValue()-this.getTotalLiabilities()}getAllIncomes(){const e=this.getPassiveIncome(),a=this.sumItems(this.state.activeIncomes,"amount");return e+a}getAllExpenses(){const e=this.getLivingExpenses(),a=this.sumItems(this.state.otherExpenses,"amount");return e+a}getNetIncome(){return this.getAllIncomes()-this.getAllExpenses()}updateHealthGoal(e,a){this.setState({health:{...this.state.health,[e]:a}})}setHealthState(e){this.setState({health:{...this.state.health,...e}})}addWeightLog(e){const a={id:crypto.randomUUID(),date:Date.now(),weight:parseFloat(e)};this.setState({health:{...this.state.health,weightLogs:[...this.state.health.weightLogs,a]}})}addFatLog(e){const a={id:crypto.randomUUID(),date:Date.now(),fat:parseFloat(e)};this.setState({health:{...this.state.health,fatLogs:[...this.state.health.fatLogs,a]}})}saveRoutine(e){const a=this.state.health.routines,n=a.find(i=>i.id===e.id)?a.map(i=>i.id===e.id?e:i):[...a,{...e,id:crypto.randomUUID()}];this.setState({health:{...this.state.health,routines:n}})}deleteRoutine(e){this.setState({health:{...this.state.health,routines:this.state.health.routines.filter(a=>a.id!==e)}})}renameRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(s=>s.id===e?{...s,name:a}:s)}})}updateExercise(e,a,s){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(n=>{if(n.id===e){const i=[...n.exercises];return i[a]={...i[a],...s},{...n,exercises:i}}return n})}})}addExerciseToRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(s=>s.id===e?{...s,exercises:[...s.exercises,{weight:50,reps:10,sets:4,...a}]}:s)}})}reorderRoutine(e,a){const s=[...this.state.health.routines],n=a==="up"?e-1:e+1;n<0||n>=s.length||([s[e],s[n]]=[s[n],s[e]],this.setState({health:{...this.state.health,routines:s}}))}reorderExercise(e,a,s){const n=this.state.health.routines.map(i=>{if(i.id===e){const o=[...i.exercises],r=s==="up"?a-1:a+1;return r<0||r>=o.length?i:([o[a],o[r]]=[o[r],o[a]],{...i,exercises:o})}return i});this.setState({health:{...this.state.health,routines:n}})}deleteExerciseFromRoutine(e,a){this.setState({health:{...this.state.health,routines:this.state.health.routines.map(s=>{if(s.id===e){const n=[...s.exercises];return n.splice(a,1),{...s,exercises:n}}return s})}})}addCalorieLog(e,a=""){const s={id:crypto.randomUUID(),date:Date.now(),calories:parseInt(e),note:a};this.setState({health:{...this.state.health,calorieLogs:[...this.state.health.calorieLogs,s]}})}logExercise(e,a,s){const n={id:crypto.randomUUID(),routineId:e,exerciseIndex:a,date:Date.now(),rating:parseInt(s)};this.setState({health:{...this.state.health,exerciseLogs:[...this.state.health.exerciseLogs||[],n]}})}getExerciseStatus(e,a){const n=(this.state.health.exerciseLogs||[]).filter(d=>d.routineId===e&&d.exerciseIndex===a);if(n.length===0)return{color:"green",lastDate:null};n.sort((d,g)=>g.date-d.date);const i=n[0],o=new Date,r=new Date(i.date),l=new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),c=Math.floor((l-u)/(1e3*60*60*24));return c===0?{color:"danger",status:"done_today",lastLog:i}:c===1?{color:"danger",status:"yesterday",lastLog:i}:c===2?{color:"tertiary",status:"day_before",lastLog:i}:{color:"success",status:"rested",lastLog:i}}addGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),completed:!1,subGoals:[],...e};this.setState({goals:[...this.state.goals,a]})}toggleGoal(e){this.setState({goals:this.state.goals.map(a=>a.id===e?{...a,completed:!a.completed}:a)})}deleteGoal(e){this.setState({goals:this.state.goals.filter(a=>a.id!==e)})}addScheduledTask(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),lastProcessed:null,active:!0,...e};this.setState({scheduledTasks:[...this.state.scheduledTasks,a]})}deleteScheduledTask(e){this.setState({scheduledTasks:this.state.scheduledTasks.filter(a=>a.id!==e)})}updateScheduledTask(e,a){this.setState({scheduledTasks:this.state.scheduledTasks.map(s=>s.id===e?{...s,...a}:s)})}processScheduledTasks(){const e=new Date,a=e.toISOString().split("T")[0],s=e.getDay(),n=e.getDate();let i=!1;const o=[...this.state.scheduledTasks],r=[...this.state.goals];o.forEach(l=>{if(!l.active||l.lastProcessed===a)return;let u=!1;(l.type==="weekly"&&l.days&&l.days.includes(s)||l.type==="monthly"&&l.dayOfMonth==n||l.type==="fixed"&&l.date===a)&&(u=!0),u&&(r.some(d=>d.title===l.title&&d.timeframe==="day"&&!d.completed)||r.push({id:crypto.randomUUID(),title:l.title,timeframe:"day",completed:!1,color:l.color||"#ffffff",createdAt:Date.now(),scheduledTaskId:l.id}),l.lastProcessed=a,i=!0)}),i&&this.setState({goals:r,scheduledTasks:o})}addSkill(e){const a={id:crypto.randomUUID(),name:"",level:0,category:"current",...e,createdAt:Date.now()};this.setState({skills:[...this.state.skills||[],a]})}updateSkill(e,a){this.setState({skills:this.state.skills.map(s=>s.id===e?{...s,...a}:s)})}deleteSkill(e){this.setState({skills:this.state.skills.filter(a=>a.id!==e)})}reorderSkills(e,a){const s=[...this.state.skills||[]],n=s.findIndex(d=>d.id===e);if(n===-1)return;const i=s[n].category,o=s.filter(d=>d.category===i),r=o.findIndex(d=>d.id===e),l=a==="up"?r-1:r+1;if(l<0||l>=o.length)return;const u=o[l].id,c=s.findIndex(d=>d.id===u);[s[n],s[c]]=[s[c],s[n]],this.setState({skills:s})}deleteCompletedGoals(e){this.setState({goals:this.state.goals.filter(a=>a.timeframe!==e||!a.completed)})}updateGoal(e,a){this.setState({goals:this.state.goals.map(s=>s.id===e?{...s,...a}:s)})}toggleSubGoal(e,a){const s=this.state.goals.find(i=>i.id===e);if(!s||!s.subGoals)return;const n=[...s.subGoals];n[a].completed=!n[a].completed,this.updateGoal(e,{subGoals:n})}reorderGoals(e){this.setState({goals:e})}updateGoalColor(e,a){this.updateGoal(e,{color:a})}addEvent(e){const a={id:crypto.randomUUID(),...e};this.setState({events:[...this.state.events,a]}),this.scheduleNotification(a)}deleteEvent(e){this.setState({events:this.state.events.filter(a=>a.id!==e)})}scheduleNotification(e){!("Notification"in window)||Notification.permission!=="granted"||console.log(`Scheduling notification for: ${e.title} at ${e.time}`)}addPerson(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({social:{...this.state.social,people:[...this.state.social.people,a]}}),a}updatePerson(e,a){this.setState({social:{...this.state.social,people:this.state.social.people.map(s=>s.id===e?{...s,...a}:s)}})}deletePerson(e){this.setState({social:{...this.state.social,people:this.state.social.people.filter(a=>a.id!==e)}})}movePerson(e,a){this.updatePerson(e,{columnId:a})}addSocialColumn(e){const a={id:crypto.randomUUID(),order:this.state.social.columns.length,...e};this.setState({social:{...this.state.social,columns:[...this.state.social.columns,a]}})}updateSocialColumn(e,a){this.setState({social:{...this.state.social,columns:this.state.social.columns.map(s=>s.id===e?{...s,...a}:s)}})}deleteSocialColumn(e){this.setState({social:{...this.state.social,columns:this.state.social.columns.filter(a=>a.id!==e),people:this.state.social.people.filter(a=>a.columnId!==e)}})}reorderSocialColumns(e){this.setState({social:{...this.state.social,columns:e}})}updateIdealLeadProfile(e){this.setState({social:{...this.state.social,idealLeadProfile:e}})}addCommunication(e){const a={id:crypto.randomUUID(),order:this.state.social.communications.length,rating:1,lastUsed:{},...e};this.setState({social:{...this.state.social,communications:[...this.state.social.communications,a]}})}updateCommunication(e,a){this.setState({social:{...this.state.social,communications:this.state.social.communications.map(s=>s.id===e?{...s,...a}:s)}})}deleteCommunication(e){this.setState({social:{...this.state.social,communications:this.state.social.communications.filter(a=>a.id!==e)}})}reorderCommunications(e){this.setState({social:{...this.state.social,communications:e}})}logCommunicationUsed(e,a){const s=Date.now(),n=this.state.social.communications.map(o=>o.id===e?{...o,lastUsed:{...o.lastUsed||{},[a]:s}}:o),i=this.state.social.people.map(o=>o.id===a?{...o,lastContact:new Date(s).toISOString().split("T")[0]}:o);this.setState({social:{...this.state.social,communications:n,people:i}})}updateContactSources(e){this.setState({social:{...this.state.social,contactSources:e}})}addWealthGoal(e){const a={id:crypto.randomUUID(),createdAt:Date.now(),...e};return this.setState({wealthGoals:[...this.state.wealthGoals||[],a]}),a}updateWealthGoal(e,a){this.setState({wealthGoals:this.state.wealthGoals.map(s=>s.id===e?{...s,...a}:s)})}deleteWealthGoal(e){this.setState({wealthGoals:this.state.wealthGoals.filter(a=>a.id!==e)})}reorderWealthGoals(e,a){const s=[...this.state.wealthGoals],n=s.findIndex(o=>o.id===e);if(n===-1)return;const i=a==="up"?n-1:n+1;i<0||i>=s.length||([s[n],s[i]]=[s[i],s[n]],this.setState({wealthGoals:s}))}setInflationRate(e){this.setState({inflationRate:parseFloat(e)})}setProjectionYears(e){this.setState({projectionYears:parseInt(e)})}addTimeActivity(e){const a=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,activities:[...this.state.timeInvest.activities,{...e,id:a}]}})}updateTimeActivity(e,a){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.map(s=>s.id===e?{...s,...a}:s)}})}deleteTimeActivity(e){this.setState({timeInvest:{...this.state.timeInvest,activities:this.state.timeInvest.activities.filter(a=>a.id!==e),logs:this.state.timeInvest.logs.filter(a=>a.activityId!==e)}})}addTimeLog(e){const a=Date.now().toString();this.setState({timeInvest:{...this.state.timeInvest,logs:[...this.state.timeInvest.logs,{...e,id:a}]}})}setPomodoroTime(e){this.setState({timeInvest:{...this.state.timeInvest,pomodoroTime:parseInt(e)}})}}const p=new Et,$t=[{id:"health",icon:"heart",label:"Health"},{id:"finance",icon:"wallet",label:"Finance"},{id:"social",icon:"users",label:"Connections"},{id:"time-invest",icon:"clock",label:"Time Invest"},{id:"goals",icon:"target",label:"Goals"},{id:"menu",icon:"menu",label:"Menu"}];function Ie(t="finance"){const e=`
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `,a=$t.map(s=>`
        <div class="nav-item ${s.id===t?"active":""}" data-nav="${s.id}">
            ${m(s.icon,"nav-icon")}
            <span class="nav-label">${s.label}</span>
        </div>
    `).join("");return e+a}function _e(t){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.nav;e.forEach(n=>n.classList.remove("active")),a.classList.add("active"),t&&t(s)})})}function w(t,e="$"){const a=Math.abs(t);let s=0,n=0;e==="₿"?(s=4,n=6):(e==="$"||e==="€"||e==="£"||e==="Fr")&&(s=0,n=2);const i=new Intl.NumberFormat("en-US",{minimumFractionDigits:s,maximumFractionDigits:n}).format(a);return`${t<0?"-":""}${e}${i}`}function re(t){return t==null?"0.0%":`${t>=0?"+":""}${t.toFixed(1)}%`}const St="https://api.coingecko.com/api/v3",b={STOCKS:"Stocks & Índices",CURRENCIES:"Divisas (Forex)",CRYPTO_MAJORS:"Cripto (Principales)",CRYPTO_ALTS:"Cripto (Altcoins)",COMMODITIES:"Materias Primas"},It=5*60*1e3;let ve={data:null,timestamp:0,currency:"USD"};const Y=[{id:"sp500",name:"S&P 500",symbol:"SPX",category:b.STOCKS,yahooId:"%5EGSPC",icon:"trendingUp"},{id:"nasdaq100",name:"Nasdaq 100",symbol:"NDX",category:b.STOCKS,yahooId:"%5ENDX",icon:"trendingUp"},{id:"msciworld",name:"MSCI World ETF",symbol:"URTH",category:b.STOCKS,yahooId:"URTH",icon:"trendingUp"},{id:"microsoft",name:"Microsoft",symbol:"MSFT",category:b.STOCKS,yahooId:"MSFT",icon:"trendingUp"},{id:"tesla",name:"Tesla",symbol:"TSLA",category:b.STOCKS,yahooId:"TSLA",icon:"trendingUp"},{id:"apple",name:"Apple",symbol:"AAPL",category:b.STOCKS,yahooId:"AAPL",icon:"trendingUp"},{id:"amazon",name:"Amazon",symbol:"AMZN",category:b.STOCKS,yahooId:"AMZN",icon:"trendingUp"},{id:"nvidia",name:"Nvidia",symbol:"NVDA",category:b.STOCKS,yahooId:"NVDA",icon:"trendingUp"},{id:"google",name:"Google",symbol:"GOOGL",category:b.STOCKS,yahooId:"GOOGL",icon:"trendingUp"},{id:"meta",name:"Meta",symbol:"META",category:b.STOCKS,yahooId:"META",icon:"trendingUp"},{id:"oracle",name:"Oracle",symbol:"ORCL",category:b.STOCKS,yahooId:"ORCL",icon:"trendingUp"},{id:"netflix",name:"Netflix",symbol:"NFLX",category:b.STOCKS,yahooId:"NFLX",icon:"trendingUp"},{id:"ypf",name:"YPF",symbol:"YPF",category:b.STOCKS,yahooId:"YPF",icon:"trendingUp"},{id:"ibex35",name:"IBEX 35",symbol:"IBEX",category:b.STOCKS,yahooId:"%5EIBEX",icon:"trendingUp"},{id:"eurusd",name:"Euro / Dólar",symbol:"EUR/USD",category:b.CURRENCIES,yahooId:"EURUSD=X",icon:"dollarSign"},{id:"usdars",name:"Dólar / Peso Arg",symbol:"USD/ARS",category:b.CURRENCIES,yahooId:"USDARS=X",icon:"dollarSign"},{id:"usdchf",name:"Dólar / Franco Suizo",symbol:"USD/CHF",category:b.CURRENCIES,yahooId:"USDCHF=X",icon:"dollarSign"},{id:"gbpusd",name:"Libra / Dólar",symbol:"GBP/USD",category:b.CURRENCIES,yahooId:"GBPUSD=X",icon:"dollarSign"},{id:"audusd",name:"Aus Dólar / USD",symbol:"AUD/USD",category:b.CURRENCIES,yahooId:"AUDUSD=X",icon:"dollarSign"},{id:"usdbrl",name:"Dólar / Real Bra",symbol:"USD/BRL",category:b.CURRENCIES,yahooId:"USDBRL=X",icon:"dollarSign"},{id:"gold",name:"Oro",symbol:"XAU",category:b.COMMODITIES,cgId:"pax-gold",icon:"package"},{id:"silver",name:"Plata",symbol:"XAG",category:b.COMMODITIES,cgId:"tether-gold",icon:"package"},{id:"copper",name:"Cobre",symbol:"HG",category:b.COMMODITIES,yahooId:"HG=F",icon:"package"},{id:"bitcoin",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ethereum",name:"Ethereum",symbol:"ETH",cgId:"ethereum",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"ripple",name:"XRP",symbol:"XRP",cgId:"ripple",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"solana",name:"Solana",symbol:"SOL",cgId:"solana",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"cardano",name:"Cardano",symbol:"ADA",cgId:"cardano",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"dogecoin",name:"Dogecoin",symbol:"DOGE",cgId:"dogecoin",category:b.CRYPTO_MAJORS,icon:"bitcoin"},{id:"kaspa",name:"Kaspa",symbol:"KAS",cgId:"kaspa",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"litecoin",name:"Litecoin",symbol:"LTC",cgId:"litecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bitcoin-cash",name:"Bitcoin Cash",symbol:"BCH",cgId:"bitcoin-cash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"monero",name:"Monero",symbol:"XMR",cgId:"monero",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"chainlink",name:"Chainlink",symbol:"LINK",cgId:"chainlink",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stellar",name:"Stellar",symbol:"XLM",cgId:"stellar",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"sui",name:"Sui",symbol:"SUI",cgId:"sui",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"hbar",name:"Hedera",symbol:"HBAR",cgId:"hedera-hashgraph",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"aave",name:"Aave",symbol:"AAVE",cgId:"aave",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"bittensor",name:"Bittensor",symbol:"TAO",cgId:"bittensor",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"worldcoin",name:"Worldcoin",symbol:"WLD",cgId:"worldcoin-org",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"arbitrum",name:"Arbitrum",symbol:"ARB",cgId:"arbitrum",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"polygon",name:"Polygon",symbol:"POL",cgId:"polygon-ecosystem-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"optimism",name:"Optimism",symbol:"OP",cgId:"optimism",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"stacks",name:"Stacks",symbol:"STX",cgId:"blockstack",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"ondo",name:"Ondo",symbol:"ONDO",cgId:"ondo-finance",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"zcash",name:"Zcash",symbol:"ZEC",cgId:"zcash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"dash",name:"Dash",symbol:"DASH",cgId:"dash",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"filecoin",name:"Filecoin",symbol:"FIL",cgId:"filecoin",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"algorand",name:"Algorand",symbol:"ALGO",cgId:"algorand",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"render",name:"Render",symbol:"RNDR",cgId:"render-token",category:b.CRYPTO_ALTS,icon:"bitcoin"},{id:"fetch-ai",name:"Fetch.ai",symbol:"FET",cgId:"fetch-ai",category:b.CRYPTO_ALTS,icon:"bitcoin"}];async function et(){const t="usd";if(ve.data&&Date.now()-ve.timestamp<It)return ve.data;const e=Y.map(s=>s.cgId).filter(Boolean).join(","),a=`${St}/coins/markets?vs_currency=${t}&ids=${e}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;try{const s=await fetch(a),n=s.ok?await s.json():[],i=Y.filter(l=>l.yahooId),o=await Lt(i),r=Y.map(l=>{if(l.cgId){const u=n.find(c=>c.id===l.cgId);if(u)return{...l,price:u.current_price,image:u.image,change24h:u.price_change_percentage_24h_in_currency||u.price_change_percentage_24h||0,change7d:u.price_change_percentage_7d_in_currency||0,change30d:u.price_change_percentage_30d_in_currency||0,change1y:u.price_change_percentage_1y_in_currency||0}}if(l.yahooId&&o[l.yahooId]){const u=o[l.yahooId];return{...l,price:u.price,change24h:u.change24h,change7d:u.change7d,change30d:u.change30d,change1y:u.change1y}}return{...l,price:null,change24h:null,change7d:null,change30d:null,change1y:null}});return ve={data:r,timestamp:Date.now(),currency:"USD"},r}catch(s){return console.error("Market fetch failed",s),Y.map(n=>({...n,price:null,change24h:null,change7d:null,change30d:null,change1y:null}))}}async function Lt(t){const e={};return await Promise.all(t.map(async a=>{try{const s=`https://query1.finance.yahoo.com/v8/finance/chart/${a.yahooId}?interval=1d&range=2y`,n=`https://api.allorigins.win/get?url=${encodeURIComponent(s)}`,o=await(await fetch(n)).json(),r=JSON.parse(o.contents);if(!r.chart||!r.chart.result||!r.chart.result[0])throw new Error("Invalid data");const l=r.chart.result[0],u=l.meta,d=l.indicators.quote[0].close.filter(P=>P!==null&&P>0);if(d.length===0)throw new Error("No valid price data");const g=u.regularMarketPrice||d[d.length-1],h=d.length-1,f=d[Math.max(0,h-1)],y=(g-f)/f*100,x=d[Math.max(0,h-5)],k=(g-x)/x*100,L=d[Math.max(0,h-21)],E=(g-L)/L*100,B=d[Math.max(0,h-252)],D=(g-B)/B*100;e[a.yahooId]={price:g,change24h:isNaN(y)?0:y,change7d:isNaN(k)?0:k,change30d:isNaN(E)?0:E,change1y:isNaN(D)?0:D}}catch(s){console.warn(`Failed to fetch ${a.symbol} from Yahoo`,s),e[a.yahooId]=null}})),e}const At={passive:{label:"Ingresos Pasivos",storeKey:"passiveAssets",updateMethod:"updatePassiveAsset",deleteMethod:"deletePassiveAsset",fields:["value","monthlyIncome"]},investment:{label:"Activo de Inversión",storeKey:"investmentAssets",updateMethod:"updateInvestmentAsset",deleteMethod:"deleteInvestmentAsset",fields:["value"]},liability:{label:"Pasivo/Deuda",storeKey:"liabilities",updateMethod:"updateLiability",deleteMethod:"deleteLiability",fields:["amount","monthlyPayment"]},activeIncome:{label:"Ingreso Activo",storeKey:"activeIncomes",updateMethod:"updateActiveIncome",deleteMethod:"deleteActiveIncome",fields:["amount"]},livingExpense:{label:"Gasto de Vida",storeKey:"livingExpenses",updateMethod:"updateLivingExpense",deleteMethod:"deleteLivingExpense",fields:["amount"]}};let de=null,ee=null;function tt(t,e){const a=At[e];if(!a){console.error("Unknown category:",e);return}const i=p.getState()[a.storeKey].find(r=>r.id===t);if(!i){console.error("Item not found:",t);return}de=i,ee=e;const o=document.createElement("div");o.className="modal-overlay",o.id="edit-modal",o.innerHTML=Dt(i,a),document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("active")}),Mt(a)}const Ct=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}],Tt={passive:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}],investment:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}],liability:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}],activeIncome:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}],livingExpense:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]};function Dt(t,e){const a=ee==="investment"||ee==="passive",s=Tt[ee]||[];let n="";return e.fields.includes("value")&&e.fields.includes("monthlyIncome")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="edit-value" value="${t.value||0}" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${t.monthlyIncome||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("value")?n=`
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="edit-value" value="${t.value||0}" step="any" inputmode="decimal">
      </div>
    `:e.fields.includes("amount")&&e.fields.includes("monthlyPayment")?n=`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="edit-amount" value="${t.amount||0}" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${t.monthlyPayment||0}" inputmode="numeric">
        </div>
      </div>
    `:e.fields.includes("amount")&&(n=`
      <div class="form-group">
        <label class="form-label">${ee==="livingExpense"?"Gasto Mensual":"Ingreso Mensual"}</label>
        <input type="number" class="form-input" id="edit-amount" value="${t.amount||0}" inputmode="numeric">
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
                  ${s.map(i=>`<option value="${i.value}" ${i.value===t.type?"selected":""}>${i.label}</option>`).join("")}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${Ct.map(i=>`<option value="${i.value}" ${i.value===t.currency?"selected":""}>${i.label}</option>`).join("")}
                  </optgroup>
                  ${a?`
                  <optgroup label="Mercados Reales">
                      ${Y.map(i=>`<option value="${i.symbol}" ${i.symbol===t.currency?"selected":""}>${i.name} (${i.symbol})</option>`).join("")}
                  </optgroup>
                  `:""}
              </select>
          </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${t.name||""}">
      </div>
      
      ${n}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${t.details||""}" placeholder="Notas adicionales...">
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
  `}function Mt(t){const e=document.getElementById("edit-modal"),a=document.getElementById("edit-modal-close"),s=document.getElementById("btn-update"),n=document.getElementById("btn-delete");e.addEventListener("click",i=>{i.target===e&&he()}),a.addEventListener("click",he),s.addEventListener("click",()=>Bt(t)),n.addEventListener("click",()=>Pt(t))}function Bt(t){var u,c,d,g,h,f,y,x,k;const e=(c=(u=document.getElementById("edit-name"))==null?void 0:u.value)==null?void 0:c.trim(),a=(d=document.getElementById("edit-type"))==null?void 0:d.value,s=(g=document.getElementById("edit-currency"))==null?void 0:g.value,n=(f=(h=document.getElementById("edit-details"))==null?void 0:h.value)==null?void 0:f.trim(),i=parseFloat((y=document.getElementById("edit-value"))==null?void 0:y.value)||0,o=parseFloat((x=document.getElementById("edit-amount"))==null?void 0:x.value)||0,r=parseFloat((k=document.getElementById("edit-monthly"))==null?void 0:k.value)||0;if(!e){v.alert("Requerido","El nombre es obligatorio para guardar los cambios.");return}const l={name:e,type:a,currency:s,details:n};t.fields.includes("value")&&(l.value=i),t.fields.includes("amount")&&(l.amount=o),t.fields.includes("monthlyIncome")&&(l.monthlyIncome=r),t.fields.includes("monthlyPayment")&&(l.monthlyPayment=r),p[t.updateMethod](de.id,l),he()}function Pt(t){v.confirm("¿Eliminar?",`¿Estás seguro de que quieres borrar "${de.name}"? Esta acción no se puede deshacer.`).then(e=>{e&&(p[t.deleteMethod](de.id),v.toast("Eliminado correctamente","info"),he())})}function he(){const t=document.getElementById("edit-modal");t&&(t.classList.remove("active"),setTimeout(()=>t.remove(),300)),de=null,ee=null}let te=!1,se=!1,$={key:"price",direction:"desc"},ne="USD",G=null;function Rt(){const t=p.getState(),e=t.lastMarketData||[],a=t.marketFavorites||[];G===null&&(G=a.length>0?"favorites":"all"),!se&&!te&&Nt();const s=ne==="EUR"?"€":"$";let n=e;G==="favorites"&&(n=e.filter(o=>a.includes(o.id)));const i=Object.values(b);return`
        <div class="market-view animate-fade-in" style="padding: 4px;">
            <!-- Single Line Header Controls -->
            <div class="market-controls-row">
                <div class="market-group">
                    <button class="filter-chip ${G==="all"?"active":""}" id="filter-all">
                        Todos
                    </button>
                    <button class="filter-chip ${G==="favorites"?"active":""}" id="filter-favs">
                        ${m("star","tiny-icon")} Favoritos
                    </button>
                </div>

                <div class="market-status-badge ${te?"market-status-fresh":"market-status-cached"}" title="Tasa de refresco: 5 min">
                    ${se?'<div class="loading-spinner-sm" style="width:10px; height:10px;"></div>':m(te?"check":"save","tiny-icon")}
                    <span>${se?"Updating":te?"Live":"Cached"}</span>
                </div>

                <div class="capsule-toggle">
                    <button class="capsule-btn ${ne==="USD"?"active":""}" data-curr="USD">USD</button>
                    <button class="capsule-btn ${ne==="EUR"?"active":""}" data-curr="EUR">EUR</button>
                </div>
            </div>

            <!-- Content -->
            ${n.length===0&&G==="favorites"?Ut():""}
            ${n.length===0&&G==="all"?Ot():""}
            
            ${i.map(o=>{const r=n.filter(l=>l.category===o);return r.length===0?"":jt(o,r,s,a)}).join("")}
        </div>
    `}function jt(t,e,a,s){const n=[...e].sort((i,o)=>{let r=i[$.key],l=o[$.key];return typeof r=="string"&&(r=r.toLowerCase()),typeof l=="string"&&(l=l.toLowerCase()),r<l?$.direction==="asc"?-1:1:r>l?$.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-top: var(--spacing-lg);">
            <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                    ${t}
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
                            ${n.map(i=>_t(i,a,s.includes(i.id))).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}function _t(t,e,a){let s=t.price;if(t.price!==null&&ne==="EUR"){const r=p.getState().rates.USD||.92;s=t.price*r}const n=Se(t.change24h),i=Se(t.change30d),o=Se(t.change1y);return`
        <tr class="market-row" data-id="${t.id}">
            <td style="padding: 0 0 0 12px; width: 44px;">
                <button class="btn-favorite ${a?"active":""}" data-id="${t.id}">
                    ${m("star")}
                </button>
            </td>
            <td>
                <div class="asset-cell">
                     ${t.image?`<img src="${t.image}" alt="${t.symbol}" style="width: 22px; height: 22px; border-radius: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`:`<div class="asset-icon-tiny" style="background: rgba(255,255,255,0.05); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${m(t.icon||"trendingUp")}</div>`}
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <span class="asset-symbol" style="line-height: 1.2;">${t.symbol.toUpperCase()}</span>
                        <span class="asset-name-tiny">${t.name}</span>
                    </div>
                </div>
            </td>
            <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${s!==null?w(s,e):"-"}</td>
            <td class="text-right font-mono ${n}" style="font-weight: 700;">
                ${t.change24h!==null?re(t.change24h):"-"}
            </td>
            <td class="text-right font-mono ${i}" style="font-size: 11px; opacity: 0.9;">
                ${t.change30d!==null?re(t.change30d):"-"}
            </td>
            <td class="text-right font-mono ${o}" style="font-size: 11px; opacity: 0.9;">
                ${t.change1y!==null?re(t.change1y):"-"}
            </td>
        </tr>
    `}function Se(t){return t==null?"":te?t>=0?"text-positive":"text-negative":"text-accent-primary"}function Ut(){return`
        <div class="empty-state" style="padding: 60px 20px; text-align: center; background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); border: 1px dashed rgba(255,255,255,0.1); margin-top: 20px;">
            <div style="font-size: 32px; margin-bottom: 12px; filter: grayscale(1);">⭐</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">No hay favoritos todavía</h3>
            <p style="color: var(--text-muted); font-size: 14px; max-width: 250px; margin: 0 auto;">Marca con una estrella los activos que quieres seguir de cerca.</p>
            <button class="btn btn-secondary" id="btn-show-all" style="margin-top: 24px; font-size: 12px; padding: 10px 20px; border-radius: 30px;">Ver todos los activos</button>
        </div>
    `}function Ot(){return`
        <div class="empty-state" style="padding: 100px 0;">
             <div class="loading-spinner"></div>
             <p style="margin-top: 20px; color: var(--text-muted); font-size: 14px; letter-spacing: 0.5px;">CONSULTANDO MERCADOS GLOBALES...</p>
        </div>
    `}async function Nt(){var t,e;if(!se){se=!0,(t=window.reRender)==null||t.call(window);try{const a=await et();p.saveMarketData(a),te=!0}catch(a){console.error("Market update failed",a)}finally{se=!1,(e=window.reRender)==null||e.call(window)}}}function Gt(){var t,e,a;document.querySelectorAll(".capsule-btn").forEach(s=>{s.addEventListener("click",()=>{var i;const n=s.dataset.curr;n!==ne&&(ne=n,(i=window.reRender)==null||i.call(window))})}),(t=document.getElementById("filter-all"))==null||t.addEventListener("click",()=>{var s;G="all",(s=window.reRender)==null||s.call(window)}),(e=document.getElementById("filter-favs"))==null||e.addEventListener("click",()=>{var s;G="favorites",(s=window.reRender)==null||s.call(window)}),(a=document.getElementById("btn-show-all"))==null||a.addEventListener("click",()=>{var s;G="all",(s=window.reRender)==null||s.call(window)}),document.querySelectorAll(".btn-favorite").forEach(s=>{s.addEventListener("click",n=>{var o;n.stopPropagation();const i=s.dataset.id;p.toggleMarketFavorite(i),(o=window.reRender)==null||o.call(window)})}),document.querySelectorAll(".market-table th.sortable").forEach(s=>{s.addEventListener("click",()=>{var i;const n=s.dataset.sort;$.key===n?$.direction=$.direction==="asc"?"desc":"asc":($.key=n,$.direction="desc",n==="name"&&($.direction="asc")),(i=window.reRender)==null||i.call(window)})})}function Ft(){const t=p.getState(),{wealthGoals:e=[],inflationRate:a=3,projectionYears:s=10,currencySymbol:n}=t,i=p.getAllExpenses();let o=0;e.forEach(d=>{const g=d.cost*(d.dividendYield/100)/12;o+=p.convertValue(g,d.currency||t.currency)});const r=o-i,l=i*Math.pow(1+a/100,s);let u=0;e.forEach(d=>{const h=d.cost*Math.pow(1+d.annualGrowth/100,s)*(d.dividendYield/100)/12;u+=p.convertValue(h,d.currency||t.currency)});const c=u-l;return`
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
                        <span class="positive">${w(o,n)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Totales</span>
                        <span class="negative">${w(i,n)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto</span>
                        <span class="${r>=0?"positive":"negative"}">${w(r,n)}</span>
                    </div>
                </div>

                <div class="projection-divider-vertical"></div>

                <div class="projection-col">
                    <div class="projection-label">En ${s} años (${a}% inf.)</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos Est.</span>
                        <span class="positive">${w(u,n)}</span>
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
                    <label>Años proyectados: ${s}</label>
                    <input type="range" id="years-slider" min="1" max="50" step="1" value="${s}">
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
                ${m("plus")} Agregar
            </button>
        </div>

        <div class="wealth-goals-list">
            ${e.length===0?`
                <div class="empty-state">
                    ${m("target","empty-icon")}
                    <p>No tienes objetivos guardados aún.</p>
                </div>
            `:e.map(d=>qt(d,t)).join("")}
        </div>
    </div>
    `}function qt(t,e){const a=e.currencySymbol,s=t.cost*(t.dividendYield/100)/12,n=p.convertValue(s,t.currency||e.currency);return`
    <div class="card wealth-goal-card" data-id="${t.id}">
        <div class="goal-card-main">
            <div class="goal-card-info">
                <div class="goal-name">${t.name}</div>
                <div class="goal-cost">${w(t.cost,t.currency||e.currency)} cost</div>
            </div>
            <div class="goal-card-yield">
                <div class="yield-value">+${w(n,a)}/mes</div>
                <div class="yield-pct">${t.dividendYield}% div.</div>
            </div>
        </div>
        <div class="goal-card-details">
            <div class="detail-item">
                <span class="detail-label">Crecimiento Anual:</span>
                <span class="detail-value">${t.annualGrowth}%</span>
            </div>
            <div class="goal-actions">
                <div class="goal-reorder-actions">
                    <button class="icon-btn reorder-wealth-goal" data-id="${t.id}" data-dir="up">${m("chevronUp")}</button>
                    <button class="icon-btn reorder-wealth-goal" data-id="${t.id}" data-dir="down">${m("chevronDown")}</button>
                </div>
                <div style="flex: 1;"></div>
                <button class="icon-btn edit-wealth-goal" data-id="${t.id}">${m("edit")}</button>
                <button class="icon-btn delete-wealth-goal" data-id="${t.id}">${m("trash")}</button>
            </div>
        </div>
    </div>
    `}function Ht(){var a;(a=document.getElementById("btn-add-wealth-goal"))==null||a.addEventListener("click",async()=>{Ue()}),document.querySelectorAll(".edit-wealth-goal").forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const i=s.dataset.id,o=p.getState().wealthGoals.find(r=>r.id===i);o&&Ue(o)})}),document.querySelectorAll(".delete-wealth-goal").forEach(s=>{s.addEventListener("click",async n=>{var r;n.stopPropagation();const i=s.dataset.id;await v.confirm("Eliminar objetivo","¿Estás seguro de que deseas eliminar este objetivo?")&&(p.deleteWealthGoal(i),(r=window.reRender)==null||r.call(window))})}),document.querySelectorAll(".reorder-wealth-goal").forEach(s=>{s.addEventListener("click",n=>{var r;n.stopPropagation();const i=s.dataset.id,o=s.dataset.dir;p.reorderWealthGoals(i,o),(r=window.reRender)==null||r.call(window)})});const t=document.getElementById("inflation-slider");t&&t.addEventListener("change",s=>{var n;p.setInflationRate(s.target.value),(n=window.reRender)==null||n.call(window)});const e=document.getElementById("years-slider");e&&e.addEventListener("change",s=>{var n;p.setProjectionYears(s.target.value),(n=window.reRender)==null||n.call(window)})}async function Ue(t=null){const e=!!t,a=e?"Editar Objetivo":"Nuevo Objetivo Patrimonial",s=document.createElement("div");s.className="modal-overlay active overlay-centered",s.innerHTML=`
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${a}</h3>
                <button class="close-modal-btn">${m("x")}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre del Objetivo</label>
                    <input type="text" id="goal-name" class="form-input" placeholder="Ej: Inmueble en Carlos Paz" value="${(t==null?void 0:t.name)||""}">
                </div>
                <div class="form-group">
                    <label class="form-label">Coste / Valor actual</label>
                    <div class="input-with-currency">
                        <input type="number" id="goal-cost" class="form-input" placeholder="100000" value="${(t==null?void 0:t.cost)||""}">
                        <select id="goal-currency" class="currency-mini-select">
                            ${["EUR","USD","ARS","GBP","CHF"].map(r=>`<option value="${r}" ${(t==null?void 0:t.currency)===r?"selected":""}>${r}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Crecimiento % (Anual)</label>
                        <input type="number" id="goal-growth" class="form-input" placeholder="5" value="${(t==null?void 0:t.annualGrowth)||""}" step="0.1">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Dividendos % (Anual)</label>
                        <input type="number" id="goal-dividend" class="form-input" placeholder="4" value="${(t==null?void 0:t.dividendYield)||""}" step="0.1">
                    </div>
                </div>
                <button class="btn btn-primary" id="save-goal-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${e?"Guardar Cambios":"Crear Objetivo"}
                </button>
            </div>
        </div>
    `,document.body.appendChild(s);const n=s.querySelector(".close-modal-btn"),i=s.querySelector("#save-goal-btn"),o=()=>{s.classList.remove("active"),setTimeout(()=>s.remove(),300)};n.addEventListener("click",o),s.addEventListener("click",r=>{r.target===s&&o()}),i.addEventListener("click",()=>{var h;const r=s.querySelector("#goal-name").value,l=parseFloat(s.querySelector("#goal-cost").value),u=parseFloat(s.querySelector("#goal-growth").value)||0,c=parseFloat(s.querySelector("#goal-dividend").value)||0,d=s.querySelector("#goal-currency").value;if(!r||isNaN(l)){v.toast("Completa nombre y coste","error");return}const g={name:r,cost:l,annualGrowth:u,dividendYield:c,currency:d};e?(p.updateWealthGoal(t.id,g),v.toast("Objetivo actualizado")):(p.addWealthGoal(g),v.toast("Objetivo creado")),o(),(h=window.reRender)==null||h.call(window)})}let U="summary";function Oe(){const t=p.getState(),e=t.currencySymbol;return setTimeout(U==="markets"||U==="goals"?_:F,0),`
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="margin-bottom: var(--spacing-md);">
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <!-- Finance Tabs (Segmented Control) -->
      <div class="segmented-control">
        <button class="segment-btn ${U==="summary"?"active":""}" id="tab-summary">
            Summary
        </button>
        <button class="segment-btn ${U==="goals"?"active":""}" id="tab-goals">
            Goals
        </button>
        <button class="segment-btn ${U==="markets"?"active":""}" id="tab-markets">
            Markets
        </button>
      </div>
      
      ${U==="summary"?zt(t,e):U==="goals"?Ft():Rt()}
      
    </div>
  `}function zt(t,e){const a=p.getPassiveIncome(),s=p.getLivingExpenses(),n=p.getNetPassiveIncome(),i=p.getInvestmentAssetsValue(),o=p.getTotalLiabilities(),r=p.getNetWorth(),l=p.getAllIncomes(),u=p.getAllExpenses(),c=p.getNetIncome();return`
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
            <span class="stat-value positive">${w(a,e)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${w(s,e)}</span>
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
          <span class="stat-value ${c>=0?"positive":"negative"}" style="font-size: 20px;">
            ${w(c,e)}
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
      
      ${Vt(t)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${Kt(t)}

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
                        <option value="EUR" ${t.currency==="EUR"?"selected":""}>EUR (€)</option>
                        <option value="USD" ${t.currency==="USD"?"selected":""}>USD ($)</option>
                        <option value="CHF" ${t.currency==="CHF"?"selected":""}>CHF (Fr)</option>
                        <option value="GBP" ${t.currency==="GBP"?"selected":""}>GBP (£)</option>
                        <option value="AUD" ${t.currency==="AUD"?"selected":""}>AUD (A$)</option>
                        <option value="ARS" ${t.currency==="ARS"?"selected":""}>ARS ($)</option>
                        <option value="BTC" ${t.currency==="BTC"?"selected":""}>BTC (₿)</option>
                    </select>
                    <div class="premium-select-icon">
                        ${m("chevronDown","tiny-icon")}
                    </div>
                </div>
            </div>
        </div>
      </div>
  `}function Vt(t){const e=[...t.passiveAssets,...t.investmentAssets],a=t.liabilities;if(e.length===0)return"";const s={Bitcoin:{value:0,color:"#f59e0b"},Altcoins:{value:0,color:"#6366f1"},Inmuebles:{value:0,color:"#a855f7"},Bolsa:{value:0,color:"#00d4aa"},Oro:{value:0,color:"#fbbf24"},"Otros/Efe.":{value:0,color:"#94a3b8"}};e.forEach(c=>{const d=p.convertValue(c.value||0,c.currency||"EUR");c.currency==="BTC"?s.Bitcoin.value+=d:c.currency==="ETH"||c.currency==="XRP"||c.type==="crypto"?s.Altcoins.value+=d:c.type==="property"||c.type==="rental"?s.Inmuebles.value+=d:c.type==="stocks"||c.type==="etf"||c.currency==="SP500"?s.Bolsa.value+=d:c.currency==="GOLD"?s.Oro.value+=d:s["Otros/Efe."].value+=d});const n=a.filter(c=>c.type==="mortgage").reduce((c,d)=>c+p.convertValue(d.amount||0,d.currency||"EUR"),0);s.Inmuebles.value=Math.max(0,s.Inmuebles.value-n),t.hideRealEstate&&(s.Inmuebles.value=0);const i=Object.entries(s).filter(([c,d])=>d.value>0).sort((c,d)=>d[1].value-c[1].value),o=i.reduce((c,[d,g])=>c+g.value,0);if(o===0)return`
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${t.hideRealEstate?"checked":""}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;let r=0;const l=i.map(([c,d])=>{const g=d.value/o*100,h=r;return r+=g,{name:c,percentage:g,color:d.color,start:h}}),u=l.map(c=>`${c.color} ${c.start}% ${c.start+c.percentage}%`).join(", ");return`
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${t.hideRealEstate?"checked":""}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${u});">
          <div class="pie-center">
            <div class="pie-total">${w(o,t.currencySymbol)}</div>
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
  `}function Kt(t){const e=[...(t.activeIncomes||[]).map(s=>({...s,category:"activeIncome"})),...t.passiveAssets.map(s=>({...s,category:"passive"})),...t.investmentAssets.map(s=>({...s,category:"investment"})),...t.liabilities.map(s=>({...s,category:"liability"}))];if(e.length===0)return`
      <div class="empty-state">
        ${m("package","empty-icon")}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;const a=t.currencySymbol;return`
    <div class="asset-list">
      ${e.map(s=>{const n=Yt(s.currency||s.type),i=Wt(s.currency||s.type),o=s.category==="liability",r=s.value||s.amount||0,l=p.convertValue(r,s.currency||"EUR");let u="";if(s.currency!==t.currency){const d={EUR:"€",USD:"$",BTC:"₿",ETH:"Ξ",XRP:"✕",GOLD:"oz",SP500:"pts",CHF:"Fr",GBP:"£",AUD:"A$",ARS:"$"}[s.currency]||s.currency;u=`<div class="asset-original-value">${r} ${d}</div>`}return`
          <div class="asset-item" data-id="${s.id}" data-category="${s.category}">
            <div class="asset-icon-wrapper ${n}">
              ${m(i,"asset-icon")}
            </div>
            <div class="asset-info">
              <div class="asset-name">${s.name}</div>
              <div class="asset-details">${s.details||s.type||""}</div>
              ${u}
            </div>
            <div>
              <div class="asset-value ${o?"text-warning":""}">
                ${s.category==="activeIncome"?"+":o?"-":""}${w(l,a)}
                ${s.category==="activeIncome"?'<span style="font-size: 10px; opacity: 0.7; font-weight: 400;">/mes</span>':""}
              </div>
              ${s.monthlyIncome?`<div class="asset-yield">+${w(p.convertValue(s.monthlyIncome,s.currency),a)}/mes</div>`:""}
              ${s.monthlyPayment?`<div class="asset-yield text-negative">-${w(p.convertValue(s.monthlyPayment,s.currency),a)}/mes</div>`:""}
            </div>
          </div>
        `}).join("")}
    </div>
  `}function Yt(t){return{property:"property",rental:"property",stocks:"stocks",etf:"stocks",SP500:"stocks",crypto:"crypto",BTC:"crypto",ETH:"crypto",XRP:"crypto",GOLD:"investment",cash:"cash",USD:"cash",EUR:"cash",savings:"cash",vehicle:"vehicle",debt:"debt",loan:"debt",mortgage:"debt",creditcard:"debt",salary:"cash",freelance:"cash",business:"property"}[t]||"cash"}function Wt(t){return{property:"building",rental:"building",stocks:"trendingUp",etf:"trendingUp",SP500:"trendingUp",crypto:"bitcoin",BTC:"bitcoin",ETH:"bitcoin",XRP:"bitcoin",GOLD:"package",cash:"dollarSign",USD:"dollarSign",EUR:"dollarSign",savings:"piggyBank",vehicle:"car",debt:"creditCard",loan:"landmark",mortgage:"home",creditcard:"creditCard",salary:"briefcase",freelance:"users",business:"building"}[t]||"dollarSign"}function Ne(){const t=document.getElementById("tab-summary"),e=document.getElementById("tab-markets"),a=document.getElementById("tab-goals");if(t&&e&&a&&(t.addEventListener("click",()=>{var o;U="summary",(o=window.reRender)==null||o.call(window)}),e.addEventListener("click",()=>{var o;U="markets",(o=window.reRender)==null||o.call(window)}),a.addEventListener("click",()=>{var o;U="goals",(o=window.reRender)==null||o.call(window)})),U==="markets"){Gt();return}if(U==="goals"){Ht();return}document.querySelectorAll(".asset-item").forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.id,l=o.dataset.category;tt(r,l)})});const n=document.getElementById("toggle-real-estate");n&&n.addEventListener("change",()=>{p.toggleRealEstate()});const i=document.getElementById("display-currency-select");i&&i.addEventListener("change",o=>{p.setCurrency(o.target.value)})}let z=10,W=7,J=null,Z=null;function Xt(){const e=p.getState().currencySymbol,a=p.getNetWorth(),n=p.getNetIncome()*12,i=J!==null?J:a,o=Z!==null?Z:n,r=at(i,o,W,z);return`
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
          <div class="compound-input-hint">Patrimonio actual: ${w(a,e)}</div>
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
        ${st(r.yearlyBreakdown)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${nt(r.yearlyBreakdown,e)}
      </div>
    </div>
  `}function at(t,e,a,s){const n=a/100,i=[];let o=t,r=0,l=0;for(let u=1;u<=s;u++){const c=o,d=o*n;o+=d+e,r+=e,l+=d,i.push({year:u,startBalance:c,contribution:e,interest:d,endBalance:o,totalContributions:r,totalInterest:l})}return{finalValue:o,totalContributions:r,totalInterest:l,totalGrowth:o-t,growthMultiple:t>0?o/t:0,yearlyBreakdown:i}}function st(t,e){if(t.length===0)return"";const a=Math.max(...t.map(n=>Math.abs(n.endBalance))),s=t.map((n,i)=>{const o=i/(t.length-1)*100,r=100-n.endBalance/a*100;return`${o},${r}`});return`
    <div class="line-chart-container" style="height: 200px; width: 100%; position: relative; margin-top: 20px;">
      <svg viewBox="0 0 100 100" class="projection-line-chart" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
        <!-- Grid horizontal lines -->
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        
        <!-- Area under curve -->
        <path d="M0,100 L${s.join(" L")} L100,100 Z" fill="url(#chart-gradient)" opacity="0.2" />
        
        <!-- Main line -->
        <path d="M${s.join(" L")}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        
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
        <span>Año ${Math.floor(t.length/2)}</span>
        <span>Año ${t.length}</span>
      </div>
    </div>
  `}function nt(t,e){const a=[];for(let s=0;s<t.length;s++){const n=t[s];(s<5||(s+1)%5===0||s===t.length-1)&&a.push(n)}return`
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
          ${a.map(s=>`
            <tr>
              <td>${s.year}</td>
              <td class="${s.endBalance>=0?"positive":"negative"}">${w(s.endBalance,e)}</td>
              <td style="color: var(--accent-secondary);">+${w(s.interest,e)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Jt(t){const e=document.getElementById("back-to-finance"),a=document.getElementById("rate-slider"),s=document.getElementById("years-slider"),n=document.getElementById("principal-input"),i=document.getElementById("contribution-input"),o=document.getElementById("reset-principal"),r=document.getElementById("reset-contribution");e&&e.addEventListener("click",t),n&&n.addEventListener("input",l=>{J=parseFloat(l.target.value)||0,Q()}),i&&i.addEventListener("input",l=>{Z=parseFloat(l.target.value)||0,Q()}),o&&o.addEventListener("click",()=>{J=null;const l=p.getNetWorth();n.value=l,Q()}),r&&r.addEventListener("click",()=>{Z=null;const l=p.getNetIncome()*12;i.value=l,Q()}),a&&a.addEventListener("input",l=>{W=parseFloat(l.target.value),document.getElementById("rate-value").textContent=`${W}%`,Q()}),s&&s.addEventListener("input",l=>{z=parseInt(l.target.value),document.getElementById("years-value").textContent=`${z} años`,Q()})}function Q(){const e=p.getState().currencySymbol,a=J!==null?J:p.getNetWorth(),s=Z!==null?Z:p.getNetIncome()*12,n=at(a,s,W,z),i=document.getElementById("future-value"),o=document.getElementById("future-value-title"),r=document.getElementById("growth-label"),l=document.getElementById("initial-capital"),u=document.getElementById("total-contributed"),c=document.getElementById("total-interest"),d=document.getElementById("final-value-breakdown"),g=document.getElementById("projection-chart"),h=document.getElementById("projection-table");i&&(i.textContent=w(n.finalValue,e)),o&&(o.textContent=`Valor Futuro en ${z} años`),r&&(r.innerHTML=`${n.totalGrowth>=0?"📈":"📉"} ${n.growthMultiple.toFixed(1)}x tu capital inicial`),l&&(l.textContent=w(a,e)),u&&(u.textContent=w(n.totalContributions,e),u.className=`stat-value ${n.totalContributions>=0?"positive":"negative"}`),c&&(c.textContent=w(n.totalInterest,e)),d&&(d.textContent=w(n.finalValue,e)),g&&(g.innerHTML=st(n.yearlyBreakdown)),h&&(h.innerHTML=nt(n.yearlyBreakdown,e))}function Zt(){z=10,W=7,J=null,Z=null}let le=p.getState().lastMarketData||[],ce=!1,A={key:"price",direction:"desc"},it="";function Qt(){const t=p.getState(),e=t.currency||"EUR",a=t.currencySymbol||"€";if((le.length===0||it!==e)&&(ce||ot(),le.length===0))return`
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
            `;const s=Object.values(b);return`
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
                                ${ce?`
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

            ${s.map(n=>{const i=le.filter(o=>o.category===n);return i.length===0?"":ea(n,i,a)}).join("")}
        </div>
    `}function ea(t,e,a){const s=[...e].sort((n,i)=>{let o=n[A.key],r=i[A.key];return typeof o=="string"&&(o=o.toLowerCase()),typeof r=="string"&&(r=r.toLowerCase()),o<r?A.direction==="asc"?-1:1:o>r?A.direction==="asc"?1:-1:0});return`
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${t}
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
                            ${s.map(n=>`
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
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${n.price!==null?w(n.price,a):"-"}</td>
                                    <td class="${n.change24h>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums;">${n.change24h!==null?re(n.change24h):"-"}</td>
                                    <td class="${n.change30d>=0?"text-positive":"text-negative"}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${n.change30d!==null?re(n.change30d):"-"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `}async function ot(){const e=p.getState().currency||"EUR";ce||(ce=!0,it=e,le=await et(),p.saveMarketData(le),ce=!1,window.dispatchEvent(new CustomEvent("market-ready")))}function ta(t){const e=document.getElementById("market-back");e&&e.addEventListener("click",t),document.querySelectorAll(".market-table th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.sort;A.key===i?A.direction=A.direction==="asc"?"desc":"asc":(A.key=i,A.direction="desc",i==="name"&&(A.direction="asc")),typeof window.reRender=="function"&&window.reRender()})}),document.querySelectorAll(".market-currency-toggle .btn-toggle").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.curr;p.setCurrency(i),ot()})}),window.addEventListener("market-ready",()=>{typeof window.reRender=="function"&&window.reRender()})}class Ge{static getApiKey(){return localStorage.getItem("life-dashboard/db_gemini_api_key")}static setApiKey(e){localStorage.setItem("life-dashboard/db_gemini_api_key",e)}static hasKey(){return!!this.getApiKey()}static async analyzeFood(e){var r;const a=this.getApiKey();if(!a)throw new Error("Se requiere una API Key de Gemini en Configuración.");const n=(await this.fileToBase64(e)).split(",")[1],i=e.type,o=`Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;try{const l=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o},{inline_data:{mime_type:i,data:n}}]}],generationConfig:{response_mime_type:"application/json"}})});if(!l.ok){const d=await l.json();throw new Error(((r=d.error)==null?void 0:r.message)||"Error al conectar con Gemini AI")}const c=(await l.json()).candidates[0].content.parts[0].text;return JSON.parse(c)}catch(l){throw console.error("[Gemini] Analysis failed:",l),l}}static fileToBase64(e){return new Promise((a,s)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>a(n.result),n.onerror=i=>s(i)})}}let ie=localStorage.getItem("life-dashboard/health_current_tab")||"diet";function aa(){const t=p.getState(),{health:e}=t;return`
    <div class="health-page stagger-children" style="padding-bottom: 120px;">
      <header class="page-header">
        <h1 class="page-title">Health & Fitness</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- SUB-NAVIGATION TABS -->
      <div class="health-tabs">
        <button class="health-tab-btn ${ie==="diet"?"active":""}" data-tab="diet">
            ${m("apple")} Dieta
        </button>
        <button class="health-tab-btn ${ie==="exercise"?"active":""}" data-tab="exercise">
            ${m("zap")} Ejercicio
        </button>
      </div>

      <div id="health-tab-content">
        ${ie==="diet"?na(e):sa(e)}
      </div>

    </div>
    `}function sa(t){return`
      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${t.routines.map((e,a)=>`
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${m("zap")}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${e.id}" data-current="${e.name}">${e.name}</h3>
                </div>
                <div class="routine-actions desktop-only">
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="up">${m("chevronUp")}</button>
                    <button class="reorder-routine-btn" data-index="${a}" data-dir="down">${m("chevronDown")}</button>
                    <button class="delete-routine-btn" data-id="${e.id}">${m("trash")}</button>
                </div>
                <button class="icon-btn mobile-only routine-more-btn" data-id="${e.id}" data-index="${a}" data-name="${e.name}">
                    ${m("moreVertical")}
                </button>
            </header>

            <div class="exercise-list-health">
                ${e.exercises.map((s,n)=>{const i=p.getExerciseStatus(e.id,n),o=`var(--accent-${i.color})`,r=i.status==="done_today";return`
                    <div class="exercise-item-health ${r?"exercise-done":""}">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot-wear" style="background-color: ${o}; box-shadow: 0 0 10px ${o};"></div>
                            <div class="ex-health-info">
                                <div class="ex-health-name-row">
                                    <span class="ex-health-name clickable rename-exercise" data-routine="${e.id}" data-index="${n}" data-current="${s.name}">${s.name}</span>
                                    <div class="ex-reorder-btns desktop-only">
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="up">${m("chevronUp")}</button>
                                        <button class="reorder-ex-btn" data-routine="${e.id}" data-index="${n}" data-dir="down">${m("chevronDown")}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${e.id}" data-index="${n}">${s.weight||50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${e.id}" data-index="${n}">${s.reps||10} reps</span>
                                    ${i.lastLog?`
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge-emoji" title="Último esfuerzo">${oa(i.lastLog.rating)}</span>
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
                            <button class="icon-btn mobile-only ex-more-btn" data-routine="${e.id}" data-index="${n}" data-name="${s.name}">
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
    `}function na(t){const e=t.weightLogs.length>0?t.weightLogs[t.weightLogs.length-1].weight:"--",a=t.fatLogs.length>0?t.fatLogs[t.fatLogs.length-1].fat:null;let s="rgba(255,255,255,0.1)",n="linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)",i="var(--text-primary)",o="Sin datos";return a!==null&&(a<12?(s="var(--accent-success)",n="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",i="var(--accent-success)",o="Excelente (Atlético)"):a<=18?(s="var(--accent-tertiary)",n="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)",i="var(--accent-tertiary)",o="Bueno (Fitness)"):(s="var(--accent-danger)",n="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",i="var(--accent-danger)",o="Atención (Reducción)")),`
      <!-- BODY HIGHLIGHT METRIC (UNIFIED & DYNAMIC) -->
      <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: ${n}; border-color: ${s}; padding: 24px !important; transition: all 0.3s ease;">
          <div class="card-header" style="margin-bottom: 20px;">
              <span class="card-title" style="color: ${i};">Resumen Físico Actual</span>
              <div style="color: ${s}">${m("activity","card-icon")}</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
              <!-- WEIGHT SIDE -->
              <div class="clickable" id="log-weight-btn" style="text-align: center; border-right: 1px solid rgba(255,255,255,0.1);">
                  <div class="highlight-value" style="color: ${i} !important; background: none !important; -webkit-text-fill-color: initial !important; font-size: 32px; margin: 0; line-height: 1;">${e} <span style="font-size: 14px; opacity: 0.6;">kg</span></div>
                  <div class="highlight-label" style="opacity: 0.8; margin-top: 8px; color: ${i};">Peso Actual</div>
              </div>

              <!-- FAT SIDE -->
              <div class="clickable" id="log-fat-btn" style="text-align: center;">
                  <div class="highlight-value" style="color: ${i} !important; background: none !important; -webkit-text-fill-color: initial !important; font-size: 32px; margin: 0; line-height: 1;">${a!==null?a+"%":"--"}</div>
                  <div class="highlight-label" style="color: ${i}; opacity: 0.9; margin-top: 8px;">${o}</div>
              </div>
          </div>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-xl);">
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${t.weightGoal} kg</div>
          <div class="summary-label">Peso Objetivo</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-date-btn">
          <div class="summary-value" style="font-size: 16px;">${t.weightGoalDate?new Date(t.weightGoalDate).toLocaleDateString():"--"}</div>
          <div class="summary-label">Fecha Límite</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${t.fatGoal}%</div>
          <div class="summary-label">Meta Grasa</div>
        </div>
      </div>

      <!-- TEARDOWN CHART -->
      ${ia(t)}

      <div class="card ai-calorie-card" id="ai-scan-photo" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 20px !important; margin-bottom: var(--spacing-2xl); cursor: pointer; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);">
          <div style="display: flex; align-items: center; gap: 15px;">
              <div style="background: var(--accent-primary); color: white; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                ${m("camera")}
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${ra(t)} kcal</div>
                <div style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Consumidas hoy</div>
              </div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 10px; font-size: 13px; font-weight: 700; color: var(--accent-primary);">
            Escanear Comida
          </div>
      </div>
    `}function ia(t){const e=[...t.weightLogs||[]].sort((N,ke)=>N.date-ke.date);if(e.length<1||!t.weightGoalDate)return`
            <div class="card chart-card">
                <div class="card-header">
                    <span class="card-title">Trayectoria de Peso</span>
                    ${m("trendingDown")}
                </div>
                <div class="empty-state" style="padding: var(--spacing-xl); text-align: center; opacity: 0.6;">
                    <p>Registra tu peso y establece una <br><strong>Fecha Objetivo</strong> para ver el gráfico.</p>
                </div>
            </div>
        `;const a=e[0],s=e[e.length-1],n=a.date,i=new Date(t.weightGoalDate).getTime(),o=Date.now(),l=Math.max(i,o)-n,u=e.map(N=>N.weight),c=Math.min(...u,t.weightGoal)-2,g=Math.max(...u,a.weight)+2-c,h=300,f=150,y=N=>(N-n)/l*h,x=N=>f-(N-c)/g*f,k=y(i),L=x(t.weightGoal),E=y(n),B=x(a.weight),D=e.map((N,ke)=>`${ke===0?"M":"L"} ${y(N.date)} ${x(N.weight)}`).join(" "),P=y(o),V=i-n,K=o-n,mt=Math.min(1,K/V),vt=a.weight-(a.weight-t.weightGoal)*mt,xe=s.weight-vt,De=t.weightGoal<a.weight?xe<0:xe>0,Me=V/(1e3*60*60*24*7),gt=Me>0?(a.weight-t.weightGoal)/Me:0;return`
    <div class="card chart-card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header">
            <span class="card-title">Trayectoria de Peso</span>
            <span class="badge ${De?"badge-success":"badge-danger"}" style="font-size: 10px;">
                ${De?"Vas bien":"Por debajo del ritmo"} (${Math.abs(xe).toFixed(1)}kg)
            </span>
        </div>
        
        <div class="teardown-chart-container" style="height: ${f}px; width: 100%; margin-top: 20px; position: relative;">
            <svg viewBox="0 0 ${h} ${f}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
                <!-- Grid -->
                <line x1="0" y1="${x(t.weightGoal)}" x2="${h}" y2="${x(t.weightGoal)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
                
                <!-- Target Line (Ideal) -->
                <line x1="${E}" y1="${B}" x2="${k}" y2="${L}" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5" />
                
                <!-- Real Progress -->
                <path d="${D}" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Markers -->
                <circle cx="${k}" cy="${L}" r="4" fill="var(--accent-primary)" />
                <circle cx="${y(s.date)}" cy="${x(s.weight)}" r="4" fill="var(--accent-primary)" />
                
                <!-- Today Marker -->
                <line x1="${P}" y1="0" x2="${P}" y2="${f}" stroke="var(--accent-tertiary)" stroke-width="1" opacity="0.5" />
            </svg>
        </div>
        
        <div class="chart-legend" style="margin-top: 15px; display: flex; flex-direction: column; gap: 4px; font-size: 10px; color: var(--text-muted);">
            <div style="display: flex; justify-content: space-between;">
                <span>Inicio: ${a.weight}kg</span>
                <span>Objetivo: ${t.weightGoal}kg (${new Date(t.weightGoalDate).toLocaleDateString()})</span>
            </div>
            <div style="display: flex; justify-content: center; font-weight: 600; color: var(--text-secondary); margin-top: 4px;">
                <span>Ritmo requerido: ${gt.toFixed(2)} kg / semana</span>
            </div>
        </div>
    </div>
    `}function oa(t){return t<=2?"😰":t<=4?"😐":"😄"}function ra(t){const e=new Date().toDateString();return(t.calorieLogs||[]).filter(a=>new Date(a.date).toDateString()===e).reduce((a,s)=>a+(s.calories||0),0)}function la(){document.querySelectorAll(".health-tab-btn").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.tab;e!==ie&&(ie=e,localStorage.setItem("life-dashboard/health_current_tab",e),typeof window.reRender=="function"&&window.reRender())})}),ie==="exercise"?ca():da()}function ca(){var t;document.querySelectorAll(".add-ex-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,s=await v.prompt("Nuevo Ejercicio","Nombre del ejercicio:");s&&(p.addExerciseToRoutine(a,{name:s}),v.toast("Ejercicio añadido"))})}),document.querySelectorAll(".rename-routine").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id,s=e.dataset.current,n=await v.prompt("Editar Rutina","Nombre de la rutina:",s);n&&n!==s&&(p.renameRoutine(a,n),v.toast("Rutina renombrada"))})}),document.querySelectorAll(".delete-routine-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id;await v.confirm("¿Borrar Rutina?","Esta acción no se puede deshacer.","Eliminar","Cancelar")&&(p.deleteRoutine(a),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".routine-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const s=e.dataset.id,n=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Rutina"}],r=await v.select(`Menú: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await v.prompt("Editar Rutina","Nuevo nombre:",i);l&&l!==i&&(p.renameRoutine(s,l),v.toast("Rutina renombrada"))}else r==="up"?p.reorderRoutine(n,"up"):r==="down"?p.reorderRoutine(n,"down"):r==="delete"&&await v.confirm("¿Borrar Rutina?","No se puede deshacer.","Eliminar","Cancelar")&&(p.deleteRoutine(s),v.toast("Rutina eliminada"))})}),document.querySelectorAll(".rename-exercise").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,s=parseInt(e.dataset.index),n=e.dataset.current,i=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",n);i&&i!==n&&(p.updateExercise(a,s,{name:i}),v.toast("Ejercicio renombrado"))})}),document.querySelectorAll(".delete-exercise-btn").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.routine,s=parseInt(e.dataset.index);await v.confirm("Eliminar Ejercicio","¿Quitar este ejercicio de la rutina?","Eliminar","Cancelar")&&(p.deleteExerciseFromRoutine(a,s),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".ex-more-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const s=e.dataset.routine,n=parseInt(e.dataset.index),i=e.dataset.name,o=[{value:"rename",label:"✏️ Renombrar"},{value:"up",label:"⬆️ Mover Arriba"},{value:"down",label:"⬇️ Mover Abajo"},{value:"delete",label:"🗑️ Eliminar Ejercicio"}],r=await v.select(`Ejercicio: ${i}`,"Elige una acción:",o,1);if(r==="rename"){const l=await v.prompt("Renombrar Ejercicio","Nuevo nombre:",i);l&&l!==i&&(p.updateExercise(s,n,{name:l}),v.toast("Ejercicio renombrado"))}else r==="up"?p.reorderExercise(s,n,"up"):r==="down"?p.reorderExercise(s,n,"down"):r==="delete"&&await v.confirm("Eliminar Ejercicio","¿Quitar de la rutina?","Eliminar","Cancelar")&&(p.deleteExerciseFromRoutine(s,n),v.toast("Ejercicio eliminado"))})}),document.querySelectorAll(".reorder-routine-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const s=parseInt(e.dataset.index),n=e.dataset.dir;p.reorderRoutine(s,n)})}),document.querySelectorAll(".reorder-ex-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const s=e.dataset.routine,n=parseInt(e.dataset.index),i=e.dataset.dir;p.reorderExercise(s,n,i)})}),document.querySelectorAll(".update-weight").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const s=e.dataset.routine,n=parseInt(e.dataset.index),i=[];for(let r=10;r<=150;r+=2.5)i.push(`${r}kg`);const o=await v.select("Seleccionar Peso","Elige el peso para este ejercicio:",i,4);if(o){const r=parseFloat(o.replace("kg",""));p.updateExercise(s,n,{weight:r}),v.toast("Peso actualizado")}})}),document.querySelectorAll(".update-reps").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const s=e.dataset.routine,n=parseInt(e.dataset.index),i=[];for(let r=7;r<=20;r++)i.push(`${r} reps`);const o=await v.select("Seleccionar Reps","Elige las repeticiones objetivo:",i,4);if(o){const r=parseInt(o.replace(" reps",""));p.updateExercise(s,n,{reps:r}),v.toast("Reps actualizadas")}})}),document.querySelectorAll(".log-stars-btn").forEach(e=>{e.addEventListener("click",async a=>{a.stopPropagation();const s=e.dataset.rid,n=parseInt(e.dataset.idx),i=await v.performance("Finalizar Ejercicio","¿Qué tan intenso te ha parecido?");i&&(p.logExercise(s,n,i),v.toast("Ejercicio registrado","success"))})}),(t=document.getElementById("add-routine-btn"))==null||t.addEventListener("click",async()=>{const e=await v.prompt("Nueva Rutina","Nombre (ej: Pecho y Triceps):","Día X");e&&(p.saveRoutine({name:e,exercises:[]}),v.toast("Rutina creada"))})}function da(){var t,e,a,s,n,i;(t=document.getElementById("log-weight-btn"))==null||t.addEventListener("click",async()=>{const o=await v.prompt("Registrar Peso","Peso actual (kg):","","number");o&&(p.addWeightLog(parseFloat(o)),v.toast("Peso registrado"))}),(e=document.getElementById("log-fat-btn"))==null||e.addEventListener("click",async()=>{const o=await v.prompt("Registrar Grasa","Porcentaje de grasa (%):","","number");o&&(p.addFatLog(parseFloat(o)),v.toast("Grasa registrada"))}),(a=document.getElementById("set-weight-goal-btn"))==null||a.addEventListener("click",async()=>{const o=p.getState().health.weightGoal,r=await v.prompt("Objetivo de Peso","Introduce tu peso ideal (kg):",o,"number");r&&(p.updateHealthGoal("weightGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(s=document.getElementById("set-weight-date-btn"))==null||s.addEventListener("click",async()=>{const o=p.getState().health.weightGoalDate||new Date().toISOString().split("T")[0],r=await v.prompt("Fecha Objetivo","¿Cuándo quieres llegar a tu meta?",o,"date");r&&(p.updateHealthGoal("weightGoalDate",r),v.toast("Fecha actualizada"))}),(n=document.getElementById("set-fat-goal-btn"))==null||n.addEventListener("click",async()=>{const o=p.getState().health.fatGoal,r=await v.prompt("Objetivo de Grasa","Introduce tu porcentaje ideal (%):",o,"number");r&&(p.updateHealthGoal("fatGoal",parseFloat(r)),v.toast("Objetivo actualizado"))}),(i=document.getElementById("ai-scan-photo"))==null||i.addEventListener("click",()=>{const o=document.createElement("input");o.type="file",o.accept="image/*",o.onchange=async l=>{var c;const u=l.target.files[0];if(u){if(!Ge.hasKey()){if(await v.confirm("IA no configurada","Añade tu Gemini API Key en Ajustes.","Configurar","Simulación")){(c=document.querySelector('[data-nav="settings"]'))==null||c.click();return}v.toast("Usando simulación...","info"),r();return}try{v.toast("Analizando con Gemini...","info");const d=await Ge.analyzeFood(u);await v.confirm("IA Detectada",`Identificado: "${d.name}" (${d.calories} kcal). ¿Registrar?`)&&(p.addCalorieLog(d.calories,`${d.name} (AI)`),v.toast("Calorías registradas"))}catch(d){v.alert("Error IA",d.message)}}};function r(){setTimeout(async()=>{const l={name:"Bowl Saludable",calories:450};await v.confirm("IA Simulada",`Detectado "${l.name}" con ${l.calories} kcal. ¿Registrar?`)&&(p.addCalorieLog(l.calories,l.name),v.toast("Registrado"))},1e3)}o.click()})}const Le=["#ffffff","#00D4AA","#7C3AED","#F59E0B","#EF4444","#3B82F6","#EC4899","#10B981","#A855F7","#64748B"];let oe="focus";function Fe(){const t=p.getState(),{goals:e,scheduledTasks:a}=t;return`
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Goals & Focus</h1>
        <p class="page-subtitle">Gestiona tus prioridades y automatizaciones</p>
      </header>

      <!-- Goals Tabs (Segmented Control) -->
      <div class="segmented-control" style="margin-bottom: var(--spacing-lg);">
        <button class="segment-btn ${oe==="focus"?"active":""}" id="tab-goals-focus">
            Focus
        </button>
        <button class="segment-btn ${oe==="schedule"?"active":""}" id="tab-goals-schedule">
            Schedule
        </button>
      </div>

      ${oe==="focus"?ua(e):pa(a)}
    </div>
  `}function ua(t){return`
      <div class="goals-grid-layout">
        ${[{id:"day",label:"Today",icon:"zap",color:"#FFD700"},{id:"week",label:"This Week",icon:"calendar",color:"#00D4AA"},{id:"year",label:"Year 2026",icon:"target",color:"#7C3AED"},{id:"long",label:"Long Term",icon:"trendingUp",color:"#EF4444"}].map(a=>{const s=t.filter(r=>r.timeframe===a.id),n=s.filter(r=>r.completed).length,i=s.length,o=i>0?n/i*100:0;return`
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${a.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${a.color}22; color: ${a.color}">${m(a.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${a.label}</span>
                        <span class="column-stats">${n}/${i}</span>
                    </div>
                    ${n>0?`
                        <button class="btn-clear-completed" data-tf="${a.id}" title="Limpiar completadas">
                            ${m("trash")}
                        </button>
                    `:""}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${o}%; background: ${a.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${a.id}">
                    ${ga(s,a.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${a.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${a.id}">
                        ${m("plus")}
                    </button>
                </div>
            </div>
          </div>
        `}).join("")}
      </div>
    `}function pa(t){return`
        <div class="animate-fade-in">
            <div class="schedule-actions" style="margin-bottom: var(--spacing-xl);">
                <button class="btn btn-primary w-full" id="add-scheduled-task-btn" style="padding: 15px; font-weight: 800; border-radius: 15px; box-shadow: 0 10px 20px rgba(0, 212, 170, 0.2);">
                    ${m("plus")} Programar Nueva Tarea Automática
                </button>
            </div>

            <div class="scheduled-tasks-list">
                ${t.length===0?`
                    <div class="empty-state">
                        ${m("calendar","empty-icon")}
                        <div class="empty-title">Sin tareas programadas</div>
                        <p class="empty-description">Programa tareas recurrentes que aparecerán automáticamente en tu columna de "Hoy".</p>
                    </div>
                `:t.map(e=>ma(e)).join("")}
            </div>
        </div>
    `}function ma(t){const e=va(t),a=t.color||"var(--accent-primary)";return`
    <div class="card schedule-card ${t.active?"":"is-inactive"}" 
         style="border-left: 4px solid ${a}; margin-bottom: var(--spacing-md); background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);">
        <div class="schedule-card-body" style="padding: 16px; display: flex; align-items: center; gap: 16px;">
            <div class="schedule-type-icon" style="background: ${a}22; color: ${a}; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${m(t.type==="weekly"?"refreshCw":t.type==="monthly"?"calendar":"pin")}
            </div>
            <div class="schedule-info" style="flex: 1;">
                <div class="schedule-title" style="color: ${a}; font-weight: 700; font-size: 16px;">${t.title}</div>
                <div class="schedule-meta" style="margin-top: 4px;">
                    <span class="schedule-frequency" style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">${e}</span>
                    ${t.lastProcessed?`<span class="schedule-last" style="opacity: 0.5; font-size: 10px; margin-left: 10px;">Última vez: ${t.lastProcessed}</span>`:""}
                </div>
            </div>
            <div class="schedule-actions" style="display: flex; gap: 12px;">
                <button class="icon-btn toggle-schedule" data-id="${t.id}" style="color: ${t.active?"var(--accent-success)":"var(--text-muted)"}; background: none; width: 32px; height: 32px;">
                    ${m(t.active?"checkCircle":"circle")}
                </button>
                <button class="icon-btn delete-schedule" data-id="${t.id}" style="opacity: 0.5; background: none; width: 32px; height: 32px;">
                    ${m("trash")}
                </button>
            </div>
        </div>
    </div>
    `}function va(t){if(t.type==="fixed")return`Fecha: ${t.date}`;if(t.type==="monthly")return`Día ${t.dayOfMonth}`;if(t.type==="weekly"){const e=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];return`${t.days.map(a=>e[a]).join(", ")}`}return"Recurrente"}function ga(t,e){return t.length===0?`
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${m("package")}</div>
            </div>
        `:[...t].sort((s,n)=>s.completed!==n.completed?s.completed?1:-1:s.order!==void 0&&n.order!==void 0?s.order-n.order:(n.createdAt||0)-(s.createdAt||0)).map(s=>{const n=s.subGoals&&s.subGoals.length>0,i=n?s.subGoals.filter(r=>r.completed).length/s.subGoals.length*100:0,o=s.color||"#ffffff";return`
        <div class="goal-card-premium ${s.completed?"is-completed":""}" 
             data-id="${s.id}" 
             draggable="true"
             style="border-left: 4px solid ${o};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${s.id}" style="border-color: ${o}aa; background: ${s.completed?o:"transparent"}">
                    ${s.completed?m("check","check-icon-white"):""}
                </div>
                <div class="goal-main-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div class="goal-title-premium clickable-edit-goal" 
                             data-id="${s.id}" 
                             style="color: ${o}; font-weight: 700; flex: 1;">${s.title}</div>
                        <button class="open-color-picker" data-id="${s.id}" 
                                style="width: 14px; height: 14px; background: ${o}; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; margin-top: 4px;" 
                                title="Cambiar color"></button>
                    </div>
                    
                    <div class="goal-header-row" style="margin-top: 4px;">
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${s.id}" title="Hito">${m("plus")}</button>
                            <button class="action-btn-mini delete-goal" data-id="${s.id}" title="Borrar">${m("trash")}</button>
                        </div>
                    </div>
                    
                    ${n?`
                        <div class="subgoals-list-premium">
                            ${s.subGoals.map((r,l)=>`
                                <div class="subgoal-item-premium ${r.completed?"sub-done":""} toggle-subgoal" data-id="${s.id}" data-idx="${l}">
                                    <div class="sub-check" style="color: ${o}">${m(r.completed?"check":"plus","sub-check-svg")}</div>
                                    <span class="sub-title" style="color: ${o}ee">${r.title}</span>
                                </div>
                            `).join("")}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${i}%; background: ${o}"></div>
                            </div>
                        </div>
                    `:""}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${s.id}">
                        ${Le.map(r=>`
                            <div class="goal-color-dot ${r===o?"active":""} set-goal-color" 
                                 data-id="${s.id}" 
                                 data-color="${r}"
                                 style="background: ${r}"></div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}).join("")}function qe(){const t=document.getElementById("tab-goals-focus"),e=document.getElementById("tab-goals-schedule");if(t&&e&&(t.addEventListener("click",()=>{var i;oe="focus",(i=window.reRender)==null||i.call(window)}),e.addEventListener("click",()=>{var i;oe="schedule",(i=window.reRender)==null||i.call(window)})),oe==="schedule"){ha();return}document.querySelectorAll(".btn-clear-completed").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const r=i.dataset.tf;await v.confirm("Limpiar completadas","¿Borrar todas las metas ya terminadas de esta columna?")&&(p.deleteCompletedGoals(r),v.toast("Metas limpiadas"))})}),document.querySelectorAll(".toggle-goal").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id;p.toggleGoal(r)})}),document.querySelectorAll(".open-color-picker").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=document.getElementById(`colors-${r}`);document.querySelectorAll(".color-selector-overlay").forEach(u=>{u.id!==`colors-${r}`&&u.classList.add("hidden")}),l==null||l.classList.toggle("hidden")})}),document.querySelectorAll(".set-goal-color").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=i.dataset.color;p.updateGoalColor(r,l),v.toast("Color aplicado")})}),document.querySelectorAll(".toggle-subgoal").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const r=i.dataset.id,l=parseInt(i.dataset.idx);p.toggleSubGoal(r,l)})}),document.querySelectorAll(".delete-goal").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation(),await v.confirm("Eliminar Meta","¿Estás seguro?","BORRAR")&&(p.deleteGoal(i.dataset.id),v.toast("Meta eliminada"))})}),document.querySelectorAll(".add-subgoal").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const r=i.dataset.id,l=await v.prompt("Nuevo Hito","¿Qué paso necesitas completar?");if(l){const c=[...p.getState().goals.find(d=>d.id===r).subGoals||[],{title:l,completed:!1}];p.updateGoal(r,{subGoals:c}),v.toast("Paso añadido")}})}),document.querySelectorAll(".clickable-edit-goal").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.id,r=i.textContent,l=await v.prompt("Editar Meta","Actualiza el texto:",r);l&&l!==r&&p.updateGoal(o,{title:l})})}),document.querySelectorAll(".quick-add-input-premium").forEach(i=>{i.addEventListener("keypress",o=>{if(o.key==="Enter"&&i.value.trim()){const r=i.dataset.timeframe;p.addGoal({title:i.value.trim(),timeframe:r,color:Le[0]}),i.value="",v.toast("Creada")}})}),document.querySelectorAll(".btn-quick-add-submit").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.timeframe,r=i.previousElementSibling;r&&r.value.trim()?(p.addGoal({title:r.value.trim(),timeframe:o,color:Le[0]}),r.value="",v.toast("Creada")):r&&r.focus()})});const a=document.querySelectorAll(".goals-list-premium");let s=null;document.querySelectorAll(".goal-card-premium").forEach(i=>{i.addEventListener("dragstart",o=>{s=i.dataset.id,i.classList.add("dragging"),o.dataTransfer.effectAllowed="move"}),i.addEventListener("dragend",()=>{i.classList.remove("dragging"),document.querySelectorAll(".goals-list-premium").forEach(o=>o.classList.remove("drag-over"))})}),a.forEach(i=>{i.addEventListener("dragover",o=>{o.preventDefault(),i.classList.add("drag-over"),o.dataTransfer.dropEffect="move"}),i.addEventListener("dragleave",()=>{i.classList.remove("drag-over")}),i.addEventListener("drop",o=>{o.preventDefault(),i.classList.remove("drag-over");const r=i.dataset.timeframe,l=[...p.getState().goals],u=l.findIndex(h=>h.id===s);if(u===-1)return;const c={...l[u]};c.timeframe!==r&&(c.timeframe=r),l.splice(u,1);const d=n(i,o.clientY);if(d==null)l.push(c);else{const h=d.dataset.id,f=l.findIndex(y=>y.id===h);l.splice(f,0,c)}const g=l.map((h,f)=>({...h,order:f}));p.reorderGoals(g),v.toast("Orden actualizado")})});function n(i,o){return[...i.querySelectorAll(".goal-card-premium:not(.dragging)")].reduce((l,u)=>{const c=u.getBoundingClientRect(),d=o-c.top-c.height/2;return d<0&&d>l.offset?{offset:d,element:u}:l},{offset:Number.NEGATIVE_INFINITY}).element}}function ha(){var t;(t=document.getElementById("add-scheduled-task-btn"))==null||t.addEventListener("click",async()=>{const e=await v.prompt("Programar Tarea","¿Qué quieres automatizar?");if(!e)return;const a=[{value:"weekly",label:"📅 Semanal (Elegir días)"},{value:"monthly",label:"🗓️ Mensual (Día fijo)"},{value:"fixed",label:"📌 Fecha Concreta"}],s=await v.select("Tipo de Repetición","¿Cómo se repite esta tarea?",a,1);if(!s)return;let n={title:e,type:s};if(s==="weekly"){const r=await v.prompt("Días de la semana","Introduce los días (1=Lun, 7=Dom) separados por coma:","1,4");if(!r)return;const l=r.split(",").map(u=>{let c=parseInt(u.trim());return c===7?0:c}).filter(u=>!isNaN(u));n.days=l}else if(s==="monthly"){const r=await v.prompt("Día del mes","Día (1-31):","1","number");if(!r)return;n.dayOfMonth=parseInt(r)}else if(s==="fixed"){const r=await v.prompt("Fecha Concreta","¿Cuándo?",new Date().toISOString().split("T")[0],"date");if(!r)return;n.date=r}const i=[{value:"#00D4AA",label:"Teal"},{value:"#7C3AED",label:"Purple"},{value:"#F59E0B",label:"Orange"},{value:"#EF4444",label:"Red"},{value:"#3B82F6",label:"Blue"}],o=await v.select("Color","Elige un color:",i,3);n.color=o||"#00D4AA",p.addScheduledTask(n),v.toast("Tarea programada")}),document.querySelectorAll(".delete-schedule").forEach(e=>{e.addEventListener("click",async()=>{const a=e.dataset.id;await v.confirm("Eliminar Programación","¿Seguro que quieres quitar esta automatización?")&&(p.deleteScheduledTask(a),v.toast("Eliminado"))})}),document.querySelectorAll(".toggle-schedule").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.id,s=p.getState().scheduledTasks.find(n=>n.id===a);p.updateScheduledTask(a,{active:!s.active})})})}let q=new Date;function ya(){const t=p.getState(),{events:e}=t;return`
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
                <span class="current-month">${ba()}</span>
                <button class="icon-btn-navigation next-month">${m("chevronRight")}</button>
            </div>
            <div class="calendar-grid">
                ${fa(e)}
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
                `:e.filter(a=>{const s=new Date(a.date);return s.getMonth()===q.getMonth()&&s.getFullYear()===q.getFullYear()}).sort((a,s)=>new Date(a.date)-new Date(s.date)).map(a=>`
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${a.category||"event"}">
                            ${m(xa(a.category||"event"))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${a.title}</div>
                            <div class="event-details-row">
                                <span class="event-date-text">${wa(a.date)}</span>
                                <span class="event-dot-separator"></span>
                                <span class="event-time-text">${a.time}</span>
                                ${a.repeat!=="none"?`<span class="event-repeat-tag">${ka(a.repeat)}</span>`:""}
                            </div>
                        </div>
                        <button class="event-delete-btn" data-id="${a.id}">
                            ${m("trash")}
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
      </div>
    </div>
  `}function fa(t){const e=q.getMonth(),a=q.getFullYear(),s=new Date().getDate(),n=new Date().getMonth()===e&&new Date().getFullYear()===a,i=new Date(a,e+1,0).getDate(),o=new Date(a,e,1).getDay(),r=["D","L","M","M","J","V","S"],l=new Set;t.forEach(c=>{const d=new Date(c.date);d.getMonth()===e&&d.getFullYear()===a&&l.add(d.getDate())});let u=r.map(c=>`<div class="calendar-day-label">${c}</div>`).join("");for(let c=0;c<o;c++)u+='<div class="calendar-day empty"></div>';for(let c=1;c<=i;c++){const d=n&&c===s,g=l.has(c);u+=`
            <div class="calendar-day ${d?"today":""} ${g?"has-event":""}">
                ${c}
                ${g?'<span class="event-dot-indicator"></span>':""}
            </div>
        `}return u}function ba(){return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][q.getMonth()]} ${q.getFullYear()}`}function wa(t){const e={day:"numeric",month:"short"};return new Date(t).toLocaleDateString("es-ES",e).toUpperCase()}function xa(t){switch(t){case"reminder":return"bell";case"meeting":return"users";default:return"calendar"}}function ka(t){return{daily:"Diario",weekly:"Semanal",monthly:"Mensual",yearly:"Anual"}[t]||""}function Ea(){var t,e,a;(t=document.querySelector(".prev-month"))==null||t.addEventListener("click",()=>{q.setMonth(q.getMonth()-1),typeof window.reRender=="function"&&window.reRender()}),(e=document.querySelector(".next-month"))==null||e.addEventListener("click",()=>{q.setMonth(q.getMonth()+1),typeof window.reRender=="function"&&window.reRender()}),document.querySelectorAll(".event-delete-btn").forEach(s=>{s.addEventListener("click",async()=>{await v.confirm("¿Eliminar evento?","¿Borrar este evento de tu agenda?")&&(p.deleteEvent(s.dataset.id),v.toast("Evento eliminado"))})}),(a=document.getElementById("add-event-manual-btn"))==null||a.addEventListener("click",async()=>{const s=await v.prompt("Nuevo Evento","Título del evento:");if(!s)return;const n=await v.prompt("Fecha","Formato YYYY-MM-DD:",new Date().toISOString().split("T")[0]);if(!n)return;const i=await v.prompt("Hora","Formato HH:MM:","10:00");if(!i)return;const o=[{value:"event",label:"Evento"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"}],r=await v.select("Categoría","Tipo de evento:",o,0);p.addEvent({title:s,date:n,time:i,category:r||"event",repeat:"none"}),v.toast("Evento agendado","success")})}function $a(){const t=p.getState(),e=t.currencySymbol,a=t.livingExpenses,s=t.otherExpenses||[],n=t.liabilities,i=p.sumItems(a,"amount"),o=p.sumItems(s,"amount"),r=p.sumItems(n,"monthlyPayment"),l=i+o+r,u=[...(a||[]).map(c=>({...c,category:"livingExpense",typeLabel:"Gasto de Vida"})),...(s||[]).map(c=>({...c,category:"otherExpense",typeLabel:"Otro Gasto"})),...(n||[]).filter(c=>c.monthlyPayment>0).map(c=>({...c,amount:c.monthlyPayment,category:"liability",typeLabel:"Deuda / Hipoteca"}))].sort((c,d)=>d.amount-c.amount);return`
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
      
      ${Sa(u,t)}

    </div>
  `}function Sa(t,e){if(t.length===0)return`
            <div class="empty-state">
                ${m("creditCard","empty-icon")}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;const a=e.currencySymbol;return`
        <div class="asset-list">
            ${t.map(s=>{const n=p.convertValue(s.amount,s.currency||"EUR"),i=Ia(s.category);return`
                <div class="asset-item expense-item" data-id="${s.id}" data-category="${s.category}">
                    <div class="asset-icon-wrapper expense">
                        ${m(i,"asset-icon")}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${s.name}</div>
                        <div class="asset-details">${s.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${w(n,a)}
                    </div>
                </div>
                `}).join("")}
        </div>
    `}function Ia(t){switch(t){case"liability":return"landmark";case"livingExpense":return"shoppingCart";default:return"creditCard"}}function La(t){const e=document.getElementById("back-to-finance");e&&e.addEventListener("click",t),document.querySelectorAll(".expense-item").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.id,i=s.dataset.category;tt(n,i)})})}const Aa="modulepreload",Ca=function(t){return"/life-dashboard/"+t},He={},ye=function(e,a,s){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(a.map(l=>{if(l=Ca(l),l in He)return;He[l]=!0;const u=l.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":Aa,u||(d.as="script"),d.crossOrigin="",d.href=l,r&&d.setAttribute("nonce",r),document.head.appendChild(d),u)return new Promise((g,h)=>{d.addEventListener("load",g),d.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return n.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function Ta(){const t=S.isBioEnabled(),e=O.hasToken();return`
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
                        <input type="checkbox" id="toggle-bio" ${t?"checked":""}>
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
            <p>Life Dashboard Pro v1.0.96</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `}function Da(){var s,n,i,o,r,l,u,c,d,g;(s=document.getElementById("toggle-bio"))==null||s.addEventListener("change",async h=>{if(h.target.checked){const y=await v.prompt("Activar Biometría","Introduce tu contraseña maestra para confirmar:","Tu contraseña","password");if(y)try{await S.registerBiometrics(y),v.toast("Biometría activada correctamente")}catch(x){await v.alert("Error",x.message),h.target.checked=!1}else h.target.checked=!1}else localStorage.setItem("life-dashboard/db_bio_enabled","false"),v.toast("Biometría desactivada","info")});const t=document.getElementById("btn-install-pwa");t&&setTimeout(()=>{if(window.deferredPrompt){const h=document.getElementById("install-pwa-card");h&&(h.style.display="block"),t.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:f}=await window.deferredPrompt.userChoice;if(f==="accepted"){v.toast("Instalando aplicación...");const y=document.getElementById("install-pwa-card");y&&(y.style.display="none")}window.deferredPrompt=null})}},1e3),(n=document.getElementById("connect-drive-btn"))==null||n.addEventListener("click",async()=>{try{await O.authenticate(),v.toast("Google Drive conectado"),typeof window.reRender=="function"&&window.reRender()}catch(h){v.alert("Error",h.message||"Error al conectar")}}),(i=document.getElementById("upload-drive-btn"))==null||i.addEventListener("click",async()=>{const h=document.getElementById("upload-drive-btn"),f=h.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;h.innerHTML='<div class="loading-spinner-sm"></div>',h.style.pointerEvents="none";const x=S.getVaultKey();await O.pushData(p.getState(),x),v.toast("Bóveda subida correctamente")}catch(y){console.error(y),v.alert("Error al subir",y.message)}finally{h.innerHTML=f,h.style.pointerEvents="auto"}}),(o=document.getElementById("download-drive-btn"))==null||o.addEventListener("click",async()=>{const h=document.getElementById("download-drive-btn"),f=h.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;h.innerHTML='<div class="loading-spinner-sm"></div>',h.style.pointerEvents="none";const x=S.getVaultKey(),k=await O.pullData(x);k?(p.resetState(k),await p.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(y){console.error("[Settings] Download failed:",y),v.alert("Error de Descarga",y.message||"Error desconocido al bajar datos")}finally{h.innerHTML=f,h.style.pointerEvents="auto"}}),(r=document.getElementById("export-data-btn"))==null||r.addEventListener("click",async()=>{try{v.toast("Preparando archivo encriptado...","info");const h=p.getState(),f=S.getVaultKey(),{SecurityService:y}=await ye(async()=>{const{SecurityService:D}=await Promise.resolve().then(()=>Be);return{SecurityService:D}},void 0),x=await y.encrypt(h,f),k=new Blob([JSON.stringify(x)],{type:"application/octet-stream"}),L=URL.createObjectURL(k),E=document.createElement("a"),B=new Date().toISOString().split("T")[0];E.href=L,E.download=`life_dashboard_backup_${B}.bin`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL(L),v.toast("Backup exportado correctamente")}catch(h){console.error("Export error:",h),v.alert("Error de Exportación","No se pudieron encriptar o descargar los datos.")}});const e=document.getElementById("import-backup-btn"),a=document.getElementById("import-backup-input");e==null||e.addEventListener("click",()=>{a==null||a.click()}),a==null||a.addEventListener("change",async h=>{var x;const f=(x=h.target.files)==null?void 0:x[0];if(!f)return;if(!await v.confirm("¿Importar Backup?","Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?")){a.value="";return}try{const k=await f.text(),L=JSON.parse(k),E=S.getVaultKey(),{SecurityService:B}=await ye(async()=>{const{SecurityService:P}=await Promise.resolve().then(()=>Be);return{SecurityService:P}},void 0),D=await B.decrypt(L,E);if(D)p.setState(D),await p.saveState(),v.toast("Backup importado correctamente"),setTimeout(()=>window.location.reload(),1e3);else throw new Error("No se pudo descifrar el archivo")}catch(k){console.error("Import error:",k),v.alert("Error de Importación","El archivo no es válido o la contraseña no coincide con la usada para el backup.")}finally{a.value=""}}),(l=document.getElementById("btn-logout"))==null||l.addEventListener("click",async()=>{await v.confirm("¿Cerrar sesión?","El acceso quedará bloqueado hasta que introduzcas tu clave.")&&(S.logout(),window.location.reload())}),(u=document.getElementById("btn-save-gemini"))==null||u.addEventListener("click",()=>{var f;const h=(f=document.getElementById("gemini-api-key"))==null?void 0:f.value;h!==void 0&&(localStorage.setItem("life-dashboard/db_gemini_api_key",h.trim()),v.toast("API Key de Gemini guardada"))}),(c=document.getElementById("btn-save-drive-secret"))==null||c.addEventListener("click",()=>{const f=document.getElementById("drive-client-secret").value.trim();f?(localStorage.setItem("life-dashboard/drive_client_secret",f),v.toast("Secreto guardado correctamente")):(localStorage.removeItem("life-dashboard/drive_client_secret"),v.toast("Secreto eliminado, usando valor por defecto","info")),O.init().catch(console.error)}),(d=document.getElementById("toggle-drive-secret"))==null||d.addEventListener("click",h=>{const f=document.getElementById("drive-client-secret"),y=h.currentTarget,x=f.type==="password";f.type=x?"text":"password",y.innerHTML=m(x?"eyeOff":"eye")}),(g=document.getElementById("btn-factory-reset"))==null||g.addEventListener("click",async()=>{if(await v.hardConfirm("Borrar todos los datos","Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.","BORRAR")){const f="life-dashboard/";if(Object.keys(localStorage).forEach(y=>{y.startsWith(f)&&localStorage.removeItem(y)}),Object.keys(sessionStorage).forEach(y=>{y.startsWith(f)&&sessionStorage.removeItem(y)}),window.indexedDB.databases&&(await window.indexedDB.databases()).forEach(x=>window.indexedDB.deleteDatabase(x.name)),navigator.serviceWorker){const y=await navigator.serviceWorker.getRegistrations();for(let x of y)x.unregister()}v.toast("Aplicación reseteada","info"),setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now()},1e3)}})}function Ma(){const t=O.hasToken();return`
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

            ${t?`
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
    `}function Ba(t){var e,a,s,n,i,o,r;(e=document.getElementById("open-calendar"))==null||e.addEventListener("click",()=>{t("calendar")}),(a=document.getElementById("open-skills"))==null||a.addEventListener("click",()=>{t("skills")}),(s=document.getElementById("open-schedule"))==null||s.addEventListener("click",()=>{t("goals")}),(n=document.getElementById("open-settings"))==null||n.addEventListener("click",()=>{t("settings")}),(i=document.getElementById("btn-upload-menu"))==null||i.addEventListener("click",async()=>{const l=document.getElementById("btn-upload-menu"),u=l.innerHTML;try{if(!await v.confirm("Subir a la Nube","Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?"))return;l.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',l.style.pointerEvents="none";const d=S.getVaultKey();await O.pushData(p.getState(),d),v.toast("Bóveda subida correctamente")}catch(c){console.error(c),v.alert("Error al subir",c.message)}finally{l.innerHTML=u,l.style.pointerEvents="auto"}}),(o=document.getElementById("btn-download-menu"))==null||o.addEventListener("click",async()=>{const l=document.getElementById("btn-download-menu"),u=l.innerHTML;try{if(!await v.confirm("Descargar de la Nube","Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?"))return;l.innerHTML='<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>',l.style.pointerEvents="none";const d=S.getVaultKey(),g=await O.pullData(d);g?(p.resetState(g),await p.saveState(),v.toast("Datos descargados correctamente","success"),setTimeout(()=>window.location.reload(),1e3)):v.alert("Error","No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)")}catch(c){console.error("[Menu] Download failed:",c),v.alert("Error de Descarga",c.message||"Error desconocido al bajar datos")}finally{l.innerHTML=u,l.style.pointerEvents="auto"}}),(r=document.getElementById("btn-force-update"))==null||r.addEventListener("click",async()=>{if(await v.confirm("¿Forzar Actualización?","Esto recargará la página y limpiará la caché para obtener la última versión.")){if(window.caches)try{const u=await caches.keys();for(let c of u)await caches.delete(c)}catch(u){console.error("Error clearing cache",u)}window.location.reload(!0)}})}function Pa(){const{social:t}=p.getState(),{people:e,columns:a,idealLeadProfile:s}=t,n=e.length,i=a.find(u=>u.name.toLowerCase().includes("closed")||u.name.toLowerCase().includes("cerrado")||u.name.toLowerCase().includes("exito"));let o=0;if(n>0){const u=s&&s.trim().length>0;(i?e.filter(d=>d.columnId===i.id).length:0)>0?o=u?100:80:(o=Math.min(40,n*5),u&&(o+=10))}let r="var(--accent-danger)",l="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)";return o>=60?(r="var(--accent-success)",l="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"):o>=25&&(r="var(--accent-tertiary)",l="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"),`
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
            ${a.sort((u,c)=>u.order-c.order).map(u=>{const c=e.filter(d=>d.columnId===u.id);return`
                <div class="kanban-column" data-col-id="${u.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${u.color}"></span>
                            ${u.name}
                            <span class="kanban-count">${c.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${u.id}">${m("moreVertical")}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${u.id}">
                        ${c.map(d=>Ra(d)).join("")}
                    </div>
                </div>
                `}).join("")}
        </div>
    </div>
    `}function Ra(t){const e=t.lastContact?Math.floor((Date.now()-new Date(t.lastContact).getTime())/864e5):null,a=t.color||"#3b82f6";return`
    <div class="person-card glass-panel" draggable="true" data-id="${t.id}">
        <div class="person-color-strip" style="background: ${a};"></div>
        <div class="person-card-content">
            <div class="person-header" style="margin-bottom: 2px;">
                <h3 class="person-name" style="font-size: 14px;">${t.name}</h3>
                ${t.rating?`<span class="person-rating" style="font-size: 10px; font-weight: 800; color: var(--accent-tertiary);">★${t.rating}</span>`:""}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="person-info-left" style="display: flex; align-items: center; gap: 8px;">
                    <div class="person-detail text-muted" style="font-size: 10px; font-weight: 600;">
                        ${e!==null?`${e===0?"Hoy":`Hace ${e}d`}`:"Contactar"}
                    </div>
                    ${t.source?`<span class="tag" style="font-size: 8px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-muted);">${t.source}</span>`:""}
                </div>
                <button class="icon-btn person-chat-btn" data-id="${t.id}" style="padding: 4px; background: none; color: var(--accent-primary); opacity: 0.7;">
                    ${m("messageSquare","tiny-icon")}
                </button>
            </div>
        </div>
    </div>
    `}function ja(){window.socialListenersAttached||(window.socialListenersAttached=!0,document.addEventListener("click",t=>{const e=t.target.closest(".col-opts-btn");if(e){t.preventDefault(),t.stopPropagation(),Ga(e.dataset.id,e);return}if(t.target.closest("#add-social-col-btn")){_a();return}if(t.target.closest("#add-person-btn")){window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person"}}));return}if(t.target.closest("#ideal-lead-btn")){Ua();return}if(t.target.closest("#communications-mgr-btn")){ye(()=>import("./CommunicationsModal-Dy5uIG8y.js"),[]).then(n=>n.openCommunicationsModal());return}if(t.target.closest("#contact-sources-btn")){qa();return}const a=t.target.closest(".person-chat-btn");if(a){t.preventDefault(),t.stopPropagation(),ye(()=>import("./CommunicationsModal-Dy5uIG8y.js"),[]).then(n=>n.openCommunicationsModal(a.dataset.id));return}const s=t.target.closest(".person-card");if(s){Oa(s.dataset.id);return}}),document.addEventListener("dragstart",t=>{const e=t.target.closest(".person-card");e&&(t.dataTransfer.setData("text/plain",e.dataset.id),e.classList.add("dragging"))}),document.addEventListener("dragend",t=>{const e=t.target.closest(".person-card");e&&e.classList.remove("dragging")}),document.addEventListener("dragover",t=>{const e=t.target.closest(".kanban-cards");e&&(t.preventDefault(),e.classList.add("drag-over"))}),document.addEventListener("dragleave",t=>{const e=t.target.closest(".kanban-cards");e&&e.classList.remove("drag-over")}),document.addEventListener("drop",t=>{const e=t.target.closest(".kanban-cards");if(e){t.preventDefault(),e.classList.remove("drag-over");const a=t.dataTransfer.getData("text/plain"),s=e.dataset.colId;a&&s&&p.movePerson(a,s)}}))}async function _a(){const t=await v.prompt("Etapa","Nombre de la etapa:");t&&(p.addSocialColumn({name:t,color:"#94a3b8"}),v.toast("Etapa agregada correctamente","success"))}async function Ua(){const t=p.getState().social.idealLeadProfile||"",e=await Na(t);e!==null&&(p.updateIdealLeadProfile(e),v.toast("Perfil Ideal actualizado"))}function Oa(t){const e=p.getState().social.people.find(a=>a.id===t);e&&window.dispatchEvent(new CustomEvent("open-add-modal",{detail:{type:"person",person:e}}))}function Na(t){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="9999",a.innerHTML=`
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${t||""}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const s=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",s),a.querySelector("#save-ideal-lead").addEventListener("click",()=>{const n=a.querySelector("#ideal-lead-text").value;a.remove(),e(n)}),a.addEventListener("click",n=>{n.target===a&&s()})})}function Ga(t,e){document.querySelectorAll(".column-options-menu").forEach(o=>o.remove());const a=p.getState().social.columns.find(o=>o.id===t);if(!a)return;const s=document.createElement("div");s.className="column-options-menu",s.innerHTML=`
        <button class="menu-item" data-action="edit">${m("edit")} Editar Nombre</button>
        <button class="menu-item" data-action="color">${m("palette")} Cambiar Color</button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_up">${m("chevronUp")} Mover Arriba (Anterior)</button>
        <button class="menu-item" data-action="move_down">${m("chevronDown")} Mover Abajo (Siguiente)</button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">${m("trash")} Eliminar Etapa</button>
    `;const n=e.getBoundingClientRect();s.style.position="fixed",s.style.top=`${n.bottom+8}px`,s.style.right=`${window.innerWidth-n.right}px`,s.style.zIndex="9999",document.body.appendChild(s),s.querySelectorAll(".menu-item").forEach(o=>{o.addEventListener("click",async()=>{const r=o.dataset.action;if(s.remove(),r==="edit"){const l=await v.prompt("Nombre de Columna","Nuevo nombre:",a.name);l!=null&&l.trim()&&p.updateSocialColumn(t,{name:l.trim()})}else if(r==="color"){const l=await Fa(a.color);l&&p.updateSocialColumn(t,{color:l})}else if(r==="delete")await v.confirm("Eliminar Etapa",`¿Eliminar "${a.name}"?`)&&p.deleteSocialColumn(t);else if(r==="move_up"||r==="move_down"){const l=[...p.getState().social.columns].sort((d,g)=>d.order-g.order),u=l.findIndex(d=>d.id===t);if(u===-1)return;const c=r==="move_up"?u-1:u+1;c>=0&&c<l.length&&([l[u].order,l[c].order]=[l[c].order,l[u].order],p.reorderSocialColumns(l))}})});const i=o=>{!s.contains(o.target)&&o.target!==e&&(s.remove(),document.removeEventListener("click",i))};setTimeout(()=>document.addEventListener("click",i),10)}function Fa(t){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="99999",a.innerHTML=`
            <div class="modal" style="max-width: 320px;">
                <div class="modal-header">
                    <h2 class="modal-title">Color de Etapa</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <input type="color" id="stage-color-input" class="color-picker-input" value="${t||"#3b82f6"}">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px;">
                        ${["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#64748b","#000000"].map(n=>`<div class="color-swatch" data-color="${n}" style="background:${n}; height:30px; border-radius:6px; cursor:pointer; border:2px solid ${t===n?"white":"transparent"}"></div>`).join("")}
                    </div>
                    <button class="btn btn-primary w-full" id="save-stage-color" style="margin-top: 24px;">Aplicar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const s=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",s),a.querySelectorAll(".color-swatch").forEach(n=>n.addEventListener("click",()=>{a.querySelector("#stage-color-input").value=n.dataset.color,a.querySelectorAll(".color-swatch").forEach(i=>i.style.borderColor="transparent"),n.style.borderColor="white"})),a.querySelector("#save-stage-color").addEventListener("click",()=>{const n=a.querySelector("#stage-color-input").value;a.remove(),e(n)}),a.addEventListener("click",n=>{n.target===a&&s()})})}async function qa(){const{contactSources:t}=p.getState().social,e=await Ha(t);e&&(p.updateContactSources(e),v.toast("Fuentes de contacto actualizadas"))}function Ha(t){return new Promise(e=>{const a=document.createElement("div");a.className="modal-overlay active",a.style.zIndex="9999",a.innerHTML=`
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fuentes de Contacto</h2>
                    <button class="modal-close">${m("x")}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">Escribe las fuentes separadas por coma:</p>
                    <textarea id="contact-sources-text" class="form-input" rows="4" placeholder="Ej: Instagram, WhatsApp, Amigo...">${t.join(", ")}</textarea>
                    <button class="btn btn-primary w-full" id="save-contact-sources" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(a);const s=()=>{a.remove(),e(null)};a.querySelector(".modal-close").addEventListener("click",s),a.querySelector("#save-contact-sources").addEventListener("click",()=>{const i=a.querySelector("#contact-sources-text").value.split(",").map(o=>o.trim()).filter(o=>o.length>0);a.remove(),e(i)}),a.addEventListener("click",n=>{n.target===a&&s()})})}let ue="tracker",T=null,we=!1,ae=null;function za(){const t=p.getState(),{activities:e=[],logs:a=[]}=t.timeInvest||{};return`
    <div class="time-invest-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Time Invest</h1>
            <p class="page-subtitle">Invierte tu tiempo con propósito</p>
        </header>

        <div class="segmented-control">
            <button class="segment-btn ${ue==="tracker"?"active":""}" id="tab-tracker">
                Tracker
            </button>
            <button class="segment-btn ${ue==="stats"?"active":""}" id="tab-stats">
                Stats
            </button>
        </div>

        ${Va(e,a)}

        ${T?Xa(e):""}
    </div>
    `}function Va(t,e){var a;if(ae){const s=t.find(n=>n.id===ae);if(s&&((a=s.subActivities)==null?void 0:a.length)>0)return Ka(s)}return ue==="tracker"?Ya(t):Wa(t,e)}function Ka(t){return`
    <div class="sub-activity-selector animate-fade-in">
        <div class="section-divider">
            <button class="btn-mini-action" id="btn-back-to-activities">${m("chevronLeft")}</button>
            <span class="section-title">¿En qué vas a trabajar?</span>
        </div>
        
        <div class="activities-grid">
            <div class="activity-btn sub-opt" data-sub-id="none" style="--color: ${t.color}; --color-alpha: ${t.color}20">
                 <span class="activity-label">General</span>
            </div>
            ${t.subActivities.map(e=>`
                <div class="activity-btn sub-opt" data-sub-id="${e.id}" style="--color: ${t.color}; --color-alpha: ${t.color}20">
                    <span class="activity-label">${e.name}</span>
                </div>
            `).join("")}
        </div>
    </div>
    `}function Ya(t){return`
    <div class="tracker-view animate-fade-in">
        <div class="section-divider">
            <span class="section-title">Actividades</span>
            <button class="btn-add-goal-inline" id="btn-add-activity">
                ${m("plus")} Configurar
            </button>
        </div>

        <div class="activities-grid">
            ${t.map(e=>`
                <div class="activity-btn" data-id="${e.id}" style="--color: ${e.color}; --color-alpha: ${e.color}20">
                    <div class="activity-icon-container">
                        ${m(e.icon||"brain")}
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
                <input type="checkbox" id="pomodoro-toggle" class="apple-switch" ${we?"checked":""}>
            </div>
        </div>
    </div>
    `}function Wa(t,e){const a=[];for(let c=6;c>=0;c--){const d=new Date;d.setDate(d.getDate()-c),a.push(d.toISOString().split("T")[0])}const s=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],n=a.map(c=>{const d=e.filter(h=>h.date.startsWith(c)),g={};return d.forEach(h=>{g[h.activityId]=(g[h.activityId]||0)+(h.durationMinutes||0)}),g}),i=Math.max(...n.flatMap(c=>Object.values(c)),60),o=150,r=300,l=r/6,u=c=>n.map((d,g)=>{const h=d[c]||0,f=g*l,y=o-h/i*o;return`${g===0?"M":"L"} ${f} ${y}`}).join(" ");return`
    <div class="stats-view animate-fade-in">
        <div class="card stats-card">
            <div class="card-header">
                <span class="card-title">Inversión 7 días (minutos)</span>
                ${m("trendingUp")}
            </div>
            
            <div class="line-chart-container" style="height: ${o}px; width: 100%; position: relative; margin-top: 20px;">
                <svg viewBox="0 0 ${r} ${o}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
                    <!-- Grid Lines -->
                    <line x1="0" y1="0" x2="${r}" y2="0" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="${o/2}" x2="${r}" y2="${o/2}" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="${o}" x2="${r}" y2="${o}" stroke="rgba(255,255,255,0.1)" />
                    
                    ${t.map(c=>`
                        <path d="${u(c.id)}" fill="none" stroke="${c.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px ${c.color}40)" />
                        ${n.map((d,g)=>{const h=d[c.id]||0;if(h===0)return"";const f=g*l,y=o-h/i*o;return`<circle cx="${f}" cy="${y}" r="4" fill="${c.color}" />`}).join("")}
                    `).join("")}
                </svg>
                
                <div class="chart-labels" style="display: flex; justify-content: space-between; margin-top: 10px;">
                    ${a.map(c=>`<span style="font-size: 10px; color: var(--text-muted);">${s[new Date(c).getUTCDay()]}</span>`).join("")}
                </div>
            </div>
            
            <div class="chart-legend" style="margin-top: 24px; display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${t.map(c=>`
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
            ${t.map(c=>{const d=e.filter(g=>g.activityId===c.id).reduce((g,h)=>g+(h.durationMinutes||0),0);return`
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
    `}function Xa(t){var n;const e=t.find(i=>i.id===T.activityId),a=(n=e==null?void 0:e.subActivities)==null?void 0:n.find(i=>i.id===T.subActivityId),s=rt(T.elapsedSeconds);return`
    <div class="timer-overlay animate-fade-in">
        <div class="timer-active-label">Invirtiendo en...</div>
        <div class="activity-label" style="font-size: 32px; margin-bottom: 4px; color: ${e==null?void 0:e.color}">${e==null?void 0:e.name}</div>
        ${a?`<div class="sub-activity-label" style="font-size: 18px; margin-bottom: var(--spacing-xl); opacity: 0.8;">${a.name}</div>`:'<div style="margin-bottom: var(--spacing-xl);"></div>'}
        
        <div class="timer-display">${s}</div>

        <div class="timer-controls">
            <!-- No pause for now to keep it simple, just stop/complete -->
            <button class="timer-btn stop" id="btn-stop-timer">
                ${m("x")}
            </button>
            <button class="timer-btn" id="btn-complete-timer" style="background: var(--accent-success); color: white;">
                ${m("check")}
            </button>
        </div>
        
        ${we?`<p style="margin-top: 40px; color: var(--text-muted); font-size: 14px;">Pomodoro activo (${p.getState().timeInvest.pomodoroTime} min)</p>`:""}
    </div>
    `}function rt(t){const e=Math.floor(t/3600),a=Math.floor(t%3600/60),s=t%60;return`${e>0?e+":":""}${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Ja(){var t,e,a,s,n,i,o;(t=document.getElementById("tab-tracker"))==null||t.addEventListener("click",()=>{var r;ue="tracker",(r=window.reRender)==null||r.call(window)}),(e=document.getElementById("tab-stats"))==null||e.addEventListener("click",()=>{var r;ue="stats",(r=window.reRender)==null||r.call(window)}),document.querySelectorAll(".activity-btn").forEach(r=>{r.classList.contains("sub-opt")||r.addEventListener("click",()=>{var c,d;const l=r.dataset.id;((c=p.getState().timeInvest.activities.find(g=>g.id===l).subActivities)==null?void 0:c.length)>0?(ae=l,(d=window.reRender)==null||d.call(window)):Ve(l)})}),document.querySelectorAll(".sub-opt").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.subId==="none"?null:r.dataset.subId;Ve(ae,l),ae=null})}),(a=document.getElementById("btn-back-to-activities"))==null||a.addEventListener("click",()=>{var r;ae=null,(r=window.reRender)==null||r.call(window)}),(s=document.getElementById("pomodoro-toggle"))==null||s.addEventListener("change",r=>{we=r.target.checked}),(n=document.getElementById("btn-stop-timer"))==null||n.addEventListener("click",()=>{confirm("¿Deseas cancelar esta sesión? No se guardarán los datos.")&&Ke(!1)}),(i=document.getElementById("btn-complete-timer"))==null||i.addEventListener("click",()=>{Ke(!0)}),(o=document.getElementById("btn-add-activity"))==null||o.addEventListener("click",()=>{fe()})}function fe(){var r,l,u;const t=p.getState().timeInvest,{activities:e=[],pomodoroTime:a=25}=t,s=document.createElement("div");s.className="modal-overlay active",s.id="time-invest-config-modal",s.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 500px;">
            <div class="modal-header">
                <h2 class="modal-title">Configurar Time Invest</h2>
                <button class="modal-close" id="close-config-modal">${m("x")}</button>
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
                                    <div style="color: ${c.color}">${m(c.icon||"brain","mini-icon")}</div>
                                    <span style="font-weight: 600;">${c.name}</span>
                                </div>
                                <div class="activity-edit-actions">
                                    <button class="btn-mini-action edit-activity" data-id="${c.id}">${m("edit")}</button>
                                    <button class="btn-mini-action delete delete-activity" data-id="${c.id}">${m("trash")}</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                    <button class="btn btn-secondary" id="btn-new-activity" style="width: 100%; margin-top: var(--spacing-md); border-style: dashed;">
                        ${m("plus")} Añadir Actividad
                    </button>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="save-config" style="width: 100%;">Listo</button>
            </div>
        </div>
    `,document.body.appendChild(s);const n=()=>{var c;s.classList.remove("active"),setTimeout(()=>s.remove(),300),(c=window.reRender)==null||c.call(window)};(r=document.getElementById("close-config-modal"))==null||r.addEventListener("click",n),(l=document.getElementById("save-config"))==null||l.addEventListener("click",n);const i=document.getElementById("pomodoro-input"),o=document.getElementById("pomodoro-val");i==null||i.addEventListener("input",c=>{const d=c.target.value;o.textContent=d,p.setPomodoroTime(d)}),s.querySelectorAll(".edit-activity").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.id,g=e.find(h=>h.id===d);ze(g),s.remove()})}),s.querySelectorAll(".delete-activity").forEach(c=>{c.addEventListener("click",async()=>{const d=c.dataset.id;await v.confirm("¿Eliminar actividad?","Se perderán también los registros asociados.")&&(p.deleteTimeActivity(d),s.remove(),fe())})}),(u=document.getElementById("btn-new-activity"))==null||u.addEventListener("click",()=>{ze(),s.remove()})}function ze(t=null){var c,d;const e=!!t,a=["brain","rocket","coffee","bookOpen","zap","heart","briefcase","users","dumbbell","code","music","monitor"],s=["#8b5cf6","#f59e0b","#ef4444","#3b82f6","#10b981","#ec4899","#06b6d4","#f97316","#84cc16","#a855f7","#6366f1","#d946ef"];let n=(t==null?void 0:t.icon)||"brain",i=(t==null?void 0:t.color)||"#8b5cf6";const o=document.createElement("div");o.className="modal-overlay active",o.innerHTML=`
        <div class="modal animate-slide-up" style="max-width: 450px;">
            <div class="modal-header">
                <h2 class="modal-title">${e?"Editar":"Nueva"} Actividad</h2>
                <button class="modal-close" id="close-activity-form">${m("x")}</button>
            </div>
            
            <div class="modal-body">
                <div class="config-group">
                    <label class="config-title">Nombre</label>
                    <input type="text" id="activity-name" class="form-input" placeholder="Ej: Meditar, Leer..." value="${(t==null?void 0:t.name)||""}">
                </div>

                <div class="config-group">
                    <label class="config-title">Icono</label>
                    <div class="icon-selection-grid">
                        ${a.map(g=>`
                            <div class="icon-option ${g===n?"selected":""}" data-icon="${g}">
                                ${m(g)}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="config-group">
                    <label class="config-title">Color</label>
                    <div class="color-selection-grid">
                        ${s.map(g=>`
                            <div class="color-option ${g===i?"selected":""}" data-color="${g}" style="background: ${g}"></div>
                        `).join("")}
                    </div>
                </div>

                <div class="config-group">
                    <label class="config-title">Sub-actividades</label>
                    <div id="sub-activities-list">
                        ${((t==null?void 0:t.subActivities)||[]).map(g=>`
                            <div class="activity-edit-item" style="padding: 8px 12px; margin-bottom: 4px;">
                                <span style="flex: 1; font-size: 13px;">${g.name}</span>
                                <button class="btn-mini-action delete-sub" data-sub-name="${g.name}">${m("trash")}</button>
                            </div>
                        `).join("")}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" id="new-sub-name" class="form-input" placeholder="Nombre sub-tarea" style="height: 38px;">
                        <button class="btn btn-secondary" id="btn-add-sub" style="min-width: auto; height: 38px;">${m("plus")}</button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="save-activity" style="width: 100%;">Guardar Actividad</button>
            </div>
        </div>
    `,document.body.appendChild(o);const r=[...(t==null?void 0:t.subActivities)||[]];o.querySelector("#btn-add-sub").addEventListener("click",()=>{const g=o.querySelector("#new-sub-name"),h=g.value.trim();h&&(r.push({id:Date.now().toString(),name:h}),g.value="",l())});function l(){const g=o.querySelector("#sub-activities-list");g.innerHTML=r.map(h=>`
            <div class="activity-edit-item" style="padding: 8px 12px; margin-bottom: 4px;">
                <span style="flex: 1; font-size: 13px;">${h.name}</span>
                <button class="btn-mini-action delete-sub" data-sub-id="${h.id}">${m("trash")}</button>
            </div>
        `).join(""),g.querySelectorAll(".delete-sub").forEach(h=>{h.addEventListener("click",()=>{const f=h.dataset.subId,y=r.findIndex(x=>x.id===f);y!==-1&&r.splice(y,1),l()})})}l();const u=()=>{o.classList.remove("active"),setTimeout(()=>o.remove(),300),fe()};(c=document.getElementById("close-activity-form"))==null||c.addEventListener("click",u),o.querySelectorAll(".icon-option").forEach(g=>{g.addEventListener("click",()=>{o.querySelectorAll(".icon-option").forEach(h=>h.classList.remove("selected")),g.classList.add("selected"),n=g.dataset.icon})}),o.querySelectorAll(".color-option").forEach(g=>{g.addEventListener("click",()=>{o.querySelectorAll(".color-option").forEach(h=>h.classList.remove("selected")),g.classList.add("selected"),i=g.dataset.color})}),(d=document.getElementById("save-activity"))==null||d.addEventListener("click",()=>{const g=document.getElementById("activity-name").value.trim();if(!g){v.toast("Por favor, indica un nombre","error");return}const h={name:g,icon:n,color:i,subActivities:r};e?p.updateTimeActivity(t.id,h):p.addTimeActivity(h),o.classList.remove("active"),setTimeout(()=>o.remove(),300),fe()})}function Ve(t,e=null){var a;T||(T={activityId:t,subActivityId:e,startTime:Date.now(),elapsedSeconds:0,interval:setInterval(()=>{T.elapsedSeconds=Math.floor((Date.now()-T.startTime)/1e3);const s=document.querySelector(".timer-display");if(s&&(s.textContent=rt(T.elapsedSeconds)),we){const n=p.getState().timeInvest.pomodoroTime||25;T.elapsedSeconds===n*60&&(Za(),v.toast("¡Tiempo Pomodoro cumplido!","success"))}},1e3)},(a=window.reRender)==null||a.call(window))}function Ke(t=!1){var e;if(T){if(clearInterval(T.interval),t){const a=Math.floor(T.elapsedSeconds/60);a>=1?(p.addTimeLog({activityId:T.activityId,subActivityId:T.subActivityId,date:new Date().toISOString(),durationMinutes:a}),v.toast(`¡Excelente! Has invertido ${a} min.`,"success")):v.toast("Sesión muy corta para ser registrada.","info")}T=null,(e=window.reRender)==null||e.call(window)}}function Za(){try{const t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator(),a=t.createGain();e.connect(a),a.connect(t.destination),e.type="sine",e.frequency.setValueAtTime(880,t.currentTime),a.gain.setValueAtTime(0,t.currentTime),a.gain.linearRampToValueAtTime(.5,t.currentTime+.1),a.gain.exponentialRampToValueAtTime(.01,t.currentTime+1),e.start(t.currentTime),e.stop(t.currentTime+1)}catch(t){console.error("Audio error:",t)}}function Qa(){const{skills:t}=p.getState(),e=(t||[]).filter(n=>n.category==="current"),a=(t||[]).filter(n=>n.category==="next"),s=e.length>0?Math.round(e.reduce((n,i)=>n+i.level,0)/e.length):0;return`
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
            <div class="highlight-value" style="color: #7c3aed; background: none !important; -webkit-text-fill-color: initial !important;">${s}<span style="font-size: 16px; opacity: 0.6;">%</span></div>
            <div class="highlight-label">
                ${s>80?"👑 Nivel experto en tu stack":s>50?"🛡️ Profesional competente":"🌱 En fase de crecimiento"}
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
                    ${e.length===0?Ye():e.map(n=>es(n)).join("")}
                </div>
            </section>

            <!-- NEXT SKILLS TO DEVELOP -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Desafíos</span>
                    <button class="icon-btn add-skill-btn" data-category="next" style="color: white !important;">${m("plus")}</button>
                </div>
                <div class="skills-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${a.length===0?Ye():a.map(n=>ts(n)).join("")}
                </div>
            </section>
        </div>
    </div>
    `}function es(t){return`
    <div class="card skill-card" style="margin-bottom: 8px; padding: 12px 16px !important;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <button class="reorder-skill" data-id="${t.id}" data-dir="up" style="background: none; border: none; color: var(--text-muted); padding: 0; cursor: pointer; height: 12px; display: flex; align-items: center; justify-content: center;">${m("chevronUp")}</button>
                    <button class="reorder-skill" data-id="${t.id}" data-dir="down" style="background: none; border: none; color: var(--text-muted); padding: 0; cursor: pointer; height: 12px; display: flex; align-items: center; justify-content: center;">${m("chevronDown")}</button>
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${t.name}</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-skill" data-id="${t.id}" style="color: white !important; width: 32px; height: 32px; padding: 0;">${m("edit")}</button>
                <button class="icon-btn delete-skill" data-id="${t.id}" style="color: var(--accent-danger); width: 32px; height: 32px; padding: 0;">${m("trash")}</button>
            </div>
        </div>
        <div class="skill-progress-container" style="background: rgba(255,255,255,0.05); height: 6px; border-radius: 3px; overflow: hidden; position: relative;">
            <div class="skill-progress-fill" style="width: ${t.level}%; height: 100%; background: var(--accent-primary); border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; font-weight: 600; color: var(--text-muted);">
            <span>Maestría</span>
            <span style="color: var(--accent-primary);">${t.level}%</span>
        </div>
    </div>
    `}function ts(t){return`
    <div class="card next-skill-card edit-skill" data-id="${t.id}" style="padding: 10px 12px !important; display: flex; align-items: center; justify-content: space-between; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); height: auto;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <button class="reorder-skill" data-id="${t.id}" data-dir="up" style="background: none; border: none; color: var(--text-muted); padding: 0; cursor: pointer; height: 12px; display: flex; align-items: center; justify-content: center;">${m("chevronUp")}</button>
                <button class="reorder-skill" data-id="${t.id}" data-dir="down" style="background: none; border: none; color: var(--text-muted); padding: 0; cursor: pointer; height: 12px; display: flex; align-items: center; justify-content: center;">${m("chevronDown")}</button>
            </div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text-primary); text-align: left;">${t.name}</div>
        </div>
        <div style="color: #7c3aed; opacity: 0.6;">${m("zap")}</div>
    </div>
    `}function Ye(t){return`
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">Pulse + para añadir su primera skill</p>
    </div>
    `}function as(){document.querySelectorAll(".add-skill-btn").forEach(t=>{t.addEventListener("click",()=>{Ae(null,t.dataset.category)})}),document.querySelectorAll(".edit-skill").forEach(t=>{t.addEventListener("click",e=>{var n;e.stopPropagation();const a=t.dataset.id||((n=t.closest(".edit-skill"))==null?void 0:n.dataset.id),s=p.getState().skills.find(i=>i.id===a);s&&Ae(s)})}),document.querySelectorAll(".delete-skill").forEach(t=>{t.addEventListener("click",async e=>{e.stopPropagation();const a=t.dataset.id;await v.confirm("Eliminar Habilidad","¿Estás seguro de que quieres eliminar esta skill?")&&(p.deleteSkill(a),v.toast("Habilidad eliminada"))})}),document.querySelectorAll(".reorder-skill").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();const a=t.dataset.id,s=t.dataset.dir;p.reorderSkills(a,s)})})}function Ae(t=null,e="current"){const a=!!t,s=a?t.category:e,n=a?t.level:50,i=`modal-skills-${Date.now()}`;v._showModal({title:a?"Editar Habilidad":"Gestión de Mastery",message:a?"Actualiza los detalles de tu skill":"Añade una nueva habilidad a tu ecosistema",centered:!0,content:`
            <div id="${i}" style="margin-top: var(--spacing-md);">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Tipo de Habilidad</label>
                    <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 12px;">
                        <button type="button" class="btn cat-btn ${s==="current"?"active":""}" id="cat-current" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${s==="current"?"#7c3aed":"transparent"}; color: ${s==="current"?"#fff":"var(--text-muted)"}; border: none;">ACTUAL (EXPERTISE)</button>
                        <button type="button" class="btn cat-btn ${s==="next"?"active":""}" id="cat-next" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${s==="next"?"#7c3aed":"transparent"}; color: ${s==="next"?"#fff":"var(--text-muted)"}; border: none;">PRÓXIMA (A APRENDER)</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Nombre de la Skill</label>
                    <input type="text" id="skill-name" class="form-input" placeholder="Ej: React Native, Python, UI Design..." value="${a?t.name:""}" autofocus>
                </div>

                <div id="level-container" style="display: ${s==="current"?"block":"none"};">
                    <div class="form-group">
                        <label class="form-label">Nivel de Dominio: <span id="level-val" style="color: #7c3aed; font-weight: 800;">${n}%</span></label>
                        <input type="range" id="skill-level" min="1" max="100" value="${n}" style="width: 100%; accent-color: #7c3aed; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); cursor: pointer;">
                    </div>
                </div>
            </div>
        `,buttons:[{text:"Cancelar",type:"secondary",onClick:()=>{}},{text:a?"Actualizar":"Guardar Skill",type:"primary",style:"background: #7c3aed; border: none; font-weight: 800;",onClick:()=>{const o=document.getElementById("skill-name").value.trim(),r=document.getElementById("cat-current").classList.contains("active")?"current":"next",l=parseInt(document.getElementById("skill-level").value);if(!o){v.toast("El nombre es obligatorio","error");return}a?(p.updateSkill(t.id,{name:o,category:r,level:r==="current"?l:0}),v.toast("Skill actualizada")):(p.addSkill({name:o,category:r,level:r==="current"?l:0}),v.toast("Nueva skill añadida al stack"))}}]}),setTimeout(()=>{const o=document.getElementById("cat-current"),r=document.getElementById("cat-next"),l=document.getElementById("level-container"),u=document.getElementById("skill-level"),c=document.getElementById("level-val"),d=g=>{g==="current"?(o.style.background="#7c3aed",o.style.color="#fff",o.classList.add("active"),r.style.background="transparent",r.style.color="var(--text-muted)",r.classList.remove("active"),l.style.display="block"):(r.style.background="#7c3aed",r.style.color="#fff",r.classList.add("active"),o.style.background="transparent",o.style.color="var(--text-muted)",o.classList.remove("active"),l.style.display="none")};o.onclick=()=>d("current"),r.onclick=()=>d("next"),u.oninput=()=>{c.textContent=u.value+"%"}},100)}const Te={passiveAsset:{label:"Ingresos Pasivos",icon:"building",types:[{value:"rental",label:"Inmueble en Renta"},{value:"stocks",label:"Acciones/Dividendos"},{value:"etf",label:"ETF/Fondos"},{value:"bonds",label:"Bonos"},{value:"crypto",label:"Crypto Staking"},{value:"business",label:"Negocio Pasivo"},{value:"royalties",label:"Regalías"},{value:"other",label:"Otro"}]},activeIncome:{label:"Ingreso Activo",icon:"briefcase",types:[{value:"salary",label:"Salario"},{value:"freelance",label:"Freelance"},{value:"business",label:"Negocio Activo"},{value:"other",label:"Otro"}]},livingExpense:{label:"Gasto de Vida",icon:"receipt",types:[{value:"rent",label:"Alquiler/Hipoteca"},{value:"utilities",label:"Servicios"},{value:"food",label:"Alimentación"},{value:"transport",label:"Transporte"},{value:"insurance",label:"Seguros"},{value:"health",label:"Salud"},{value:"other",label:"Otro"}]},investmentAsset:{label:"Activo de Inversión",icon:"trendingUp",types:[{value:"property",label:"Inmueble"},{value:"stocks",label:"Acciones"},{value:"etf",label:"ETF/Fondos"},{value:"crypto",label:"Criptomoneda"},{value:"cash",label:"Efectivo/Ahorro"},{value:"vehicle",label:"Vehículo"},{value:"collectibles",label:"Coleccionables"},{value:"other",label:"Otro"}]},liability:{label:"Pasivo/Deuda",icon:"creditCard",types:[{value:"mortgage",label:"Hipoteca"},{value:"loan",label:"Préstamo Personal"},{value:"carloan",label:"Préstamo Auto"},{value:"creditcard",label:"Tarjeta de Crédito"},{value:"studentloan",label:"Préstamo Estudiantil"},{value:"other",label:"Otra Deuda"}]},event:{label:"Evento/Cita",icon:"calendar",types:[{value:"event",label:"Evento Puntual"},{value:"reminder",label:"Recordatorio"},{value:"meeting",label:"Reunión"},{value:"other",label:"Otro"}]}},We=[{value:"EUR",label:"Euro (€)"},{value:"USD",label:"Dólar ($)"},{value:"CHF",label:"Franco Suizo (Fr)"},{value:"GBP",label:"Libra (£)"},{value:"AUD",label:"Dólar Aus. (A$)"},{value:"ARS",label:"Peso Arg. ($)"}];let C="passiveAsset",lt=[];function ge(t="passiveAsset",e=[]){var s,n;C=t,lt=e,(n=(s=Te[C])==null?void 0:s.types[0])!=null&&n.value;const a=document.createElement("div");a.className="modal-overlay",a.id="add-modal",a.innerHTML=ss(),document.body.appendChild(a),requestAnimationFrame(()=>{a.classList.add("active")}),is()}function ss(){return`
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${C==="event"?"Agregar Evento":"Agregar Elemento"}</h2>
        <button class="modal-close" id="modal-close">
          ${m("x")}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${C!=="event"?`
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(Te).filter(([e])=>!lt.includes(e)).map(([e,a])=>`
          <div class="type-option ${e===C?"active":""}" data-category="${e}">
            <div class="type-option-icon-wrapper">
                ${m(a.icon)}
            </div>
            <div class="type-option-label">${a.label.split("/")[0]}</div>
          </div>
        `).join("")}
      </div>`:""}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${ct()}
      </div>
    </div>
  `}function ct(){const t=Te[C],e=C==="investmentAsset"||C==="passiveAsset";if(e){const s=Y.map(n=>({value:n.symbol,label:`${n.name} (${n.symbol})`}));[...We,...s]}let a="";return C==="passiveAsset"||C==="investmentAsset"?a=`
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
    `:C==="activeIncome"||C==="livingExpense"?a=`
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `:C==="liability"?a=`
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
    `:C==="event"&&(a=`
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
                ${t.types.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${We.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}
                </optgroup>
                ${e?`
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${Y.map(s=>`<option value="${s.symbol}">${s.name} (${s.symbol})</option>`).join("")}
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
      ${m("plus")} Agregar
    </button>
  `}function is(){const t=document.getElementById("add-modal"),e=document.getElementById("modal-close");t.addEventListener("click",s=>{s.target===t&&Ce()}),e.addEventListener("click",Ce);const a=t.querySelectorAll(".category-selector .type-option");a.forEach(s=>{s.addEventListener("click",()=>{C=s.dataset.category,a.forEach(n=>n.classList.remove("active")),s.classList.add("active"),document.getElementById("form-container").innerHTML=ct(),Xe()})}),Xe()}function Xe(){const t=document.getElementById("btn-save");t&&t.addEventListener("click",os);const e=document.getElementById("mode-qty"),a=document.getElementById("mode-total"),s=document.getElementById("input-qty"),n=document.getElementById("input-value"),i=document.getElementById("input-currency"),o=document.getElementById("input-name");if(e&&a){const l=u=>{u==="qty"?(e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)",a.style.background="transparent",a.style.color="var(--text-secondary)",s.focus()):(a.style.background="var(--accent-primary)",a.style.color="var(--bg-primary)",e.style.background="transparent",e.style.color="var(--text-secondary)",n.focus())};e.addEventListener("click",()=>l("qty")),a.addEventListener("click",()=>l("total"))}const r=l=>{const u=p.getState().rates,c=i==null?void 0:i.value,d=u[c]||1;if(l==="qty"){const g=parseFloat(s.value)||0;n.value=(g*d).toFixed(2)}else{const g=parseFloat(n.value)||0;s.value=(g/d).toFixed(6)}};s==null||s.addEventListener("input",()=>r("qty")),n==null||n.addEventListener("input",()=>r("total")),i&&i.addEventListener("change",()=>{if(o&&!o.value){const l=i.options[i.selectedIndex].text;o.value=l.split(" (")[0]}r("qty")})}function os(){var h,f,y,x,k,L,E,B,D,P,V,K;const t=(f=(h=document.getElementById("input-name"))==null?void 0:h.value)==null?void 0:f.trim(),e=(y=document.getElementById("input-type"))==null?void 0:y.value,a=(x=document.getElementById("input-currency"))==null?void 0:x.value,s=(L=(k=document.getElementById("input-details"))==null?void 0:k.value)==null?void 0:L.trim(),n=parseFloat((E=document.getElementById("input-value"))==null?void 0:E.value)||0,i=document.getElementById("input-qty"),o=i?parseFloat(i.value)||0:n,r=parseFloat((B=document.getElementById("input-amount"))==null?void 0:B.value)||0,l=parseFloat((D=document.getElementById("input-monthly"))==null?void 0:D.value)||0,u=(P=document.getElementById("input-date"))==null?void 0:P.value,c=(V=document.getElementById("input-time"))==null?void 0:V.value,d=(K=document.getElementById("input-repeat"))==null?void 0:K.value;if(!t){v.alert("Campo Obligatorio","Por favor ingresa un nombre para el elemento.");return}const g={name:t,type:e,currency:a,details:s};switch(C){case"passiveAsset":p.addPassiveAsset({...g,value:o,monthlyIncome:l});break;case"activeIncome":p.addActiveIncome({...g,amount:r});break;case"livingExpense":p.addLivingExpense({...g,amount:r});break;case"investmentAsset":p.addInvestmentAsset({...g,value:o});break;case"liability":p.addLiability({...g,amount:r,monthlyPayment:l});break;case"event":p.addEvent({title:t,date:u,time:c,repeat:d,category:e});break}Ce()}function Ce(){const t=document.getElementById("add-modal");t&&(t.classList.remove("active"),setTimeout(()=>t.remove(),300))}let X=null;function dt(t=null){console.log("[LeadModal] Opening modal",{personToEdit:t});const e=document.getElementById("add-person-modal");e&&(console.log("[LeadModal] Removing existing modal"),e.remove()),X=t?t.id:null;const a=document.createElement("div");a.className="modal-overlay",a.id="add-person-modal",a.setAttribute("role","dialog"),a.innerHTML=rs(t),document.body.appendChild(a),setTimeout(()=>{var s;a.classList.add("active"),(s=a.querySelector("#person-name"))==null||s.focus()},50),ls(a)}function rs(t=null){const e=t?"Editar Lead":"Lead",a=t?"Guardar Cambios":"Lead";return`
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
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${(t==null?void 0:t.name)||""}">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" id="person-phone" placeholder="+54 9 ..." value="${(t==null?void 0:t.phone)||""}">
            </div>
            <div class="form-group">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-input" id="person-city" placeholder="Ej: Buenos Aires" value="${(t==null?void 0:t.city)||""}">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Fuente de Contacto</label>
                <select class="form-input form-select" id="person-source">
                    ${p.getState().social.contactSources.map(s=>`
                        <option value="${s}" ${(t==null?void 0:t.source)===s?"selected":""}>${s}</option>
                    `).join("")}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Lead Alignment (1-10)</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" class="form-range" id="person-rating-slider" min="1" max="10" value="${(t==null?void 0:t.rating)||5}" style="flex: 1;">
                    <span id="rating-value" style="font-weight: bold; width: 24px; text-align: center;">${(t==null?void 0:t.rating)||5}</span>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Último Contacto</label>
                <input type="date" class="form-input" id="person-last-contact" value="${(t==null?void 0:t.lastContact)||new Date().toISOString().split("T")[0]}">
            </div>
            <div class="form-group">
                <label class="form-label">Color del Lead</label>
                <div class="goal-color-dots" id="person-color-picker" style="justify-content: flex-start; margin-top: 0; background: none; border: none; padding: 5px 0;">
                    ${["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"].map(s=>`
                        <div class="goal-color-dot ${(t==null?void 0:t.color)===s||!(t!=null&&t.color)&&s==="#3b82f6"?"active":""}" 
                             data-color="${s}" 
                             style="background-color: ${s}; width: 28px; height: 28px;"></div>
                    `).join("")}
                </div>
                <input type="hidden" id="person-color-value" value="${(t==null?void 0:t.color)||"#3b82f6"}">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notas / Descripción</label>
            <textarea class="form-input" id="person-desc" rows="3" placeholder="Detalles importantes, gustos, temas de conversación...">${(t==null?void 0:t.description)||""}</textarea>
        </div>

        <div class="form-group" style="margin-top: var(--spacing-md);">
             <label class="form-label">Etapa</label>
             <select class="form-input form-select" id="person-column">
                ${p.getState().social.columns.sort((s,n)=>s.order-n.order).map(s=>`<option value="${s.id}" ${(t==null?void 0:t.columnId)===s.id?"selected":""}>${s.name}</option>`).join("")}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${X?`
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${m("trash")}
            </button>`:""}
            <button class="btn btn-primary w-full" id="btn-save-person-lead" style="padding: 14px;">
                ${m("plus")} ${a}
            </button>
        </div>
      </div>
    </div>
  `}function ls(t){const e=t.querySelector("#person-modal-close"),a=t.querySelector("#btn-save-person-lead"),s=t.querySelector("#btn-delete-person"),n=t.querySelector("#person-rating-slider"),i=t.querySelector("#rating-value");if(t.addEventListener("click",l=>{l.target===t&&(console.log("[LeadModal] Overlay clicked, closing"),be(t))}),e==null||e.addEventListener("click",()=>{console.log("[LeadModal] Close button clicked"),be(t)}),n&&i){const l=()=>{console.log("[LeadModal] Slider updated:",n.value),i.textContent=n.value};n.oninput=l,n.onchange=l}a&&(a.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Save button clicked"),ds(t)}),s&&(s.onclick=l=>{l.preventDefault(),console.log("[LeadModal] Delete button clicked"),cs(t)});const o=t.querySelectorAll(".goal-color-dot"),r=t.querySelector("#person-color-value");o.forEach(l=>{l.addEventListener("click",()=>{o.forEach(u=>u.classList.remove("active")),l.classList.add("active"),r&&(r.value=l.dataset.color),console.log("[LeadModal] Color selected:",l.dataset.color)})})}async function cs(t){X&&await v.confirm("Eliminar Lead","¿Estás seguro de eliminar este lead?")&&(p.deletePerson(X),v.toast("Lead eliminado","success"),be(t))}function ds(t){var a,s,n,i,o,r,l,u,c,d,g,h,f;const e=t.querySelector("#btn-save-person-lead");if(e.disabled){console.log("[LeadModal] Save ignored, already processing");return}try{const y=(s=(a=t.querySelector("#person-name"))==null?void 0:a.value)==null?void 0:s.trim(),x=(i=(n=t.querySelector("#person-phone"))==null?void 0:n.value)==null?void 0:i.trim(),k=(r=(o=t.querySelector("#person-city"))==null?void 0:o.value)==null?void 0:r.trim(),L=(l=t.querySelector("#person-source"))==null?void 0:l.value,E=(u=t.querySelector("#person-rating-slider"))==null?void 0:u.value,B=(d=(c=t.querySelector("#person-desc"))==null?void 0:c.value)==null?void 0:d.trim(),D=(g=t.querySelector("#person-column"))==null?void 0:g.value,P=(h=t.querySelector("#person-color-value"))==null?void 0:h.value,V=(f=t.querySelector("#person-last-contact"))==null?void 0:f.value;if(console.log("[LeadModal] Attempting to save",{name:y,rating:E,columnId:D,color:P,lastContact:V}),!y){console.warn("[LeadModal] Save failed: Missing name"),v.toast("El nombre es obligatorio","error");return}e.disabled=!0,e.innerHTML='<span class="loading-spinner-sm"></span> Guardando...';const K={name:y,phone:x,city:k,source:L,rating:parseInt(E)||5,description:B,columnId:D,color:P,lastContact:V};X?(console.log("[LeadModal] Updating person",X),p.updatePerson(X,K),v.toast("Lead actualizado correctamente","success")):(console.log("[LeadModal] Adding new person"),p.addPerson(K),v.toast("Lead guardado correctamente","success")),console.log("[LeadModal] Save successful, closing modal"),be(t)}catch(y){console.error("[LeadModal] Error saving lead:",y),v.toast("Error al guardar el lead","error"),e.disabled=!1,e.innerHTML=`${m("plus")} Lead`}}function be(t){t&&(console.log("[LeadModal] Closing modal"),t.classList.remove("active"),setTimeout(()=>{t.parentNode&&(console.log("[LeadModal] Removing modal from DOM"),t.remove())},400))}function us(){const t=S.isSetup(),e=S.isBioEnabled();return`
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${m("lock","auth-icon")}
                </div>
                <h1 class="auth-title">${t?"Bienvenida de nuevo":"Configura tu Bóveda"}</h1>
                <p class="auth-subtitle">${t?"Introduce tu contraseña para entrar":"Crea una contraseña maestra para proteger tus datos"}</p>
            </div>

            <div class="auth-form">
                <div class="input-group">
                    <input type="password" id="auth-password" class="form-input" placeholder="Contraseña maestra" autofocus>
                </div>
                
                ${t?"":`
                <div class="input-group">
                    <input type="password" id="auth-confirm" class="form-input" placeholder="Confirmar contraseña">
                </div>
                `}

                <button id="auth-submit-btn" class="btn btn-primary w-full">
                    ${t?"Desbloquear":"Empezar"}
                </button>

                ${t&&e?`
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
    `}function ps(t){var i;const e=document.getElementById("auth-submit-btn"),a=document.getElementById("auth-bio-btn"),s=document.getElementById("auth-password"),n=async()=>{const o=s.value,r=document.getElementById("auth-confirm"),l=S.isSetup();try{let u;if(l)u=await S.unlock(o);else{if(!o||o.length<4)throw new Error("Contraseña demasiado corta");if(o!==r.value)throw new Error("Las contraseñas no coinciden");u=await S.setup(o)}await p.loadEncrypted(u),t()}catch(u){v.alert("Error",u.message)}};e==null||e.addEventListener("click",n),s==null||s.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),n())}),(i=document.getElementById("auth-confirm"))==null||i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),n())}),a==null||a.addEventListener("click",async()=>{try{const o=await S.unlockWithBiometrics();await p.loadEncrypted(o),t()}catch(o){v.alert("Identificación",o.message)}}),S.isBioEnabled()&&setTimeout(async()=>{try{const o=await S.unlockWithBiometrics();await p.loadEncrypted(o),t()}catch{console.log("Auto-bio failed or cancelled")}},500)}let R=localStorage.getItem("life-dashboard/app_current_page")||"finance",I=localStorage.getItem("life-dashboard/app_current_sub_page")||null;I==="null"&&(I=null);async function Je(){window.addEventListener("open-add-modal",e=>{var s,n;const a=(s=e.detail)==null?void 0:s.type;a==="person"?dt((n=e.detail)==null?void 0:n.person):ge(a)}),O.init().catch(e=>console.warn("[Drive] Pre-init failed:",e)),window.addEventListener("nav-change",e=>{var s;const a=(s=e.detail)==null?void 0:s.page;if(a){R=a,I=null,localStorage.setItem("life-dashboard/app_current_page",R),j();const n=document.getElementById("bottom-nav");n&&(n.innerHTML=Ie(R))}});const t=S.getVaultKey();t?await p.loadEncrypted(t)?ut():(console.error("[Boot] Decryption failed, invalid vault key in session?"),S.logout(),Ze()):Ze()}function Ze(){const t=document.getElementById("app");t.innerHTML=us(),ps(()=>{ut()})}function ut(){const t=document.getElementById("app");t.innerHTML=`
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `,pt(),p.subscribe(()=>{j()}),window.reRender=()=>j(),ms()}function ms(){var s,n;const t=localStorage.getItem("life-dashboard/pwa_install_dismissed");if(t&&(Date.now()-parseInt(t))/864e5<7||window.matchMedia("(display-mode: standalone)").matches)return;const e=document.createElement("div");e.className="pwa-install-banner",e.id="pwa-install-banner",e.innerHTML=`
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
    `,document.body.appendChild(e);const a=()=>{window.deferredPrompt&&setTimeout(()=>{e.classList.add("visible")},2e3)};a(),window.addEventListener("beforeinstallprompt",a),(s=document.getElementById("pwa-banner-install"))==null||s.addEventListener("click",async()=>{if(!window.deferredPrompt)return;window.deferredPrompt.prompt();const{outcome:i}=await window.deferredPrompt.userChoice;i==="accepted"&&(e.classList.remove("visible"),setTimeout(()=>e.remove(),500)),window.deferredPrompt=null}),(n=document.getElementById("pwa-banner-close"))==null||n.addEventListener("click",()=>{e.classList.remove("visible"),localStorage.setItem("life-dashboard/pwa_install_dismissed",Date.now().toString()),setTimeout(()=>e.remove(),500)})}function pt(){const t=document.getElementById("bottom-nav");t.innerHTML=Ie(R),_e(e=>{R=e,I=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",I),F(),j(),t.innerHTML=Ie(R),_e(a=>{R=a,I=null,localStorage.setItem("life-dashboard/app_current_page",R),localStorage.setItem("life-dashboard/app_current_sub_page",I),F(),j(),pt()})}),vs(),j()}function j(){const t=document.getElementById("main-content");if(!t)return;const e=t.scrollTop;if(I==="compound"){t.innerHTML=Xt(),Jt(()=>{I=null,Zt(),F(),j()}),t.scrollTop=e;return}if(I==="expenses"){t.innerHTML=$a(),La(()=>{I=null,F(),j()}),t.scrollTop=e;return}if(I==="market"){t.innerHTML=Qt(),ta(()=>{I=null,F(),j()}),t.scrollTop=e;return}switch(t.classList.toggle("no-padding-mobile",R==="health"),R){case"finance":F(),t.innerHTML=Oe(),Ne(),Qe();break;case"goals":_(),t.innerHTML=Fe(),qe();break;case"time-invest":_(),t.innerHTML=za(),Ja();break;case"social":_(),t.innerHTML=Pa(),ja();break;case"health":t.innerHTML=aa(),la(),_();break;case"menu":t.innerHTML=Ma(),Ba(a=>{R=a,F(),j()}),_();break;case"calendar":t.innerHTML=ya(),Ea(),F();break;case"goals":_(),t.innerHTML=Fe(),qe();break;case"skills":t.innerHTML=Qa(),as(),_();break;case"settings":t.innerHTML=Ta(),Da(),_();break;default:F(),t.innerHTML=Oe(),Ne(),Qe()}requestAnimationFrame(()=>{t.scrollTop=e})}function Qe(){const t=document.getElementById("open-compound");t&&t.addEventListener("click",()=>{I="compound",localStorage.setItem("life-dashboard/app_current_sub_page",I),_(),j()});const e=document.getElementById("open-markets");e&&e.addEventListener("click",()=>{I="market",localStorage.setItem("life-dashboard/app_current_sub_page",I),_(),j()});const a=document.getElementById("open-expenses");a&&a.addEventListener("click",()=>{I="expenses",localStorage.setItem("life-dashboard/app_current_sub_page",I),_(),j()})}function vs(){const t=document.querySelector(".fab");t&&t.remove();const e=document.createElement("button");e.className="fab",e.id="main-fab",e.innerHTML=m("plus","fab-icon"),e.setAttribute("aria-label","Agregar"),e.addEventListener("click",async()=>{const a=localStorage.getItem("life-dashboard/app_current_page")||R;if(a==="calendar")ge("event");else if(a==="health"){const s=await ns.confirm("Log Metric","What do you want to record today?","Weight","Body Fat");if(s===!0){const n=await ns.prompt("Log Weight","Enter your current weight in kg:","","number");n&&p.addWeightLog(n)}else if(s===!1){const n=await ns.prompt("Body Fat","Enter your body fat %:","","number");n&&p.addFatLog(n)}}else a==="social"?dt():a==="skills"?Ae():a==="finance"||a==="goals"||!a?ge("passiveAsset",["event"]):ge()}),document.body.appendChild(e)}function _(){const t=document.getElementById("main-fab");t&&(t.style.display="none")}function F(){const t=document.getElementById("main-fab");t&&(t.style.display="flex")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Je):Je();window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),window.deferredPrompt=t,console.log("PWA Install Prompt ready");const e=document.getElementById("install-pwa-card");e&&(e.style.display="block")});export{m as g,v as n,p as s};
