# Challenge SOTAMIT - Backend
Documentación del backend para el challenge.

## Todos los paquetes de instalación que se utilizaron

### Para inicializar el proyecto de Nestjs
```Powershell
npm i -g @nestjs/cli
nest new project-name
```
En mi caso puse "nest new ./" para que el proyecto se inicalize dentro de la carpeta de backend sin necesidad de crear otra.

### Configs de Nestjs
```Powershell
npm i --save @nestjs/config
```
### Variables de entorno
```Powershell
npm install --save dotenv
npm install --save joi
```

### Passport con Nestjs
```Powershell
npm install --save @nestjs/passport
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

### Mongoose con Nestjs
```Powershell
npm i @nestjs/mongoose mongoose
```

### Validaciones
```Powershell
npm i --save class-validator class-transformer
```

### Hashing de contraseña
```Powershell
npm i bcrypt
npm install --save @types/bcrypt
```

### Cookies
```Powershell
npm i cookie-parser
npm i -D @types/cookie-parser
```

### Documentación con swagger
```Powershell
npm install --save @nestjs/swagger swagger-ui-express
```

### Para inicializar el CRUD de usuarios y auth
```Powershell
nest g resource users
nest g resource auth
```

### Nota
Toda la iformación fue sacada de la documentación de [NestJs](https://docs.nestjs.com/).

## Documentación
La documentación está realizada en [Swagger](https://swagger.io/) con Nest. Para acceder a ella en el servidor, deben ir al endpoint ```/api/docs```

## Testings

### Testings E2E

* #### Auth Testing:
  + Testing de registro con datos válidos e inválidos.
  + Testing de inicio de sesión con credenciales correctas e incorrectas.
  + Testing de la funcionalidad de cierre de sesión y la gestión de cookies.

* #### Users Testing:
  + Testing de operaciones CRUD con autenticación.
  + Testing de restricciones de acceso basadas en roles.
  + Testing de reglas de validación y gestión de errores.

### Spec Testings:

* #### Auth Service Testing:
  + Testing de la lógica de registro de usuarios.
  + Testing de la autenticación y la generación de tokens.
  + Testing de la gestión de errores para usuarios duplicados y credenciales inválidas.

* #### Auth Controller Testing:
  + Testing de la asignación entre DTO y llamadas de servicio.
  + Testing de la gestión de cookies para tokens de autenticación.
  + Testing del formato correcto de las respuestas.

* #### User Service Testing:
  + Testing de la creación de usuarios con un hash de contraseña adecuado.
  + Testing de la recuperación, actualización y eliminación de usuarios.
  + Testing de reglas de validación y gestión de errores.

* #### Pruebas del controlador de usuarios:
  + Testing del enrutamiento correcto de las solicitudes a los métodos de servicio.
  + Testing del formato de las respuestas según los patrones de interceptor.

### Ejecución de Testings

#### Testing Unitarios:
  + En la consola, ejecutar el comando ```npm run test.```

#### Testing de Extremo a Extremo:
  + En la consola, ejecutar el comando ```npm run test:e2e```