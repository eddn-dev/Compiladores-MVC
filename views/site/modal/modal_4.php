<div class="blur">
    <div class="modal bg30" id="modal4">
        <button class="modal_close">&times;</button>
        <div class="modal_title">Calculadora</div>
        <div class="modal_canvas_container"></div>
        <div class="modal_content">
            <div class="modal_create_layout">
                <div class="modal_automaton_form">
                    <form>
                        <div class="form-group">
                            <label for="text-operation">Introduzca la operación a realizar:</label>
                            <input type="text" id="text-operation" name="text-operation">
                            <small id="text-operation-alert" class="alert-message"></small> 
                        </div>
                        <!-- Contenedor para mostrar el resultado y la notación postfija -->
                        <div class="modal_result">
                            <p id="operation-result">Resultado: <span id="result-output"></span></p>
                            <p id="postfix-expression">Notación Postfija: <span id="postfix-output"></span></p>
                        </div>
                        <div class="modal_buttons">
                            <button type="button" class="modal_button calculate">Calcular</button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    </div>
</div>
