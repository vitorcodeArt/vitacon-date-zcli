import customtkinter as ctk
import requests
from requests.auth import HTTPBasicAuth
import pandas as pd
from tkinter import filedialog, messagebox

# ==============================
# Variáveis globais
# ==============================
subdomain = None
email = None
token = None
brand_url = None
section_id = None
permission_group_id = None
df = None
locale = "pt-br"


# ==============================
# Funções auxiliares
# ==============================
def autenticar(mail, tkn):
    """Retorna tupla (auth, headers) para requisições"""
    auth = HTTPBasicAuth(f"{mail}/token", tkn)
    headers = {"Content-Type": "application/json"}
    return auth, headers


def buscar_marcas():
    global subdomain, email, token
    try:
        auth, headers = autenticar(email, token)
        url = f"{subdomain}/api/v2/brands.json"
        resp = requests.get(url, auth=auth, headers=headers)

        if resp.status_code == 200:
            return resp.json()["brands"]
        else:
            messagebox.showerror("Erro", f"Erro ao buscar marcas: {resp.status_code}\n{resp.text}")
            return []
    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao buscar marcas: {e}")
        return []


def buscar_secoes(url_base):
    try:
        auth, headers = autenticar(email, token)
        resp = requests.get(f"{url_base}/api/v2/help_center/sections.json", auth=auth, headers=headers)

        if resp.status_code == 200:
            return resp.json()["sections"]
        else:
            messagebox.showerror("Erro", f"Erro ao buscar seções: {resp.status_code}\n{resp.text}")
            return []
    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao buscar seções: {e}")
        return []


def buscar_permission_groups(url_base):
    try:
        auth, headers = autenticar(email, token)
        resp = requests.get(f"{url_base}/api/v2/guide/permission_groups.json", auth=auth, headers=headers)

        if resp.status_code == 200:
            return resp.json()["permission_groups"]
        else:
            messagebox.showerror("Erro", f"Erro ao buscar grupos de permissão: {resp.status_code}\n{resp.text}")
            return []
    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao buscar grupos de permissão: {e}")
        return []


def criar_artigos(path_excel):
    """Faz upload dos artigos do Excel"""
    global email, token, section_id, permission_group_id, locale, brand_url

    try:
        df = pd.read_excel(path_excel)

        if not {"titulo", "texto"}.issubset(df.columns):
            messagebox.showerror("Erro", "O Excel precisa conter as colunas: titulo e texto")
            return

        auth, headers = autenticar(email, token)
        url = f"{brand_url}/api/v2/help_center/sections/{section_id}/articles.json"

        sucessos = []
        erros = []

        for idx, row in df.iterrows():
            title = str(row["titulo"])
            body = str(row["texto"])

            payload = {
                "article": {
                    "title": title,
                    "body": body,
                    "locale": locale,
                    "permission_group_id": permission_group_id,
                    "user_segment_id": None
                }
            }

            resp = requests.post(url, auth=auth, headers=headers, json=payload)

            if resp.status_code == 201:
                sucessos.append(title)
            else:
                erros.append((title, resp.status_code, resp.text))

        resumo = f"✅ Criados: {len(sucessos)} artigos\n❌ Erros: {len(erros)}"
        if erros:
            resumo += "\n\nFalhas:\n" + "\n".join([f"{t} ({c})" for t, c, _ in erros])

        messagebox.showinfo("Resultado", resumo)

    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao criar artigos: {e}")


# ==============================
# GUI Principal
# ==============================
class ZendeskUploader(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Zendesk Bulk Uploader")
        self.geometry("800x600")

        self.current_frame = None
        self.show_step1()

    def clear_frame(self):
        if self.current_frame:
            self.current_frame.destroy()

    # ==========================
    # Etapa 1
    # ==========================
    def show_step1(self):
        self.clear_frame()
        frame = ctk.CTkFrame(self)
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        ctk.CTkLabel(frame, text="Etapa 1 - Configurações Iniciais", font=("Arial", 18, "bold")).pack(pady=10)

        entry_subdomain = ctk.CTkEntry(frame, placeholder_text="Subdomínio (ex: https://meu.zendesk.com)")
        entry_subdomain.pack(pady=5, fill="x")

        entry_email = ctk.CTkEntry(frame, placeholder_text="E-mail administrador")
        entry_email.pack(pady=5, fill="x")

        entry_token = ctk.CTkEntry(frame, placeholder_text="Token", show="*")
        entry_token.pack(pady=5, fill="x")

        def next_step():
            global subdomain, email, token
            subdomain = entry_subdomain.get().strip()
            email = entry_email.get().strip()
            token = entry_token.get().strip()

            if not subdomain or not email or not token:
                if not messagebox.askyesno("Pular", "Você não preencheu todos os campos. Deseja pular essa etapa?"):
                    return

            self.show_step2()

        ctk.CTkButton(frame, text="Próximo", command=next_step).pack(pady=20)

        self.current_frame = frame

    # ==========================
    # Etapa 2
    # ==========================
    def show_step2(self):
        self.clear_frame()
        frame = ctk.CTkFrame(self)
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        ctk.CTkLabel(frame, text="Etapa 2 - Escolha a Marca", font=("Arial", 18, "bold")).pack(pady=10)

        brands = buscar_marcas()

        brand_options = [f"{b['name']} ({b['brand_url']})" for b in brands]
        brand_dict = {f"{b['name']} ({b['brand_url']})": b['brand_url'] for b in brands}

        combo = ctk.CTkComboBox(frame, values=brand_options, width=400)
        combo.pack(pady=10)

        def next_step():
            global brand_url
            choice = combo.get()
            if not choice:
                messagebox.showwarning("Atenção", "Selecione uma marca")
                return
            brand_url = brand_dict[choice]
            self.show_step3()

        ctk.CTkButton(frame, text="Próximo", command=next_step).pack(pady=20)

        self.current_frame = frame

    # ==========================
    # Etapa 3
    # ==========================
    def show_step3(self):
        self.clear_frame()
        frame = ctk.CTkFrame(self)
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        ctk.CTkLabel(frame, text="Etapa 3 - Seções e Permissões", font=("Arial", 18, "bold")).pack(pady=10)

        secoes = buscar_secoes(brand_url)
        permissoes = buscar_permission_groups(brand_url)

        section_options = [f"{s['name']} (ID: {s['id']})" for s in secoes]
        section_dict = {f"{s['name']} (ID: {s['id']})": s['id'] for s in secoes}

        perm_options = [f"{p['name']} (ID: {p['id']})" for p in permissoes]
        perm_dict = {f"{p['name']} (ID: {p['id']})": p['id'] for p in permissoes}

        combo_section = ctk.CTkComboBox(frame, values=section_options, width=400)
        combo_section.pack(pady=10)

        combo_perm = ctk.CTkComboBox(frame, values=perm_options, width=400)
        combo_perm.pack(pady=10)

        def next_step():
            global section_id, permission_group_id
            if not combo_section.get() or not combo_perm.get():
                messagebox.showwarning("Atenção", "Selecione seção e grupo de permissão")
                return

            section_id = section_dict[combo_section.get()]
            permission_group_id = perm_dict[combo_perm.get()]

            self.show_step4()

        ctk.CTkButton(frame, text="Próximo", command=next_step).pack(pady=20)

        self.current_frame = frame

    # ==========================
    # Etapa 4
    # ==========================
    def show_step4(self):
        self.clear_frame()
        frame = ctk.CTkFrame(self)
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        ctk.CTkLabel(frame, text="Etapa 4 - Upload de Artigos", font=("Arial", 18, "bold")).pack(pady=10)

        def selecionar_excel():
            filepath = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx")])
            if filepath:
                criar_artigos(filepath)

        ctk.CTkButton(frame, text="Selecionar Excel e Enviar", command=selecionar_excel).pack(pady=20)

        self.current_frame = frame


if __name__ == "__main__":
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("blue")
    app = ZendeskUploader()
    app.mainloop()
