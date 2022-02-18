# Instruções de como utilizar a API

### Fazer cópia do repositório na sua máquina local

1. Inicie o git em uma pasta: `git init`
2. Faça um clone na sua máquina local: `git clone https://github.com/MatheusNunes133/MiniProjeto-MongoDB`

### Baixar dependências necessárias

3. No terminal utilize este comando: `npm i`

### Configurando arquivo de configurações

4. Crie um arquivo na raiz chamada de `.env`
5. Dentro do arquivo deve ser colocado as seguintes configurações:
```
MONGO_HOST = {Seu host(localhost) do mongo}
MONGO_PORT = {Sua porta do mongo}
MONGO_DATABASE = {Nome do banco de dados}
MONGO_COLLECTION = {Nome da coleção}
```

### Iniciando a API

6. No terminal escreva esse comando: `npm start`
7. Pronto a API já em execução
