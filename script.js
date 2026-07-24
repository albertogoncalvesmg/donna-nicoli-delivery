// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================
const WHATSAPP_NUMERO = "5531991546556"; 

// ==========================================
// LÓGICA DO CARRINHO E INTERFACE
// ==========================================
const inputsMassa = document.querySelectorAll('.input-massa');
const inputsMolho = document.querySelectorAll('.input-molho');
const inputsAdicional = document.querySelectorAll('.input-adicional');
const inputsBebida = document.querySelectorAll('.input-bebida'); 
const spanValorTotal = document.getElementById('valor-total');
const btnFinalizar = document.getElementById('btn-finalizar-whatsapp');

// Variáveis do Pagamento
const inputsPagamento = document.querySelectorAll('.input-pagamento');
const boxPix = document.getElementById('box-pix');
const boxTroco = document.getElementById('box-troco');
const inputTroco = document.getElementById('valor-troco');

let totalPedido = 0;

function atualizarValorTotal() {
    totalPedido = 0;
    
    // Nova linha: Soma o valor da Massa (R$ 19,90)
    inputsMassa.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); });
    
    // Mantém as somas que já existiam
    inputsMolho.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); });
    inputsAdicional.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); });
    inputsBebida.forEach(input => { if (input.checked) totalPedido += parseFloat(input.dataset.preco); }); 
    
    spanValorTotal.innerText = totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}}

inputsMassa.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsMolho.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsAdicional.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsBebida.forEach(input => input.addEventListener('change', atualizarValorTotal)); 

// Função para mostrar/esconder opções de pagamento
inputsPagamento.forEach(input => {
    input.addEventListener('change', (evento) => {
        // Primeiro esconde os dois boxes
        boxPix.classList.add('d-none');
        boxTroco.classList.add('d-none');
        
        // Depois mostra só o que foi selecionado
        if (evento.target.value === 'PIX') {
            boxPix.classList.remove('d-none');
        } else if (evento.target.value === 'Dinheiro') {
            boxTroco.classList.remove('d-none');
        }
    });
});

// ==========================================
// ENVIO DO PEDIDO: "MONTE O SEU"
// ==========================================
btnFinalizar.addEventListener('click', () => {
    const massaEscolhida = document.querySelector('.input-massa:checked');
    const molhoEscolhido = document.querySelector('.input-molho:checked');
    const pagamentoEscolhido = document.querySelector('.input-pagamento:checked');

    if (!massaEscolhida || !molhoEscolhido) {
        alert('Por favor, escolha uma massa e um molho para montar o seu prato!');
        return; 
    }

    if (!pagamentoEscolhido) {
        alert('Por favor, escolha uma forma de pagamento no final da tela!');
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
    
    if (bebidasEscolhidas.length > 0) {
        textoPedido += `🥤 *Bebidas:* ${bebidasEscolhidas.join(', ')}\n`;
    }

    textoPedido += `\n💰 *Total do pedido: ${totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n`;
    
    // Adicionando informações do pagamento na mensagem
    textoPedido += `💳 *Forma de Pagamento:* ${pagamentoEscolhido.value}\n`;
    if (pagamentoEscolhido.value === 'Dinheiro' && inputTroco.value.trim() !== '') {
        textoPedido += `   *(Precisa de troco para R$ ${inputTroco.value})*\n`;
    }

    textoPedido += `\nAguardo a confirmação e a taxa de entrega para enviar o comprovante/endereço!`;

    const textoCodificado = encodeURIComponent(textoPedido);
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`, '_blank');
});

// ==========================================
// ENVIO DE PEDIDO RÁPIDO: "PRATOS DA CASA" E "PROMOÇÕES"
// ==========================================
document.querySelectorAll('.btn-pedir-prato').forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const nomePrato = evento.target.dataset.nome;
        const precoPrato = parseFloat(evento.target.dataset.preco);

        let textoPedidoRapido = `Olá! Quero pedir um prato pronto na *Donna Nicoli* 🍝\n\n`;
        textoPedidoRapido += `🍽️ *Prato:* ${nomePrato}\n`;
        textoPedidoRapido += `💰 *Valor:* ${precoPrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
        textoPedidoRapido += `Aguardo a confirmação para passar o endereço e a forma de pagamento!`;

        const textoCodificadoRapido = encodeURIComponent(textoPedidoRapido);
        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificadoRapido}`, '_blank');
    });
});
