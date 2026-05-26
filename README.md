# Iris Aerospace - Web Portal (Frontend)

Repositorio correspondiente a la interfaz pública y el portal del cliente de **Iris Aerospace**, una plataforma de turismo suborbital e interplanetario. Este proyecto forma parte del Trabajo de Fin de Grado (TFG) de Alejandra.

## Descripción del Proyecto

`iris-web` es el punto de entrada principal para los consumidores finales. Funciona como una agencia de viajes espaciales de lujo, permitiendo a los usuarios:
- Explorar destinos planetarios mediante un Atlas Estelar inmersivo.
- Reservar vuelos espaciales, alojamientos y seguros.
- Pagar sus reservas de manera segura a través de la integración nativa con Stripe.
- Acceder a su "Portal de Cliente" privado para gestionar sus pasajeros, comunicarse con su gestor personal y descargar documentación (Tickets en PDF).

## Stack Tecnológico

El portal está construido utilizando tecnologías modernas orientadas al rendimiento, la accesibilidad y el posicionamiento SEO:

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19) usando App Router para un rendimiento híbrido (SSR / RSC).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones y 3D:** Framer Motion, GSAP y Three.js / Spline (para visualización 3D inmersiva del Atlas Estelar).
- **Pagos:** [Stripe React](https://stripe.com/docs/stripe-js/react) para el cobro transaccional con máxima seguridad.
- **Testing:** [Vitest](https://vitest.dev/) para pruebas unitarias y de integración del flujo de negocio.

## Estructura del Directorio

```text
iris-web/
├── app/                  # Rutas principales de Next.js (App Router), páginas y layouts
├── components/           # Componentes reutilizables de UI (Botones, Modales, Formularios)
├── lib/                  # Utilidades, configuración de clientes (Axios, Stripe) y validaciones
├── public/               # Recursos estáticos (Imágenes, modelos 3D, iconos)
├── tests/                # Suite de pruebas automatizadas (Vitest)
├── types/                # Definiciones de tipos para TypeScript
└── package.json          # Dependencias y scripts del proyecto
```

## Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### 1. Clonar el repositorio y acceder a la carpeta
```bash
git clone <url-del-repo>
cd iris-web
```

### 2. Instalar las dependencias
Este proyecto utiliza `npm` como gestor de paquetes.
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto tomando como referencia las variables necesarias para el funcionamiento del backend y Stripe:

```env
# Ejemplo de .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## Pruebas (Testing)

El sistema integra un entorno robusto de **Chaos Engineering** y pruebas E2E utilizando Vitest, validando flujos críticos como los conflictos de sesión y el blindaje transaccional contra el fraude en Stripe.

Para ejecutar los tests automatizados:
```bash
npm run test
```

## Enlaces Relacionados (Ecosistema Iris)

Este proyecto frontend es la capa pública del ecosistema Iris Aerospace. Trabaja en sintonía con:
1. **API Bridge (`iris-api`)**: Servidor Express/Node encargado de validar JWT y conectar de forma segura con la base de datos PostgreSQL en NeonTech.
2. **ERP Interno (`control-iris`)**: Motor monolítico desarrollado en Laravel 11 / Livewire 3 para el uso exclusivo de Gestores y Administradores.

## Licencia / Autoría
Desarrollado por Alejandra para su proyecto de fin de grado. Todos los derechos reservados al contexto académico del proyecto.
