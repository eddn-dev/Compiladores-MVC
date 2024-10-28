// Función para manejar la aplicación de la cerradura de Kleene
function handleAplicarCerraduraKleene(modal) {
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
            }
        ],
        validationEvent: 'change',
        populateAFNSelects: true,
        onSubmit: (fields, form) => {
            const afnId1 = fields['afnId1'].value;

            // Obtener el AFN seleccionado
            const afn1Index = AFNS.findIndex(afn => afn.ID_AFN === afnId1);
            const afn1 = AFNS[afn1Index];

            // Aplicar la cerradura de Kleene
            afn1.Cerradura_Kleene();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'Cerradura de Kleene aplicada exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}