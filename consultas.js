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
