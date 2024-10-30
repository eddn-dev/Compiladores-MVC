<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\siteController;
use MVC\Router;

$router = new Router();

$router->get('/', [siteController::class, 'inicio']);
$router->get('/modal1', [siteController::class, 'modal1']);
$router->get('/modal2', [siteController::class, 'modal2']);
$router->get('/modal3', [siteController::class, 'modal3']);
$router->get('/modal4', [siteController::class, 'modal4']);
$router->get('/modal5', [siteController::class, 'modal5']);
$router->get('/modal6', [siteController::class, 'modal6']);
$router->get('/modal7', [siteController::class, 'modal7']);
$router->get('/modal-option-1', [siteController::class, 'modalOption1']);
$router->get('/modal-option-2', [siteController::class, 'modalOption2']);
$router->get('/modal-option-3', [siteController::class, 'modalOption3']);
$router->get('/modal-option-4', [siteController::class, 'modalOption4']);
$router->get('/modal-option-5', [siteController::class, 'modalOption5']);
$router->get('/modal-option-6', [siteController::class, 'modalOption6']);
$router->get('/modal-option-7', [siteController::class, 'modalOption7']);


$router->checkRoutes();