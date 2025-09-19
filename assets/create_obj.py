import requests
from requests.auth import HTTPBasicAuth
import pandas as pd
import json

# ==============================
# Configurações
# ==============================
subdomain = "con-bcrcx-leticia"
email = "consultoriazendesk@bcrcx.com"
token = "aJdCCPCRjzT3jvhWOjpBtjxt7yWBuXhdrDsZLnN7"
custom_object_key = "unidades"   # sua key
user_id = "24992545403668"       # ID do usuário logado (criador)
excel_file = "unidades.xlsx"     # coloque o caminho do arquivo

# Autenticação e cabeçalho
auth = HTTPBasicAuth(f"{email}/token", token)
headers = {"Content-Type": "application/json"}

# ==============================
# Função para criar registros
# ==============================
def criar_registros():
    # Carregar planilha
    df = pd.read_excel(excel_file)

    for index, row in df.iterrows():
        unidade = str(row["unidade"]).strip()
        modalidades = [m.strip() for m in str(row["modalidade"]).split(",")]
        estado = str(row["estado"]).strip()
        cep = str(row["cep"]).strip()

        payload = {
            "custom_object_record": {
                "custom_object_key": custom_object_key,
                "external_id": f"unidade_{unidade.lower()}",
                "custom_object_fields": {
                    "cep": cep,
                    "estado": estado,
                    "modalidades": modalidades
                },
                "created_by_user_id": user_id,
                "updated_by_user_id": user_id
            }
        }

        url = f"https://{subdomain}.zendesk.com/api/v2/custom_objects/{custom_object_key}/records"

        response = requests.post(url, auth=auth, headers=headers, json=payload)

        if response.status_code in [200, 201]:
            print(f"✅ Registro criado: {unidade}")
        else:
            print(f"❌ Erro ao criar {unidade}: {response.status_code} - {response.text}")

# ==============================
# Execução
# ==============================
if __name__ == "__main__":
    criar_registros()
