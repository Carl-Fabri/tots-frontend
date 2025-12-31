# Sistema de Reservas de Espacios

Sistema completo de gestión de espacios y reservas construido con Angular y Laravel.

## Características

- ✅ Autenticación con MC-Kit Auth
- ✅ Vista principal con listado de espacios y filtros avanzados
- ✅ **Calendario visual de reservas** - Muestra horarios reservados y libres
- ✅ Detalle de espacios con información completa y calendario específico
- ✅ ABM de espacios para administradores (usando PrimeNG Table)
- ✅ Sistema de reservas con validación de horarios
- ✅ Gestión de reservas (ver, editar, cancelar)
- ✅ Sistema de notificaciones (toasts) con PrimeNG
- ✅ Interfaz moderna con PrimeNG y Tailwind CSS

## Tecnologías Utilizadas

### Frontend
- Angular 19
- PrimeNG 19
- MC-Kit (Auth, Filter, Table)
- Tailwind CSS
- RxJS

### Backend
- Laravel
- JWT Authentication
- CORS configurado

## Instalación

### Frontend

```bash
cd notekeeper-frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Backend

```bash
cd tots-backend
composer install
php artisan migrate
php artisan serve
```

El backend estará disponible en `http://localhost:8000`

## Configuración

### Variables de Entorno

Asegúrate de configurar las siguientes variables en el backend:

- `DB_CONNECTION`
- `DB_HOST`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

### CORS

El CORS está configurado en `tots-backend/config/cors.php` para permitir solicitudes desde `http://localhost:4200`.

## Estructura del Proyecto

### Frontend

```
notekeeper-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/          # Componente de login con MC-Kit
│   │   │   ├── register/       # Componente de registro
│   │   │   ├── layout/         # Layout principal con navegación
│   │   │   ├── spaces-list/    # Listado de espacios con filtros
│   │   │   ├── space-detail/   # Detalle de espacio
│   │   │   ├── calendar-view/  # Calendario visual de reservas
│   │   │   ├── admin-spaces/   # ABM de espacios (admin)
│   │   │   ├── reservation-form/  # Formulario de reserva
│   │   │   └── reservations-list/  # Gestión de reservas
│   │   ├── guards/             # Guards de autenticación
│   │   └── routes.ts          # Configuración de rutas
│   ├── services/              # Servicios (Auth, Space, Reservation, Notification)
│   ├── models/                # Modelos TypeScript
│   └── interceptors/          # Interceptor HTTP para JWT
```

## Funcionalidades

### Autenticación
- Login con MC-Kit Auth Basic
- Registro de usuarios
- Protección de rutas con guards
- Manejo de tokens JWT

### Espacios
- Listado con filtros por:
  - Búsqueda por nombre/descripción
  - Capacidad mínima/máxima
  - Estado (activo/inactivo)
- Vista detallada de cada espacio
- **Calendario visual** que muestra disponibilidad de espacios
- ABM completo para administradores

### Calendario de Reservas
- Vista mensual con todos los espacios o filtrado por espacio específico
- Indicadores visuales de reservas (confirmadas, pendientes, canceladas)
- Navegación entre meses
- Tooltips con detalles de reservas al pasar el mouse
- Filtro por espacio para ver disponibilidad específica

### Reservas
- Creación de reservas con validación de horarios
- Visualización de reservas del usuario
- Edición de reservas existentes
- Cancelación de reservas
- Validación para evitar superposiciones

### Notificaciones
- Sistema de toasts con PrimeNG
- Notificaciones de éxito/error/info/advertencia

## Rutas

### Públicas
- `/` - Listado de espacios
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/spaces/:id` - Detalle de espacio

### Protegidas (requieren autenticación)
- `/reservations` - Mis reservas
- `/spaces/:id/reserve` - Crear reserva

### Administrador
- `/admin/spaces` - Administración de espacios

## Testing

Para ejecutar los tests:

```bash
cd notekeeper-frontend
npm test
```

## Notas

- El sistema utiliza JWT para autenticación
- Las reservas se validan en el backend para evitar superposiciones
- Solo los administradores pueden gestionar espacios
- Los usuarios solo pueden ver y gestionar sus propias reservas

## Desarrollo

### Comandos Útiles

```bash
# Frontend
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests

# Backend
php artisan serve  # Servidor de desarrollo
php artisan migrate # Ejecutar migraciones
php artisan test   # Ejecutar tests
```

## Licencia

Este proyecto es de uso educativo.
