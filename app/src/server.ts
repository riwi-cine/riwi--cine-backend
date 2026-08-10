// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
 */
import express from "express";
import path from "path"; //se importo path para poder usar el metodo join(sirve para concatenar rutas para leer archivos)
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import currencyRoutes from "./routes/currency.routes";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // leera los archivos que estan en la carpeta public

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/currencies", currencyRoutes);

app.get("/api/docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/health", (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

export default app;
