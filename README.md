# 🎮 Tetris Clásico
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

Un juego completo de Tetris implementado con HTML5 Canvas y JavaScript vanilla, incluyendo todas las mecánicas clásicas del juego original.

## 🌟 Características

### Mecánicas del Juego
- ✅ **7 Piezas Clásicas**: I, O, T, S, Z, J, L con colores auténticos
- ✅ **Rotación Completa**: Sistema de rotación con wall kicks
- ✅ **Sistema de Caída**: Caída automática con aceleración progresiva
- ✅ **Eliminación de Líneas**: Detección y eliminación automática de líneas completas
- ✅ **Puntuación**: Sistema completo con bonus por líneas múltiples
- ✅ **Niveles**: Incremento automático de dificultad
- ✅ **Pieza Fantasma**: Vista previa de dónde caerá la pieza
- ✅ **Lock Delay**: Tiempo de gracia antes de fijar la pieza

### Controles
- **← →**: Mover pieza horizontalmente
- **↓**: Caída rápida (soft drop)
- **↑**: Rotar pieza 90° en sentido horario
- **Espacio**: Caída instantánea (hard drop)
- **P**: Pausar/Reanudar juego
- **R**: Reiniciar juego

### Características Visuales
- 🎨 **Diseño Moderno**: Interfaz atractiva con gradientes y efectos
- 🌈 **Efectos 3D**: Bloques con profundidad visual
- 👻 **Pieza Fantasma**: Preview transparente de la posición de caída
- 📱 **Responsive**: Adaptable a dispositivos móviles
- 🎯 **Vista de Siguiente Pieza**: Panel dedicado para la próxima pieza

### Sistema de Puntuación
- **Línea Simple**: 100 × nivel
- **Línea Doble**: 300 × nivel  
- **Línea Triple**: 500 × nivel
- **Tetris (4 líneas)**: 800 × nivel
- **Soft Drop**: 1 punto por celda
- **Hard Drop**: 2 puntos por celda

## 🚀 Cómo Jugar

1. Abre `index.html` en tu navegador web
2. Las piezas caen automáticamente desde la parte superior
3. Usa las teclas de flecha para mover y rotar las piezas
4. Completa líneas horizontales para eliminarlas y ganar puntos
5. El juego termina cuando las piezas llegan a la parte superior

## 🏗️ Estructura del Proyecto

```
tetris-clasico/
│
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y diseño visual
├── tetris.js           # Lógica completa del juego
└── README.md           # Este archivo
```

## 🎯 Mecánicas Técnicas

### Tablero de Juego
- **Dimensiones**: 10 columnas × 20 filas visibles (+ 4 ocultas)
- **Tamaño de celda**: 30×30 píxeles
- **Detección de colisiones**: Verificación precisa en tiempo real

### Sistema de Rotación
- **Wall Kicks**: Ajuste automático cuando la rotación colisiona
- **Punto de pivote**: Cada pieza rota alrededor de su centro
- **Validación**: Verificación de posiciones válidas

### Optimizaciones
- **RequestAnimationFrame**: Loop de juego suave y eficiente
- **Lock Delay**: 500ms de tiempo de gracia
- **Aceleración**: Velocidad aumenta cada 10 líneas

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas**: Renderizado gráfico
- **JavaScript ES6+**: Lógica del juego
- **CSS3**: Estilos y animaciones
- **Responsive Design**: Adaptabilidad móvil

## 🎮 Próximas Mejoras

- [ ] Sistema de hold (guardar pieza)
- [ ] Efectos de sonido
- [ ] Música de fondo
- [ ] Tabla de puntuaciones altas
- [ ] Múltiples modos de juego
- [ ] Controles táctiles para móviles

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móviles

---

¡Disfruta jugando este clásico atemporal! 🎉
