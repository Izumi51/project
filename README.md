# ProjectNI

`ProjectNI` é uma aplicação web full-stack projetada para gerenciamento de compras B2B (business-to-business) e cadeia de suprimentos. Ele permite que usuários (clientes) criem solicitações de licitação (Biddings) para produtos e quantidades que necessitam.

O sistema então compara essas licitações com um banco de dados de fornecedores (`Suppliers`) e seus inventários de produtos (`Products`), identificando as melhores ofertas de custo-benefício através de um motor de "Match" (combinação).

Este projeto é dividido em duas partes principais:
* `api/`: Um backend RESTful construído com Spring Boot.
* `frontend/`: Um aplicativo de página única (SPA) construído com React.

## Funcionalidades Principais

* **Autenticação de Usuário:** Login e registro seguros usando Spring Security e tokens JWT.
* **Gerenciamento de Licitações (Bidding):** Clientes podem criar, ler, atualizar e excluir suas solicitações de licitação.
* **Gerenciamento de Fornecedores (Supplier):** Operações CRUD para gerenciar fornecedores.
* **Gerenciamento de Produtos (Product):** Operações CRUD para gerenciar produtos, incluindo um sistema complexo de faixas de preço (`PriceTier`) com base na quantidade.
* **Motor de Combinação (Match Engine):** A funcionalidade principal. Compara a quantidade e categoria de uma licitação com todas as `PriceTiers` aplicáveis para encontrar as 3 melhores ofertas de custo total.
* **Dashboard:** Uma página inicial (`Home`) que resume o total de licitações, produtos e fornecedores.
* **Navegação Protegida:** As rotas principais (Bidding, Supplier, Product, Match) são protegidas e exigem login.

## Tecnologias Utilizadas

### Backend (`api/`)

* **Java 25**
* **Spring Boot**
* **Spring Security** (com autenticação JWT)
* **Spring Data JPA** (Hibernate)
* **PostgreSQL**
* **Maven**
* **Lombok**

### Frontend (`frontend/`)

* **React** (v19)
* **Vite**
* **React Router** (v7)
* **Tailwind CSS**
* **React Context API** (para gerenciamento de estado)
* **Axios** (para chamadas de API)

## Começando

### Pré-requisitos

* JDK 25 ou superior
* Maven 3.x
* Node.js 18 ou superior
* Um banco de dados PostgreSQL em execução

### 1. Configuração do Backend (API)

1.  **Navegue até o diretório da API:**
    ```sh
    cd api
    ```

2.  **Configuração do Banco de Dados:**
    * Crie um novo banco de dados no PostgreSQL (ex: `projectNI`).
    * Abra `src/main/resources/application.properties`.
    * Atualize `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password` com suas credenciais do PostgreSQL.
    * Atualize `api.security.token.secret` com uma chave secreta forte para JWT.

3.  **Execute a Aplicação:**
    ```sh
    ./mvnw spring-boot:run
    ```
    A API estará em execução em `http://localhost:8080`.

### 2. Configuração do Frontend

1.  **Navegue até o diretório do frontend (em um novo terminal):**
    ```sh
    cd frontend
    ```

2.  **Instale as Dependências:**
    ```sh
    npm install
    ```

3.  **Execute o Servidor de Desenvolvimento:**
    ```sh
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou a porta indicada pelo Vite).

4.  **Configuração da API:** O frontend está configurado para se comunicar com `http://localhost:8080/api/`. Se o seu backend estiver em uma porta diferente, atualize o `baseURL` em `frontend/src/api/axios.jsx`.