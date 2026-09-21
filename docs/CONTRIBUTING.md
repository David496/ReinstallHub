# Guía de Contribución | ReInstall Hub

¡Gracias por tu interés en contribuir a **ReInstall Hub**! Este documento contiene las pautas para proponer mejoras, reportar errores y agregar nuevas aplicaciones al catálogo.

---

## 1. Cómo Agregar un Nuevo Software al Catálogo

El catálogo de aplicaciones se encuentra en `data/software.json`. Cada entrada debe seguir este esquema TypeScript:

```json
{
  "id": "nombre-en-kebab-case",
  "name": "Nombre Comercial de la Aplicación",
  "publisher": "Nombre del Desarrollador",
  "wingetId": "Identificador.Oficial.De.WinGet",
  "description": "Short English description (maximum 2 lines).",
  "descriptionEs": "Descripción breve y clara en español (máximo 2 líneas).",
  "category": ["CategoríaValida"],
  "tags": ["etiqueta1", "etiqueta2"],
  "icon": "/icons/nombre-en-kebab-case.svg",
  "estimatedSize": 150,
  "recommended": false
}
```

### Reglas para Nuevas Aplicaciones:
1. **Identificador WinGet Válido**: Comprueba que el paquete exista en el repositorio oficial de Microsoft ejecutando:
   ```powershell
   winget show <wingetId>
   ```
2. **Icono Vectorial**: Agrega el icono correspondiente en formato SVG en `public/icons/<id>.svg`.
3. **Categoría Válida**: Debe pertenecer a una de las categorías soportadas:
   `Office`, `Browsers`, `Utilities`, `Media`, `Graphics`, `Development`, `Communication`, `Gaming`, `Security`, `Essential`, `Recommended`.
4. **Bilingüe**: Proporciona descripciones tanto en inglés (`description`) como en español (`descriptionEs`).

---

## 2. Desarrollo Local

### Requisitos:
- Node.js 20.x o superior
- npm 10.x o superior
- Windows 10/11 con WinGet habilitado

### Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/ReinstallHub.git
cd ReinstallHub

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev
```

---

## 3. Pruebas y Calidad de Código

Antes de enviar un Pull Request, asegúrate de que todas las comprobaciones pasen localmente:

```bash
# Comprobación estricta de tipos TypeScript
npm run typecheck

# Ejecución de la suite de pruebas unitarias
npm test

# Compilación de producción
npm run build
```

---

## 4. Convenciones de Commits

Seguimos las pautas de [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva funcionalidad para el usuario.
- `fix:` Corrección de un error.
- `docs:` Cambios exclusivamente en la documentación.
- `refactor:` Cambios en el código que no corrigen errores ni añaden funcionalidades.
- `test:` Agregar o corregir pruebas unitarias.
