// Función para manejar la aplicación de la cerradura de Kleene
function handleAplicarCerraduraKleene(modal) {
    const config = {
        fields: [
            {
                name: 'afnId',
                selector: '#automaton-id',
                alertSelector: '#automaton-id-alert',
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
            const afnId = fields['afnId'].value;

            // Obtener el AFN seleccionado
            const afnIndex = AFNS.findIndex(afn => afn.ID_AFN === afnId);
            const afn = AFNS[afnIndex];

            // Aplicar la cerradura de Kleene
            afn.Cerradura_Kleene();

            // Actualizar los selects en otros modales
            actualizarSelectsDeAFN();

            mostrarNotificacion('Cerradura de Kleene aplicada exitosamente.', 'success');
            closeModal(modal);
        },
        successMessage: 'Cerradura de Kleene aplicada exitosamente.',
        errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };

    handleAFNModal(modal, config);

    // Inicializar la previsualización del AFN seleccionado
    bindAFNSelectionChange('#automaton-id', '#preview-afn');

    const select = modal.querySelector('#automaton-id');

    function updateResultPreview() {
        const afnId = select.value;

        if (afnId) {
            const afn = AFNS.find(afn => afn.ID_AFN === afnId);

            // Clonar el AFN para la previsualización
            const previewAFN = afn.clone();

            // Aplicar la cerradura de Kleene
            previewAFN.Cerradura_Kleene();

            // Actualizar la previsualización del resultado
            updateAFNPreview('#preview-result', previewAFN);
        } else {
            // Limpiar la previsualización del resultado
            updateAFNPreview('#preview-result', null);
        }
    }

    // Vincular evento para actualizar la previsualización del resultado
    select.addEventListener('change', () => {
        updateAFNPreview('#preview-afn', AFNS.find(afn => afn.ID_AFN === select.value));
        updateResultPreview();
    });

    // Actualizar las previsualizaciones iniciales
    updateAFNPreview('#preview-afn', AFNS.find(afn => afn.ID_AFN === select.value));
    updateResultPreview();
}
