<div class="blur">
    <!-- Contenido del modal -->
    <div class="modal" id="modal14">
        <button class="modal_close">&times;</button>
        <div class="modal_title">
            ER a AFN
        </div>
        <div class="modal_content">
            <div class="modal_create_layout">
                <div class="modal_automaton_previews">
                    <div class="automaton_preview" id="1"></div>
                </div>
                <div class="modal_automaton_form">
                    <form>
                        <div class="form-group">
                            <label for="automaton-id">ID:</label>
                            <input type="text" id="automaton-id" name="automaton-id">
                            <small id="automaton-id-alert" class="alert-message"></small> 
                        </div>
                        <div class="form-group">
                            <label for="regex-input">Ingrese la expresión regular para generar un autómata:</label>
                            <input type="text" id="regex-input" name="regex-input" placeholder="Escribe la expresión regular aquí">
                        </div>
                        <div class="modal_buttons">
                            <button type="button" class="modal_button cancel">Cancelar</button>
                            <button type="submit" class="modal_button accept">Aceptar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
