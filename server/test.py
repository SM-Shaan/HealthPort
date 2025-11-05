import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  data=json.dumps({
    "model": "deepseek/deepseek-chat-v3.1:free",
    "messages": [
      {
        "role": "user",
        "content": "If the disease is: alcoholic liver disease. Which department should I visit(Just write the department name only)?"
      }
    ],
    
  })
)

print(response.json()['choices'][0]['message']['content'])