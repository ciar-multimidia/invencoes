$(document).ready(function() {

	// lendo caminho do arquivo para descobrir se é um capitulo/artigo ou uma capa.
	var complementourl;
	var caminhourl = window.location.href.split('/');
	indexCaminhoComum = caminhourl.indexOf('livros');
	var numeroLivro = parseInt(caminhourl[indexCaminhoComum+1]);
	var nomePaginaAtual = caminhourl[indexCaminhoComum+2].split('.')[0];
	var numeroCapitulo;
	if (nomePaginaAtual == 'capa') {
		complementourl = '';
	} else if(nomePaginaAtual == 'ficha-tecnica'){
		complementourl = '';
	}else if (nomePaginaAtual == 'capitulos'){
		var nomeCapitulo = caminhourl[indexCaminhoComum+3].split('.')[0].split('');
		if (nomeCapitulo[0] == 'c' &&
			$.isNumeric(nomeCapitulo[1]) &&
			$.isNumeric(nomeCapitulo[2]) ) {
			complementourl = '../';
			nomePaginaAtual = nomeCapitulo;
			numeroCapitulo = parseInt(nomeCapitulo[1]+nomeCapitulo[2]);
		}
	}

	// colocando os elementos globais no html
	var header = $('header').eq(0),
		article = $('article').eq(0),
		corpo = $('body');

	// estamos numa capa? entao coloca a classe capa no header.
	if (nomePaginaAtual == 'capa') {
		header.addClass('capa');
	}

	// inserido elementos da capa
	var tagTituloInicial = header.find('h1');
	var tituloInicial = tagTituloInicial.html();
	var sinopseInicial = header.find('div.sinopse').html();
	var membrosIniciais = header.find('.membro').clone();
	var txtMembrosIniciais = membrosIniciais.wrapAll('<div></div>').parent().html();

	header.children().remove();
	header.append('\
		<div class=\"sobrevolume\">\
			<div class=\"invencoes-sumario\">\
				<a class=\"bt-invencoes\" href=\"'+complementourl+'../../index.html\">\
					<img src=\"'+complementourl+'../../imagens/invencoes-mini.svg\">\
				</a>\
				<div class=\"btsumario\" role=\"button\">\
					<img src=\"'+complementourl+'../../imagens/hamburger-branco.svg\"><span>Sumário</span>\
				</div>\
			</div>\
			\
			<div class="titulo">\
				<h1>'+tituloInicial+'</h1>\
				<div class="sinopse">'+(sinopseInicial != undefined ? sinopseInicial : '')+'</div>\
			</div>'+
			(membrosIniciais.length > 0 ? 
				'<div class="info">\
					<div class="organizacao">\
						<h2>'+
							(nomePaginaAtual == 'capa' ? 'Organização' : membrosIniciais.length > 1 ? 'Autores' : 'Autor(a)')
						+'</h2>'+
						txtMembrosIniciais
					+'</div>\
					</div>'
				: '')
		+'</div>\
	');

	// adicionando header fixo
	header.after('\
		<div id=\"headerfixo\">\
			<div class=\"header_mesmo\">\
				<div role=\"button\" class=\"btsumario\"><img src=\"'+complementourl+'../../imagens/hamburger-branco.svg\"></div>\
				<h1>'+(tagTituloInicial.clone().find('span').remove().end().text())+'</h1>\
			</div>\
			<div class=\"barra-progresso\">\
				<div class=\"progresso\"></div>\
			</div>\
		</div>\
	');

	// adicionando as camadas adicionais do article
	article.children().wrapAll('<div class="main"></div>');
	article.prepend('<div class="overlay-fechar"></div>');
	article.append('<div class="aside"></div>');

	// adicionando footer
	article.after('\
		<footer>\
			<a class="anterior" href="">\
				<img src="'+complementourl+'../../imagens/arrow-branco.svg" alt="">\
				<div class="textonav">\
					<p>Anterior</p>\
					<h4></h4>\
				</div>\
			</a>\
			<a class="proximo" href="">\
				<div class="textonav">\
					<p>Próximo</p>\
					<h4></h4>\
				</div>\
				<img src="'+complementourl+'../../imagens/arrow-branco.svg" alt="">\
			</a>\
		</footer>\
	');

	// adicionando overlay
	$('footer').after('\
		<div id="overlay">\
			<div class="escurecer"></div>\
			<div class="fechar-overlay">\
				<div class="posrel ">\
					<div></div>\
					<div></div>\
				</div>\
			</div>\
			<div class="transicao"></div>\
				\
			<div class="modais">\
				<div class="minicurriculos">\</div>\
			</div>\
			<nav id="sumario">\
				<div class="color-overlay">\
					<div class="invencoes-ficha">\
						<a class="invencoes" href="'+complementourl+'../../index.html">\
							<img src="'+complementourl+'../../imagens/invencoes-mini.svg">\
						</a>\
						<a class="fichatecnica" href="'+complementourl+'capitulos/fichatecnica.html">Ficha técnica</a>\
					</div>\
					<ul>\
						<li'+(nomePaginaAtual == 'capa' ? 
							' class="pagina-atual"' : 
							'')
						+'>\
							<a'+(nomePaginaAtual == 'capa' ? 
								'' : 
								' href="'+complementourl+'capa.html"')
							+'>\
								<h3 class="titulo">Capa do livro</h3>\
							</a>\
						</li>\
					</ul>\
				</div>\
			</nav>\
		</div>\
	');

	// depois que colocar tudo, deixar body visivel
	corpo.addClass('carregado');

	

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
		alturaHeader = header.innerHeight(),
		titulo = header.find('.titulo').eq(0),
		sinopseTitulo = titulo.find('.sinopse'),
		headerfixo = $('#headerfixo'),
		barraProgresso = headerfixo.find('.barra-progresso > .progresso'),
		footer = $('footer').eq(0),
		domArticle = $('article').eq(0),
		areaAside = domArticle.find('.aside'),
		asideContent, 
		textosRodape = $('span.notarodape'),
		rodapeRevelado = false,
		indexRodapeClicado,
		todoCorpo = $('html,body'),
		alturaCorpo = todoCorpo.innerHeight(),
		janela = $(window),
		alturaJanela = janela.innerHeight(),
		scrollTopMaximo = todoCorpo.innerHeight() - alturaJanela;


	// atualizando a altura do header
	janela.on('resize', function(event) {
		alturaHeader = header.innerHeight();
		alturaJanela = janela.innerHeight();
		alturaCorpo = todoCorpo.innerHeight();
		scrollTopMaximo = todoCorpo.innerHeight() - alturaJanela;
		// revelando footer se conteudo é muito pequeno
		if (alturaCorpo < janela.height()+header.innerHeight()) {
			footer.addClass('visivel');
		}
	});

	// deixando footer sempre fixo caso conteudo nao seja grande o suficiente
	if (alturaCorpo < janela.height()+header.innerHeight()) {
		footer.addClass('visivel');
	}
	

	// pegando dados desse livro
	var dadosLivroAtual = dadosLivros[numeroLivro-1];

	// Total de capítulos nesse livro
	var totalCapitulos = dadosLivroAtual.capitulos.length;

	// populando sumário
	if (dadosLivroAtual.tem_categorias == true) {
		var categoriaAtual = '';
	}
	$.each(dadosLivroAtual.capitulos, function(index, val) {
		 if (dadosLivroAtual.tem_categorias == true) {
		 	if (val.categoria != categoriaAtual) {
		 		categoriaAtual = val.categoria;
		 		sumario.find('ul').eq(0).append('<div class="categoria"><h5>'+val.categoria+'</h5></div');
		 	}
		 }
		 console.log(index, numeroCapitulo);
		 sumario.find('ul').eq(0).append('\
		 	<li'+(index == numeroCapitulo ? ' class="pagina-atual"' : '')+'>\
		 		<a'+(index == numeroCapitulo ? 
			 			'' : 
			 			' href="'+complementourl+'capitulos/c'+( (index).toString().length>1 ? 
			 				'' : 
			 				'0')
			 			+index+'.html"'
		 			) 
		 		+'>\
		 			<h3 class="titulo">'+val.titulo+'</h3>'+
		 			(val.autores != '' ?
		 				'<div class="autores">\
		 					<p>'+
		 					(val.autores.join('</p><p>'))
		 					+'</p>\
		 				</div>'
		 			 : '')
		 			
		 		+'</a>\
		 	</li>\
	 	');
	});

	// links do footer
	if (numeroCapitulo == dadosLivroAtual.capitulos.length-1) {
		footer.find('a.proximo').addClass('esconder');
	} else if (nomePaginaAtual == 'capa') {
		footer.find('a.proximo').attr('href',complementourl+'capitulos/c00.html');
		footer.find('a.proximo div.textonav > h4').text(dadosLivroAtual.capitulos[0].titulo);
	}else{
		footer.find('a.proximo').attr('href', complementourl+'capitulos/c'+( (numeroCapitulo+1).toString().length>1 ? '' : "0" )+(numeroCapitulo+1)+'.html');
		footer.find('a.proximo div.textonav > h4').text(dadosLivroAtual.capitulos[numeroCapitulo+1].titulo);
	}
	if (nomePaginaAtual == 'capa') {
		footer.find('a.anterior').addClass('esconder');
	} else if (numeroCapitulo == 0) {
		footer.find('a.anterior').attr('href', complementourl+'capa.html');
		footer.find('a.anterior div.textonav > h4').text('Capa do Livro');
	}else{
		footer.find('a.anterior').attr('href', complementourl+'capitulos/c'+( (numeroCapitulo-1).toString().length>1 ? '' : "0" )+(numeroCapitulo-1)+'.html');
		footer.find('a.anterior div.textonav > h4').text(dadosLivroAtual.capitulos[numeroCapitulo-1].titulo);
	}


	// envolvendo todas as tables com div rolável
	$('table').wrap('<div class="containertable"></div>')
		 

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

	// definindo interações com as informações sobre os autores/organizadores
	if (boxOrganizacao.length > 0) {
		var infoOrganizacao = boxOrganizacao.find('.membro.cdescricao');
		if (infoOrganizacao.length > 0) {
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
	
	// clicar no X fecha overlay
	btFecharOverlay.on('click', function(event) {
		esconderOverlay();
	});

	// clicar no escuro tambem
	escurecer.on('click', function(event) {
		esconderOverlay();
	});

	// arrastar o menu de sumario para a esquerda tambem
	sumario.on('swipeleft', function(event) {
		esconderOverlay();
	});

	// e apertando esc tambem :D
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


	// armazenando textos do rodape, criando botoes para acesso e removendo tags que continham os textos
	var conteudoNotaRodape = [];
	textosRodape.each(function(index, el) {
		$(el).before('<span class="linknotarodape"><img src="'+complementourl+'../../imagens/icone_moreinfo.svg"></span>');
		conteudoNotaRodape.push(
			$(el).html()
		);
	});
	textosRodape.remove();
	var botoesRodape = $('span.linknotarodape');

	// funcao que fecha a nota de rodape
	function esconderNotaRodape(){
		asideContent.css('width', asideContent.innerWidth()).removeClass('visivel');
		areaAside.addClass('easing-reverso');
		areaAside.removeClass('visivel');
		setTimeout(function(){
			todoCorpo.removeClass('blockscroll apenas_mobile');
			domArticle.find('div.overlay-fechar').removeClass('db');
			asideContent.remove();
			areaAside.removeClass('db easing-reverso');
			indexRodapeClicado = '';
			rodapeRevelado = false;
			
		},200);
	}

	// funcao que abrem (e populam) as notas de rodapé
	function revelarNotaRodape(btClicado){
		if (rodapeRevelado === false){
			areaAside.addClass('db');
			todoCorpo.addClass('blockscroll apenas_mobile')
			domArticle.find('div.overlay-fechar').addClass('db');
		};
		setTimeout(function(){
			if (rodapeRevelado === false){areaAside.addClass('visivel')};
			setTimeout(function(){
				if (rodapeRevelado === true){
					asideContent.remove();
					asideContent = '';
				};
				areaAside.append('\
					<div class="content">\
						<div class="btfechar">\
							<div></div>\
							<div></div>\
						</div>\
						<p>'+conteudoNotaRodape[indexRodapeClicado]+'</p>\
					</div>'
				);
				asideContent = areaAside.find('div.content');
				var calculoTopContent = btClicado.offset().top - areaAside.offset().top - asideContent.find('div.btfechar').outerHeight(true);

				if (calculoTopContent < 0) {
					calculoTopContent = 0;
				} else if(calculoTopContent+asideContent.innerHeight() > areaAside.innerHeight() ){
					calculoTopContent = areaAside.innerHeight()-asideContent.innerHeight();
				}
				asideContent.css('top', calculoTopContent);
				asideContent.addClass('visivel');

				asideContent.find('.btfechar').on('click', function(event) {
					esconderNotaRodape();
				});
				rodapeRevelado = true;
			}, (rodapeRevelado === false ? 200 : 0));
		},(rodapeRevelado === false ? 20 : 0));
	}

	// evento de clique para abrir os rodapes
	botoesRodape.on('click', function(event) {
		var clicado = $(this);
		if (indexRodapeClicado !== botoesRodape.index(clicado) ) {
			indexRodapeClicado = botoesRodape.index(clicado);
			revelarNotaRodape(clicado);
		} else{
			
		}
	});

	// no mobile, cover transparente fecha a nota
	domArticle.find('div.overlay-fechar').eq(0).on('click', function(event) {
		esconderNotaRodape();
	});

	// arrastar aside para a direita também fecha a nota
	areaAside.on('swiperight', function(event) {
		esconderNotaRodape();
		
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

		if (rolagemEvento > scrollTopMaximo - 10) {
			footer.addClass('final');
		} else {
			footer.removeClass('final');
		}
	rolagemAtual = rolagemEvento;
	});

	

});