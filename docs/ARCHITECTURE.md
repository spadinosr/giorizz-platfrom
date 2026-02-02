# GIORIZZ — ARCHITECTURE.md  
Documentazione tecnica dell’architettura della piattaforma.

GIORIZZ è una piattaforma modulare composta da tre ambienti principali:  
Client VIP, Driver Pro e HQ Admin.  
Ogni ambiente comunica con Supabase per autenticazione, database e real‑time.

---

# 🧱 1. Struttura Generale

La piattaforma è organizzata in tre livelli:

### **A) Frontend**
- HTML (pagine principali)
- CSS (AUREA UI)
- JavaScript modulare (scripts/)

### **B) Backend**
- Supabase (Auth, Database, API, Realtime)

### **C) Servizi Futuri**
- AI Brain
- Driver Coach
- Marketplace dinamico
- World Engine

---

# 🗂️ 2. Struttura delle Cartelle

