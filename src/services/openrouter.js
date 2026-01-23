// Leer la API key directamente de process.env en cada llamada
// para evitar problemas de timing con dotenv
const getApiKey = () => process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

const systemPrompt = `Eres un experto en películas que sabe absolutamente todo de ellas. 
Nunca inventas información, sino que solamente te basas en datos de fuentes oficiales.
Sabes incluso anécdotas muy rebuscadas y prefieres contar las que sean más graciosas. 
El usuario te preguntará por anécdotas de cierta película y siempre responderás en formato JSON y nada más.
El ejemplo JSON del cuál te basarás para todas tus respuestas, siempre será: {"anecdotes":["anecdote1","anecdote2","anecdote3"]}.
Cada anécdota siempre tendrá como MAXIMO 50 palabras y nada más.`

function buildPrompt(movie) {
    return `Para esta película, proporciona: 3 anécdotas del rodaje (cada una de máximo 50 palabras).
Película: ${movie.title} - (${movie.year})
Responde SOLO en JSON con la estructura que conoces`;
}


export async function enrichMovie(movie) {
    const apiKey = getApiKey();
    if (!apiKey) {
        movie.anecdotes = [];
        return movie;
    }
    const prompt = buildPrompt(movie);
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
            }),
        });

        const data = await response.json();
        console.log("data", data);
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);

        movie.anecdotes = parsed.anecdotes;
        return movie;

    } catch (error) {
        console.error(error);
    }

}