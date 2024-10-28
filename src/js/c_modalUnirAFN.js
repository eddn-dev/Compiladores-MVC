
// Función para manejar la unión de dos AFNs
function handleUnirAFN(modal) {
    const config = {
        fields: [
            {
                name: 'afnId1',
                selector: '#automaton-id-1',
                alertSelector: '#automaton-id-1-alert',
                validate: (value) => {
                    if (!value) {
                        return 'Selecciona un AFN.';
                    }
                    return null;
                }
            },
            {
                name: 'afnId2',
                selector: '#automaton-id-2',
                alertSelector: '#automaton-id-2-alert',
                validate: (value, fields) => {
                    const afnId1 = fields['afnId1'].value.trim();
                    if (!value) {
                        return 'Selecciona un AFN.';
                    } else if (value === afnId1) {
                        return 'Debes seleccionar un AFN diferente.';
                    }
                    return null;
                }
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;
            const afnId2 = fields['afnId2'].value;

            // Obtener los AFNs seleccionados
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn2Index = AFNS.findIndex(afn => afn.ID_AFN === afnId2);

            const afn1 = AFNS[afn1Index];
            const afn2 = AFNS[afn2Index];

            // Unir los AFNs
            afn1.Unir(afn2);

            // Aplicar cerradura si es necesario
            const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
            switch(cerradura) {
                case 'kleene':
                    afn1.Cerradura_Kleene();
                    break;
                case 'epsilon':
                    afn1.Cerradura_Positiva();
                    break;
                // 'default' no hace nada
            }

            // Eliminar el AFN 2 de la lista, ya que ha sido unido al AFN 1
            AFNS.splice(afn2Index, 1);

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'AFNs unidos exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}