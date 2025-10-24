#!/bin/sh

# docker-entrypoint.sh
# Script de arranque para el contenedor Laravel que garantiza que:
#  - se instalen dependencias (si falta vendor)
#  - exista APP_KEY
#  - las migraciones se ejecuten cuando la DB esté disponible (reintentos)
#  - opcionalmente se ejecuten los seeders si RUN_SEEDERS=true
#
# Ejemplos de uso (desde dentro del contenedor):
# 1) Ejecutar manualmente: /usr/local/bin/docker-entrypoint.sh php artisan migrate --force
# 2) Levantar el servicio en background: docker compose up --build (entrypoint se ejecuta automáticamente)
# 3) Forzar seeders tras migraciones: export RUN_SEEDERS=true && docker compose up --build

# -----------------------------
# Funciones
# -----------------------------

# sync_env_file
# Sincroniza variables importantes desde las variables de entorno al archivo .env
# Ejemplos:
# 1) sync_env_file # actualiza DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD en .env
# 2) export DB_HOST=db; sync_env_file # aplica el valor en .env
# 3) sync_env_file; php artisan migrate --force
sync_env_file() {
    # Asegurarse de que exista .env
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
        else
            touch .env
        fi
    fi

    for var in DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD; do
        # Obtener el valor de la variable de entorno
        val=$(eval "echo \"\$$var\"")
        if [ -n "$val" ]; then
            # Si la variable ya existe en .env, reemplazarla; si no, añadirla
            if grep -q "^$var=" .env 2>/dev/null; then
                sed -i "s/^$var=.*/$var=$val/" .env || true
            else
                echo "$var=$val" >> .env
            fi
        fi
    done
}

# ensure_vendor
# Asegura que la carpeta vendor/autoload.php existe; si no, ejecuta composer install.
# Ejemplos:
# 1) ensure_vendor
# 2) if [ ! -f vendor/autoload.php ]; then ensure_vendor; fi
# 3) ensure_vendor # se puede llamar al inicio del entrypoint
ensure_vendor() {
    if [ ! -f vendor/autoload.php ]; then
        echo "vendor no encontrado. Ejecutando composer install..."
        composer install --no-interaction --prefer-dist --optimize-autoloader || {
            echo "Warning: composer install falló. Continuando y reintentando en runtime si es necesario.";
        }
    else
        echo "vendor encontrado, omitiendo composer install"
    fi
}

# ensure_app_key
# Genera APP_KEY si no existe en .env ni en la configuración de la app.
# Ejemplos:
# 1) ensure_app_key
# 2) export APP_KEY=""; ensure_app_key
# 3) ensure_app_key # sin efectos si ya existe
ensure_app_key() {
    # Si APP_KEY ya está en variables de entorno no hacemos nada
    if [ -n "${APP_KEY:-}" ]; then
        echo "APP_KEY ya está presente en variables de entorno"
        return 0
    fi

    # Si existe .env y contiene APP_KEY con valor distinto, ok
    if [ -f .env ]; then
        KEY_VAL=$(grep '^APP_KEY=' .env | cut -d '=' -f2- || true)
        if [ -n "$KEY_VAL" ]; then
            echo "APP_KEY ya existe en .env"
            return 0
        fi
    fi

    echo "Generando APP_KEY..."
    php artisan key:generate || echo "Warning: no se pudo generar APP_KEY"
}

# run_migrations_with_retry
# Ejecuta las migraciones con reintento hasta que la base de datos responda o se agote el número de intentos.
# Ejemplos:
# 1) run_migrations_with_retry 30 5  # 30 intentos, 5s entre intentos
# 2) run_migrations_with_retry        # usa valores por defecto
# 3) if run_migrations_with_retry; then echo OK; else echo FAIL; fi
run_migrations_with_retry() {
    MAX_TRIES=${1:-30}
    SLEEP_SECONDS=${2:-3}

    ATTEMPT=1
    while [ $ATTEMPT -le $MAX_TRIES ]; do
        echo "Intento de migraciones: $ATTEMPT/$MAX_TRIES"
        # Ejecutar migraciones sin interacción; si falla, esperamos y reintentamos
        php artisan migrate --force && return 0 || true
        echo "Migraciones no disponibles aún, esperando ${SLEEP_SECONDS}s antes de reintentar..."
        sleep $SLEEP_SECONDS
        ATTEMPT=$((ATTEMPT + 1))
    done

    echo "Error: no se pudieron ejecutar las migraciones después de $MAX_TRIES intentos"
    return 1
}

# run_seeders_if_requested
# Ejecuta los seeders si la variable de entorno RUN_SEEDERS es 'true' (case-insensitive)
# Ejemplos:
# 1) RUN_SEEDERS=true run_seeders_if_requested
# 2) export RUN_SEEDERS=true; run_seeders_if_requested
# 3) run_seeders_if_requested # no ejecuta si RUN_SEEDERS no está en 'true'
run_seeders_if_requested() {
    case "${RUN_SEEDERS:-}" in
        "true"|"TRUE"|"1")
            echo "RUN_SEEDERS habilitado: ejecutando db:seed --force"
            php artisan db:seed --force || echo "Warning: seeders fallaron" ;;
        *)
            echo "RUN_SEEDERS no habilitado; omitiendo seeders" ;;
    esac
}

# -----------------------------
# Inicio del entrypoint
# -----------------------------

# Mover al directorio de la aplicación
cd /var/www/html || exit 1

# Sincronizar variables de entorno con .env (por ejemplo DB_HOST=db)
sync_env_file

# Asegurar dependencias y key
ensure_vendor
ensure_app_key

# Intentar ejecutar migraciones (reintentos)
if run_migrations_with_retry 30 3; then
    echo "Migraciones ejecutadas correctamente"
else
    echo "Continuando inicio incluso si las migraciones fallaron";
fi

# Ejecutar seeders si corresponde
run_seeders_if_requested

# Finalmente ejecutar el CMD pasado al contenedor
# Por ejemplo: php artisan serve --host=0.0.0.0 --port=8000
exec "$@"
