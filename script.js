// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================
// Substitua pelo número exato do WhatsApp da Donna Nicoli (apenas números, com DDI e DDD)
const WHATSAPP_NUMERO = "5531991546556"; 

// ==========================================
// LÓGICA DO CARRINHO: "MONTE O SEU"
// ==========================================

// Selecionando os elementos do HTML
const inputsMassa = document.querySelectorAll('.input-massa');
const inputsMolho = document.querySelectorAll('.input-molho');
const inputsAdicional = document.querySelectorAll('.input-adicional');
const spanValorTotal = document.getElementById('valor-total');
const btnFinalizar = document.getElementById('btn-finalizar-whatsapp');

// Variável para guardar o valor total do "Monte o Seu"
let totalPedido = 0;

// Função para calcular e atualizar o valor na tela
function atualizarValorTotal() {
    totalPedido = 0;

    // Soma o valor do molho escolhido (A massa tem valor 0, o preço base está no molho)
    inputsMolho.forEach(input => {
        if (input.checked) {
            totalPedido += parseFloat(input.dataset.preco);
        }
    });

    // Soma o valor de cada adicional marcado
    inputsAdicional.forEach(input => {
        if (input.checked) {
            totalPedido += parseFloat(input.dataset.preco);
        }
    });

    // Formata o valor para o padrão Real Brasileiro (R$ 0,00)
    spanValorTotal.innerText = totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adicionando "ouvintes" para que o cálculo seja feito toda vez que o cliente clicar em algo
inputsMassa.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsMolho.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsAdicional.forEach(input => input.addEventListener('change', atualizarValorTotal));

// ==========================================
// ENVIO DO PEDIDO: "MONTE O SEU"
// ==========================================

btnFinalizar.addEventListener('click', () => {
    // 1. Validar se o cliente escolheu a massa e o molho
    const massaEscolhida = document.querySelector('.input-massa:checked');
    const molhoEscolhido = document.querySelector('.input-molho:checked');

    if (!massaEscolhida || !molhoEscolhido) {
        alert('Por favor, escolha uma massa e um molho para montar o seu prato!');
        return; // Interrompe a função se faltar item obrigatório
    }

    // 2. Coletar os adicionais marcados
    let adicionaisEscolhidos = [];
    inputsAdicional.forEach(input => {
        if (input.checked) {
            adicionaisEscolhidos.push(input.value);
        }
    });

    // 3. Montar o texto amigável para o WhatsApp
    let textoPedido = `Olá! Quero fazer um pedido na *Donna Nicoli* 🍝\n\n`;
    textoPedido += `*👩‍🍳 MONTE O SEU DELIVERY*\n`;
    textoPedido += `🍲 *Massa:* ${massaEscolhida.value}\n`;
    textoPedido += `🍅 *Molho:* ${molhoEscolhido.value}\n`;

    if (adicionaisEscolhidos.length > 0) {
        textoPedido += `🥓 *Adicionais:* ${adicionaisEscolhidos.join(', ')}\n`;
    } else {
        textoPedido += `🥓 *Adicionais:* Nenhum\n`;
    }

    textoPedido += `\n💰 *Total do prato: ${totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\n`;
    textoPedido += `Aguardo a confirmação, a taxa de entrega e a chave PIX!`;

    // 4. Codificar o texto para formato de Link de Internet e redirecionar
    const textoCodificado = encodeURIComponent(textoPedido);
    const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`;
    
    window.open(linkWhatsApp, '_blank');
});

// ==========================================
// ENVIO DE PEDIDO RÁPIDO: "PRATOS DA CASA"
// ==========================================

const botoesPratos = document.querySelectorAll('.btn-pedir-prato');

botoesPratos.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        // Pega as informações escondidas dentro do botão no HTML (data-nome e data-preco)
        const nomePrato = evento.target.dataset.nome;
        const precoPrato = parseFloat(evento.target.dataset.preco);

        // Monta o texto para o prato pronto
        let textoPedidoRapido = `Olá! Quero pedir um *Prato da Casa* na Donna Nicoli 🍝\n\n`;
        textoPedidoRapido += `🍽️ *Prato:* ${nomePrato}\n`;
        textoPedidoRapido += `💰 *Valor:* ${precoPrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
        textoPedidoRapido += `Aguardo a confirmação, a taxa de entrega e a chave PIX!`;

        const textoCodificadoRapido = encodeURIComponent(textoPedidoRapido);
        const linkWhatsAppRapido = `https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificadoRapido}`;
        
        window.open(linkWhatsAppRapido, '_blank');
    });
});