//FIND: retorna todos as lanchonetes que apresentam opção de delivery
db.lanchonetes.find({"servicos.tipo": "delivery" });

// FIND, SIZE: lista as lanchonetes com 2 tipos de serviço: delivery e retirada em local
db.lanchonetes.find({servicos:{$size: 2}}).pretty();

//AGGREGATE, MATCH, GROUP: agrupa os restaurantes que apresentam um serviço de delivery e simultaneamente possuem opção vegetariana no cardápio
db.lanchonetes.aggregate( [
    {
       $match: {  "servicos.tipo": "delivery"}
    },
    {
        $match: {  "cardapio.vegetariano": true}
     },
    {
        $group: { _id: "$tipo", lanchonetes: { $push: "$$ROOT" } } 
    }
 ]);

// PROJECT, LOOKUP, GROUP, COND: percorre todos os pedidos e os classifica entre caro e barato
db.pedidos.aggregate([
    {
      $lookup: {
        from: "lanches",
        localField: "lanches.nome",
        foreignField: "nome",
        as: "detalhes_lanche"
      }
    },
    {
      $unwind: "$detalhes_lanche"
    },
    {
      $group: {
        _id: "$_id",
        total: { $sum: "$detalhes_lanche.preco" },
        tipo: { $first: "$tipo" },
        forma_pagamento: { $first: "$forma_pagamento" },
        lanches: { $first: "$lanches" },
        cliente: { $first: "$cliente" },
        end_cliente: { $first: "$end_cliente" },
        func_responsavel: { $first: "$func_responsavel" }
      }
    },
    {
      $project: {
        tipo: 1,
        forma_pagamento: 1,
        lanches: 1,
        cliente: 1,
        end_cliente: 1,
        func_responsavel: 1,
        classificacao: {
          $cond: {
            if: { $gte: ["$total", 40] },
            then: "Caro",
            else: "Barato"
          }
        }
      }
    }
  ]);

// GTE (>=): Seleciona todos os pratos que demoram 10 minutos ou mais para serem preparados e que são vegetarianos
db.lanches.find({
    tempo_preparo: {
        $gte: 10
    },
    vegetariano: true
}, {
    // Exibe o nome e o tempo de preparo de cada prato, em ordem crescente de acordo com o tempo de preparo
    nome: 1,
    tempo_preparo: 1
}).sort({tempo_preparo : 1});


// GROUP/SUM: Agrupa os pedidos de acordo com a soma do valor de seus lanches, exibindo os IDs dos pedidos e seu valor total
// Obs: Os pedidos são exibidos numa order diferente da que aparece no povoamento
db.pedidos.aggregate([
    {
        $unwind: "$lanches"
    },
    {
        $lookup: {
        from: "lanches",
        localField: "lanches._id",
        foreignField: "_id",
        as: "lanchesInfo"
    }},
    {
        $unwind: "$lanchesInfo"
    },
    {
        $group: {
        _id: "$id",
        total: {$sum: "$lanchesInfo.preco"}
    }}
]);

// COUNT: Contando todos os pedidos cuja funcionária responsável foi Maria
// A função COUNT funciona, mas mostra uma mensagem de deprecated, então substituí por countDocuments()
db.pedidos.countDocuments({
    "func_responsavel": "Maria"
});

// MAX: Seleciona o ID e o valor do item mais caro de cada pedido
db.pedidos.aggregate([
    {
        $unwind: "$lanches"
    },
    {
        $lookup: {
        from: "lanches",
        localField: "lanches._id",
        foreignField: "_id",
        as: "lanchesInfo"
    }},
    {
        $unwind: "$lanchesInfo"
    },
    {
        $group: {
        _id: "$id",
        maior: {$max: "$lanchesInfo.preco"}
    }}
]);

// AVG: retorna a média de preços dos lanches das lanchonetes
db.lanchonetes.aggregate([
    { $unwind: "$cardapio" },
    {
        $lookup:
        {
            from: "lanches",
            localField: "cardapio._id",
            foreignField: "_id",
            as: "lanches"
        }
    },
    { $unwind: "$lanches" },
    {
        $group:
        {
            _id: "$nome",
            mediaPreco: { $avg: "$lanches.preco" }
        }
    }
]);

// EXISTS: Retorna os lanches que possuem um preço
db.lanches.find({
    preco: { $exists: true }
});

// SORT: lista os nomes das lanchonetes por ordem alfabética
db.lanchonetes.aggregate([
    {
        $sort: {
            nome: 1
        }
    },
    {
        $project: {
            _id: 0,
            nome: 1
        }
    }
]);

// LIMIT: Lista os lanches que são vegetarianos e limita o resultado em 5 documentos
db.lanches.find({
    vegetariano: true
}).limit(5);

// WHERE: Retorna os lanches que possuem "Crepe" no nome
db.lanches.find({
    $where: function () {
        return this.nome.includes("Crepe");
    }
});

//MAP REDUCE: Calcular a média de preço dos lanches:
// O comando MAPREDUCE está deprecated. O Mongo recomenda substituí-lo por aggregate, mas como já temos uma consulta que calcula a média e várias que usam o aggregate, deixaremos ela aqui apenas para manter a checklist. De qualquer forma, ela funciona, mas exibe um warning.
db.lanches.mapReduce(
    function() {
        emit("media", this.preco);
    },
    function(key, values) {
        return Array.sum(values) / values.length;
    },
    {
        out: {inline: 1}
    }
);

//FUNCTION: Função para adicionar um item ao cardápio de uma lanchonete:
function adicionarItemCardapio(nomeLanchonete, item) {
    const lanchonete = db.lanchonetes.findOne({ "nome": nomeLanchonete });
    if (!lanchonete) {
        console.error("Lanchonete não encontrada");
        return;
    }

    const lanche = db.lanches.findOne({ "nome": item.nome });
    if (!lanche) {
        db.lanches.insertOne(item);
    }

    const itemId = db.lanches.findOne({ "nome": item.nome });

    db.lanchonetes.updateOne(
        { "nome": nomeLanchonete },
        { $push: { "cardapio": itemId } }
    );
    console.log("Item adicionado ao cardápio da lanchonete", nomeLanchonete);
}

const novoItem = { "nome": "Torrada Gourmet", "preco": 15.50, "tempo_preparo": 15, "vegetariano": true };
adicionarItemCardapio("Zé Lanches", novoItem);

//PRETTY: Consulta para listar todos os lanches com preço menor ou igual a R$10,00:
db.lanches.find({"preco": {$lte: 10}}).pretty();

//ALL: Consulta para encontrar lanchonetes que ofereçam "Sanduíche de Queijo e Presunto" e "Cachorro Quente" em seu cardápio:
db.lanchonetes.find({
    "cardapio.nome": {
        $all: ["Sanduíche de Queijo e Presunto", "Cachorro Quente"]
    }
})

// SET: Atualizar o preço de "Coca-Cola" para R$ 5,00:
db.lanches.updateOne(
    { "nome": "Coca-Cola" },
    { $set: { "preco": 5.00 } }
);
// SET: Atualizar a localização de uma lanchonete específica para "boa viagem, 100":
db.lanchonetes.updateOne(
    { "nome": "Zé Lanches" },
    { $set: { "localizacao": "boa viagem, 100" } }
);

// TEXT/SEARCH: busca todos os lanches que custam menos de 5 reais e têm coxinha em seu nome
db.lanches.createIndex({ nome: "text" });
db.lanches.find({ $text: { $search: "coxinha" }, preco: { $lt: 5.00 }}, { nome: 1, preco: 1, tempo_preparo: 1, vegetariano: 1, _id: 0 }).pretty();

// FILTER: busca todos os itens em todos os cardápios que tenham preço menor ou igual a 10 reais, com limite de 5 por cardápio
db.lanchonetes.aggregate([
    {
        $project: {
        _id: 0,
        nome_lanchonete: "$nome",
        cardapio: {
            $filter: {
                input: "$cardapio",
                as: "lanche",
                cond: {
                    $and: [
                        { $lte: [ "$$lanche.preco", 10 ] },
                        { $lt: [ { $indexOfArray: [ "$cardapio", "$$lanche" ] }, 5 ] }
                    ]
                }
            }
            }
        }
    }
])

// UPDATE: aumenta o valor do primeiro lanche com o nome "Pastel de Camarão" em 1 real e altera o tempo de preparo para 5 minutos
// update foi substituído por updateOne ou updateMany
db.lanches.updateOne(
    { nome: "Pastel de Camarão" },
    {
        $inc: { preco: 1.00 },
        $set: { tempo_preparo: 5 }
    }
);
db.lanches.find({ nome: "Pastel de Camarão" }, { nome: 1, preco: 1, tempo_preparo: 1, vegetariano: 1, _id: 0 });

// SAVE (INSERTONE): insere um novo lanche com nome "Pastel Mistão", preço 17 reais e tempo de preparo 15 minutos, mas sem especificar o _id
// save foi substituído pelo insertOne ou insertMany
db.lanches.insertOne({ nome: "Pastel Mistão", preco: 17.00, tempo_preparo: 15, vegetariano: false });

// RENAMECOLLECTION: renomeia o nome da coleção de lanches para laches; busca nome, preço e tempo de preparo de todos os lanches e depois muda novamente para lanches
db.lanches.renameCollection("laches");
db.laches.find().pretty();
db.laches.renameCollection("lanches");

// LOOKUP/MATCH/GROUP: utiliza o $lookup para buscar os lanches de cada lanchonete, com base no id dos itens no cardápios e os agrupa de forma detalhada para cada lanchonete
// vale ressaltar que o cardapio já contém os lanches, então não seria necessário utilizar essa função, mas foi feito para demonstrar o uso do $lookup
db.lanchonetes.aggregate([
    {
        $unwind: "$cardapio"
    },
    {
        $lookup: {
        from: "lanches",
        localField: "cardapio._id",
        foreignField: "_id",
        as: "lanches_detalhados"
    }
    },
    {
        $unwind: "$lanches_detalhados"
    },
    {
        $match: {
            "lanches_detalhados": { $exists: true }
        }
    },
    {
        $group: {
            _id: "$_id",
            nome: { $first: "$nome" },
            localizacao: { $first: "$localizacao" },
            data_fundacao: { $first: "$data_fundacao" },
            n_funcionarios: { $first: "$n_funcionarios" },
            cardapio: { $push: "$lanches_detalhados" }
        }
    }
]);

// FINDONE: busca a primeira lanchonete, em ordem de inserção, que tenha menos de 40 funcionários
db.lanchonetes.findOne(
    { $expr: { $lte: [ "$n_funcionarios", "$$num" ] } },
    { _id: 0 },
    { let : { num: 39 }
});

// ADDTOSET: adiciona o novo lanche ao cardápio da lanchonete "Rango Top"
// Usado para encontrar o lanche "Pastel Mistão" na coleção lanches
var pastelMistao = db.lanches.findOne({ nome: "Pastel Mistão" });
// Atualiza a lanchonete "Rango Top" para adicionar o item "Pastel Mistão" ao cardápio
db.lanchonetes.updateOne(
{ nome: "Rango Top" },
{ $addToSet: { cardapio: pastelMistao } }
);
