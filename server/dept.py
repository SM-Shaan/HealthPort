from embed_data import embed_data
import requests
import json
import ollama


def disease_detection(model_embed, collection, query=None):

    query_emb = model_embed.encode(query).tolist()

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
    print("Generating department for disease:", disease)
    model_name = "qwen3:1.7b"  # Ollama's hosted Qwen model
    prompt_dept=f"""If the disease is: {disease}. Which department should I visit(Just write the department name only)?"""
    response = ollama.generate(
        model=model_name,
        prompt=prompt_dept
    )
    print(response['response'])
    dept=response['response'].strip()
    return dept

def dept_finalize(dept_list, disease=None):
    model_name = "deepseek-r1:1.5b"  # Ollama's hosted Qwen model
    dept_string = ", ".join(dept_list)

    prompt_dept_finalize = f"""The following is a list of medical departments: {dept_string}. 
    Please finalize and return the most appropriate department for the given disease {disease}. 
    Just write the department name only."""
    response2 = ollama.generate(
        model=model_name,
        prompt=prompt_dept_finalize
    )
    print(response2['response'])
    finalized_dept=response2['response'].strip()
    return finalized_dept
