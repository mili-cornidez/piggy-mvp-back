import { Request, Response } from "express";

export const sendAnalyticsEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Verifica que la variable de entorno esté definida
        const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
        const PRIVY_API_KEY = process.env.PRIVY_API_KEY;

        if (!PRIVY_APP_ID || !PRIVY_API_KEY) {
            console.error("❌ Missing Privy credentials in environment variables.");
            res.status(500).json({ error: "Server misconfiguration: missing Privy credentials." });
            return;
        }

        // Validar que el cuerpo de la solicitud tenga los datos requeridos
        const { event_name, client_id } = req.body;
        if (!event_name || !client_id) {
            console.error("❌ Missing required fields: event_name and client_id.");
            res.status(400).json({ error: "Missing required fields: event_name and client_id." });
            return;
        }

        console.log("📡 Sending request to Privy:", req.body);

        const response = await fetch("https://auth.privy.io/api/v1/analytics_events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${PRIVY_API_KEY}`, // 📌 Token de autenticación correcto
                "privy-app-id": PRIVY_APP_ID, // 📌 Ahora sí es el correcto
            },
            body: JSON.stringify({ event_name, client_id }), // ✅ Mandamos solo los campos necesarios
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Privy API Error:", errorText);
            res.status(response.status).json({ error: errorText });
            return;
        }

        const data = await response.json();
        console.log("✅ Privy API Response:", data);
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error communicating with Privy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
