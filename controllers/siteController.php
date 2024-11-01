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
            '<script src="build/js/c_modalAFNbasico.js"></script>',
            '<script src="build/js/c_modalAFNOpcional.js"></script>',
            '<script src="build/js/c_modalCerraduraKleene.js"></script>',
            '<script src="build/js/c_modalCerraduraPositiva.js"></script>',
            '<script src="build/js/c_modalConcatenarAFN.js"></script>',
            '<script src="build/js/c_modalProbarAFD.js"></script>',
            '<script src="build/js/c_modalUnirAFN.js"></script>',
            '<script src="build/js/c_modalObtenerAFD.js"></script>',
            '<script src="build/js/c_modalERaAFN.js"></script>',
            '<script src="build/js/c_modalCalculadora.js"></script>',
            '<script src="build/js/scene.js" type="module"></script>',
            '<script src="build/js/buttons.js"></script>',
            '<script src="build/js/AnalizLex.js"></script>',
            '<script src="build/js/AnalizSin.js"></script>'
        ];
        $router->render('site/index/index',[],true, $scripts);
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

    public static function modalOption7(Router $router) {
        $router->render('site/modal/modal_option_7', [], false);
    }
}