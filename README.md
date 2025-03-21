# Challenge de Ingreso a SOTAMIT

## Consigna

### Introducción
Este examen tiene como objetivo determinar tus habilidades en el ámbito del desarrollo. No es totalmente necesario que se completen todos los niveles de desafíos. Se busca abarcar casi todo el proceso de un desarrollo y es posible que no apliquen en su totalidad al cargo que está buscando ingresar, suma que se conozca todo el proceso. El desafío consiste en realizar una pequeña aplicación CRUD de alta de personal, utilizando
NodeJs.

### Desafíos
Nivel 1: Repositorio

Todo el código deberá estar guardado en algún repositorio GIT (teniendo en cuenta buenas
prácticas) junto a la documentación del proyecto. Suma la realización de una estimación en horas de cada tarea.
Recordar indicar que paquetes se utilizaron y todos los pasos necesarios para ejecutar correctamente la aplicación.

Nivel 2: Backend

Desarrollar un servidor donde se exponga una API REST que permita en formato JSON dar una alta, baja, realizar una modificación y traer el listado de empleados.

Cada empleado deberá tener:
- Nombre Completo
- Documento de identidad
- Fecha de nacimiento
- Si es o no desarrollador
- Una breve descripción
- Área a la que pertenece

Recuerda documentar cada endpoint que desarrolles.

Nivel 3: Base de datos

Los datos deberán ser almacenados en una base de datos, indicando en la documentación el porqué de la elección de la base de datos, el DER (Diagrama de Entidad Relación), y las consultas SQL para realizar cada acción y creación de la base.

Nota: Las áreas deberán estar en una tabla aparte.

Nivel 4: Frontend

Desarrollar una página web la cual tenga un formulario de alta de empleados, y otra donde están listados todos los empleados que fueron dados de alta, preferentemente utilizando algún framework moderno (Angular, Vue ó React).

Nivel 5: Testeo automático

Utilizar alguna librería moderna para realizar pruebas unitarias y/o funcionales de todo el código desarrollado.

## Tecnologías utilizadas

* Frontend: Vite. ReactJs. Tailwindcss. Typescript. React-Hook-Form.
* Bakcend: Nestjs. Typecript. MongoDb. Passport-jwt.

### Nota
Para más información sobre los paquetes de instalación y más detalles de cada entorno (frontend/backend) mirar los readme de cada carpeta.