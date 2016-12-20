$(document).ready(function() {
	var boxOrganizacao = $('.info'),
		modalAberto = false,
		fonteModal,
		destinoModal,
		overlay = $('#overlay'),
		escurecer = overlay.find('.escurecer').eq(0),
		btFecharOverlay = overlay.find('.fechar-overlay').eq(0),
		boxTransicao = overlay.find('.transicao').eq(0),
		minicurriculos = overlay.find('.minicurriculos').eq(0),
		header = $('header').eq(0),
		alturaHeader = header.innerHeight(),
		titulo = header.find('.titulo').eq(0),
		sinopseTitulo = titulo.find('.sinopse'),
		headerfixo = $('#headerfixo'),
		barraProgresso = headerfixo.find('.barra-progresso > .progresso'),
		footer = $('footer').eq(0),
		todoCorpo = $('html,body'),
		alturaCorpo = todoCorpo.innerHeight(),
		janela = $(window),
		alturaJanela = janela.innerHeight(),
		scrollTopMaximo = todoCorpo.innerHeight() - alturaJanela;


	// metodo para revelar o modal
	function revelarModal(clicado, destino){

		todoCorpo.addClass('blockscroll');
		overlay.addClass('db');

		var wi = clicado.innerWidth();
		var hi = clicado.innerHeight();
		var xi = clicado.offset().left;
		var yi = clicado.offset().top - janela.scrollTop();
		var wf = destino.innerWidth();
		var hf = destino.innerHeight();
		var xf = destino.offset().left;
		var yf = destino.offset().top - janela.scrollTop();

		// console.log('Dimensões do clicado: \n'
		// 	+'X: '+xi
		// 	+'\nY: '+yi
		// 	+'\nlargura: '+wi
		// 	+'\naltura: '+hi
		// 	+'\n\nDimensões do destino: \n'
		// 	+'X: '+xf
		// 	+'\nY: '+yf
		// 	+'\nlargura: '+wf
		// 	+'\naltura: '+hi);

		boxTransicao.css({
			width: wi,
			height: hi,
			left: xi,
			top: yi
		});

		clicado.addClass('esconder');

		setTimeout(function(){
			escurecer.addClass('visivel');
			btFecharOverlay.addClass('visivel');
			boxTransicao.animate({
				width: wf,
				height: hf,
				left: xf,
				top: yf},
				200, function() {
				minicurriculos.addClass('visivel');
				boxTransicao.addClass('esconder');			
			});

		},20);
		modalAberto = true;
		fonteModal = clicado;
		destinoModal = destino;
	}

	// Método que esconde o modal

	function esconderModal(){

		var wi = fonteModal.innerWidth();
		var hi = fonteModal.innerHeight();
		var xi = fonteModal.offset().left;
		var yi = fonteModal.offset().top - janela.scrollTop();
		var wf = destinoModal.innerWidth();
		var hf = destinoModal.innerHeight();
		var xf = destinoModal.offset().left;
		var yf = destinoModal.offset().top - janela.scrollTop();

		todoCorpo.removeClass('blockscroll');
		escurecer.removeClass('visivel');
		btFecharOverlay.removeClass('visivel');
		minicurriculos.removeClass('visivel');			
		boxTransicao.removeClass('esconder')
		.css({
			width: wf,
			height: hf,
			left: xf,
			top: yf
		})
		.animate({
			width: wi,
			height: hi,
			left: xi,
			top: yi},
			200, function() {
				overlay.removeClass('db');
				fonteModal.removeClass('esconder');
				fonteModal = '';
				destinoModal = '';
		});
		
		modalAberto = false;
	}

	// atualizando a altura do header
	janela.on('resize', function(event) {
		alturaHeader = header.innerHeight();
		alturaJanela = janela.innerHeight();
		alturaCorpo = todoCorpo.innerHeight();
		scrollTopMaximo = todoCorpo.innerHeight() - alturaJanela;
	});

	// definindo interações com as informações sobre os autores/organizadores
	if (boxOrganizacao.length > 0) {
		var infoOrganizacao = boxOrganizacao.find('.membro.cdescricao');
		if (infoOrganizacao.length > 0) {
			console.log('tem info sobre '+infoOrganizacao.length+' autores')
			infoOrganizacao.each(function(index, el) {
				var infoAutOrg = $(el).html();
				minicurriculos.append(infoAutOrg);
			});
			minicurriculos.find('p.nome').replaceWith(function() {
			    return $('<h2/>', {html: this.innerHTML, class: 'nome'});
			});

			boxOrganizacao.on('click', function(event) {
				var boxClicado = $(this);
				revelarModal(boxClicado, minicurriculos);
			});
		} 
	}
	
	// Fechando overlay globalmente
	btFecharOverlay.on('click', function(event) {
		esconderModal();
	});

	escurecer.on('click', function(event) {
		esconderModal();
	});

	$(document).on('keyup', function(e) {
		var evento = e;
		var tecla = event.keyCode || evento.which;
		if (tecla == 27) {
			if (modalAberto == true) {
				evento.preventDefault();
				esconderModal();
			}
		}
	});

	// Revelando sinopse
	if (sinopseTitulo.length > 0) {
		titulo.on('click', function(event) {
			sinopseTitulo.slideToggle(200);
		});
	}

	// Definindo automaticamente título
	headerfixo.find('h1').text(function(){
		return titulo
		.find('h1')
		.clone()
		.find('span')
		.remove()
		.end()
		.text();
	});

	// Eventos de rolagem da página
	var rolagemAtual = janela.scrollTop();
	janela.on('scroll', function(event) {
		var rolagemEvento = $(this).scrollTop();
		if(rolagemEvento > alturaHeader){
			headerfixo.addClass('db');
			footer.addClass('visivel');
			var calcProgresso = (1 - ( (scrollTopMaximo - $(this).scrollTop() )/(scrollTopMaximo - alturaHeader) ) )*100;
			barraProgresso.css('width', calcProgresso+'%');
			if (rolagemEvento < rolagemAtual) {
				headerfixo.addClass('visivel');
			} else if(rolagemEvento > rolagemAtual){
				headerfixo.removeClass('visivel');
			}
		}
		 else if (rolagemEvento < alturaHeader ) {
			barraProgresso.css('width', '0%');
			footer.removeClass('visivel');
			setTimeout(function(){footer.removeClass('db')},200);
			if (rolagemEvento < alturaHeader-headerfixo.innerHeight()) {
				headerfixo.removeClass('db visivel');			
			}
		}
	rolagemAtual = rolagemEvento;
	});

});