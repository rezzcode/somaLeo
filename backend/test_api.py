"""
Test script to verify API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    print("\n🏥 Testing Health Endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_info():
    """Test info endpoint"""
    print("\nℹ️ Testing Info Endpoint...")
    response = requests.get(f"{BASE_URL}/api/info")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_subjects():
    """Test subjects endpoint"""
    print("\n📚 Testing Subjects Endpoint...")
    response = requests.get(f"{BASE_URL}/api/subjects")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_grades():
    """Test grades endpoint"""
    print("\n📖 Testing Grades Endpoint...")
    response = requests.get(f"{BASE_URL}/api/grades")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_chat():
    """Test chat endpoint"""
    print("\n💬 Testing Chat Endpoint...")
    
    payload = {
        "message": "How do I solve quadratic equations?",
        "subject": "Mathematics",
        "grade": 8
    }
    
    response = requests.post(f"{BASE_URL}/api/chat", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📝 AI Tutor Response:")
        print(f"Subject: {data.get('subject')}")
        print(f"Grade: {data.get('grade')}")
        print(f"Message:\n{data.get('message')}")
        print(f"\n💡 Suggested Follow-up: {data.get('suggested_followup')}")
        print(f"Conversation ID: {data.get('conversation_id')}")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def test_chat_followup():
    """Test follow-up chat in same conversation"""
    print("\n💬 Testing Follow-up Chat (with conversation context)...")
    
    # First message
    payload1 = {
        "message": "What is photosynthesis?",
        "subject": "Science",
        "grade": 7
    }
    
    response1 = requests.post(f"{BASE_URL}/api/chat", json=payload1)
    conv_id = response1.json().get("conversation_id")
    
    print(f"First message - Conversation ID: {conv_id}")
    print(f"First response:\n{response1.json().get('message')}\n")
    
    # Follow-up in same conversation
    payload2 = {
        "message": "Can you give me an example?",
        "subject": "Science",
        "grade": 7,
        "conversation_id": conv_id
    }
    
    response2 = requests.post(f"{BASE_URL}/api/chat", json=payload2)
    print(f"Follow-up response:\n{response2.json().get('message')}\n")
    print(f"Same conversation ID used: {response2.json().get('conversation_id') == conv_id}")
    
    return response1.status_code == 200 and response2.status_code == 200


def test_get_conversation():
    """Test retrieving conversation history"""
    print("\n📜 Testing Get Conversation Endpoint...")
    
    # Create a message first
    payload = {
        "message": "Explain fractions to me",
        "subject": "Mathematics",
        "grade": 6
    }
    
    response = requests.post(f"{BASE_URL}/api/chat", json=payload)
    conv_id = response.json().get("conversation_id")
    
    # Retrieve conversation
    response = requests.get(f"{BASE_URL}/api/chat/{conv_id}")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Conversation ID: {data.get('conversation_id')}")
    print(f"Subject: {data.get('subject')}")
    print(f"Grade: {data.get('grade')}")
    print(f"Total Messages: {data.get('message_count')}")
    
    return response.status_code == 200


def test_invalid_subject():
    """Test error handling for invalid subject"""
    print("\n⚠️ Testing Error Handling (Invalid Subject)...")
    
    payload = {
        "message": "Teach me something",
        "subject": "InvalidSubject",
        "grade": 7
    }
    
    response = requests.post(f"{BASE_URL}/api/chat", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Error Response: {response.json()}")
    
    return response.status_code == 400


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("🧪 CBC AI Tutor API Test Suite")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health),
        ("API Info", test_info),
        ("Subjects", test_subjects),
        ("Grades", test_grades),
        ("Chat", test_chat),
        ("Chat Follow-up", test_chat_followup),
        ("Get Conversation", test_get_conversation),
        ("Error Handling", test_invalid_subject),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Error running test: {e}")
            results[test_name] = False
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\n✨ Total: {passed}/{total} tests passed")
    print("=" * 60)


if __name__ == "__main__":
    print("⚠️  Make sure the backend server is running on http://localhost:8000")
    print("   Run: python -m uvicorn main:app --reload\n")
    
    try:
        # Quick connectivity check
        requests.get(f"{BASE_URL}/health", timeout=2)
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        exit(1)
    
    run_all_tests()
