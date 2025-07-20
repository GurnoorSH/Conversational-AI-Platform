import os
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from google.cloud.dialogflowcx_v3beta1.services import sessions
from google.cloud.dialogflowcx_v3beta1.types import session

# Load environment variables from .env file
load_dotenv()
from google.auth import default
creds, project = default()
print("Using credentials for:", creds.service_account_email)
app = FastAPI(debug=True)

# --- CORS Middleware ---
# This is crucial for allowing your frontend JavaScript
# to communicate with this backend.
origins = ["*"]  # In production, restrict this to your frontend's domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Data Validation ---
class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response_text: str

# --- Dialogflow CX Configuration ---
# You need to find these values in your Dialogflow CX agent's settings
# PROJECT_ID = "GCP Project ID"  # Replace with your actual GCP Project ID
# AGENT_ID = "your-dialogflow-cx-agent-id" 

PROJECT_ID = "105729787359757292742"
LOCATION = "global"  # Or your chosen location
AGENT_ID = "4107faee-049a-409d-8257-0f6005ef1e3c"



@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    """
    Receives a message from the user, sends it to Dialogflow CX,
    and returns the bot's response.
    """
    session_id = request.session_id
    text_input = request.message
    
    # The session path is critical for Dialogflow to maintain conversation state
    session_path = f"projects/{PROJECT_ID}/locations/{LOCATION}/agents/{AGENT_ID}/sessions/{session_id}"

    # Create the session client
    session_client = sessions.SessionsAsyncClient(
        client_options={"api_endpoint": f"{LOCATION}-dialogflow.googleapis.com"}
    )

    # Construct the query request
    query_input = session.QueryInput(
        text=session.TextInput(text=text_input),
        language_code="en",  # Or your desired language
    )
    request = session.DetectIntentRequest(
        session=session_path, query_input=query_input
    )
    
    # Get the response from Dialogflow
    response = await session_client.detect_intent(request=request)
    
    # Extract the response text
    response_messages = [
        " ".join(msg.text.text) for msg in response.query_result.response_messages
    ]
    bot_response_text = " ".join(response_messages)

    return ChatResponse(response_text=bot_response_text)

@app.get("/generate-session")
async def generate_session_id():
    """Generates a unique session ID for a new conversation."""
    return {"session_id": str(uuid.uuid4())}


# import os
# import uuid
# from dotenv import load_dotenv
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# from google.cloud.dialogflowcx_v3beta1.services import sessions as cx_sessions
# from google.cloud.dialogflowcx_v3beta1.types import session as cx_session

# # Load .env into os.environ
# load_dotenv()

# # Read required settings from environment
# PROJECT_ID = os.getenv("GCP_PROJECT_ID", "105729787359757292742")
# LOCATION = os.getenv("DIALOGFLOW_LOCATION", "global")
# AGENT_ID = os.getenv("DIALOGFLOW_AGENT_ID", "4107faee-049a-409d-8257-0f6005ef1e3c")

# app = FastAPI()

# # --- CORS ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Lock this down in production!
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Request / Response models ---
# class ChatRequest(BaseModel):
#     message: str
#     session_id: str

# class ChatResponse(BaseModel):
#     response_text: str

# @app.post("/chat", response_model=ChatResponse)
# async def chat_with_bot(chat_req: ChatRequest):
#     """
#     Receives a message, sends it to Dialogflow CX, returns the bot’s reply.
#     """
#     session_id = chat_req.session_id
#     text_input = chat_req.message

#     session_path = (
#         f"projects/{PROJECT_ID}/locations/{LOCATION}"
#         f"/agents/{AGENT_ID}/sessions/{session_id}"
#     )

#     client = cx_sessions.SessionsAsyncClient(
#         client_options={"api_endpoint": f"{LOCATION}-dialogflow.googleapis.com"}
#     )

#     query_input = cx_session.QueryInput(
#         text=cx_session.TextInput(text=text_input),
#         language_code="en",
#     )
#     detect_req = cx_session.DetectIntentRequest(
#         session=session_path,
#         query_input=query_input,
#     )

#     response = await client.detect_intent(request=detect_req)

#     # Join all textual response messages into a single string
#     texts = [msg.text.text for msg in response.query_result.response_messages]
#     flat = [t for sub in texts for t in sub]
#     bot_text = " ".join(flat).strip()

#     return ChatResponse(response_text=bot_text)

# @app.get("/generate-session")
# async def generate_session_id():
#     """Creates a new UUID to use as a Dialogflow CX session."""
#     return {"session_id": str(uuid.uuid4())}


# if __name__ == "__main__":
#     # Only runs when you do: python main.py
#     import uvicorn
#     uvicorn.run(
#         "main:app",
#         host="127.0.0.1",
#         port=8000,
#         reload=True,      # Enables auto‑reload
#         log_level="info"
#     )
