// Función para manejar la aplicación del operador opcional
function handleAplicarOpcional(modal) {
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

            // Aplicar el operador opcional
            afn1.Opcional();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();
        },
        successMessage: 'Operador opcional aplicado exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);
}