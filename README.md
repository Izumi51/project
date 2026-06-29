# Sistema de Otimização de Licitações

O `Sistema de Otimização de Licitações` é uma plataforma web *full-stack* desenvolvida para automatizar e otimizar processos de seleção de fornecedores em licitações públicas e privadas. Ao contrário de abordagens tradicionais baseadas em algoritmos gulosos (que selecionam apenas o menor preço unitário por item), o sistema utiliza um **motor de otimização matemática** para minimizar o custo total de aquisição, considerando simultaneamente restrições complexas como custos fixos de frete, limites de capacidade e faixas de desconto por volume (*price tiers*).

Este projeto é dividido em duas partes principais:

* `api/`: Backend robusto em Java com Spring Boot, integrado ao **Google OR-Tools** para resolução de problemas de Programação Linear Inteira Mista (MILP).
 
* `frontend/`: *Single Page Application* (SPA) desenvolvida em React para visualização intuitiva e auditoria dos cenários otimizados.

## Funcionalidades Principais

1. **Motor de Otimização (Match Engine):** O núcleo do sistema. Utiliza a biblioteca Google OR-Tools (via JNI) para processar o Problema de Seleção de Fornecedores (SSP), garantindo a combinação de menor custo global com conformidade integral às restrições logísticas.

2. **Modelagem de Faixas de Preço (Price Tiers):** Cadastro flexível de propostas onde preços variam conforme volumes mínimos e máximos, modelando descontos por escala e capacidade de estoque.

3. **Gestão de Licitações (Bidding) e Fornecedores:** Operações completas para administrar editais, fornecedores e seus respectivos custos fixos de frete.
 
4. **Auditoria de Decisão:** Interface dedicada (*MatchDetails*) que exibe a composição do custo (itens vs. frete) e justifica a adjudicação, essencial para a transparência e conformidade com a Lei n.º 14.133/2021.
 
5. **Segurança e Performance:** Autenticação JWT, arquitetura desacoplada e performance otimizada para resolver problemas complexos em milissegundos.

## Tecnologias Utilizadas

### Backend (`api/`)

* **Java 25 & Spring Boot**
* **Google OR-Tools** (Motor de otimização MILP) 
* **Spring Data JPA** & **PostgreSQL**
* **Maven** (Gerenciamento de dependências)

### Frontend (`frontend/`)

* **React** (v19) & **Vite**
* **Axios** (Integração com API RESTful)
* **Tailwind CSS** (Estilização)
* **Context API** (Gerenciamento de estado global)

## Como começar

### Pré-requisitos

* JDK 25 ou superior
* Maven 3.x
* Node.js 18 ou superior
* PostgreSQL

### 1. Configuração do Backend (API)

1. Navegue até `api/` e configure o `src/main/resources/application.properties` com suas credenciais do PostgreSQL.

2. O sistema requer uma instância do banco de dados configurada para as entidades `Bidding`, `Product`, `Supplier` e `PriceTier`.

3. Execute a aplicação:
```sh
    ./mvnw spring-boot:run
```

### 2. Configuração do Frontend

1. Navegue até `frontend/`.

2. Instale as dependências:
```sh
    npm install
```

3. Inicie o servidor de desenvolvimento:
```sh
    npm run dev
```

## Diferencial Técnico

A plataforma resolve o *Supplier Selection Problem* (SSP) como um modelo de Programação Linear Inteira Mista (MILP). O solver SCIP, integrado ao backend via JNI, avalia milhares de combinações de custos de frete e restrições de capacidade simultaneamente, superando as limitações de algoritmos gulosos rudimentares e gerando economia real em processos licitatórios.