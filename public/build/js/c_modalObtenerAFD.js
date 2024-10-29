function handleObtenerAFD(e){const t=e.querySelector("#form-obtener-afd"),n=t.querySelector(".modal_button.accept"),r=t.querySelector(".modal_button.cancel"),a=t.querySelector("#tabla-afns"),o=t.querySelector("#tabla-afns-alert");function c(e,n,r){if(r.textContent="",n.classList.remove("input-error"),e.checked){const e=n.value.trim();if(/^[0-9]+$/.test(e)){const a=parseInt(e);Array.from(t.querySelectorAll('input[name^="token_afn_"]')).filter((e=>e!==n&&!e.disabled)).map((e=>parseInt(e.value.trim()))).filter((e=>!isNaN(e))).includes(a)&&(n.classList.add("input-error"),r.appendChild(l("El token ya está asignado a otro AFN.")))}else n.classList.add("input-error"),r.appendChild(l("El token debe ser un número entero."))}}function i(){t.querySelectorAll('input[name="unir_afn"]').forEach((e=>{const n=e.value;c(e,t.querySelector('input[name="token_afn_'+n+'"]'),e.parentElement.parentElement.nextSibling.firstChild)}))}function l(e){const t=document.createElement("small");return t.classList.add("error-message"),t.textContent=e,t}!function(){if(a.innerHTML="",0===AFNS.length){const e=document.createElement("tr"),t=document.createElement("td");return t.setAttribute("colspan","3"),t.textContent="No hay AFNs disponibles.",e.appendChild(t),a.appendChild(e),void(n.disabled=!0)}n.disabled=!1,AFNS.forEach((e=>{const t=document.createElement("tr"),n=document.createElement("td");n.textContent=e.ID_AFN,t.appendChild(n);const r=document.createElement("td"),o=document.createElement("input");o.type="checkbox",o.name="unir_afn",o.value=e.ID_AFN,r.appendChild(o),t.appendChild(r);const i=document.createElement("td"),l=document.createElement("input");l.type="text",l.name="token_afn_"+e.ID_AFN,l.size="5",l.disabled=!0,i.appendChild(l),t.appendChild(i);const s=document.createElement("tr"),d=document.createElement("td");d.setAttribute("colspan","3"),d.classList.add("error-cell"),s.appendChild(d),a.appendChild(t),a.appendChild(s),o.addEventListener("change",(function(){l.disabled=!this.checked,c(o,l,d)})),l.addEventListener("input",(function(){c(o,l,d)}))}))}(),t.addEventListener("input",(function(){i()})),t.addEventListener("submit",(function(n){n.preventDefault(),o.textContent="",o.classList.remove("error");let r=!0,a=[];i();const c=t.querySelectorAll('input[name="unir_afn"]:checked');if(0===c.length?(r=!1,o.textContent="Debe seleccionar al menos un AFN para unir.",o.classList.add("error")):c.forEach((e=>{const n=e.value,o=t.querySelector('input[name="token_afn_'+n+'"]'),c=o.value.trim();o.classList.contains("input-error")?r=!1:a.push({afn:AFNS.find((e=>e.ID_AFN===n)),token:parseInt(c)})})),r){a.forEach((e=>{e.afn.Edos_Acept.forEach((t=>{t.Token=e.token}))}));const t=a.map((e=>e.afn)),n=AFN.UnirAFNs(t);n.convertirAFD();const r=n.generarContenidoArchivo();iniciarDescarga(r,"matriz_transicion.txt"),mostrarNotificacion("Archivo generado exitosamente.","success"),closeModal(e)}else mostrarNotificacion("Por favor, corrige los errores antes de continuar.","error")})),r.addEventListener("click",(function(){closeModal(e)}))}