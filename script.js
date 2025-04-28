const artistasSection = document.getElementById('artistas');
   const categoriaSelect = document.getElementById('categoria');
   const formCadastro = document.getElementById('formCadastro');
   const contatosContainer = document.getElementById('contatos-container');
   const adicionarContatoButton = document.getElementById('adicionar-contato');

   function obterArtistas(categoria = 'todos') {
        let url = 'URL_DO_SEU_APPS_SCRIPT_AQUI?action=read';
        if (categoria !== 'todos') {
            url += `&categoria=${categoria}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                exibirArtistas(data.valores);
            })
            .catch(error => console.error('Erro ao obter artistas:', error));
   }

   function obterArtistasHome(categoria, elemento) {
        fetch(`URL_DO_SEU_APPS_SCRIPT_AQUI?action=read&categoria=${categoria}`)
            .then(response => response.json())
            .then(data => {
                exibirArtistasHome(data.valores, elemento);
            })
            .catch(error => console.error('Erro ao obter artistas:', error));
   }

   function exibirArtistas(artistas) {
        if (!artistasSection) return;

        artistasSection.innerHTML = "";
        if (artistas && artistas.length > 0) {
            artistas.forEach(artista => {
                const artistaDiv = document.createElement('div');
                artistaDiv.classList.add('artista');
                artistaDiv.innerHTML = `
                    <h2>${artista[0]}</h2>
                    <p>Categoria: ${artista[1]}</p>
                    <p>${artista[2]}</p>
                    <p>Contato(s): ${formatarContatos(artista[3])}</p>
                `;
                artistasSection.appendChild(artistaDiv);
            });
        } else {
            artistasSection.innerHTML = "<p>Nenhum artista cadastrado ainda.</p>";
        }
   }

   function exibirArtistasHome(artistas, elemento) {
        if (!artistas || artistas.length === 0) {
            elemento.innerHTML = "<p>Nenhum artista nesta categoria ainda.</p>";
            return;
        }

        let artistasHTML = "";
        artistas.forEach(artista => {
            artistasHTML += `
                <div class="artista-home">
                    <h4>${artista[0]}</h4>
                    <p>${artista[2].substring(0, 100)}...</p>
                </div>
            `;
        });
        elemento.innerHTML = artistasHTML;
   }

   function formatarContatos(contatosString) {
        if (!contatosString) return "Não informado";

        try {
            const contatos = JSON.parse(contatosString);
            let contatosFormatados = "";
            contatos.forEach(contato => {
                if (contato.tipo === 'telefone') {
                    contatosFormatados += `${contato.tipo}: ${formatarTelefone(contato.valor)}<br>`;
                } else {
                    contatosFormatados += `${contato.tipo}: ${contato.valor}<br>`;
                }
            });
            return contatosFormatados;
        } catch (e) {
            return contatosString;
        }
   }

   function formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length === 11) {
            return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`;
        }
        return telefone;
   }

   function cadastrarArtista(event) {
        if (!formCadastro) return;

        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const categoria = document.getElementById('categoriaCadastro').value;
        const descricao = document.getElementById('descricao').value;

        const contatos = [];
        document.querySelectorAll('.contato-item').forEach(item => {
            const tipo = item.querySelector('.tipo-contato').value;
            const valor = item.querySelector('.valor-contato').value;
            contatos.push({ tipo, valor });
        });

        const novoArtista = { nome, categoria, descricao, contatos: JSON.stringify(contatos) };

        fetch('URL_DO_SEU_APPS_SCRIPT_AQUI', {
            method: 'POST',
            body: JSON.stringify(novoArtista),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Artista cadastrado:', data);
            obterArtistas();
            formCadastro.reset();
        })
        .catch(error => console.error('Erro ao cadastrar artista:', error));
   }

   function filtrarArtistas() {
        if (categoriaSelect && artistasSection) {
            const categoriaSelecionada = categoriaSelect.value;
            obterArtistas(categoriaSelecionada);
        }
   }

   if (categoriaSelect) {
        categoriaSelect.addEventListener('change', filtrarArtistas);
        if (artistasSection) {
            obterArtistas(); // Carregar todos os artistas inicialmente na página de catálogo
        }
        if (formCadastro) {
            formCadastro.addEventListener('submit', cadastrarArtista);
        }
   }

   if (adicionarContatoButton) {
        adicionarContatoButton.addEventListener('click', () => {
            const novoContatoItem = document.createElement('div');
            novoContatoItem.classList.add('contato-item');
            novoContatoItem.innerHTML = `
                <select class="tipo-contato" name="tipoContato[]">
                    <option value="telefone">Telefone</option>
                    <option value="email">E-mail</option>
                    <option value="instagram">Instagram</option>
                    <option value="outros">Outros</option>
                </select>
                <input type="text" class="valor-contato" name="valorContato[]" placeholder="Insira o contato" required>
            `;
            contatosContainer.appendChild(novoContatoItem);
        });
   }

   // Formatação do telefone (máscara)
   if (formCadastro) {
        formCadastro.addEventListener('input', function(e) {
            if (e.target.classList.contains('valor-contato')) {
                if (e.target.previousElementSibling.value === 'telefone') {
                    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                    e.target.value = !x[2] ? '(' + x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                }
            }
        });
   }

   // Carregar artistas na página inicial
   document.addEventListener('DOMContentLoaded', function() {
        const literaturaArtistas = document.querySelector('#literatura .artistas-categoria');
        const musicaArtistas = document.querySelector('#musica .artistas-categoria');
        const artesVisuaisArtistas = document.querySelector('#artes-visuais .artistas-categoria');
        const artesCenicasArtistas = document.querySelector('#artes-cenicas .artistas-categoria');

        if (literaturaArtistas) {
            obterArtistasHome('literatura', literaturaArtistas);
        }
        if (musicaArtistas) {
            obterArtistasHome('musica', musicaArtistas);
        }
        if (artesVisuaisArtistas) {
            obterArtistasHome('artes-visuais', artesVisuaisArtistas);
        }
        if (artesCenicasArtistas) {
            obterArtistasHome('artes-cenicas', artesCenicasArtistas);
        }
   });