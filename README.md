# Orchestration Backend (Layer 3)

Este projeto é o núcleo de nuvem da arquitetura híbrida para **Windows 10 Custom + IA Local**.

## Arquitetura de Comunicação
1. **Layer 1 (Windows 10)**: Sistema customizado injeta o Ollama e Daemons.
2. **Layer 2 (Edge IA)**: O Python Daemon (NSSM) processa inferências locais.
3. **Layer 3 (Este Backend)**: Recebe payloads JSON via REST e armazena no PostgreSQL.

## Configuração do Lado do Cliente (Windows)
O script Python no Windows deve enviar um POST para:
`https://[YOUR-DEPLOYED-URL]/api/telemetria_llm`

### Exemplo de Payload:
```json
{
  "machine_id": "WS-DELL-01",
  "model_name": "mistral:7b",
  "prompt_tokens": 120,
  "completion_tokens": 45,
  "insight_json": {
    "category": "system_optimization",
    "summary": "Processo de indexação reduzido para poupar VRAM."
  }
}
```

### Segurança
Todas as chamadas exigem um JWT assinado por uma Service Account do Google, injetada no Windows via diretório `$OEM$`.

## Tech Stack
- Next.js 15 (API Routes)
- PostgreSQL (Nix Managed)
- Google Auth Library
- Stateless REST design