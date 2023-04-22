db.dropDatabase();

// Criando coleção de lanches
db.createCollection("lanches");

// Inserindo na coleção de lanches
db.lanches.insertMany([
    {
        "nome": "Sanduíche de Queijo e Presunto",
        "preco": 5.00,
        "tempo_preparo": 5
    },
    {
        "nome": "Coxinha de Frango",
        "preco": 4.50,
        "tempo_preparo": 7
    },
    {
        "nome": "Coxinha de Charque",
        "preco": 4.00,
        "tempo_preparo": 7
    },
    {
        "nome": "Coxinha de Bacalhau",
        "preco": 6.00,
        "tempo_preparo": 7
    },
    {
        "nome": "Enroladinho",
        "preco": 6.00,
        "tempo_preparo": 10
    },
    {
        "nome": "Cachorro Quente",
        "preco": 15.00,
        "tempo_preparo": 10
    },
    {
        "nome": "Pastel de Queijo",
        "preco": 9.00,
        "tempo_preparo": 7
    },
    {
        "nome": "Pastel de Camarão",
        "preco": 14.00,
        "tempo_preparo": 7
    },
    {
        "nome": "Pastel de Carne",
        "preco": 10.00,
        "tempo_preparo": 7
    },
    {
        "nome": "X-Burguer",
        "preco": 10.00,
        "tempo_preparo": 5
    },
    {
        "nome": "X-Ratão",
        "preco": 10.00,
        "tempo_preparo": 9
    },
    {
        "nome": "X-Bacon",
        "preco": 20.00,
        "tempo_preparo": 14
    },
    {
        "nome": "X-Duplo",
        "preco": 18.00,
        "tempo_preparo": 16
    },
    {
        "nome": "X-Cheddar",
        "preco": 12.00,
        "tempo_preparo": 10
    },
    {
        "nome": "Hamburguer",
        "preco": 14.00,
        "tempo_preparo": 8
    },
    {
        "nome": "Pizza de Calabresa",
        "preco": 20.00,
        "tempo_preparo": 20
    },
    {
        "nome": "Pizza de Abacaxi",
        "preco": 15.00,
        "tempo_preparo": 12
    },
    {
        "nome": "Pizza de Frango com Catupiry",
        "preco": 15.00,
        "tempo_preparo": 12
    },
    {
        "nome": "Crepe Misto",
        "preco": 10.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Crepe de Frango",
        "preco": 10.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Crepe de Charque e Cebola Caramelizada",
        "preco": 10.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Crepe de Banana com Chocolate",
        "preco": 10.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Crepe de Morango com Nutella",
        "preco": 10.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Strogonoff de Carne",
        "preco": 20.00,
        "tempo_preparo": 15
    },
    {
        "nome": "Macarrão com Queijo",
        "preco": 25.00,
        "tempo_preparo": 16
    },
    {
        "nome": "Salada de Frango",
        "preco": 12.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Frango a Cubana com Arroz de Brócolis",
        "preco": 12.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Frango a Parmegiana",
        "preco": 12.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Água de Coco",
        "preco": 7.00,
        "tempo_preparo": 0
    },    
    {
        "nome": "Coca-Cola",
        "preco": 6.00,
        "tempo_preparo": 0
    },
    {
        "nome": "Guaraná Antártica",
        "preco": 6.00,
        "tempo_preparo": 7
    },
    {
        "nome": "Suco de Limão",
        "preco": 8.00,
        "tempo_preparo": 2
    },
    {
        "nome": "Suco de Maracujá",
        "preco": 8.00,
        "tempo_preparo": 3
    },
    {
        "nome": "Suco de Acerola",
        "preco": 8.00,
        "tempo_preparo": 3
    },
    {
        "nome": "Suco de Morango",
        "preco": 9.00,
        "tempo_preparo": 4
    },
    {
        "nome": "Fanta Uva",
        "preco": 6.00,
        "tempo_preparo": 0
    },
    {
        "nome": "Fanta Laranja",
        "preco": 6.00,
        "tempo_preparo": 0
    },
    {
        "nome": "Guaraná da Amazônia",
        "preco": 7.00,
        "tempo_preparo": 0
    },
    {
        "nome": "Cerveja Budweiser",
        "preco": 7.00,
        "tempo_preparo": 0
    },
    {
        "nome": "Cerveja Heineken",
        "preco": 19.00,
        "tempo_preparo": 0
    },
]);


// Criando coleção de serviços
db.createCollection("servicos");


// Inserindo na coleção de serviços
db.servicos.insertMany([
    {
        "tipo": "retirada em local",
        "forma_pagamento": "Cartão de crédito",
        "lanches": [
            db.lanches.findOne({"nome": "Sanduíche de Queijo e Presunto"})
        ],
        "cliente": "João",
        "end_cliente": "Santa Delmira",
        "func_responsavel": "Maria"
    },
    {
        "tipo": "delivery",
        "forma_pagamento": "PIX",
        "lanches": [
            db.lanches.findOne({"nome": "Cachorro Quente"}),
            db.lanches.findOne({"nome": "Pastel de Queijo"}),
            db.lanches.findOne({"nome": "Guaraná Antártica"})
        ],
        "cliente": "Thiago",
        "end_cliente": "Conjunto Residencial Patrocínio",
        "func_responsavel": "Gabriel"
    },
    {
        "tipo": "retirada em local",
        "forma_pagamento": "Cartão de débito",
        "lanches": [
            db.lanches.findOne({"nome": "Macarrão com Queijo"}),
            db.lanches.findOne({"nome": "Cerveja Heineken"})
        ],
        "cliente": "Felipe",
        "end_cliente": "Campina Grande",
        "func_responsavel": "Maria"
    },
    {
        "tipo": "retirada em local",
        "forma_pagamento": "Cartão de crédito",
        "lanches": [
            db.lanches.findOne({"nome": "Suco de Limão"}),
            db.lanches.findOne({"nome": "Fanta Laranja"}),
            db.lanches.findOne({"nome": "Frango a Cubana com Arroz de Brócolis"}),
            db.lanches.findOne({"nome": "Pizza de Abacaxi"})
        ],
        "cliente": "João",
        "end_cliente": "Santa Delmira",
        "func_responsavel": "Gabriel"
    }
]);

// Criando coleção de lanchonetes
db.createCollection("lanchonetes");

// Inserindo na coleção de lanchonetes
db.lanchonetes.insertMany([
    {
        "nome": "Zé Lanches",
        "localizacao": "Bairro da Jabuticaba",
        "data_fundacao": new Date("2017-05-12"),
        "n_funcionarios": 10,
        "cardapio": [
            db.lanches.findOne({"nome": "Sanduíche de Queijo e Presunto"}),
            db.lanches.findOne({"nome": "Coxinha de Frango"}),
            db.lanches.findOne({"nome": "Cachorro Quente"}),
            db.lanches.findOne({"nome": "Coxinha de Bacalhau"}),
            db.lanches.findOne({"nome": "Crepe de Charque e Cebola Caramelizada"}),
            db.lanches.findOne({"nome": "Crepe de Banana com Chocolate"}),
            db.lanches.findOne({"nome": "Crepe de Morango com Nutella"}),
            db.lanches.findOne({"nome": "Fanta Uva"})
        ]
    },
    {
        "nome": "Big Burger",
        "localizacao": "Centro",
        "data_fundacao": new Date("2020-01-10"),
        "n_funcionarios": 15,
        "cardapio": [
            db.lanches.findOne({"nome": "Pastel de Queijo"}),
            db.lanches.findOne({"nome": "Pastel de Camarão"}),
            db.lanches.findOne({"nome": "Pastel de Carne"}),
            db.lanches.findOne({"nome": "X-Burguer"}),
            db.lanches.findOne({"nome": "X-Ratão"}),
            db.lanches.findOne({"nome": "X-Bacon"}),
            db.lanches.findOne({"nome": "X-Duplo"}),
            db.lanches.findOne({"nome": "X-Cheddar"})
        ]
    },
    {
        "nome": "Nivan Chef",
        "localizacao": "Bairro CIn",
        "data_fundacao": new Date("2020-08-14"),
        "n_funcionarios": 10,
        "cardapio": [
            db.lanches.findOne({"nome": "Pizza de Abacaxi"}),
            db.lanches.findOne({"nome": "Pizza de Calabresa"}),
            db.lanches.findOne({"nome": "Pizza de Frango com Catupiry"}),
            db.lanches.findOne({"nome": "Salada de Frango"}),
            db.lanches.findOne({"nome": "Strogonoff de Carne"}),
            db.lanches.findOne({"nome": "Macarrão com Queijo"}),
            db.lanches.findOne({"nome": "Cerveja Budweiser"}),
            db.lanches.findOne({"nome": "Cerveja Heineken"})
        ]
    },
    {
        "nome": "Rango Top",
        "localizacao": "Casa forte",
        "data_fundacao": new Date("2021-01-09"),
        "n_funcionarios": 22,
        "cardapio": [
            db.lanches.findOne({"nome": "Frango a Cubana com Arroz de Brócolis"}),
            db.lanches.findOne({"nome": "Frango a Parmegiana"}),
            db.lanches.findOne({"nome": "Coxinha de Charque"}),
            db.lanches.findOne({"nome": "Coca-Cola"}),
            db.lanches.findOne({"nome": "Guaraná Antártica"}),
            db.lanches.findOne({"nome": "Enroladinho"}),
            db.lanches.findOne({"nome": "Hamburguer"}),
            db.lanches.findOne({"nome": "Água de Coco"})
        ]
    },
    {
        "nome": "Lanchonete da Praça",
        "localizacao": "Jardim Imbariê",
        "data_fundacao": new Date("2012-03-29"),
        "n_funcionarios": 39,
        "cardapio": [
            db.lanches.findOne({"nome": "Crepe Misto"}),
            db.lanches.findOne({"nome": "Crepe de Frango"}),
            db.lanches.findOne({"nome": "Suco de Acerola"}),
            db.lanches.findOne({"nome": "Suco de Morango"}),
            db.lanches.findOne({"nome": "Suco de Maracujá"}),
            db.lanches.findOne({"nome": "Suco de Limão"}),
            db.lanches.findOne({"nome": "Guaraná da Amazônia"}),
            db.lanches.findOne({"nome": "Fanta Laranja"})
        ]
    }
]);