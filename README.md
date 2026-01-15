# 🍊 Carmen Job Search

> Búsqueda automática de empleo con IA - Encuentra tu trabajo ideal sin esfuerzo

Carmen Job Search es una webapp que utiliza IA para buscar automáticamente oportunidades laborales en LinkedIn, Indeed y páginas de empresas, y te envía alertas personalizadas por email.

## ✨ Características

- 🤖 **Matching con IA** - OpenAI analiza cada oferta y la compara con tus preferencias
- 🔔 **Alertas por Email** - Recibe notificaciones en el horario que prefieras
- 🔍 **Búsqueda Automática** - Scraping de LinkedIn, Indeed y páginas de empresas
- 📊 **Dashboard Interactivo** - Gestiona empresas, preferencias y trabajos encontrados
- 🎨 **UI/UX Moderna** - Diseño oscuro con tema naranja usando NextUI

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Frontend** | Next.js 15 + NextUI + Tailwind CSS |
| **Backend** | Express + TypeScript (API Bridge) |
| **Base de Datos** | PostgreSQL |
| **Email** | Brevo SMTP |
| **IA** | OpenAI API (gpt-4o-mini) |

## 📁 Estructura del Proyecto

```
carmen-job-search/
├── vercel/frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/              # Páginas (App Router)
│   │   ├── components/       # Componentes React
│   │   └── theme.ts          # Configuración de tema
│   └── package.json
├── api-bridge/               # API Express
│   ├── src/
│   │   ├── routes/           # Rutas API
│   │   ├── services/         # Servicios (DB, email, scrapers)
│   │   └── server.ts         # Servidor principal
│   └── package.json
└── docker-compose.override.yml
```

## 🚀 Instalación

### API Bridge (Servidor Local)

```bash
cd api-bridge
npm install
cp .env.example .env
# Edita .env con tus credenciales
npm run dev
```

### Frontend (Vercel)

```bash
cd vercel/frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ⚙️ Variables de Entorno

### API Bridge
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
API_BRIDGE_KEY=tu-clave-secreta
OPENAI_API_KEY=sk-...
BREVO_SMTP_PASSWORD=tu-password-brevo
```

### Frontend
```bash
API_BRIDGE_URL=http://localhost:3001
API_BRIDGE_KEY=tu-clave-secreta
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📸 Screenshots

### Landing Page
![Landing](.github/screenshots/landing.png)

### Dashboard
![Dashboard](.github/screenshots/dashboard.png)

### Job List con Filtros
![Jobs](.github/screenshots/jobs.png)

## 🤝 Contribuyendo

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ por [andresmoralesc1](https://github.com/andresmoralesc1)

---

**Nota:** Este proyecto es para fines educativos. Siempre respeta los términos de servicio de los sitios web que haces scraping.
