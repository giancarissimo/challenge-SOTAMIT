# Challenge SOTAMIT - Frontend
Documentación del apartado del Front para el challenge.

## Flujo de uso de la aplicación.

La aplicación consta de varias páginas web:

```/```: Una pequeña introducción a la aplicación.

```/register``` : Contiene un formulario de registro para los usuarios.

```/login``` : Contiene un formulario de inicio de sesión para los usuarios.

```/profile``` : Contiene la información de nuestra cuenta, una vez loggeados. Requiere autenticación y autorización.

```/users``` : Contiene todos los usuarios registrados hasta el momento. Requiere autenticación y autprización.

Al intentar acceder a las páginas protegidas sin autenticación, la aplicación retorna un error indicando que el usuario no está autenticado (por falta de cookie o token).

Se recomienda registrar primero un usuario administrador a través de la pagina de ```/register``` y luego registrar uno o más usuarios normales.

Al iniciar sesión con un usuario normal a través de ```/login``` se puede interactuar únicamente con sus propios datos, impidiendo acciones como eliminar otros usuarios o actualizarlos.

Iniciar sesión como administrador permite gestionar todos los usuarios, lo que respalda la administración centralizada de la aplicación.

Con estas mejoras, se garantiza una mayor seguridad y se promueve una gestión de usuarios más robusta, alineándose con buenas prácticas en el desarrollo de aplicaciones web.

## Instalación e Inicialización

### Requisitos Previos
  * Tener instalado [NodeJs](https://nodejs.org/en)
  * Utilizar ```npm``` o ```yarn```

### Instalación de Dependencias
1. Abrir la consola de comandos a través de ```cntrl + ñ```

2. Ir a la carpeta de ```/frontend```
```bash
cd frontend
```

3. Instalar las dependencias:
```bash
npm install
```

### Inicialización del Servidor
Para iniciar el servidor, ejecutar:

```bash
npm run dev
```

Una vez iniciado, se podrá acceder a la aplicación en ```http://localhost:3000```.