function handleAplicarOpcional(e){handleAFNModal(e,{fields:[{name:"afnId1",selector:"#automaton-id-1",alertSelector:"#automaton-id-1-alert",validate:e=>e?null:"Selecciona un AFN."}],validationEvent:"change",populateAFNSelects:!0,onSubmit:(e,a)=>{const o=e.afnId1.value,n=AFNS.findIndex((e=>e.ID_AFN===o));AFNS[n].Opcional(),actualizarSelectsDeAFN()},successMessage:"Operador opcional aplicado exitosamente.",errorMessage:"Por favor, corrige los errores antes de continuar."})}