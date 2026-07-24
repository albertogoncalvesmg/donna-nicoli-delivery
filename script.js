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
const inputsPrato = document.querySelectorAll('.input-prato'); // Nova linha pros pratos prontos!
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
    
    // Soma todas as categorias
    inputsPrato.forEach(input => { if (input.checked && input.dataset.preco) totalPedido += parseFloat(input.dataset.preco); });
    inputsMassa.forEach(input => { if (input.checked && input.dataset.preco) totalPedido += parseFloat(input.dataset.preco); });
    inputsMolho.forEach(input => { if (input.checked && input.dataset.preco) totalPedido += parseFloat(input.dataset.preco); });
    inputsAdicional.forEach(input => { if (input.checked && input.dataset.preco) totalPedido += parseFloat(input.dataset.preco); });
    inputsBebida.forEach(input => { if (input.checked && input.dataset.preco) totalPedido += parseFloat(input.dataset.preco); }); 
    
    spanValorTotal.innerText = totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Ouvintes de clique
inputsPrato.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsMassa.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsMolho.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsAdicional.forEach(input => input.addEventListener('change', atualizarValorTotal));
inputsBebida.forEach(input => input.addEventListener('change', atualizarValorTotal)); 

// Função de mostrar/esconder PIX e Troco
if (inputsPagamento.length > 0) {
    inputsPagamento.forEach(input => {
        input.addEventListener('change', (evento) => {
            if(boxPix) boxPix.classList.add('d-none');
            if(boxTroco) boxTroco.classList.add('d-none');
            
            if (evento.target.value === 'PIX' && boxPix) {
                boxPix.classList.remove('d-none');
            } else if (evento.target.value === 'Dinheiro' && boxTroco) {
                boxTroco.classList.remove('d-none');
            }
        });
    });
}

// ==========================================
// ENVIO DO PEDIDO PARA O WHATSAPP
// ==========================================
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        
        // Coleta o que foi marcado
        let pratosEscolhidos = [];
        inputsPrato.forEach(input => { if (input.checked) pratosEscolhidos.push(input.value); });
        
        const massaEscolhida = document.querySelector('.input-massa:checked');
        const molhoEscolhido = document.querySelector('.input-molho:checked');
        const pagamentoEscolhido = document.querySelector('.input-pagamento:checked');
        
        let adicionaisEscolhidos = [];
        inputsAdicional.forEach(input => { if (input.checked) adicionaisEscolhidos.push(input.value); });
        
        let bebidasEscolhidas = [];
        inputsBebida.forEach(input => { if (input.checked) bebidasEscolhidas.push(input.value); });

        // Validações Inteligentes
        const temPratoPronto = pratosEscolhidos.length > 0;
        const querMonteOSeu = massaEscolhida || molhoEscolhido || adicionaisEscolhidos.length > 0;
        const temBebida = bebidasEscolhidas.length > 0;

        // 1. Carrinho vazio?
        if (!temPratoPronto && !querMonteOSeu && !temBebida) {
            alert('Seu carrinho está vazio! Escolha um prato, monte o seu ou adicione uma bebida.');
            return;
        }

        // 2. Se começou a montar o prato, terminou?
        if (querMonteOSeu && (!massaEscolhida || !molhoEscolhido)) {
            alert('Você começou a "Montar o Seu Delivery", mas esqueceu de escolher a Massa ou o Molho!');
            return;
        }

        // 3. Escolheu como vai pagar?
        if (!pagamentoEscolhido) {
            alert('Por favor, escolha uma forma de pagamento no final da tela!');
            return;
        }

        // Construindo a mensagem
        let textoPedido = `Olá! Quero fazer um pedido na *Donna Nicoli* 🍝\n\n`;

        // Bloco de Pratos Prontos
        if (temPratoPronto) {
            textoPedido += `🍽️ *PRATOS PRONTOS:*\n`;
            pratosEscolhidos.forEach(prato => { textoPedido += `- ${prato}\n`; });
            textoPedido += `\n`;
        }

        // Bloco do Monte o Seu
        if (querMonteOSeu) {
            textoPedido += `👩‍🍳 *MONTE O SEU:*\n`;
            textoPedido += `🍲 *Massa:* ${massaEscolhida.value}\n`;
            textoPedido += `🍅 *Molho:* ${molhoEscolhido.value}\n`;
            textoPedido += `🥓 *Adicionais:* ${adicionaisEscolhidos.length > 0 ? adicionaisEscolhidos.join(', ') : 'Nenhum'}\n\n`;
        }
        
        // Bloco de Bebidas
        if (temBebida) {
            textoPedido += `🥤 *BEBIDAS:*\n`;
            bebidasEscolhidas.forEach(bebida => { textoPedido += `- ${bebida}\n`; });
            textoPedido += `\n`;
        }

        // Total e Pagamento
        textoPedido += `💰 *Total do pedido: ${totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n`;
        textoPedido += `💳 *Forma de Pagamento:* ${pagamentoEscolhido.value}\n`;
        if (pagamentoEscolhido.value === 'Dinheiro' && inputTroco && inputTroco.value.trim() !== '') {
            textoPedido += `   *(Precisa de troco para R$ ${inputTroco.value})*\n`;
        }

        textoPedido += `\nAguardo a confirmação e a taxa de entrega para enviar o comprovante/endereço!`;

        const textoCodificado = encodeURIComponent(textoPedido);
        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`, '_blank');
    });
}
