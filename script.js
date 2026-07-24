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
const inputsPrato = document.querySelectorAll('.input-prato'); 
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
// FUNÇÃO: VERIFICAR HORÁRIO DE FUNCIONAMENTO
// ==========================================
function restauranteEstaAberto() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    // Converte o horário atual para minutos (para facilitar a matemática)
    const minutosAtuais = (hora * 60) + minuto;
    
    // 10:30 = (10 * 60) + 30 = 630 minutos
    const horarioAbertura = 630; 
    
    // 14:00 = 14 * 60 = 840 minutos
    const horarioFechamento = 840; 

    // Verifica se é um dia de semana útil (Segunda a Sexta)
    const diaAberto = (diaSemana >= 1 && diaSemana <= 5);
    
    // Verifica se a hora atual está dentro da janela de funcionamento
    const horaAberta = (minutosAtuais >= horarioAbertura && minutosAtuais < horarioFechamento);

    return (diaAberto && horaAberta);
}

// ==========================================
// ENVIO DO PEDIDO PARA O WHATSAPP (LIVRE)
// ==========================================
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        
        // VALIDAÇÃO 0: Horário de Funcionamento (A MÁGICA ACONTECE AQUI)
        if (!restauranteEstaAberto()) {
            const querEnviarFechado = confirm('😴 Ops! O nosso delivery está fechado agora.\n\nNosso horário de funcionamento é de Segunda a Sexta, das 10h30 às 14h.\n\nDeseja enviar sua mensagem no WhatsApp mesmo assim para deixar seu pedido agendado?');
            
            // Se o cliente clicar em "Cancelar", ele bloqueia a ação e não envia nada
            if (!querEnviarFechado) {
                return; 
            }
        }

        // Coleta TUDO o que foi marcado na página
        let pratosEscolhidos = [];
        inputsPrato.forEach(input => { if (input.checked) pratosEscolhidos.push(input.value); });
        
        const massaEscolhida = document.querySelector('.input-massa:checked');
        const molhoEscolhido = document.querySelector('.input-molho:checked');
        
        let adicionaisEscolhidos = [];
        inputsAdicional.forEach(input => { if (input.checked) adicionaisEscolhidos.push(input.value); });
        
        let bebidasEscolhidas = [];
        inputsBebida.forEach(input => { if (input.checked) bebidasEscolhidas.push(input.value); });

        const pagamentoEscolhido = document.querySelector('.input-pagamento:checked');

        // VALIDAÇÃO 1: Carrinho Vazio?
        if (pratosEscolhidos.length === 0 && !massaEscolhida && !molhoEscolhido && adicionaisEscolhidos.length === 0 && bebidasEscolhidas.length === 0) {
            alert('Seu carrinho está vazio! Escolha algum prato, bebida ou monte sua massa para fazer o pedido.');
            return;
        }

        // VALIDAÇÃO 2: Esqueceu de dizer como vai pagar?
        if (!pagamentoEscolhido) {
            alert('Por favor, escolha uma forma de pagamento no final da tela!');
            return;
        }

        // CONSTRUINDO A MENSAGEM INTELIGENTE
        let textoPedido = `Olá! Quero fazer um pedido na *Donna Nicoli* 🍝\n\n`;

        if (pratosEscolhidos.length > 0) {
            textoPedido += `🍽️ *PRATOS PRONTOS:*\n`;
            pratosEscolhidos.forEach(prato => { textoPedido += `- ${prato}\n`; });
            textoPedido += `\n`;
        }

        if (massaEscolhida || molhoEscolhido || adicionaisEscolhidos.length > 0) {
            textoPedido += `👩‍🍳 *ITENS DO CARDÁPIO LIVRE:*\n`;
            if (massaEscolhida) textoPedido += `🍲 *Massa:* ${massaEscolhida.value}\n`;
            if (molhoEscolhido) textoPedido += `🍅 *Molho:* ${molhoEscolhido.value}\n`;
            if (adicionaisEscolhidos.length > 0) textoPedido += `🥓 *Adicionais:* ${adicionaisEscolhidos.join(', ')}\n`;
            textoPedido += `\n`;
        }
        
        if (bebidasEscolhidas.length > 0) {
            textoPedido += `🥤 *BEBIDAS:*\n`;
            bebidasEscolhidas.forEach(bebida => { textoPedido += `- ${bebida}\n`; });
            textoPedido += `\n`;
        }

        textoPedido += `💰 *Total do pedido: ${totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n`;
        textoPedido += `💳 *Forma de Pagamento:* ${pagamentoEscolhido.value}\n`;
        if (pagamentoEscolhido.value === 'Dinheiro' && inputTroco && inputTroco.value.trim() !== '') {
            textoPedido += `   *(Precisa de troco para R$ ${inputTroco.value})*\n`;
        }

        textoPedido += `\nAguardo a confirmação e a taxa de entrega para enviar o endereço!`;

        const textoCodificado = encodeURIComponent(textoPedido);
        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`, '_blank');
    });
}
