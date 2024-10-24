import * as THREE from 'three';

// Cámara compartida
const camera = new THREE.PerspectiveCamera(45, 150 / 150, 0.1, 1000);
camera.position.z = 8; // Alejar la cámara para encuadrar la esfera

// Función para crear renderizadores
function createRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    //renderer.setClearColor(0x000000, 0); // Fondo transparente
    renderer.setSize(300, 300);
    return renderer;
}

// Función para configurar una escena
function setupScene(scene, renderer, texturePath, rotX, rotY, rotZ) {
    // Luces
    const light1 = new THREE.PointLight(0xffffff, 500, 300);
    light1.position.set(-10, 10, 15);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 500, 300);
    light2.position.set(15, -15, -5);
    scene.add(light2);

    // Cargar la textura
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath, function() {
        renderer.render(scene, camera);
    });

    // Configurar la textura 
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(2, 1); 

    const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.05, 
        roughness: 0.1, 
        clearcoat: 0.6, 
        clearcoatRoughness: 0.05 
    });

    // Crear la geometría de la esfera
    const sphereGeometry = new THREE.SphereGeometry(3, 360, 360);

    // Crear la malla
    const mesh = new THREE.Mesh(sphereGeometry, material);
    mesh.rotation.set(rotX, rotY, rotZ);
    scene.add(mesh);

    // Retornar la malla
    return mesh;
}

// Función para calcular la diferencia angular mínima, esto para 
// que al momento de desactivar el hover de un botón, regrese a su
// angulo inicial y no se quede con la última rotación efectuada
function shortestAngle(from, to) {
    let difference = to - from;
    difference = ((difference + Math.PI) % (2 * Math.PI)) - Math.PI;
    return difference;
}

const spheres = [
    {
        id: 'sphere1',
        texture: 'build/img/textures/texture_1.avif',
        rotX: 0,
        rotY: 0,
        rotZ: 0
    },
    {
        id: 'sphere2',
        texture: 'build/img/textures/texture_2.avif',
        rotX: 0,
        rotY: 0,
        rotZ: 0
    },
    {
        id: 'sphere3',
        texture: 'build/img/textures/texture_3.avif',
        rotX: 0,
        rotY: 0,
        rotZ: 0
    },
    {
        id: 'sphere4',
        texture: 'build/img/textures/texture_4.avif',
        rotX: 0.0,
        rotY: 0,
        rotZ: 0
    },
    {
        id: 'sphere5',
        texture: 'build/img/textures/texture_5.avif',
        rotX: 0.0,
        rotY: 0.1,
        rotZ: 0
    },
    {
        id: 'sphere6',
        texture: 'build/img/textures/texture_6.avif',
        rotX: 0.0,
        rotY: 0,
        rotZ: 0
    },
    {
        id: 'sphere7',
        texture: 'build/img/textures/texture_7.avif',
        rotX: 0.0,
        rotY: 0,
        rotZ: 0
    }
];

spheres.forEach((sphereData) => {
    const scene = new THREE.Scene();
    const canvas = document.querySelector(`#${sphereData.id}`);
    const renderer = createRenderer(canvas);
    const mesh = setupScene(scene, renderer, sphereData.texture, sphereData.rotX, sphereData.rotY, sphereData.rotZ);

    let isHovered = false;
    let rotationSpeed = 0;
    const maxRotationSpeed = Math.PI / 20; // Velocidad máxima de rotación
    const rotationAcceleration = 0.002; // Aceleración al hacer hover
    const rotationDeceleration = 0.002; // Desaceleración al dejar hover
    const initialRotationY = mesh.rotation.y; // Almacenar la rotación inicial

    function animate() {
        requestAnimationFrame(animate);

        if (isHovered && !canvas.classList.contains('clicked')) {
            // Aumentar la velocidad de rotación hasta el máximo
            rotationSpeed += rotationAcceleration;
            if (rotationSpeed > maxRotationSpeed) {
                rotationSpeed = maxRotationSpeed;
            }
        } else {
            // Disminuir la velocidad de rotación hasta detenerse
            rotationSpeed -= rotationDeceleration;
            if (rotationSpeed < 0) {
                rotationSpeed = 0;
            }

            // Interpolar la rotación hacia la posición inicial
            const angleDifference = shortestAngle(mesh.rotation.y, initialRotationY); 
            mesh.rotation.y += angleDifference * 0.1; 
        }

        // Aplicar la velocidad de rotación
        mesh.rotation.y += rotationSpeed;

        // Normalizar la rotación a [0, 2π)
        mesh.rotation.y = mesh.rotation.y % (Math.PI * 2);
        if (mesh.rotation.y < 0) {
            mesh.rotation.y += Math.PI * 2;
        }

        renderer.render(scene, camera);
    }

    canvas.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    canvas.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Iniciar el bucle de animación
    animate();
});
