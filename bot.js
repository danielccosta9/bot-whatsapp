const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Está no ar! 🚀");
});

const lanches = [
  {
    id: 1,
    nome: "X-Burguer",
    preco: 10.0,
  },
  {
    id: 2,
    nome: "X-Salada",
    preco: 12.0,
  },
  {
    id: 3,
    nome: "X-Bacon",
    preco: 15.0,
  },
  {
    id: 4,
    nome: "X-Tudo",
    preco: 20.0,
  },
  {
    id: 5,
    nome: "X-Egg",
    preco: 12.0,
  },
  {
    id: 6,
    nome: "X-Frango",
    preco: 12.0,
  },
  {
    id: 7,
    nome: "X-Calabresa",
    preco: 12.0,
  },
  {
    id: 8,
    nome: "X-Picanha",
    preco: 15.0,
  },
  {
    id: 9,
    nome: "X-Picanha com Cheddar",
    preco: 20.0,
  },
  {
    id: 10,
    nome: "X-Picanha com Bacon",
    preco: 20.0,
  },
];

let pedido = [];
let total = 0;

client.on("message", async (message) => {
  const saudacaoRegex = /^.*\b(olá|oi|bom dia|boa tarde|boa noite)\b.*$/i;
  const cardapioRegex = /^.*\b(cardapio)\b.*$/i;
  const pedidoRegex = /^.*\b(pedido)\b.*$/i;
  const removerRegex = /^.*\b(remover)\b.*$/i;
  const finalizarRegex = /^.*\b(finalizar)\b.*$/i;

  if (saudacaoRegex.test(message.body.toLowerCase())) {
    await message.reply(
      `Olá, somos o *MCmerson´lanches!*\n\nAqui você pode fazer seu pedido de lanches e bebidas.\n\nEu me chamo *Daniel* e sou o seu atendente vitural!😊 \nAbaixo você encontra algumas funções do nosso sistema virtual. \n\nMenu: *cardapio* \n\nPara ver o pedido, digite *pedido* \n\nPara finalizar o pedido, digite *finalizar*\n\nCaso queira realizar o seu pedido por alguns dos nosso atendendes, aguarde que logo mais entrarão em contato.`
    );
  } else if (cardapioRegex.test(message.body.toLowerCase())) {
    let cardapio = "*Cardápio:*\n\n";
    lanches.map((lanche) => {
      cardapio += `*#${lanche.id} - ${lanche.nome}*\nR$ ${lanche.preco}\n\n`;
    });
    await message.reply(cardapio);
  } else if (pedidoRegex.test(message.body.toLowerCase())) {
    let pedidoTexto = "*Seu pedido:*\n\n";
    pedido.map((lanche) => {
      pedidoTexto += `*${lanche.nome}*\n`;
    });
    pedidoTexto += `\n*Total: R$ ${total}* \n\nPara adicionar mais itens, digite *cardapio*.\nPara finalizar o pedido, digite *finalizar*.`;
    await message.reply(pedidoTexto);
  } else if (finalizarRegex.test(message.body.toLowerCase())) {
    let pedidoTexto = "*Seu pedido:*\n\n";
    pedido.map((lanche) => {
      pedidoTexto += `*${lanche.nome}*\n`;
    });
    pedidoTexto += `\n*Total: R$ ${total}*`;
    pedidoTexto += `\n\n*Pedido finalizado!*\n\nAguarde que em breve entraremos em contato para confirmar o pedido e passar as informações de pagamento.`;
    await message.reply(pedidoTexto);
    pedido = [];
    total = 0;
  } else if (removerRegex.test(message.body.toLowerCase())) {
    const parametros = message.body.split(" ");
    if (parametros.length === 2) {
      const idRemover = parseInt(parametros[1]);
      const index = pedido.findIndex((item) => item.id === idRemover);
      if (index !== -1) {
        total -= pedido[index].preco;
        pedido.splice(index, 1);
        await message.reply(`Item removido do pedido.`);
      } else {
        await message.reply(`Não foi possível encontrar o item no pedido.`);
      }
    } else {
      await message.reply(
        `Formato inválido. Use remover e o número do item para remover um item do pedido. \nEx: *remover 1*`
      );
    }
  } else {
    for (let i = 0; i < lanches.length; i++) {
      if (
        message.body.toLowerCase() === `#${lanches[i].id}` ||
        message.body.toLowerCase() === `# ${lanches[i].id}`
      ) {
        pedido.push(lanches[i]);
        total += lanches[i].preco;
        await message.reply(
          `Pedido adicionado: *${lanches[i].nome}*\n\nTotal: R$ ${total}\n\nPara ver o pedido, digite *#pedido*.`
        );
      }
    }
  }
});

client.initialize();
