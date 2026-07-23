// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================
const WHATSAPP_NUMERO = "5531991546556"; 

// ==========================================
// LÓGICA DO CARRINHO: "MONTE O SEU"
// ==========================================
const inputsMassa = document.querySelectorAll('.input-massa');
const inputsMolho = document.querySelectorAll('.input-molho');
const inputsAdicional = document.querySelectorAll('.input-adicional');
const inputsBebida = document.querySelectorAll('.input-bebida'); // Novo seletor de bebidas
const spanValorTotal = document.getElementById('valor-total');
const btnFinalizar = document.getElementById('btn-finalizar-whatsapp');

let totalPedido = 0;

function atualizarValorTotal() {
    totalPedido = 0;

    inputsMolho.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); });
    inputsAdicional.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); });
    inputsBebida.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); }); // Soma bebidas

    spanValorTotal.innerText = totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

inputsMassa.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsMolho.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsAdicional.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsBebida.forEach(input => input.addEventListener('change', atualizarValorTotal)); // Ouve cliques nas bebidas

// ==========================================
// ENVIO DO PEDIDO: "MONTE O SEU"
// ==========================================
btnFinalizar.addEventListener('click', () => {
    const massaEscolhida = document.querySelector('.input-massa:checked');
    const molhoEscolhido = document.querySelector('.input-molho:checked');

    if (!massaEscolhida || !molhoEscolhido) {
        alert('Por favor, escolha uma massa e um molho para montar o seu prato!');
        return; 
    }

    let adicionaisEscolhidos = [];
    inputsAdicional.forEach(input => { if (input.checked) adicionaisEscolhidos.push(input.value); });

    let bebidasEscolhidas = [];
    inputsBebida.forEach(input => { if (input.checked) bebidasEscolhidas.push(input.value); });

    let textoPedido = `Olá! Quero fazer um pedido na *Donna Nicoli* 🍝\n\n`;
    textoPedido += `*👩‍🍳 MONTE O SEU DELIVERY*\n`;
    textoPedido += `🍲 *Massa:* ${massaEscolhida.value}\n`;
    textoPedido += `🍅 *Molho:* ${molhoEscolhido.value}\n`;

    textoPedido += `🥓 *Adicionais:* ${adicionaisEscolhidos.length > 0 ? adicionaisEscolhidos.join(', ') : 'Nenhum'}\n`;
    
    // Adiciona as bebidas no texto se alguma foi escolhida
    if (bebidasEscolhidas.length > 0) {
        textoPedido += `🥤 *Bebidas:* ${bebidasEscolhidas.join(', ')}\n`;
    }

    textoPedido += `\n💰 *Total do pedido: ${totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\n`;
    textoPedido += `Aguardo a confirmação, a taxa de entrega e a chave PIX!`;

    const textoCodificado = encodeURIComponent(textoPedido);
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`, '_blank');
});

// ==========================================
// ENVIO DE PEDIDO RÁPIDO: "PRATOS DA CASA"
// ==========================================
document.querySelectorAll('.btn-pedir-prato').forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const nomePrato = evento.target.dataset.nome;
        const precoPrato = parseFloat(evento.target.dataset.preco);

        let textoPedidoRapido = `Olá! Quero pedir um *Prato da Casa* na Donna Nicoli 🍝\n\n`;
        textoPedidoRapido += `🍽️ *Prato:* ${nomePrato}\n`;
        textoPedidoRapido += `💰 *Valor:* ${precoPrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
        textoPedidoRapido += `Aguardo a confirmação, a taxa de entrega e a chave PIX!`;

        const textoCodificadoRapido = encodeURIComponent(textoPedidoRapido);
        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificadoRapido}`, '_blank');
    });
});
