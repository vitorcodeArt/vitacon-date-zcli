import requests
from requests.auth import HTTPBasicAuth

# ==============================
# Configurações
# ==============================
subdomain = "vitaconsupport"
email = "consultoriazendesk@bcrcx.com"   # apenas o e-mail
token = "3ejJ9lYpZs4sQYlKivvfRnC6hAE9rlAVU8MZLsKy"
custom_object_key = "availability"

# Autenticação
auth = HTTPBasicAuth(f"{email}/token", token)
headers = {"Content-Type": "application/json"}


# ==============================
# Função para buscar todos os registros
# ==============================
def get_all_custom_object_records():
    records = []
    url = f"https://{subdomain}.zendesk.com/api/v2/custom_objects/{custom_object_key}/records"
    
    while url:
        response = requests.get(url, auth=auth, headers=headers)
        if response.status_code != 200:
            print(f"❌ Erro ao buscar registros: {response.status_code} - {response.text}")
            break

        data = response.json()
        registros_encontrados = data.get("custom_object_records", [])
        print(f"🔎 Buscando registros... ({len(registros_encontrados)} encontrados)")
        records.extend(registros_encontrados)

        # Paginação (se houver)
        url = data.get("links", {}).get("next")

    return records

# ==============================
# Função para deletar em massa (jobs)
# ==============================
def delete_custom_object_records_in_bulk(record_ids):
    url = f"https://{subdomain}.zendesk.com/api/v2/custom_objects/{custom_object_key}/jobs"

    payload = {
        "job": {
            "action": "delete",
            "items": record_ids
        }
    }

    response = requests.post(url, auth=auth, headers=headers, json=payload)

    if response.status_code in [200, 202]:
        job_data = response.json()
        job_id = job_data.get("job_status", {}).get("id")
        print(f"✅ Job criado com sucesso! Job ID: {job_id}")
        print(f"🔗 Acompanhar status: {job_data.get('job_status', {}).get('url')}")
    else:
        print(f"❌ Erro ao criar job: {response.status_code} - {response.text}")

# ==============================
# Executando: buscar e deletar em massa
# ==============================
if __name__ == "__main__":
    registros = get_all_custom_object_records()
    print(f"🔎 {len(registros)} registros encontrados.")

    # Pegamos apenas os IDs
    all_ids = [rec.get("id") for rec in registros if rec.get("id")]

    # Enviar em lotes de até 100 IDs
    for i in range(0, len(all_ids), 100):
        batch = all_ids[i:i+100]
        print(f"🗑️ Deletando lote com {len(batch)} registros...")
        delete_custom_object_records_in_bulk(batch)
