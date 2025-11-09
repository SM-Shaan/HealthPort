from embed_data import embed_data
import requests
import json
import ollama
from ollama import Client


def disease_detection(model_embed, collection, query=None):

    query_emb = model_embed.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_emb],
        n_results=5
    )
    # print(results)
    disease_list = []
    # print(results['metadatas'][0])
    # print("Distances:")
    # #   
    # print(results['distances'][0])
    for i in range(len(results['ids'][0])):
        # print(results['metadatas'][0][i]["disease"])
        percentage = (1 - results['distances'][0][i]) * 100
        disease_list.append({results['metadatas'][0][i]["disease"]: percentage} )
        print(f"Distance: {results['distances'][0][i]} - Disease: {results['metadatas'][0][i]['disease']} - Symptoms: {results['metadatas'][0][i]['symptoms']}")
    return disease_list


def dept_generate(disease=None):
    print("Generating department for disease:", disease)
    client = Client(
        host="https://ollama.com",
        headers={'Authorization': 'Bearer 7efd7a1ff40e4dc5b8d19692d5f65af6.9WjyQeyPv2gcmkChoa-MQjxe' }
    )
    prompt_dept=f"""If the disease is: {disease}. Which department should I visit(Just write the department name only)?"""
    messages = [
    {
        'role': 'user',
        'content': prompt_dept,
    },
    ]
    dept = ""
    for part in client.chat('deepseek-v3.1:671b-cloud', messages=messages, stream=True):
        # Get the latest content chunk
        chunk = part['message']['content']
        print(chunk, end='', flush=True)  # Print as it streams
        dept += chunk  # Accumulate

    # Strip at the end
    dept = dept.strip()

    print(dept)

    return dept

def dept_finalize(dept_list, disease=None):
    print("Finalizing department for disease:", disease)
    dept_string = ", ".join(dept_list)
    print(dept_string)
    client = Client(
        host="https://ollama.com",
        headers={'Authorization': 'Bearer 7efd7a1ff40e4dc5b8d19692d5f65af6.9WjyQeyPv2gcmkChoa-MQjxe' }
    )
    prompt_dept_finalize = f"""The following is a list of medical departments: {dept_string}. 
    Please finalize and return the most appropriate department for the given disease {disease}. 
    Just write the department name only."""
    messages = [
    {
        'role': 'user',
        'content': prompt_dept_finalize,
    },
    ]
    finalized_dept = ""
    for part in client.chat('deepseek-v3.1:671b-cloud', messages=messages, stream=True):
        # Get the latest content chunk
        chunk = part['message']['content']
        print(chunk, end='', flush=True)  # Print as it streams
        finalized_dept += chunk  # Accumulate

    # Strip at the end
    finalized_dept = finalized_dept.strip()

    print(finalized_dept)

    return finalized_dept
