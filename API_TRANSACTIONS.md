# Especificação da API — Transações Financeiras

Base URL: `http://localhost:8000`

## Autenticação

Todas as rotas exigem autenticação via JWT Bearer Token.

```
Authorization: Bearer <seu-token-jwt>
```

---

## Enumerações

### Payment Method Types
- `CREDIT_CARD` — Cartão de crédito
- `PIX` — Conta PIX

### Transaction Types
- `INCOME` — Receita/entrada
- `EXPENSE` — Despesa/saída

---

## 1. Meios de Pagamento

### 1.1 Criar Meio de Pagamento

`POST /payment-methods`

**Requisição:**

```json
{
  "name": "Nubank",
  "type": "PIX"
}
```

**Resposta 201 Created:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Nubank",
  "type": "PIX",
  "balance": 0.0,
  "created_at": "2026-05-12T18:00:00"
}
```

**Erros:**
| Código | Condição |
|--------|----------|
| 400 | Tipo inválido (deve ser `CREDIT_CARD` ou `PIX`) |
| 401 | Token ausente ou inválido |

---

### 1.2 Listar Meios de Pagamento

`GET /payment-methods`

**Resposta 200 OK:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Nubank",
    "type": "PIX",
    "balance": 1500.50,
    "created_at": "2026-05-12T18:00:00"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Bradesco",
    "type": "CREDIT_CARD",
    "balance": 0.0,
    "created_at": "2026-05-12T19:00:00"
  }
]
```

**Erros:**
| Código | Condição |
|--------|----------|
| 401 | Token ausente ou inválido |

---

### 1.3 Remover Meio de Pagamento

`DELETE /payment-methods/{pm_id}`

**Resposta 204 No Content** (sem body)

**Erros:**
| Código | Condição |
|--------|----------|
| 401 | Token ausente ou inválido |
| 404 | Método de pagamento não encontrado |
| 409 | Método possui transações vinculadas |

---

## 2. Transações

### 2.1 Registrar Transação

`POST /transactions`

**Requisição:**

```json
{
  "amount": 250.00,
  "date": "2026-05-12T14:30:00",
  "description": "Supermercado",
  "type": "EXPENSE",
  "category": "Alimentação",
  "payment_method_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Resposta 201 Created:**

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "amount": 250.00,
  "date": "2026-05-12T14:30:00",
  "description": "Supermercado",
  "type": "EXPENSE",
  "category": "Alimentação",
  "payment_method_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-05-12T18:00:00"
}
```

**Erros:**
| Código | Condição |
|--------|----------|
| 400 | Valor deve ser positivo; tipo inválido |
| 401 | Token ausente ou inválido |
| 404 | Método de pagamento não encontrado |
| 403 | Método de pagamento não pertence ao usuário |

---

### 2.2 Listar Transações

`GET /transactions`

**Query Parameters (todos opcionais):**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `type` | string | — | `INCOME` ou `EXPENSE` |
| `payment_method_id` | string | — | Filtrar por método de pagamento |
| `category` | string | — | Filtrar por categoria |
| `start_date` | string (ISO) | — | Data inicial (inclusiva) |
| `end_date` | string (ISO) | — | Data final (inclusiva) |
| `limit` | int | 100 | Máximo de resultados (1-1000) |
| `offset` | int | 0 | Posição inicial para paginação |

**Exemplo de requisição:**

```
GET /transactions?type=EXPENSE&category=Alimentação&limit=20&offset=0
```

**Resposta 200 OK:**

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "amount": 250.00,
    "date": "2026-05-12T14:30:00",
    "description": "Supermercado",
    "type": "EXPENSE",
    "category": "Alimentação",
    "payment_method_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-05-12T18:00:00"
  },
  {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "amount": 3200.00,
    "date": "2026-05-01T09:00:00",
    "description": "Salário",
    "type": "INCOME",
    "category": "Salário",
    "payment_method_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-05-01T09:00:00"
  }
]
```

**Erros:**
| Código | Condição |
|--------|----------|
| 400 | `limit` fora do intervalo (1-1000) |
| 401 | Token ausente ou inválido |

---

### 2.3 Saldo Consolidado

`GET /transactions/balance`

**Resposta 200 OK:**

```json
{
  "total_balance": 2750.50,
  "accounts": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Nubank",
      "type": "PIX",
      "balance": 1500.50
    },
    {
      "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
      "name": "Inter",
      "type": "PIX",
      "balance": 1250.00
    }
  ]
}
```

**Nota:** O saldo consolidado considera apenas contas do tipo `PIX`. Contas `CREDIT_CARD` não aparecem.

**Erros:**
| Código | Condição |
|--------|----------|
| 401 | Token ausente ou inválido |

---

### 2.4 Editar Transação

`PATCH /transactions/{tx_id}`

**Requisição:**

```json
{
  "amount": 300.00,
  "description": "Supermercado (atualizado)",
  "category": "Alimentação",
  "type": "EXPENSE"
}
```

**Resposta 200 OK:**

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "amount": 300.00,
  "date": "2026-05-12T14:30:00",
  "description": "Supermercado (atualizado)",
  "type": "EXPENSE",
  "category": "Alimentação",
  "payment_method_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-05-12T18:00:00"
}
```

**Erros:**
| Código | Condição |
|--------|----------|
| 400 | Valor deve ser positivo; tipo inválido |
| 401 | Token ausente ou inválido |
| 404 | Transação não encontrada |
| 403 | Transação não pertence ao usuário |

---

### 2.5 Excluir Transação

`DELETE /transactions/{tx_id}`

**Resposta 204 No Content** (sem body)

**Erros:**
| Código | Condição |
|--------|----------|
| 401 | Token ausente ou inválido |
| 404 | Transação não encontrada |

---

## 3. Fluxos de Exemplo

### Fluxo 1: Cadastro de Conta PIX + Transações

```
# 1. Criar conta PIX
POST /payment-methods
{ "name": "Nubank", "type": "PIX" }
→ 201 → { "id": "pm-001", "balance": 0.0 }

# 2. Registrar salário (receita)
POST /transactions
{
  "amount": 5000.00,
  "date": "2026-05-01T09:00:00",
  "description": "Salário",
  "type": "INCOME",
  "category": "Salário",
  "payment_method_id": "pm-001"
}
→ 201 → { "id": "tx-001", ... }
→ Saldo da conta pm-001 agora: 5000.00

# 3. Registrar compra (despesa)
POST /transactions
{
  "amount": 150.00,
  "date": "2026-05-05T12:00:00",
  "description": "Restaurante",
  "type": "EXPENSE",
  "category": "Alimentação",
  "payment_method_id": "pm-001"
}
→ 201 → { "id": "tx-002", ... }
→ Saldo da conta pm-001 agora: 4850.00

# 4. Consultar saldo
GET /transactions/balance
→ 200 → { "total_balance": 4850.00, "accounts": [...] }
```

### Fluxo 2: Cartão de Crédito (sem saldo)

```
# 1. Criar cartão de crédito
POST /payment-methods
{ "name": "Bradesco Visa", "type": "CREDIT_CARD" }
→ 201 → { "id": "pm-002", "balance": 0.0, "type": "CREDIT_CARD" }

# 2. Registrar compra no cartão
POST /transactions
{
  "amount": 800.00,
  "date": "2026-05-10T16:00:00",
  "description": "Eletrônicos",
  "type": "EXPENSE",
  "category": "Tecnologia",
  "payment_method_id": "pm-002"
}
→ 201 → { "id": "tx-003", ... }
→ Saldo da conta pm-002 permanece: 0.0 (CREDIT_CARD não afeta saldo)
```

### Fluxo 3: Atualização de Transação

```
# Estado inicial: tx-001 com amount=150.00, saldo=4850.00

# Atualizar valor
PATCH /transactions/tx-002
{ "amount": 200.00 }
→ 200 → { "amount": 200.00, ... }
→ Estorna 150.00 (-150) e aplica 200.00 (+200)
→ Saldo da conta pm-001 agora: 4900.00 (4850 - 150 + 200)
```

### Fluxo 4: Exclusão de Transação

```
# Estado inicial: tx-001 com amount=150.00, saldo=4900.00

# Excluir transão
DELETE /transactions/tx-002
→ 204 → (sem body)
→ Estorna valor original: 4900 - 200 = 4700.00
→ Saldo da conta pm-001 agora: 4700.00
```

### Fluxo 5: Paginação

```
# Página 1: 10 resultados
GET /transactions?limit=10&offset=0
→ 200 → [10 transações]

# Página 2: 10 resultados
GET /transactions?limit=10&offset=10
→ 200 → [10 transações]

# Filtrar por tipo
GET /transactions?type=INCOME&limit=50&offset=0
→ 200 → [apenas receitas]

# Filtrar por período
GET /transactions?start_date=2026-05-01T00:00:00&end_date=2026-05-31T23:59:59
→ 200 → [transações de maio]
```

---

## 4. Especificação de Erros

### Respostas de Erro

```json
{
  "detail": "mensagem de erro"
}
```

### Validação (Pydantic)

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "type"],
      "msg": "Tipo deve ser um de: CREDIT_CARD, PIX",
      "input": "BOLETO"
    }
  ]
}
```

### Tabela de Códigos HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| `400` | Bad Request | Valor inválido, tipo inválido, validação Pydantic |
| `401` | Unauthorized | Token ausente, expirado ou inválido |
| `403` | Forbidden | Recurso não pertence ao usuário autenticado |
| `404` | Not Found | Recurso não existe |
| `409` | Conflict | Tentar remover método de pagamento com transações vinculadas |

---

## 5. Regras de Negócio

| Regra | Comportamento |
|-------|---------------|
| **PIX + INCOME** | `balance += amount` |
| **PIX + EXPENSE** | `balance -= amount` |
| **CREDIT_CARD** | Não afeta saldo |
| **Update transação** | Estorna valor antigo, aplica novo valor |
| **Delete transação** | Estorna valor original (oposto) |
| **Delete PM** | Bloqueia se houver transações vinculadas |
| **Ownership** | Todas as queries filtram por `user_id` do token |
