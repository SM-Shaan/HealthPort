from transformers import AutoTokenizer, AutoModelForCausalLM
import torch, os

model_dir = "models"
qwen_model_name = "unsloth/Qwen3-1.7B"  # ✅ Use the normal model, not GGUF
qwen_model_path = os.path.join(model_dir, qwen_model_name.replace("/", "_"))
HF_TOKEN = "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"  # ✅ safer way

# make sure folder exists
os.makedirs(qwen_model_path, exist_ok=True)

config_path = os.path.join(qwen_model_path, "config.json")

if os.path.exists(config_path):
    print(f"✅ Loading Qwen3 model from local path: {qwen_model_path}")
    tokenizer_qwen3 = AutoTokenizer.from_pretrained(qwen_model_path)
    model_qwen3 = AutoModelForCausalLM.from_pretrained(qwen_model_path, torch_dtype=torch.float16, device_map="auto")
else:
    print(f"⬇️ Downloading and caching Qwen3 model to: {qwen_model_path}")
    tokenizer_qwen3 = AutoTokenizer.from_pretrained(qwen_model_name, token=HF_TOKEN)
    model_qwen3 = AutoModelForCausalLM.from_pretrained(
        qwen_model_name, token=HF_TOKEN, torch_dtype=torch.float16, device_map="auto"
    )
    tokenizer_qwen3.save_pretrained(qwen_model_path)
    model_qwen3.save_pretrained(qwen_model_path)

print("✅ Model is ready for use.")

# ---------- Prompt ----------
dept_list = ['pediatrics', 'psychiatrist', 'neurology']
disease = 'Panic Disorder'
dept_string = ", ".join(dept_list)
prompt = f"""The following is a list of medical departments: {dept_string}. 
Please finalize and return the most appropriate department for the given disease {disease}. 
Just write the department name only.
"""

# ---------- Inference ----------
messages = [{"role": "user", "content": prompt}]

# Convert to tokens
input_ids = tokenizer_qwen3.apply_chat_template(
    messages, add_generation_prompt=True, return_tensors="pt"
).to(model_qwen3.device)

# Generate
outputs = model_qwen3.generate(input_ids=input_ids, max_new_tokens=50)

# Decode
response = tokenizer_qwen3.decode(outputs[0][input_ids.shape[-1]:], skip_special_tokens=True)
print(response.strip())
