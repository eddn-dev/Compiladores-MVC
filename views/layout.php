<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto integral compiladores</title>
    <link rel="icon" href="build/img/icons/favicon.ico" type="image/x-icon"> 
    <link rel="stylesheet" href="build/css/app.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    
    <?php 
        echo $content;
    ?>
    <?php 
        if (isset($scripts)){
            foreach($scripts as $script){
                echo $script;
            }
        }
    ?>
    
</body>
</html>