// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
 */
import cookieParser from "cookie-parser";
import express from "express";
import path from "path"; //se importo path para poder usar el metodo join(sirve para concatenar rutas para leer archivos)
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import authRoutes from "./routes/auth.routes";
import currencyRoutes from "./routes/currency.routes";
import countryRoutes from "./routes/locations.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // leera los archivos que estan en la carpeta public
app.use(cookieParser());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/countries", countryRoutes);

app.get("/api/docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
});

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/health", (req, res) => {
    res.status(200).json({ message: "Healthy" });
});

export default app;
