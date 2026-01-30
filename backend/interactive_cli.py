#!/usr/bin/env python3
"""
Interactive CLI for testing CBC AI Tutor Backend
"""
import requests
import json
import sys
from datetime import datetime

BASE_URL = "http://localhost:8000"
conversation_id = None


def print_header():
    print("\n" + "="*70)
    print("🎓 CBC AI Tutor - Interactive CLI Test")
    print("="*70)
    print("Commands:")
    print("  quit/exit  - Exit the program")
    print("  clear      - Start new conversation")
    print("  history    - Show conversation history")
    print("  subjects   - List supported subjects")
    print("  grades     - List supported grades")
    print("  Or just type your question!")
    print("="*70 + "\n")


def get_subjects():
    """Get list of supported subjects"""
    try:
        response = requests.get(f"{BASE_URL}/api/subjects")
        data = response.json()
        return data.get("subjects", [])
    except Exception as e:
        print(f"Error: {e}")
        return []


def get_grades():
    """Get list of supported grades"""
    try:
        response = requests.get(f"{BASE_URL}/api/grades")
        data = response.json()
        return data.get("grades", [])
    except Exception as e:
        print(f"Error: {e}")
        return []


def get_conversation_history(conv_id):
    """Get conversation history"""
    try:
        response = requests.get(f"{BASE_URL}/api/chat/{conv_id}")
        data = response.json()
        return data
    except Exception as e:
        print(f"Error: {e}")
        return None


def send_message(message, subject="Mathematics", grade=8):
    """Send message to AI tutor"""
    global conversation_id
    
    try:
        payload = {
            "message": message,
            "subject": subject,
            "grade": grade
        }
        
        if conversation_id:
            payload["conversation_id"] = conversation_id
        
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            
            # Store conversation ID
            if not conversation_id:
                conversation_id = data.get("conversation_id")
            
            return data
        else:
            error = response.json()
            print(f"❌ Error: {error.get('error', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None


def display_response(data):
    """Display AI tutor response nicely"""
    if not data:
        return
    
    print("\n" + "-"*70)
    print(f"📚 Subject: {data.get('subject', 'N/A')}")
    print(f"🎯 Grade: {data.get('grade', 'N/A')}")
    print("-"*70)
    print("\n🤖 AI Tutor Response:")
    print(data.get("message", ""))
    print("\n💡 Suggested Follow-up:")
    print(f"   {data.get('suggested_followup', 'Ask me anything!')}")
    print("-"*70)
    print(f"✅ Conversation ID: {data.get('conversation_id')}")
    print()


def main():
    """Main interactive loop"""
    print_header()
    
    # Get supported values
    subjects = get_subjects()
    grades = get_grades()
    
    if not subjects:
        subjects = ["Mathematics", "English", "Science", "Social Studies", "ICT"]
    if not grades:
        grades = [6, 7, 8, 9]
    
    current_subject = "Mathematics"
    current_grade = 8
    
    while True:
        try:
            # Get user input
            print(f"📖 Current: {current_subject} (Grade {current_grade})")
            user_input = input("\n📝 You: ").strip()
            
            if not user_input:
                continue
            
            # Handle commands
            if user_input.lower() in ["quit", "exit"]:
                print("\n👋 Goodbye!")
                sys.exit(0)
            
            elif user_input.lower() == "clear":
                conversation_id = None
                print("✅ Conversation cleared. Starting fresh.")
                continue
            
            elif user_input.lower() == "history":
                if conversation_id:
                    history = get_conversation_history(conversation_id)
                    if history:
                        print(f"\n📜 Conversation History ({len(history.get('messages', []))} messages):")
                        for msg in history.get("messages", []):
                            role = "👤 You" if msg["role"] == "user" else "🤖 AI"
                            print(f"\n{role}:\n{msg['content']}")
                    continue
                else:
                    print("❌ No active conversation")
                    continue
            
            elif user_input.lower() == "subjects":
                print(f"\n📚 Supported Subjects: {', '.join(subjects)}")
                continue
            
            elif user_input.lower() == "grades":
                print(f"\n🎯 Supported Grades: {', '.join(map(str, grades))}")
                continue
            
            elif user_input.lower().startswith("subject:"):
                new_subject = user_input.replace("subject:", "").strip()
                if new_subject in subjects:
                    current_subject = new_subject
                    print(f"✅ Subject changed to: {current_subject}")
                else:
                    print(f"❌ Invalid subject. Choose from: {', '.join(subjects)}")
                continue
            
            elif user_input.lower().startswith("grade:"):
                try:
                    new_grade = int(user_input.replace("grade:", "").strip())
                    if new_grade in grades:
                        current_grade = new_grade
                        print(f"✅ Grade changed to: {current_grade}")
                    else:
                        print(f"❌ Invalid grade. Choose from: {grades}")
                except ValueError:
                    print("❌ Invalid grade format")
                continue
            
            # Send message
            print("\n⏳ Processing...")
            response = send_message(user_input, current_subject, current_grade)
            
            if response:
                display_response(response)
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ Error: {e}")
            continue


if __name__ == "__main__":
    try:
        # Check if server is running
        requests.get(f"{BASE_URL}/health", timeout=2)
        main()
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("Make sure the server is running:")
        print("  cd /home/mightpush/somaLeo/backend")
        print("  python -m uvicorn main:app --reload")
        sys.exit(1)
