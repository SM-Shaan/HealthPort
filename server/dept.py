from embed_data import embed_data
import requests
import json


def disease_detection(model, collection, query=None):

    query_emb = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_emb],
        n_results=5
    )
    # print(results)
    disease_list = []
    # print(results['metadatas'][0])
    for i in range(len(results['ids'][0])):
        # print(results['metadatas'][0][i]["disease"])
        disease_list.append(results['metadatas'][0][i]["disease"])
    return disease_list
def dept_generate(disease=None):
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
            "content": "If the disease is: {disease}. Which department should I visit(Just write the department name only)?"
        }
        ],
        
    })
    )

    print(response.json()['choices'][0]['message']['content'])
    # converting the response to string and returning it
    return str(response.json()['choices'][0]['message']['content'])