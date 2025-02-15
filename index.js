require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const {authenticate, egoi_input_format} = require('./utils/functions')

async function fetchParticipants() {
    const cookies = await authenticate();
    if (!cookies) return;

    try {
        const { data } = await axios.get(process.env.PARTICIPANTS_API_DB, {
            headers: { Cookie: cookies.join("; ") },
        });

        if (!Array.isArray(data) || data.length < 2) {
            console.log("Nenhum participant encontrado.");
            return;
        }

        const formattedData = egoi_input_format(data)

        const response = await axios.post(process.env.DESTINATION_API, formattedData, {
            headers: {
                "Content-Type": "application/json",
                "Apikey": process.env.EGOI_API_KEY,
            },
        });

        console.log("Dados enviados com sucesso:", response.data);
    } catch (error) {
        console.error("Erro ao buscar ou enviar participants:", error.message);
    }
}

// Agendar a tarefa
cron.schedule(process.env.CHECK_INTERVAL, fetchParticipants);

console.log("Serviço iniciado! Verificando novos registros periodicamente...");