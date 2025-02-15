const axios = require("axios");

const egoi_input_format = (data) => {
    return {
        mode: "update",
        compare_field: "email",
        contacts: data.map(participant => ({
            base: {
                status: "active",
                first_name: participant.first_name || "",
                last_name: participant.last_name || "",
                birth_date: null,
                language: participant.extra.language == "English" ? "en" : "pt",
                email: participant.email || "",
                cellphone: null,
                phone: null,
                push_token_android: [],
                push_token_ios: [],
            },
            extra: [{
                field_id : process.env.EGOI_COMPANY_FIELD_ID,
                value : participant.extra.company
            },
            {
                field_id : process.env.EGOI_POSITION_FIELD_ID,
                value : participant.extra.position
            },
            {
                field_id : process.env.EGOI_REGISTRATION_FIELD_ID,
                value : participant.extra.registration
            },
            {
                field_id : process.env.EGOI_PASSWORD_FIELD_ID,
                value : participant.password
            }],
        })),
    };
}

const authenticate = async () => {
    try {
        const response = await axios.post(process.env.PARTICIPANTS_API_SESSION, {
            email: process.env.PARTICIPANTS_API_EMAIL,
            password: process.env.PARTICIPANTS_API_PASSWORD,
        }, { withCredentials: true });

        const cookies = response.headers["set-cookie"];

        if (!cookies) throw new Error("Autenticação falhou, nenhum cookie recebido.");

        console.log("Autenticado com sucesso!");
        return cookies;
    } catch (error) {
        console.error("Erro ao autenticar:", error.message);
        return null;
    }
}

module.exports = {
    egoi_input_format,
    authenticate
}