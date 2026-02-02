import{s as d,g as r,n as u}from"./index-DS_PAY3p.js";function y(t=null){const e=document.createElement("div");e.className="modal-overlay active",e.id="communications-modal",e.style.zIndex="10000";const n=t?d.getState().social.people.find(i=>i.id===t):null;p(e,n),document.body.appendChild(e),m(e,n)}function p(t,e=null){const{communications:n}=d.getState().social,i=[...n].sort((a,o)=>a.order-o.order);t.innerHTML=`
        <div class="modal" style="max-width: 500px; height: 80dvh;">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title">${e?`Chat con ${e.name}`:"Comunicaciones"}</h2>
                    ${e?'<p class="modal-subtitle" style="font-size: 11px;">Selecciona un mensaje para copiar e indicar uso.</p>':""}
                </div>
                <button class="modal-close">${r("x")}</button>
            </div>
            
            <div class="modal-body" style="flex: 1; overflow-y: auto; padding-right: 5px; margin-top: 15px;">
                ${e?"":`
                    <button class="btn btn-primary w-full" id="add-comm-btn" style="margin-bottom: 20px;">
                        ${r("plus")} Nuevo Mensaje
                    </button>
                `}

                <div class="comm-list" style="display: flex; flex-direction: column; gap: 8px;">
                    ${i.length===0?`
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); opacity: 0.5;">
                            ${r("messageSquare","large-icon")}
                            <p style="margin-top: 10px;">No hay comunicaciones guardadas.</p>
                        </div>
                    `:i.map(a=>f(a,e)).join("")}
                </div>
            </div>
        </div>
    `}function f(t,e=null){const n=e&&t.lastUsed&&t.lastUsed[e.id];return`
        <div class="comm-item glass-panel" data-id="${t.id}" style="padding: 10px 12px; position: relative; cursor: pointer; transition: transform 0.2s; border: 1px solid ${n?"var(--accent-primary)":"rgba(255,255,255,0.06)"}; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 600;">${t.title}</h4>
                <div style="display: flex; align-items: center; gap: 4px;">
                    ${[1,2,3,4,5].map(i=>`
                        <span style="color: ${t.rating>=i?"var(--accent-tertiary)":"rgba(255,255,255,0.05)"}; font-size: 9px;">★</span>
                    `).join("")}
                </div>
            </div>
            <p style="margin: 0; font-size: 11px; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; opacity: 0.8;">${t.text}</p>
            
            ${e?`
                <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
                    ${n?'<span style="font-size: 8px; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.5px;">USADO</span>':""}
                </div>
            `:`
                <div class="comm-actions" style="margin-top: 8px; display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="icon-btn edit-comm" data-id="${t.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${r("edit","tiny-icon")}</button>
                    <button class="icon-btn move-up-comm" data-id="${t.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${r("chevronUp","tiny-icon")}</button>
                    <button class="icon-btn move-down-comm" data-id="${t.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${r("chevronDown","tiny-icon")}</button>
                    <button class="icon-btn delete-comm" data-id="${t.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.15); color: #ff5f5f; border-radius: 6px;">${r("trash","tiny-icon")}</button>
                </div>
            `}
        </div>
    `}function m(t,e=null){t.querySelector(".modal-close").onclick=()=>t.remove(),t.onclick=i=>{i.target===t&&t.remove()};const n=t.querySelector("#add-comm-btn");n&&(n.onclick=async()=>{const i=await x();i&&(d.addCommunication(i),p(t,e),m(t,e))}),t.querySelectorAll(".comm-item").forEach(i=>{i.onclick=a=>{if(a.target.closest(".icon-btn"))return;const o=i.dataset.id,l=d.getState().social.communications.find(s=>s.id===o);l&&e&&navigator.clipboard.writeText(l.text).then(()=>{d.logCommunicationUsed(o,e.id),u.toast("Copiado al portapapeles y registrado","success"),t.remove()})}}),t.querySelectorAll(".edit-comm").forEach(i=>{i.addEventListener("click",async a=>{a.preventDefault(),a.stopPropagation();const o=i.dataset.id;console.log("[CommModal] Edit clicked for",o);const l=d.getState().social.communications.find(c=>c.id===o);if(!l)return;const s=await x(l);s&&(d.updateCommunication(o,s),p(t,e),m(t,e))})}),t.querySelectorAll(".delete-comm").forEach(i=>{i.addEventListener("click",async a=>{a.preventDefault(),a.stopPropagation(),await u.confirm("Eliminar Comunicación","¿Estás seguro?")&&(d.deleteCommunication(i.dataset.id),p(t,e),m(t,e))})}),t.querySelectorAll(".move-up-comm").forEach(i=>{i.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),g(i.dataset.id,-1,t,e)})}),t.querySelectorAll(".move-down-comm").forEach(i=>{i.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),g(i.dataset.id,1,t,e)})})}function g(t,e,n,i){const a=[...d.getState().social.communications].sort((s,c)=>s.order-c.order),o=a.findIndex(s=>s.id===t),l=o+e;if(l>=0&&l<a.length){const s=a[o].order;a[o].order=a[l].order,a[l].order=s,d.reorderCommunications(a),p(n,i),m(n,i)}}function x(t=null){return new Promise(e=>{const n=document.createElement("div");n.className="modal-overlay active",n.style.zIndex="11000",n.innerHTML=`
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">${t?"Editar Mensaje":"Nuevo Mensaje"}</h2>
                    <button class="modal-close">${r("x")}</button>
                </div>
                <div class="modal-body" style="padding: 20px 0;">
                    <div class="form-group">
                        <label class="form-label">Título / Asunto</label>
                        <input type="text" id="comm-title" class="form-input" value="${(t==null?void 0:t.title)||""}" placeholder="Ej: Saludo inicial">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mensaje (para copiar)</label>
                        <textarea id="comm-text" class="form-input" rows="6" placeholder="Escribe el mensaje aquí...">${(t==null?void 0:t.text)||""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Puntuación / Efectividad (1-5)</label>
                        <input type="range" id="comm-rating" min="1" max="5" step="1" value="${(t==null?void 0:t.rating)||1}" class="form-range">
                        <div id="comm-rating-val" style="text-align: center; font-weight: bold; margin-top: 5px;">${(t==null?void 0:t.rating)||1}</div>
                    </div>
                    <button class="btn btn-primary w-full" id="save-comm" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `,document.body.appendChild(n);const i=()=>{n.remove(),e(null)};n.querySelector(".modal-close").onclick=i;const a=n.querySelector("#comm-rating"),o=n.querySelector("#comm-rating-val");a.oninput=()=>o.textContent=a.value,n.querySelector("#save-comm").onclick=()=>{const l=n.querySelector("#comm-title").value.trim(),s=n.querySelector("#comm-text").value.trim(),c=parseInt(n.querySelector("#comm-rating").value);if(!l||!s){u.toast("Título y texto son obligatorios","error");return}n.remove(),e({title:l,text:s,rating:c})}})}export{y as openCommunicationsModal};
