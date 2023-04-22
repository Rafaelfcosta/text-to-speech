# Text to speech

> desenvolvido com sdk de text to speech da microsoft

---

## Instalação e execução da aplicação

### Executando local

Primeiramente deve ser criado um arquivo `credentials.json` na raiz do projeto com suas credenciais da microsoft.

```json
{
  "subscriptionKey": "sua chave",
  "region": "sua região"
}
```

Depois criar o arquivo `inputs.json` e adicionar no array de textos o texto que deseja para ser sintetizado.

```json
{
  "projects": [
    {
      "name": "Nome do projeto",
      "texts": ["texto 1", "texto 2"]
    },
    {
      "name": "Nome do projeto 2",
      "texts": ["texto 1", "texto 2"]
    }
  ]
}
```

Para executar o projeto localmente como desenvolvimento, basta executar os seguintes comandos

```sh
npm i
npm start
```


