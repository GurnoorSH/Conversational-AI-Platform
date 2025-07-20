const API_URL = "http://127.0.0.1:8000";

export const getSessionId = async (): Promise<string | null> => {
    try {
        const response = await fetch(`${API_URL}/generate-session`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.session_id;
    } catch (error) {
        console.error("Error fetching session ID:", error);
        return null;
    }
};

export const sendMessageToBot = async (message: string, sessionId: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message, session_id: sessionId }),
        });
        if (!response.ok) throw new Error('Chat API response was not ok');
        const data = await response.json();
        return data.response_text;
    } catch (error) {
        console.error("Error sending message:", error);
        return "Sorry, something went wrong on our end.";
    }
};