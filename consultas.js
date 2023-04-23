// TEXT/SEARCH: busca todos os lanches que custam menos de 5 reais e têm coxinha em seu nome
db.lanches.createIndex({ nome: "text" });
db.lanches.find({ $text: { $search: "coxinha" }, preco: { $lt: 5.00 }}, { nome: 1, preco: 1, tempo_preparo: 1, _id: 0 }).pretty();

// FILTER: busca todos os itens em todos os cardápios que tenham preço menor ou igual a 10 reais, com limite de 5 por cardápio
db.lanchonetes.aggregate({
    $project: {
        nome: 1,
        cardapio: {
        $filter: {
            input: "$cardapio",
            cond: { $lte: [ "$$item.price", 10] },
            as: "item",
            limit: 5
        }
    }
    }
});

// RENAMECOLLECTION: renomeia o nome da coleção de lanches para laches; busca nome, preço e tempo de preparo de todos os lanches e depois muda novamente para lanches
db.lanches.renameCollection("laches");
db.laches.find({_id: 0, nome: 1, preco: 1, tempo_preparo: 1});
db.laches.renameCollection("lanches");

// UPDATE: aumenta o valor do primeiro lanche com o nome "Pastel de Camarão" em 1 real e altera o tempo de preparo para 5 minutos
// update foi substituído por updateOne ou updateMany
db.lanches.updateOne(
    { nome: "Pastel de Camarão" },
    {
        $inc: { preco: 1.00 },
        $set: { tempo_preparo: 5 }
    }
);
db.lanches.find({ nome: "Pastel de Camarão" }, { nome: 1, preco: 1, tempo_preparo: 1, _id: 0 });

// FINDONE: busca a primeira lanchonete que tenha menos de 40 funcionários
db.lanchonetes.findOne(
    { $expr: { $lte: [ "$n_funcionarios", "$$num" ] } },
    { _id: 0 },
    { let : { num: 39 }
});

// LOOKUP/MATCH/PROJECT: busca todos
db.lanchonetes.aggregate([
    {
    $lookup:
        {
            from: "lanches",
            let: { preco_item: "$preco" },
            pipeline: [
            { $match:
                { $expr:
                    { $lte: [ "$$preco_item", "$n_funcionarios" ]}
                }
            },
            { $project: { _id: 0} }
            ],
            as: "lanches"
        }
    }
]);

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

// SAVE (INSERTONE): insere um novo lanche com nome "Pastel Mistão", preço 17 reais e tempo de preparo 15 minutos, mas sem especificar o _id
// save foi substituído pelo insertOne ou insertMany
db.lanches.insertOne({ nome: "Pastel Mistão", preco: 17.00, tempo_preparo: 15 });

// ADDTOSET: adiciona o novo lanche ao cardápio da lanchonete "Rango Top"
db.lanchonetes.updateOne(
    { nome: "Rango Top" },
    { $addToSet: { cardapio: { _id: ObjectId("64449fc089549bfcbe33690b"), nome: "Pastel Mistão", preco: 17.00, tempo_preparo: 15  } } }
);


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


// GROUP/SUM: Agrupa os pedidos de acordo com a soma do valor de seus lanches
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
        _id: "$_id",
        total: {$sum: "$lanchesInfo.preco"}
    }}
]);


// MAX: Seleciona o item mais caro de cada pedido
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


// COUNT: Contando todos os pedidos cuja funcionária responsável foi Maria
// A função COUNT funciona, mas mostra uma mensagem de deprecated, então substituí por countDocuments()
db.pedidos.countDocuments({
    "func_responsavel": "Maria"
});
