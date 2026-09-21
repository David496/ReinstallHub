# Guía del Gestor de Perfiles | ReInstall Hub

El **Gestor de Perfiles** de ReInstall Hub permite seleccionar decenas de aplicaciones con un solo clic según el perfil del usuario o la máquina que estés configurando.

---

## 1. Perfiles de Fábrica Incluidos

ReInstall Hub incluye **6 perfiles predeterminados verificados**:

| Perfil | Icono | Descripción | Aplicaciones Incluidas |
| :--- | :---: | :--- | :--- |
| **Oficina & Hogar** | 🏢 | Navegación, ofimática y utilidades diarias | Google Chrome, ONLYOFFICE Desktop, PDF24 Creator, VLC, 7-Zip, Google Drive, Telegram |
| **Gamer & Rendimiento** | 🎮 | Plataformas de juegos, librerías y monitorización | Steam, Discord, Epic Games Launcher, MSI Afterburner, FurMark 2, Visual C++ Redistributable, .NET Desktop Runtime 8, 7-Zip |
| **Desarrollador & DevOps** | 💻 | Entorno de desarrollo de software y terminales | VS Code, Git, GitHub Desktop, Windows Terminal, Node.js LTS, Python 3.12, Docker Desktop, Postman |
| **Técnico & Diagnóstico** | 🔧 | Suite completa de diagnóstico, benchmarking y limpieza | CrystalDiskInfo, CPU-Z, HWMonitor, GPU-Z, FurMark 2, OCCT, DDU, TreeSize Free, Wise Disk Cleaner, LockHunter, Autoruns, O&O ShutUp10++, Angry IP Scanner |
| **Diseño & Multimedia** | 🎨 | Edición de audio, vídeo, 3D y gráficos | Figma, Blender, GIMP, Krita, OBS Studio, Audacity, Shotcut, HandBrake, VLC |
| **Básico Post-Formateo** | ✨ | Las herramientas imprescindibles que toda PC necesita | 7-Zip, VLC, Google Chrome, SumatraPDF, Visual C++ Redistributable, PowerToys |

---

## 2. Creación de Perfiles Personalizados

Puedes crear infinitos perfiles a tu medida:

1. Ve a la pestaña **Catálogo**.
2. Selecciona las aplicaciones que deseas incluir marcando sus casillas de verificación.
3. Despliega el menú de perfiles en la barra superior y pulsa **"Guardar selección actual..."**.
4. Asígnale un nombre (ej. *"Estudio de Grabación"* o *"Cliente Corporativo A"*) y una descripción opcional.
5. Haz clic en **Guardar Perfil**.

---

## 3. Exportar e Importar Perfiles (`.json`)

Para compartir perfiles con otros técnicos o respaldarlos en tu disco externo:

### Exportar:
- Abre el selector de perfiles.
- En la sección *Perfiles Personalizados*, haz clic en el botón de descarga (**Exportar**) junto al perfil.
- Se guardará un archivo JSON con formato estandarizado:
  ```json
  {
    "version": "1.0.0",
    "generator": "ReInstall Hub",
    "exportedAt": "2026-09-20T12:00:00.000Z",
    "profile": {
      "id": "custom-12345",
      "name": "Taller Especial",
      "description": "Herramientas de banco",
      "softwareIds": [
        "crystaldiskinfo",
        "cpu-z",
        "hwmonitor",
        "7zip"
      ],
      "isDefault": false
    }
  }
  ```

### Importar:
- Pulsa el botón **"Importar Perfil (.json)"** en el menú desplegable.
- Elige el archivo `.json` de tu pendrive.
- ReInstall Hub validará los identificadores y aplicará la selección de inmediato en el catálogo.

---

## 4. Bloqueo Inteligente de Aplicaciones ya Presentes

Al aplicar cualquier perfil en una máquina, ReInstall Hub **detecta si alguna de las aplicaciones del perfil ya se encuentra instalada en Windows**:
- Las aplicaciones existentes se omiten automáticamente para no reinstalarlas ni descargar datos duplicados.
- Solo se seleccionan e instalan los programas faltantes.
