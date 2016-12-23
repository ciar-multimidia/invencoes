$(document).ready(function() {
	var boxOrganizacao = $('.info'),
		overlayAberto = false,
		modalFoiAberto = false,
		sumarioAberto = false,
		fonteModal,
		destinoModal,
		overlay = $('#overlay'),
		escurecer = overlay.find('.escurecer').eq(0),
		btFecharOverlay = overlay.find('.fechar-overlay').eq(0),
		boxTransicao = overlay.find('.transicao').eq(0),
		modais = overlay.find('.modais > div'),
		minicurriculos = modais.filter('.minicurriculos').eq(0),
		sumario = $('#sumario'),
		botoesSumario = $('.btsumario'),
		header = $('header').eq(0),
		alturaHeader = header.innerHeight(),
		titulo = header.find('.titulo').eq(0),
		sinopseTitulo = titulo.find('.sinopse'),
		headerfixo = $('#headerfixo'),
		barraProgresso = headerfixo.find('.barra-progresso > .progresso'),
		footer = $('footer').eq(0),
		areaAside = $('article .aside'),
		textosRodape = $('span.notarodape'),
		todoCorpo = $('html,body'),
		alturaCorpo = todoCorpo.innerHeight(),
		janela = $(window),
		alturaJanela = janela.innerHeight(),
		scrollTopMaximo = todoCorpo.innerHeight() - alturaJanela;

	// metodo para revelar o overlay
	function revelarOverlay(){
		todoCorpo.addClass('blockscroll');
		overlay.addClass('db');
		setTimeout(function(){
			escurecer.addClass('visivel');
			btFecharOverlay.addClass('visivel');
		},20);
		overlayAberto = true;

	}
	// metodo para revelar o modal
	function revelarModal(clicado, destino){
		destino.addClass('db');

		var wi = clicado.innerWidth();
		var hi = clicado.innerHeight();
		var xi = clicado.offset().left;
		var yi = clicado.offset().top - janela.scrollTop();
		var wf = destino.innerWidth();
		var hf = destino.innerHeight();
		var xf = destino.offset().left;
		var yf = destino.offset().top - janela.scrollTop();
		clicado.addClass('esconder');
		boxTransicao
		.addClass('db')
		.css({
			width: wi,
			height: hi,
			left: xi,
			top: yi
		})
		.animate({
			width: wf,
			height: hf,
			left: xf,
			top: yf},
			200, function() {
			destino.addClass('visivel');
			boxTransicao.removeClass('db');			
		});

		modalFoiAberto = true;
		fonteModal = clicado;
		destinoModal = destino;
	}

	// metodo que revela o sumario
	function revelarSumario(){
		sumario.removeClass('easing-invertido');
		setTimeout(function(){
			sumario.addClass('visivel');
			sumarioAberto = true;
		}, 20)
	}

	// Método que esconde o overlay

	function esconderOverlay(){

		

		todoCorpo.removeClass('blockscroll');
		escurecer.removeClass('visivel');
		btFecharOverlay.removeClass('visivel');
		if (modalFoiAberto === true) {
			modais.removeClass('visivel');
			var wi = fonteModal.innerWidth();
			var hi = fonteModal.innerHeight();
			var xi = fonteModal.offset().left;
			var yi = fonteModal.offset().top - janela.scrollTop();
			var wf = destinoModal.innerWidth();
			var hf = destinoModal.innerHeight();
			var xf = destinoModal.offset().left;
			var yf = destinoModal.offset().top - janela.scrollTop();
			boxTransicao.addClass('db')
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
					boxTransicao.removeClass('db');
					modais.removeClass('db');
					fonteModal.removeClass('esconder');
					fonteModal = '';
					destinoModal = '';
					modalFoiAberto = false;
			});
		} else if(sumarioAberto === true){
			sumario.removeClass('visivel').addClass('easing-invertido');
			sumarioAberto = false;
			setTimeout(function(){
				overlay.removeClass('db');
			},500)
		} else{
			setTimeout(function(){
				overlay.removeClass('db');
			},200)
		}			
		
		
		overlayAberto = false;
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
				revelarOverlay();
				revelarModal(boxClicado, minicurriculos);
			});
		} 
	}

	// abrindo sumario
	botoesSumario.on('click', function(event) {
		revelarOverlay();
		revelarSumario();
	});
	
	// Fechando overlay globalmente
	btFecharOverlay.on('click', function(event) {
		esconderOverlay();
	});

	escurecer.on('click', function(event) {
		esconderOverlay();
	});

	$(document).on('keyup', function(e) {
		var evento = e;
		var tecla = event.keyCode || evento.which;
		if (tecla == 27) {
			if (overlayAberto == true) {
				evento.preventDefault();
				esconderOverlay();
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

	// codigo para criar as notas de rodapé
	var conteudoNotaRodape = [];
	textosRodape.each(function(index, el) {
		$(el).before('<span class="linknotarodape"><img src="../../imagens/icone_moreinfo.svg"></span>');
		conteudoNotaRodape.push(
			$(el).html()
		);
	});

	textosRodape.remove();
	var botoesRodape = $('span.linknotarodape');
	botoesRodape.each(function(index, el) {
		var btEl = $(el);
		var btIndice = index;
		btEl.on('click', function(event) {
			var btClicado = $(this);
			areaAside.addClass('db');
			setTimeout(function(){
				areaAside.addClass('visivel');
				setTimeout(function(){
					areaAside.append('\
						<div class="content">\
						<p>'+conteudoNotaRodape[btIndice]+'</p>\
						</div>');
					var divcontent = areaAside.find('div.content');
					var calculoTopContent = btClicado.offset().top - areaAside.offset().top;
					divcontent.addClass('db');
					divcontent.css('top', calculoTopContent);

					setTimeout(function(){
						divcontent.addClass('visivel');
					},40);
				},200);
			},40);
		});
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