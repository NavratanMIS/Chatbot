import re

class Chatbot:
    def __init__(self):
        # Simple predefined responses for demonstration
        self.faq = {
            r"hi|hello|hey": "Hello! How can I assist you today?",
            r"pricing|cost|price": "Our pricing information is available on our website. Do you need a link?",
            r"support|help|issue": "I'm sorry to hear you're having issues. Could you describe the problem in more detail?",
            r"buy|purchase|order": "You can place an order directly on our site. Would you like guidance on how to proceed?",
        }
        # Keywords to detect interest in purchasing
        self.relevant_keywords = [
            "buy", "purchase", "order", "pricing", "price", "quote", "subscription"
        ]

    def respond(self, query: str) -> str:
        query_lower = query.lower()
        for pattern, response in self.faq.items():
            if re.search(pattern, query_lower):
                return response
        return "I'm not sure about that. Could you please provide more details?"

    def is_relevant(self, query: str) -> bool:
        query_lower = query.lower()
        for kw in self.relevant_keywords:
            if kw in query_lower:
                return True
        return False

def main():
    bot = Chatbot()
    print("Welcome to the website assistant! Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == 'quit':
            print("Bot: Thank you for chatting with us. Have a great day!")
            break
        response = bot.respond(user_input)
        relevant = bot.is_relevant(user_input)
        print(f"Bot: {response}")
        if relevant:
            print("Bot: It seems you're interested in our products. A sales representative will follow up soon.")

if __name__ == '__main__':
    main()
