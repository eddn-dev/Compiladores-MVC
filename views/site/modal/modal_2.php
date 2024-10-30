<div class="blur">
    <!-- Contenido del modal -->
    <div class="modal bg30" id="modal2">
        <button class="modal_close">&times;</button>
        <div class="modal_title">
            Unión para Analizador Léxico y AFD
        </div>
        <div class="modal_canvas_container">
            <!-- Aquí puedes agregar un canvas si es necesario -->
        </div>
        <div class="modal_content">
            <form id="form-obtener-afd">
                <table>
                    <thead>
                        <tr>
                            <th>ID AFN</th>
                            <th>Unir</th>
                            <th>Token</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-afns">
                        <!-- Las filas se generarán dinámicamente -->
                    </tbody>
                </table>
                <small id="tabla-afns-alert" class="error-message"></small>
                <div class="modal_buttons">
                    <button type="submit" class="modal_button accept">Obtener AFD</button>
                    <button type="button" class="modal_button cancel">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</div>
