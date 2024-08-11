# API de Gerenciamento de Serviços

Esta API permite gerenciar serviços de emergência, como guinchos, por meio de operações básicas de CRUD (Criar, Ler, Atualizar, Excluir). A seguir, estão descritos os endpoints disponíveis e exemplos de uso.

## Endpoints

### 1. Listar Todos os Serviços

- **Método:** `GET`
- **Endpoint:** `/services`
- **Descrição:** Retorna uma lista de todos os serviços registrados.

#### Exemplo de Requisição

```javascript
fetch('http://localhost:3000/services')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
```

### 2 Adicionar um Novo Serviço

- **Método:** `POST`
- **Endpoint:** `/services`
- **Descrição:** Adiciona um novo serviço à lista.

#### Corpo da Requisição:

```json
{
  "name": "Leonard Fuller",
  "type": "Troca da placa de vídeo",
  "time": "09:00",
  "phone": "92 9912345678",
  "weekday": 0
}
```

#### Exemplo de Requisição

```javascript
fetch('http://localhost:3000/services', 
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify
    name: "Leonard Fuller",
    type: "Troca da placa de vídeo",
    time: "09:00",
    phone: "92 9912345678",
    weekday: 0
)
  .then(response => response.json())
  .then(data => console.log('Serviço adicionado:', data))
  .catch(error => console.error('Erro:', error));
```

### 3. Atualizar um Serviço Existente

- **Método:** `PUT`
- **Endpoint:** `/services/:weekday/:time`
- **Descrição:** Atualiza um serviço existente com base no dia da semana e horário.
- **Parâmetros de URL:**
    - weekday - Dia da semana valor 0 a 5 do serviço a ser atualizado.
    - time - Horário do serviço a ser atualizado no formato HH:MM.

#### Corpo da Requisição:
```json
{
  "type": "Serviço de guincho para veículos leves"
}
```

#### Exemplo de Requisição:
```javascript
fetch('http://localhost:3000/services/Monday/08:00', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'Serviço de guincho para veículos leves'
  })
})
  .then(response => response.json())
  .then(msg => console.log(msg))
  .catch(error => console.error('Erro:', error));
```

### 4. Excluir um Serviço Específico
- **Método:** `DELETE`
- **Endpoint:** `/services/:weekday/:time`
- **Descrição:** Exclui um serviço específico com base no dia da semana e horário.
- **Parâmetros de URL:**
    - weekday - Dia da semana valor 0 a 5 do serviço a ser atualizado.
    - time - Horário do serviço a ser atualizado no formato HH:MM.

#### Exemplo de Requisição

```javascript
fetch('http://localhost:3000/services/0/08:00', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(msg => console.log(msg))
  .catch(error => console.error('Erro:', error));
```

### Notas

Certifique-se de que o servidor está em execução na porta 3000 ou ajuste a URL conforme necessário.
Todos os exemplos de requisição usam o fetch API do JavaScript para interagir com a API.

Para mais informações ou para contribuir com melhorias, consulte o contribuições e licença deste projeto.