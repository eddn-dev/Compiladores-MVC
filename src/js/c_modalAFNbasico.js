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
        }
  
        AFNS.push(nuevoAFN);
        actualizarSelectsDeAFN();
      },
      successMessage: 'AFN básico creado exitosamente.',
      errorMessage: 'Por favor, corrige los errores antes de continuar.'
    };
  
    function actualizarCytoscape(afn) {
      const previewContainer = modal.querySelector('.automaton_preview'); 
  
      const nodes = [];
      const edges = [];
  
      if (afn) {
        const estadoInicial = afn.Edo_Inicial;
        const estadoFinal = [...afn.Edos_Acept][0];
        const simbolo = modal.querySelector('#start-symbol').value; 
  
        nodes.push({ data: { id: estadoInicial.Id_Edo.toString(), label: estadoInicial.Id_Edo.toString() } });
        nodes.push({ data: { id: estadoFinal.Id_Edo.toString(), label: estadoFinal.Id_Edo.toString(), shape: 'star', color: 'red' } });
        edges.push({ data: { source: estadoInicial.Id_Edo.toString(), target: estadoFinal.Id_Edo.toString(), label: simbolo } });
      }
  
      const cy = cytoscape({
        container: previewContainer,  
        elements: { nodes: nodes, edges: edges }, 
        style: [ 
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'background-color': '#666', 
              'color': '#fff', 
              'text-valign': 'center', 
              'width': '40px', 
              'height': '40px' 
            }
          },
          {
            selector: 'edge',
            style: {
              'label': 'data(label)',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'width': 2, 
              'line-color': '#9dbaea', 
              'target-arrow-color': '#9dbaea' 
            }
          },
          {
            selector: '.estadoAceptacion', 
            style: {
              'background-color': '#c0392b',
              'shape': 'star'
            }
          }
        ],
        layout: { 
          name: 'grid',
          rows: 2 
        }
      });
    }
  
    function limpiarCytoscape() {
      const previewContainer = modal.querySelector('.automaton_preview');
      const cy = cytoscape({
        container: previewContainer,
        elements: [] 
      });
    }
  
    handleAFNModal(modal, config);
    actualizarCytoscape(null); 
  
    const inputFields = modal.querySelectorAll('input[type="text"]');
    inputFields.forEach(input => {
      input.addEventListener('keyup', () => { 
        const fields = obtenerValoresDeCampos(modal);
        if (fields['automatonId'].isValid && fields['startSymbol'].isValid && fields['endSymbol'].isValid) {
          try {
            nuevoAFN = AFN.Crear_Basico_AFN(fields['startSymbol'].value, fields['endSymbol'].value || null);
            nuevoAFN.ID_AFN = fields['automatonId'].value.trim();
  
            const cerradura = modal.querySelector('input[name="cerradura"]:checked').value;
            switch (cerradura) {
              case 'kleene':
                nuevoAFN.Cerradura_Kleene();
                break;
              case 'epsilon':
                nuevoAFN.Cerradura_Positiva();
                break;
            }
  
            actualizarCytoscape(nuevoAFN);
          } catch (error) {
            console.error("Error al crear el AFN:", error);
          }
        } else {
          limpiarCytoscape();
        }
      });
    });
  }
  
  function obtenerValoresDeCampos(modal) {
    const fields = {};
    fields['automatonId'] = { value: modal.querySelector('#automaton-id').value.trim(), isValid: true };
    fields['startSymbol'] = { value: modal.querySelector('#start-symbol').value, isValid: true };
    fields['endSymbol'] = { value: modal.querySelector('#end-symbol').value, isValid: true };
    return fields;
  }