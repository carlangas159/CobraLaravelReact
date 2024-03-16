
# Laravel

Se requiere levantar el server en laravel y el front en React, React consumira los datos desde laravel.

Para laravel, en una consola, entrar en la carpeta Laravel con `cd Laravel`, instalar mediante `composer install`,

Generar la key del app ejecutando `php artisan env:encrypt`

Recorar cambiar los datos de conexion a la db en el `.env`

`DB_CONNECTION=mysql`

`DB_HOST=127.0.0.1`

`DB_PORT=3306`

`DB_DATABASE=laravel`

`DB_USERNAME=root`

`DB_PASSWORD=`


Generar las migraciones `php artisan migrate`

Generar los datos falsos  `php artisan db:seed`

y luego ejecutar serve mediante `php artisan serve`

# React

Para React, en una consola, entrar en la carpeta React con `cd React`

instalar los paquetes necesarios `npm install`

y luego ejecutar dev mediante `npm run dev`

# Api

La coleccion de postman es Api_collection.json. se debe configurar la variable global {{server}} por http://localhost:8000, para consumir datos, se requiere estar loguead por lo que debes loguearte y obtener el token

el token tambien se configura por la variable glboal {{bearerToken}} por lo que solo se debe ajustar una vez

# Otros

En produccion se genera el archivo mediante `npm run build` y se coloca en la carpeta public correspondiente.
Actualmente no disponible


