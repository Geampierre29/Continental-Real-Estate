import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

/* ==========================================================
CONFIGURACIÓN
========================================================== */

dotenv.config();

const app = express();

const PORT =
process.env.PORT || 3000;

const __filename =
fileURLToPath(import.meta.url);

const __dirname =
path.dirname(__filename);

/* ==========================================================
OPENAI
========================================================== */

if (!process.env.OPENAI_API_KEY) {

```
console.error(
    "ERROR: Falta OPENAI_API_KEY en el archivo .env"
);

process.exit(1);
```

}

const openai =
new OpenAI({

```
    apiKey:
        process.env.OPENAI_API_KEY

});
```

/* ==========================================================
MIDDLEWARE
========================================================== */

app.use(
cors()
);

app.use(
express.json({
limit: "50kb"
})
);

/*

* Servimos todos los archivos de la página.
  */

app.use(
express.static(__dirname)
);

/* ==========================================================
PERSONALIDAD DE MR. CONTI
========================================================== */

const MR_CONTI_INSTRUCTIONS = `

Eres Mr. Conti, el asistente virtual oficial de
Continental Real Estate.

Tu función es atender visitantes de la página web,
ayudarlos a identificar qué tipo de propiedad necesitan
y guiarlos hacia el siguiente paso comercial.

PERSONALIDAD:

* Eres profesional.
* Eres amable.
* Eres elegante.
* Eres cercano.
* Hablas en español.
* Tu tono es natural y humano.
* No eres excesivamente formal.
* No utilizas respuestas robóticas.
* Puedes utilizar emojis ocasionalmente, sin abusar.

TU IDENTIDAD:

Tu nombre es Mr. Conti.

Representas a Continental Real Estate.

No digas que eres ChatGPT.

No digas que eres una inteligencia artificial salvo que
el visitante pregunte directamente.

Si preguntan quién eres, responde que eres Mr. Conti,
el asistente virtual de Continental Real Estate.

OBJETIVO COMERCIAL:

Tu objetivo principal es ayudar al visitante.

Nunca debes presionar agresivamente al usuario.

Cuando sea apropiado, identifica:

* Si quiere comprar.
* Si quiere vender.
* Si quiere alquilar.
* Si quiere invertir.
* Distrito o ubicación.
* Presupuesto.
* Tipo de propiedad.
* Número de habitaciones.
* Número de baños.
* Metraje aproximado.
* Si necesita financiamiento.
* Si busca para vivir o invertir.

No necesitas preguntar todo de golpe.

Haz preguntas de forma natural,
una o dos por vez.

IMPORTANTE:

No inventes propiedades.

No inventes precios.

No inventes disponibilidad.

No inventes direcciones.

No inventes promociones.

No inventes características que no hayan sido
proporcionadas por Continental Real Estate.

Actualmente todavía no tienes acceso automático
al inventario completo de propiedades.

Si el usuario pide propiedades concretas,
puedes indicarle que puedes ayudarlo a definir
lo que busca y dirigirlo al buscador de propiedades
o a un asesor.

Cuando sea conveniente, puedes recomendar:

"Si quieres, puedo ayudarte a definir exactamente
qué propiedad buscas y luego puedes revisar las
opciones disponibles en nuestro buscador."

CONTACTO:

Si el usuario quiere hablar con un asesor humano,
puedes indicarle que puede hacerlo mediante WhatsApp.

No inventes números de teléfono distintos
a los proporcionados por la empresa.

CONTEXTO:

Mantén el contexto de la conversación.

Si el usuario dice:

"ese presupuesto"

"el primero"

"en Barranco"

"para alquilar"

etc., interpreta el mensaje según
la conversación anterior.

RESPUESTAS:

Sé conciso.

Normalmente responde entre 2 y 5 frases.

Si necesitas hacer una pregunta,
hazla claramente.

No utilices listas enormes salvo que
realmente sean necesarias.

`;

/* ==========================================================
ENDPOINT DEL CHAT
========================================================== */

app.post(
"/api/chat",
async (req, res) => {

```
    try {

        const messages =
            req.body?.messages;


        /*
         * Validación básica.
         */

        if (
            !Array.isArray(messages)
        ) {

            return res.status(400).json({

                message:
                    "La conversación enviada no es válida."

            });

        }


        /*
         * Limitamos el tamaño de la conversación
         * que llega al servidor.
         */

        const safeMessages =
            messages
                .filter(message => {

                    return (
                        message &&
                        (
                            message.role === "user" ||
                            message.role === "assistant"
                        ) &&
                        typeof message.content === "string"
                    );

                })
                .slice(-20);


        if (
            safeMessages.length === 0
        ) {

            return res.status(400).json({

                message:
                    "No se recibió ningún mensaje."

            });

        }


        /* ==================================================
           LLAMADA A OPENAI
        ================================================== */

        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                instructions:
                    MR_CONTI_INSTRUCTIONS,

                input:
                    safeMessages.map(message => ({

                        role:
                            message.role,

                        content:
                            message.content

                    })),

                max_output_tokens:
                    500

            });


        const answer =
            response.output_text?.trim();


        if (!answer) {

            throw new Error(
                "La API no devolvió texto."
            );

        }


        /*
         * Respuesta al navegador.
         */

        res.json({

            message:
                answer

        });


    } catch (error) {

        console.error(
            "Error OpenAI:",
            error
        );


        res.status(500).json({

            message:
                "No pude conectarme con el servicio de IA."

        });

    }

}
```

);

/* ==========================================================
RUTA PRINCIPAL
========================================================== */

app.get(
"/",
(req, res) => {

```
    res.sendFile(
        path.join(
            __dirname,
            "asistente.html"
        )
    );

}
```

);

/* ==========================================================
SERVIDOR
========================================================== */

app.listen(
PORT,
() => {

```
    console.log(
        `Mr. Conti funcionando en http://localhost:${PORT}`
    );

}
```

);
