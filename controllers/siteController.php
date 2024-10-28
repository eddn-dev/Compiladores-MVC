<?php 

namespace Controllers;

use MVC\Router;

class siteController {

    public static function inicio(Router $router) {
        $scripts = [
            '<script src="build/js/subclassAFN.js"></script>',
            '<script src="build/js/app.js"></script>',
            '<script src="build/js/AFN.js"></script>',
            '<script src="build/js/control.js"></script>',
            '<script src="build/js/scene.js" type="module"></script>',
            '<script src="build/js/buttons.js"></script>'
        ];
        $router->render('site/index/index',[],true, $scripts);
    }

    public static function iniciarDescarga(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener los datos enviados desde el cliente
            $contenidoArchivo = $_POST['contenidoArchivo'] ?? null;
            $nombreArchivo = $_POST['nombreArchivo'] ?? 'archivo.txt';
    
            if ($contenidoArchivo !== null && $nombreArchivo) {
                // Sanitizar el nombre del archivo
                $nombreArchivo = basename($nombreArchivo);
    
                // Generar un nombre único para el archivo temporal
                $nombreTemporal = uniqid('temp_', true) . '_' . $nombreArchivo;
    
                // Ruta completa al archivo temporal
                // Suponiendo que __DIR__ es /tu_proyecto/controllers
                // y que la carpeta public está en /tu_proyecto/public
                $rutaArchivo = __DIR__ . '/../public/temp/' . $nombreTemporal;
    
                // Asegurarse de que la carpeta temp existe
                if (!file_exists(__DIR__ . '/../public/temp/')) {
                    mkdir(__DIR__ . '/../public/temp/', 0777, true);
                }
    
                // Guardar el contenido en el archivo temporal
                file_put_contents($rutaArchivo, $contenidoArchivo);
    
                // Obtener la URL pública al archivo temporal
                // Suponiendo que la carpeta public es la raíz del servidor web
                $urlArchivo = '/temp/' . $nombreTemporal;
    
                // Devolver la URL al cliente
                echo $urlArchivo;
                exit;
            } else {
                // Responder con un error si faltan datos
                http_response_code(400);
                echo 'Datos incompletos para generar el archivo.';
                exit;
            }
        } else {
            // Método no permitido
            http_response_code(405);
            echo 'Método no permitido.';
            exit;
        }
    }
    

    public static function modal1(Router $router) {
        $router->render('site/modal/modal_1', [], false);
    }

    public static function modal2(Router $router) {
        $router->render('site/modal/modal_2', [], false);
    }

    public static function modal3(Router $router) {
        $router->render('site/modal/modal_3', [], false);
    }

    public static function modal4(Router $router) {
        $router->render('site/modal/modal_4', [], false);
    }

    public static function modal5(Router $router) {
        $router->render('site/modal/modal_5', [], false);
    }

    public static function modal6(Router $router) {
        $router->render('site/modal/modal_6', [], false);
    }

    public static function modal7(Router $router) {
        $router->render('site/modal/modal_7', [], false);
    }

    public static function modalOption1(Router $router) {
        $router->render('site/modal/modal_option_1', [], false);
    }
    
    public static function modalOption2(Router $router) {
        $router->render('site/modal/modal_option_2', [], false);
    }
    public static function modalOption3(Router $router) {
        $router->render('site/modal/modal_option_3', [], false);
    }
    
    public static function modalOption4(Router $router) {
        $router->render('site/modal/modal_option_4', [], false);
    }

    public static function modalOption5(Router $router) {
        $router->render('site/modal/modal_option_5', [], false);
    }
    
    public static function modalOption6(Router $router) {
        $router->render('site/modal/modal_option_6', [], false);
    }
}