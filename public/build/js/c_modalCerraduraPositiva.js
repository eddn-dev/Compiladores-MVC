function handleAplicarCerraduraPositiva(a){handleAFNModal(a,{fields:[{name:"afnId1",selector:"#automaton-id-1",alertSelector:"#automaton-id-1-alert",validate:a=>a?null:"Selecciona un AFN."}],validationEvent:"change",populateAFNSelects:!0,onSubmit:(a,e)=>{const r=a.afnId1.value,t=AFNS.findIndex((a=>a.ID_AFN===r));AFNS[t].Cerradura_Positiva(),actualizarSelectsDeAFN()},successMessage:"Cerradura positiva aplicada exitosamente.",errorMessage:"Por favor, corrige los errores antes de continuar."})}