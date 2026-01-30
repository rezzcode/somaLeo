"""
AI Tutor module - handles all AI interactions and logic
"""
import json
from typing import Optional, List, Dict
from datetime import datetime
from config import settings


class SafetyChecker:
    """Checks for harmful, inappropriate, or off-curriculum content"""
    
    # Keywords that suggest off-curriculum requests
    BLOCKED_KEYWORDS = [
        "inappropriate", "illegal", "violence", "hate",
        "adult", "gambling", "drugs", "politics",
        "religion", "dating", "personal attack"
    ]
    
    # Keywords that indicate curriculum content
    CBC_KEYWORDS = {
        "mathematics": ["algebra", "geometry", "calculus", "statistics", "arithmetic", "number", "equation"],
        "english": ["grammar", "vocabulary", "literature", "writing", "comprehension", "essay", "phonics"],
        "science": ["physics", "chemistry", "biology", "energy", "matter", "organism", "ecosystem"],
        "social studies": ["history", "geography", "culture", "society", "government", "economy"],
        "ict": ["programming", "coding", "computer", "data", "network", "software", "algorithm"]
    }
    
    @staticmethod
    def is_safe_message(message: str, subject: Optional[str] = None) -> tuple[bool, Optional[str]]:
        """
        Check if message is safe and curriculum-aligned
        Returns: (is_safe, reason_if_unsafe)
        """
        message_lower = message.lower()
        
        # Check for blocked keywords
        for keyword in SafetyChecker.BLOCKED_KEYWORDS:
            if keyword in message_lower:
                return False, f"Message contains inappropriate content"
        
        # If subject is specified, check curriculum alignment
        if subject and subject.lower() in SafetyChecker.CBC_KEYWORDS:
            subject_keywords = SafetyChecker.CBC_KEYWORDS[subject.lower()]
            # Allow message if it contains relevant subject keywords OR is asking a learning question
            learning_indicators = ["how to", "what is", "explain", "why", "can you help", "teach", "learn"]
            has_learning_indicator = any(indicator in message_lower for indicator in learning_indicators)
            has_subject_keyword = any(keyword in message_lower for keyword in subject_keywords)
            
            if not (has_learning_indicator or has_subject_keyword):
                return False, f"Message doesn't appear to be about {subject}"
        
        return True, None
    
    @staticmethod
    def should_filter_response(response: str) -> bool:
        """Check if AI response needs filtering"""
        response_lower = response.lower()
        return any(keyword in response_lower for keyword in SafetyChecker.BLOCKED_KEYWORDS)


class PromptEngineer:
    """Handles prompt design and engineering for CBC alignment"""
    
    SYSTEM_PROMPT_TEMPLATE = """You are {tutor_name}, a patient and encouraging Kenyan AI tutor specializing in the Competency-Based Curriculum (CBC).

Your role is to:
1. Explain concepts clearly using simple, age-appropriate language suitable for Grade {grade} students
2. Use step-by-step explanations with practical examples
3. Encourage critical thinking by guiding students to discover answers rather than giving direct answers
4. Stay strictly within the curriculum for {subject}
5. Be respectful, patient, and supportive - act like a dedicated Kenyan teacher
6. Use practical examples from Kenyan context when relevant
7. Provide practice questions after explaining concepts
8. Adapt complexity based on student understanding

Important guidelines:
- Do NOT provide answers to homework/tests directly
- DO encourage problem-solving approaches
- Redirect off-topic questions politely
- Use Kiswahili terms or phrases when appropriate to enhance learning
- Focus on building competencies, not just memorizing facts

Current context:
- Student Grade Level: {grade}
- Subject: {subject}
- Previous discussion context available for follow-up questions

Respond in a warm, encouraging tone that makes learning feel achievable."""

    @staticmethod
    def build_system_prompt(tutor_name: str, grade: int, subject: str) -> str:
        """Build the system prompt with context"""
        return PromptEngineer.SYSTEM_PROMPT_TEMPLATE.format(
            tutor_name=tutor_name,
            grade=grade,
            subject=subject
        )
    
    @staticmethod
    def build_context_prompt(messages: List[Dict], current_message: str, subject: Optional[str] = None) -> str:
        """Build conversation with full context"""
        context_str = ""
        
        if messages:
            context_str = "Previous conversation context:\n"
            for msg in messages[-5:]:  # Keep last 5 messages for context
                role = "Student" if msg["role"] == "user" else "Tutor"
                context_str += f"{role}: {msg['content']}\n"
        
        context_str += f"\nStudent's current question: {current_message}"
        
        if subject:
            context_str += f"\n\nPlease respond specifically addressing {subject} concepts."
        
        return context_str


class ConversationManager:
    """Manages conversation history and context"""
    
    def __init__(self):
        self.conversations: Dict[str, Dict] = {}
    
    def get_or_create_conversation(self, conversation_id: str, subject: Optional[str] = None, grade: Optional[int] = None) -> Dict:
        """Get existing or create new conversation"""
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = {
                "messages": [],
                "subject": subject,
                "grade": grade or 7,  # Default grade
                "created_at": datetime.utcnow().isoformat(),
                "last_activity": datetime.utcnow().isoformat()
            }
        return self.conversations[conversation_id]
    
    def add_message(self, conversation_id: str, role: str, content: str):
        """Add message to conversation"""
        conv = self.get_or_create_conversation(conversation_id)
        conv["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        })
        conv["last_activity"] = datetime.utcnow().isoformat()
        
        # Keep only last N messages to avoid token overflow
        if len(conv["messages"]) > settings.MAX_CONTEXT_MESSAGES:
            conv["messages"] = conv["messages"][-settings.MAX_CONTEXT_MESSAGES:]
    
    def get_context_messages(self, conversation_id: str) -> List[Dict]:
        """Get messages for context (excluding current turn)"""
        conv = self.get_or_create_conversation(conversation_id)
        return conv["messages"][:-1] if conv["messages"] else []
    
    def get_conversation_metadata(self, conversation_id: str) -> Dict:
        """Get conversation subject and grade"""
        conv = self.get_or_create_conversation(conversation_id)
        return {
            "subject": conv["subject"],
            "grade": conv["grade"]
        }


class AITutor:
    """Main AI Tutor class - orchestrates chat logic"""
    
    def __init__(self):
        self.safety_checker = SafetyChecker()
        self.prompt_engineer = PromptEngineer()
        self.conversation_manager = ConversationManager()
        self.llm_client = None  # Will be initialized based on provider
        self._init_llm()
    
    def _init_llm(self):
        """Initialize LLM client based on provider"""
        if settings.LLM_PROVIDER == "openai" and settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                self.llm_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except ImportError:
                print("OpenAI not available, using mock responses")
                self.llm_client = None
        else:
            print("Using mock LLM provider")
            self.llm_client = None
    
    def process_message(self, message: str, conversation_id: str, subject: Optional[str] = None, 
                       grade: Optional[int] = None) -> tuple[str, str]:
        """
        Process user message and generate tutor response
        Returns: (response, suggested_followup)
        """
        
        # 1. Safety check
        is_safe, reason = self.safety_checker.is_safe_message(message, subject)
        if not is_safe:
            return f"I'm here to help with {subject or 'your studies'}. {reason}. Could you ask me about something related to your curriculum?", None
        
        # 2. Get or create conversation
        conv = self.conversation_manager.get_or_create_conversation(
            conversation_id, 
            subject=subject, 
            grade=grade or 7
        )
        
        # 3. Add user message to context
        self.conversation_manager.add_message(conversation_id, "user", message)
        
        # 4. Build system and context prompts
        system_prompt = self.prompt_engineer.build_system_prompt(
            tutor_name=settings.TUTOR_NAME,
            grade=conv["grade"],
            subject=conv["subject"] or subject or "General Studies"
        )
        
        context_messages = self.conversation_manager.get_context_messages(conversation_id)
        context_prompt = self.prompt_engineer.build_context_prompt(context_messages, message, subject)
        
        # 5. Get AI response
        response = self._get_ai_response(system_prompt, context_prompt)
        
        # 6. Safety check on response
        if self.safety_checker.should_filter_response(response):
            response = self._get_fallback_response(message, subject)
        
        # 7. Add response to context
        self.conversation_manager.add_message(conversation_id, "assistant", response)
        
        # 8. Generate suggested follow-up
        followup = self._generate_followup_question(message, response, subject)
        
        return response, followup
    
    def _get_ai_response(self, system_prompt: str, context_prompt: str) -> str:
        """Get response from LLM or fallback"""
        try:
            if self.llm_client and settings.OPENAI_API_KEY:
                response = self.llm_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": context_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                return response.choices[0].message.content
            else:
                return self._get_mock_response(context_prompt)
        except Exception as e:
            print(f"Error calling LLM: {e}")
            return self._get_mock_response(context_prompt)
    
    def _get_mock_response(self, context: str) -> str:
        """Generate mock response for testing"""
        return f"""Great question! Let me break this down for you step-by-step.

Based on your question about {context[:50]}..., here are the key points:

1. **Main Concept**: This is an important part of your curriculum that builds critical thinking.

2. **How it works**: Think of it like... [practical example would go here]

3. **Key Steps**:
   - First, understand the foundation
   - Then apply it to examples
   - Finally, solve practice problems

4. **Practice**: Try working through a similar problem. What do you think should be the first step?

Feel free to ask follow-up questions! I'm here to help you understand this concept fully."""
    
    def _get_fallback_response(self, message: str, subject: Optional[str]) -> str:
        """Get fallback response when AI response needs filtering"""
        return f"""I appreciate your question! Let me help you understand this concept better.

Could you tell me more about what specifically you'd like to learn about {subject or 'this topic'}? 

I'm here to help explain concepts, work through problems step-by-step, and support your learning. What part would you like to focus on?"""
    
    def _generate_followup_question(self, user_message: str, response: str, subject: Optional[str]) -> Optional[str]:
        """Generate a suggested follow-up question"""
        followups = [
            "Would you like me to work through a practice problem on this?",
            "Do you have any other questions about this concept?",
            "Would it help if I explained this using a different example?",
            "Can you try to explain what we discussed in your own words?"
        ]
        
        # Simple rotation based on message length
        return followups[len(user_message) % len(followups)]


# Initialize global tutor instance
ai_tutor = AITutor()
