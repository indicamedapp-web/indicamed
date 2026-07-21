# Conectar IndicaMed v6 con Supabase

Esta versión incorpora cuentas con correo y contraseña y guarda el perfil y el historial en la nube.

## 1. Crear proyecto
1. Entra a Supabase y crea un proyecto gratuito.
2. Espera a que finalice la creación.

## 2. Crear la tabla
1. Abre `SQL Editor`.
2. Crea una consulta nueva.
3. Copia todo el contenido de `SUPABASE-SETUP.sql`.
4. Presiona `Run`.

## 3. Copiar las claves públicas
1. En Supabase abre `Project Settings` → `API`.
2. Copia `Project URL`.
3. Copia la clave pública `anon` o `publishable`.

Abre `config.js` y reemplaza:

- `PEGA_AQUI_LA_URL_DE_SUPABASE`
- `PEGA_AQUI_LA_CLAVE_PUBLICA_ANON`

La clave pública puede estar en el navegador porque la privacidad real está protegida por las políticas RLS de la tabla. No uses nunca la clave `service_role`.

## 4. Configurar el correo
En `Authentication` → `URL Configuration`:
- Site URL: `https://indicamed.vercel.app`
- Redirect URL permitida: `https://indicamed.vercel.app/**`

Para una prueba sencilla con solo dos usuarios, puedes desactivar temporalmente la confirmación de correo desde `Authentication` → `Providers` → `Email`. Si queda activada, cada usuario deberá confirmar su correo antes de entrar.

## 5. Publicar
Sube todos los archivos de esta carpeta al repositorio GitHub y espera el despliegue de Vercel.

## Resultado
Cada médico podrá crear su propia cuenta. Su perfil y sus órdenes quedarán separados y se cargarán al iniciar sesión desde cualquier dispositivo.
