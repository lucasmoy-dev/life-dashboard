/**
 * Gemini Service - Handles AI interactions using Google Generative AI
 */
export class GeminiService {
    static getApiKey() {
        return localStorage.getItem('db_gemini_api_key');
    }

    static setApiKey(key) {
        localStorage.setItem('db_gemini_api_key', key);
    }

    static hasKey() {
        return !!this.getApiKey();
    }

    /**
     * Analyzes an image of food to detect calories and dish name
     * @param {File} imageFile 
     */
    static async analyzeFood(imageFile) {
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error('Se requiere una API Key de Gemini en Configuración.');

        // Convert file to base64
        const base64Image = await this.fileToBase64(imageFile);
        const data = base64Image.split(',')[1];
        const mimeType = imageFile.type;

        const prompt = `Identify the food in this image. 
        Provide the name of the dish and the approximate total calories for a standard portion.
        Return ONLY a JSON object like this: {"name": "Dish Name", "calories": 500}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: data
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Error al conectar con Gemini AI');
            }

            const result = await response.json();
            const textResponse = result.candidates[0].content.parts[0].text;
            return JSON.parse(textResponse);
        } catch (e) {
            console.error('[Gemini] Analysis failed:', e);
            throw e;
        }
    }

    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}
