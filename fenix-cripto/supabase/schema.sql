-- ==========================================
-- FENIXCRIPTO: ESQUEMA DE BASE DE DATOS (Supabase)
-- ==========================================

-- 1. Extensiones necesarias
-- Habilitamos pgcrypto para poder manejar encriptación como bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tipos de datos personalizados (Enums)
CREATE TYPE nivel_usuario AS ENUM ('Bronce', 'Plata', 'Fenix');
CREATE TYPE estado_click AS ENUM ('PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'SOSPECHOSO');

-- 3. Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correo TEXT UNIQUE NOT NULL,
    -- Contraseña encriptada, lista para usar con crypt(contrasena, gen_salt('bf'))
    contrasena_encriptada TEXT NOT NULL,
    nivel nivel_usuario DEFAULT 'Bronce',
    saldo NUMERIC(10, 4) DEFAULT 0.0000 CHECK (saldo >= 0),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Anuncios (Directorio PTC)
CREATE TABLE anuncios_directorio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_plataforma TEXT NOT NULL,
    url_afiliado TEXT NOT NULL,
    tiempo_requerido_segundos INT NOT NULL CHECK (tiempo_requerido_segundos > 0),
    recompensa_asignada NUMERIC(10, 4) NOT NULL CHECK (recompensa_asignada >= 0),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Historial de Clicks (Interacciones de los usuarios)
CREATE TABLE historial_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    anuncio_id UUID NOT NULL REFERENCES anuncios_directorio(id) ON DELETE CASCADE,
    timestamp_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    timestamp_fin TIMESTAMPTZ,
    estado_validacion estado_click DEFAULT 'PENDIENTE',
    recompensa_ganada NUMERIC(10, 4) DEFAULT 0.0000
);

-- 6. Tabla de Retiros
CREATE TABLE historial_retiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    monto NUMERIC(10, 4) NOT NULL CHECK (monto > 0),
    fecha TIMESTAMPTZ DEFAULT NOW(),
    estado TEXT DEFAULT 'COMPLETADO'
);

-- ==========================================
-- LÓGICA DE SEGURIDAD (RESTRICCIÓN DE RETIROS)
-- ==========================================

-- Función que valida el límite de $1 USD diario (Reinicio a la medianoche) y descuenta el saldo automáticamente
CREATE OR REPLACE FUNCTION validar_limite_retiro_diario()
RETURNS TRIGGER AS $$
DECLARE
    total_retirado_hoy NUMERIC(10, 4);
    saldo_actual NUMERIC(10, 4);
BEGIN
    -- Validar que no intenten retirar montos negativos o en cero
    IF NEW.monto <= 0 THEN
        RAISE EXCEPTION 'El monto de retiro debe ser mayor a cero. Intentaste retirar: $%', NEW.monto;
    END IF;

    -- Verificar saldo actual del usuario (Bloqueo FOR UPDATE contra condiciones de carrera)
    SELECT saldo INTO saldo_actual FROM usuarios WHERE id = NEW.usuario_id FOR UPDATE;
    
    IF saldo_actual IS NULL OR saldo_actual < NEW.monto THEN
        RAISE EXCEPTION 'Saldo insuficiente para realizar el retiro de $%. Saldo actual: $%', NEW.monto, saldo_actual;
    END IF;

    -- JUGADA MAESTRA: Calcular el total retirado hoy desde las 00:00 AM (Día Calendario)
    SELECT COALESCE(SUM(monto), 0) INTO total_retirado_hoy
    FROM historial_retiros
    WHERE usuario_id = NEW.usuario_id
      AND fecha >= CURRENT_DATE; -- Filtra solo los retiros del día de hoy

    -- Verificar si el nuevo retiro superaría el límite de $1.00 USD
    IF (total_retirado_hoy + NEW.monto) > 1.0000 THEN
        RAISE EXCEPTION 'Límite de retiro diario superado: El límite es de $1.00 USD por día y se reinicia a la medianoche. Ya has retirado $%, intentas retirar $%', total_retirado_hoy, NEW.monto;
    END IF;

    -- Si pasa las reglas, se descuenta el saldo automáticamente
    UPDATE usuarios SET saldo = saldo - NEW.monto WHERE id = NEW.usuario_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que dispara la validación antes de registrar el retiro en historial_retiros
CREATE OR REPLACE TRIGGER trigger_validar_retiro
BEFORE INSERT ON historial_retiros
FOR EACH ROW EXECUTE FUNCTION validar_limite_retiro_diario();
