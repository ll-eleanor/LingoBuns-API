import os
import signal
import threading
from dotenv import load_dotenv

from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

load_dotenv()

agent_id = os.getenv("AGENT_ID")
api_key = os.getenv("ELEVENLABS_API_KEY")

elevenlabs = ElevenLabs(api_key=api_key)


conversation = Conversation(
    # API client and agent ID.
    elevenlabs,
    agent_id,

    # Assume auth is required when API_KEY is set.
    requires_auth=bool(api_key),

    # Use the default audio interface.
    audio_interface=DefaultAudioInterface(),

    # Simple callbacks that print the conversation to the console.
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),

    # latency measurements.
    # callback_latency_measurement=lambda latency: print(f"Latency: {latency}ms"),
)

conversation_id = None
session_ended = threading.Event()

# Function to wait for session end in a separate thread
def wait_for_end():
    global conversation_id
    try:
        conversation_id = conversation.wait_for_session_end()
        print(f"Conversation ID: {conversation_id}")
    except Exception as e:
        error_msg = str(e)
        # Check for quota limit errors
        if "quota limit" in error_msg.lower() or "1002" in error_msg:
            print("\n⚠️  Quota limit exceeded. The conversation has been ended.")
        elif "ConnectionClosed" in str(type(e).__name__):
            print("\n⚠️  Connection closed. The conversation has been ended.")
        else:
            print(f"Error waiting for session end: {e}")
    finally:
        session_ended.set()

# Start the conversation session
conversation.start_session()
print("Conversation started. Press Ctrl+C to stop.")


# Start waiting for session end in a separate thread
wait_thread = threading.Thread(target=wait_for_end, daemon=True)
wait_thread.start()

# Main thread waits for KeyboardInterrupt or session to end naturally
try:
    # Wait for either KeyboardInterrupt or session to end
    while not session_ended.is_set():
        session_ended.wait(timeout=0.1)
except KeyboardInterrupt:
    print("\nStopping conversation...")
    try:
        conversation.end_session()
    except Exception as e:
        # Handle audio stream timeout or other errors during shutdown
        if "timeout" in str(e).lower() or "timed out" in str(e).lower():
            print("Note: Audio stream stopped with timeout (this is usually harmless)")
        else:
            print(f"Error during shutdown: {e}")
    # Wait for the thread to finish
    wait_thread.join(timeout=2)
    if conversation_id:
        print(f"Conversation ID: {conversation_id}")
except Exception as e:
    print(f"Error: {e}")
    try:
        conversation.end_session()
    except Exception as shutdown_error:
        # Silently handle shutdown errors (often timeout issues with audio stream)
        if "timeout" not in str(shutdown_error).lower():
            print(f"Shutdown error: {shutdown_error}")
    wait_thread.join(timeout=2)