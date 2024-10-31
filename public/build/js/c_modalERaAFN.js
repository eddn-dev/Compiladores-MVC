function handleAplicarERaAFN(e){handleAFNModal(e,{fields:[{name:"automatonId",selector:"#automaton-id",alertSelector:"#automaton-id-alert",validate:e=>e?/^[0-9]+$/.test(e)?parseInt(e)<0?"El ID debe ser un número positivo.":AFNS.some((r=>r.ID_AFN===e))?"El ID ya existe. Elige otro.":null:"El ID solo puede contener números.":"El ID es obligatorio."},{name:"regexInput",selector:"#regex-input",alertSelector:"#regex-input-alert",validate:e=>e&&""!==e.trim()?null:"La expresión regular es obligatoria."}],onSubmit:async(t,o)=>{const i=t.automatonId.value,n=t.regexInput.value;try{await a();const t=new ExpresionRegular(n,r);if(t.parse()){const r=t.getResult();r.ID_AFN=i,AFNS.push(r),actualizarSelectsDeAFN(),mostrarNotificacion("AFN generado exitosamente a partir de la expresión regular.","success"),closeModal(e)}else mostrarNotificacion("Error en el análisis de la expresión regular. Verifique la sintaxis.","error")}catch(e){mostrarNotificacion("Error al cargar el autómata: "+e.message,"error")}},successMessage:"AFN generado exitosamente a partir de la expresión regular.",errorMessage:"Por favor, corrige los errores antes de continuar."});let r=null;async function a(){if(!r)try{r=await cargarAutomataDesdeArchivo("build/utils/ER_AFN.txt")}catch(e){throw console.error("Error al cargar el autómata:",e),e}}a().catch((e=>{mostrarNotificacion("Error al cargar el autómata: "+e.message,"error")}));const t=e.querySelector("#regex-input"),o=e.querySelector("#automaton-id");async function i(){const e=t.value,i=o.value;if(e&&""!==e.trim())try{await a();const t=new ExpresionRegular(e,r);if(t.parse()){const e=t.getResult();e.ID_AFN=i||"Preview",updateAFNPreview("#preview-afn",e)}else updateAFNPreview("#preview-afn",null)}catch(e){console.error("Error al generar la previsualización:",e),updateAFNPreview("#preview-afn",null)}else updateAFNPreview("#preview-afn",null)}t.addEventListener("input",i),o.addEventListener("input",i),i()}