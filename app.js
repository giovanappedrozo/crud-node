const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");

const app = express();

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (error, data) => {
  if (error) console.log(error);
  else products = JSON.parse(data);
});

// Body => Enviar dados para a aplicação
// Params => /product/456789994 * obrigatório
// Query => /product?id=973458799079&value=982793462086

function createProductFile(type = 1) {
  return fs.writeFile("products.json", JSON.stringify(products), (error) => {
    if (error)
      return `Não foi possível ${
        type === 1 ? "inserir" : "alterar"
      } o produto!`;
    else return `Produto ${type === 1 ? "inserido" : "alterado"} com sucesso!`;
  });
}

app.get("/products", (request, response) => {
  return response.json(products);
});

app.post("/products", (request, response) => {
  const body = request.body;
  const product = { ...body, id: randomUUID() };

  products.push(product);
  return response.json({ message: createProductFile() });
});

app.get("/products/:id", (request, response) => {
  const { id } = request.params;

  return response.json(products.find((product) => product.id === id));
});

app.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { name, price } = request.body;

  const productIndex = products.findIndex((product) => product.id === id);
  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };
  return response.json({ message: createProductFile(2) });
});

app.delete("/products/:id", (request, response) => {
  const { id } = request.params;

  const productIndex = products.findIndex((product) => product.id === id);

  products.splice(productIndex, 1);

  return response.json({ message: "Produto removido com sucesso!" });
});

app.listen(4002, () => console.log("Servidor está rodando na porta 4002!"));
