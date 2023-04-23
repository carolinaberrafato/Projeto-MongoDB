// busca todos os lanches que custam menos de 5 reais e têm coxinha em seu nome
db.lanches.createIndex({ nome: "text" });
db.lanches.find({ $text: { $search: "coxinha" }, preco: { $lt: 5.00 }}, { nome: 1, preco: 1, tempo_preparo: 1, _id: 0 }).pretty();

// busca todos os itens em todos os cardápios que tenham preço menor ou igual a 10 reais, com limite de 5 por cardápio
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

// renomeia o nome da coleção de lanches para laches; busca nome, preço e tempo de preparo de todos os lanches e depois muda novamente para lanches
db.lanches.renameCollection("laches");
db.laches.find({_id: 0, nome: 1, preco: 1, tempo_preparo: 1});
db.laches.renameCollection("lanches");

// aumenta o valor do primeiro lanche com o nome "Pastel de Camarão" em 1 real e altera o tempo de preparo para 5 minutos
// update foi substituído por updateOne ou updateMany
db.lanches.updateOne(
    { nome: "Pastel de Camarão" },
    {
        $inc: { preco: 1.00 },
        $set: { tempo_preparo: 5 }
    }
);
db.lanches.find({ nome: "Pastel de Camarão" }, { nome: 1, preco: 1, tempo_preparo: 1, _id: 0 });

// busca a primeira lanchonete que tenha menos de 40 funcionários
db.lanchonetes.findOne(
    { $expr: { $lte: [ "$n_funcionarios", "$$num" ] } },
    { _id: 0 },
    { let : { num: 39 }
});

// busca todos
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

// utiliza o $lookup para buscar os lanches de cada lanchonete, com base no id dos itens no cardápios e os agrupa de forma detalhada para cada lanchonete
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

// insere um novo lanche com nome "Pastel Mistão", preço 17 reais e tempo de preparo 15 minutos, mas sem especificar o _id
// save foi substituído pelo insertOne ou insertMany
db.lanches.insertOne({ nome: "Pastel Mistão", preco: 17.00, tempo_preparo: 15 });

// adiciona o novo lanche ao cardápio da lanchonete "Rango Top"
db.lanchonetes.updateOne(
    { nome: "Rango Top" },
    { $addToSet: { cardapio: { _id: ObjectId("64449fc089549bfcbe33690b"), nome: "Pastel Mistão", preco: 17.00, tempo_preparo: 15  } } }
);