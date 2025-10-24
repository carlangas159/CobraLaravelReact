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

# Docker (Dockerización mínima)

Se han añadido los archivos mínimos para dockerizar el proyecto:

- `docker-compose.yml` (define servicios: db, laravel, react)
- `Laravel/Dockerfile` (imagen base PHP + Composer, expone puerto 8000)
- `React/Dockerfile` (imagen Node, expone puerto 5173)
- `.dockerignore` (excluye node_modules, vendor y .env)

Puertos expuestos por defecto:

- Laravel: 8000 -> http://localhost:8000
- React (Vite): 5173 -> http://localhost:5173
- MySQL: 3306 -> localhost:3306

Notas importantes sobre la configuración de la base de datos:

- El servicio de MySQL está configurado en `docker-compose.yml` con:
  - Usuario: `root`
  - Contraseña: `root`
  - Base de datos: `laravel`
- Dentro de los contenedores la configuración del host debe apuntar a `DB_HOST=db`.
- Si utilizas el archivo `.env` en la raíz de `Laravel`, asegúrate de actualizar las variables:

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root
```

Comandos básicos (desde la raíz del proyecto en Windows `cmd.exe`):

- Construir y levantar todos los servicios:

```
docker compose up --build
```

- Levantar en background (detached):

```
docker compose up -d --build
```

- Ver logs de un servicio (ej. laravel):

```
docker compose logs -f laravel
```

- Ejecutar comandos de Artisan dentro del contenedor laravel (cuando está en ejecución):

```
docker compose exec laravel php artisan migrate --seed
```

Si el contenedor `laravel` no está corriendo y quieres ejecutar un comando puntual:

```
docker compose run --rm laravel php artisan key:generate
```

- Instalar dependencias de Composer dentro del contenedor (si falta `vendor`):

```
docker compose run --rm laravel composer install --no-interaction --prefer-dist --optimize-autoloader
```

- Instalar dependencias de Node para React dentro del contenedor:

```
docker compose run --rm react npm install
```

Notas y recomendaciones:

- Debido al `volume` montado para `Laravel`, la carpeta `vendor` puede no existir en la máquina host. Si ocurre, ejecuta `composer install` dentro del contenedor (ver comando arriba).
- Ejecuta `php artisan storage:link` dentro del contenedor si tu app lo requiere:

```
docker compose exec laravel php artisan storage:link
```

- Si cambias los Dockerfiles o `docker-compose.yml`, ejecuta `docker compose up --build` para reconstruir las imágenes.

- Si tienes problemas con permisos en Linux o WSL, ajusta los permisos de `storage` y `bootstrap/cache` en el contenedor o en la máquina host.

- La colección de Postman `Api_collection.json` puede usar `http://localhost:8000` como `{{server}}` y el token de autenticación si corresponde.

Ejemplo de flujo recomendado después de levantar los contenedores:

1. `docker compose up -d --build`
2. `docker compose exec laravel php artisan key:generate`
3. Edita `Laravel/.env` (o copia desde `.env.example`) y asegúrate de las credenciales para `db`.
4. `docker compose exec laravel composer install` (si es necesario)
5. `docker compose exec laravel php artisan migrate --seed`
6. Abrir `http://localhost:5173` para el front y `http://localhost:8000` para el backend.

Si quieres que ajuste alguna variable (por ejemplo usar otra contraseña para MySQL) o prefieres usar `postgres` en lugar de `mysql`, dímelo y lo adapto.

# Otros

En produccion se genera el archivo mediante `npm run build` y se coloca en la carpeta public correspondiente.
Actualmente no disponible
