// gulpfile.js

import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import terser from 'gulp-terser'
import sharp from 'sharp'

// Importaciones para Webpack
import webpackStream from 'webpack-stream'
import webpack from 'webpack'

const sass = gulpSass(dartSass)

// Definición de rutas
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    sceneJs: './src/js/scene.js' // Ruta específica para scene.js
}

// Configuración de Webpack para procesar scene.js
const webpackConfig = {
    mode: 'development', // Cambia a 'production' para producción
    entry: paths.sceneJs, // Punto de entrada de tu aplicación
    output: {
        filename: 'scene.js', // Nombre del archivo de salida
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Para transpilar ES6+ a ES5 si es necesario
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    // Opcional: Añadir source maps para facilitar la depuración
    devtool: 'source-map',
}

// Tarea para procesar scene.js con Webpack
export function jsWebpack() {
    return src(paths.sceneJs)
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(dest('./public/build/js'))
}

// Tarea para minificar otros archivos JavaScript (excluyendo scene.js)
export function js() {
    return src(['src/js/**/*.js', `!${paths.sceneJs}`])
        .pipe(terser())
        .pipe(dest('./public/build/js'))
}

// Tarea para procesar SASS
export function css() {
    return src(paths.scss, { sourcemaps: true })
        .pipe(
            sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError)
        )
        .pipe(dest('./public/build/css', { sourcemaps: '.' }))
}

// Tarea para recortar imágenes 
export async function crop() {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb'
    const width = 250
    const height = 180
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter((file) => {
        return /\.(jpg)$/i.test(path.extname(file))
    })
    try {
        images.forEach((file) => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile)
                .resize(width, height, {
                    position: 'centre',
                })
                .toFile(outputFile)
        })

        // Esperar a que todas las promesas de sharp se resuelvan
        await Promise.all(
            images.map((file) => {
                const inputFile = path.join(inputFolder, file)
                const outputFile = path.join(outputFolder, file)
                return sharp(inputFile)
                    .resize(width, height, {
                        position: 'centre',
                    })
                    .toFile(outputFile)
            })
        )

        return Promise.resolve()
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

// Tarea para procesar imágenes (sin cambios)
export async function imagenes() {
    const srcDir = './src/img'
    const buildDir = './public/build/img'
    const images = await glob('./src/img/**/*.{jpg,png}')

    images.forEach((file) => {
        const relativePath = path.relative(srcDir, path.dirname(file))
        const outputSubDir = path.join(buildDir, relativePath)
        procesarImagenes(file, outputSubDir)
    })
}

// Función auxiliar para procesar imágenes
function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)

    if (extName.toLowerCase() === '.svg') {
        // Si es un archivo SVG, simplemente copiarlo
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
        fs.copyFileSync(file, outputFile)
    } else {
        // Para otros formatos de imagen, procesarlos con sharp
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
        const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
        const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)
        const options = { quality: 80 }

        sharp(file).jpeg(options).toFile(outputFile)
        sharp(file).webp(options).toFile(outputFileWebp)
        sharp(file).avif(options).toFile(outputFileAvif)
    }
}

// Tarea de vigilancia (watch)
export function dev() {
    watch(paths.scss, css)
    watch(paths.js, js)
    watch(paths.sceneJs, jsWebpack) // Vigilar scene.js con Webpack
    watch('src/img/**/*.{png,jpg}', imagenes)
}

// Tarea por defecto
export default series(js, jsWebpack, css, imagenes, dev)
