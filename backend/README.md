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