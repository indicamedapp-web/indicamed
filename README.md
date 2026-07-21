# IndicaMed v1

Prototipo funcional para emitir indicaciones de exámenes y procedimientos desde un celular o computador.

## Incluye
- Perfil del médico: nombre, especialidad, RUT, Registro SIS, correo, teléfono, dirección, firma y logo opcional.
- Datos básicos del paciente.
- Órdenes con varios exámenes o procedimientos.
- Observaciones clínicas y preparación.
- Vista previa e impresión/guardado como PDF.
- Historial local.
- Instalación como PWA.

## Importante
Esta versión guarda todo únicamente en el dispositivo mediante almacenamiento local. Es para pruebas y validación del producto, no para datos reales de pacientes. Antes de uso clínico se necesita autenticación, servidor seguro, cifrado, auditoría, respaldo y revisión legal.

## Archivos para GitHub
Sube directamente todos los archivos que están dentro de esta carpeta. No subas el ZIP.


## Versión 4 — Solo firma
- La firma digital aparece encima del nombre del profesional.
- El timbre dejó de mostrarse en las órdenes y PDF.
- Se corrigió la firma con fondo transparente.
- Se actualizó la caché de la PWA para reflejar los cambios.


## Versión 4.1 — Impresión corregida
- Se corrigió la impresión en blanco desde la vista previa.
- La orden se imprime en formato A4.
- Se conserva la firma encima del nombre y no se muestra el timbre.


## Versión 4.2 — Botón Guardar corregido
- Se eliminaron referencias a campos de firma y timbre que ya no existen.
- El botón “Guardar y continuar” vuelve a funcionar.
- Se conserva la firma fija encima del nombre del médico.


## Versión 5.0 — Diseño clínico institucional

- Nueva orden médica con apariencia institucional y formato A4.
- Encabezado sobrio con logo de IndicaMed o logo de consulta.
- Datos del paciente organizados en una ficha clínica.
- Exámenes y procedimientos presentados con casillas.
- Observaciones y preparación en bloques diferenciados.
- Firma digitalizada sobre los datos profesionales.
- Sin fotografía del médico y sin timbre.
- Pie de verificación y número de orden.
- Se mantienen las funciones ya existentes.


## Versión 6.0 — Cuentas y almacenamiento en la nube

- Registro con correo y contraseña.
- Inicio y cierre de sesión.
- Perfil e historial sincronizados entre dispositivos.
- Datos separados por cuenta mediante Row Level Security.
- Preparado para dos o más médicos.
- Requiere crear un proyecto gratuito en Supabase y completar `config.js`.
