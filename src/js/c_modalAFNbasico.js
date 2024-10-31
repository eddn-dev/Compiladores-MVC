function handleCrearAFNBasico(modal) {
  let nuevoAFN = null;

  const config = {
      fields: [
          {
              name: 'automatonId',
              selector: '#automaton-id',
              alertSelector: '#automaton-id-alert',
              validate: (value) => {
                  if (!value) {
                      return 'El ID es obligatorio.';
                  } else if (!/^[0-9]+$/.test(value)) {
                      return 'El ID solo puede contener números.';
                  } else if (AFNS.some(afn => afn.ID_AFN === value)) {
                      return 'El ID ya existe. Elige otro.';
                  }
                  return null;
              }
          },
          {
              name: 'startSymbol',
              selector: '#start-symbol',
              alertSelector: '#start-symbol-alert',
              validate: (value) => {
                  if (!value) {
                      return 'El símbolo de inicio es obligatorio.';
                  } else if (!esCaracterValido(value)) {
                      return 'El símbolo de inicio debe ser un carácter válido.';
                  }
                  return null;
              }
          },
          {
              name: 'endSymbol',
              selector: '#end-symbol',
              alertSelector: '#end-symbol-alert',
              validate: (value, fields) => {
                  const startSymbol = fields['startSymbol'].value;
                  if (value) {
                      if (!esCaracterValido(value)) {
                          return 'El símbolo de final debe ser un carácter válido o estar vacío.';
                      } else if (startSymbol && startSymbol > value) {
                          return 'El símbolo final no puede ser menor que el símbolo inicial (valor ASCII).';
                      }
                  }
                  return null;
              }
          }
      ],
      onSubmit: (fields, form) => {
          const automatonId = fields['automatonId'].value.trim();
          const startSymbol = fields['startSymbol'].value;
          const endSymbol = fields['endSymbol'].value || null;

          nuevoAFN = AFN.Crear_Basico_AFN(startSymbol, endSymbol);
          nuevoAFN.ID_AFN = automatonId;

          const cerradura = form.querySelector('input[name="cerradura"]:checked').value;
          switch (cerradura) {
              case 'kleene':
                  nuevoAFN.Cerradura_Kleene();
                  break;
              case 'epsilon':
                  nuevoAFN.Cerradura_Positiva();
                  break;
              // 'default' no hace nada
          }

          AFNS.push(nuevoAFN);
          actualizarSelectsDeAFN();
          mostrarNotificacion('AFN básico creado exitosamente.', 'success');
          closeModal(modal);
      },
      successMessage: 'AFN básico creado exitosamente.',
      errorMessage: 'Por favor, corrige los errores antes de continuar.'
  };

  handleAFNModal(modal, config);

  // Inicializar la previsualización
  const previewContainerSelector = '.automaton_preview';
  const inputFields = modal.querySelectorAll('input[type="text"], input[name="cerradura"]');

  function updatePreview() {
      const fields = obtenerValoresDeCampos(modal);
      if (fields['automatonId'].value && fields['startSymbol'].value && fields['startSymbol'].isValid && fields['endSymbol'].isValid) {
          try {
              // Resetear contadores antes de crear el AFN de previsualización
              Estado.Cant_Edos = 0;
              AFN.Cant_AFN = 0;

              let previewAFN = AFN.Crear_Basico_AFN(fields['startSymbol'].value, fields['endSymbol'].value || null);
              previewAFN.ID_AFN = fields['automatonId'].value.trim();

              const cerradura = modal.querySelector('input[name="cerradura"]:checked').value;
              switch (cerradura) {
                  case 'kleene':
                      previewAFN.Cerradura_Kleene();
                      break;
                  case 'epsilon':
                      previewAFN.Cerradura_Positiva();
                      break;
                  // 'default' no hace nada
              }

              updateAFNPreview(previewContainerSelector, previewAFN);
          } catch (error) {
              console.error("Error al crear el AFN:", error);
              updateAFNPreview(previewContainerSelector, null);
          }
      } else {
          updateAFNPreview(previewContainerSelector, null);
      }
  }

  // Vincular eventos para actualizar la previsualización
  inputFields.forEach(input => {
      input.addEventListener('input', updatePreview);
  });

  // Actualizar la previsualización inicial
  updatePreview();
}

function obtenerValoresDeCampos(modal) {
  const fields = {};
  fields['automatonId'] = { value: modal.querySelector('#automaton-id').value.trim(), isValid: true };
  fields['startSymbol'] = { value: modal.querySelector('#start-symbol').value, isValid: esCaracterValido(modal.querySelector('#start-symbol').value) };
  fields['endSymbol'] = { value: modal.querySelector('#end-symbol').value, isValid: modal.querySelector('#end-symbol').value === '' || esCaracterValido(modal.querySelector('#end-symbol').value) };
  return fields;
}

function esCaracterValido(char) {
  // Puedes ajustar esta función según los caracteres permitidos
  return typeof char === 'string' && char.length === 1;
}
