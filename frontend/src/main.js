const nomePokemon = document.getElementById('pokemon_digitado');
const botao = document.getElementById('btnEnviar');
const painel = document.getElementById('response');

class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.nome = data.name ? data.name.charAt(0).toUpperCase() + data.name.slice(1) : '';
    this.image = data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default || '';
    this.habilidades = data.abilities?.map(h => h.ability?.name) || [];
    this.tipos = data.types?.map(t => t.type?.name) || [];
    this.stats = data.stats?.map(s => ({ name: s.stat?.name, value: s.base_stat })) || [];
  }
}

function corTipo(tipo) {
  const map = {
    normal: '#a8a77a',
    fire: '#ee8130',
    water: '#6390f0',
    electric: '#f7d02c',
    grass: '#7ac74c',
    ice: '#96d9d6',
    fighting: '#c22e28',
    poison: '#a33ea1',
    ground: '#e2bf65',
    flying: '#a98ff3',
    psychic: '#f95587',
    bug: '#a6b91a',
    rock: '#b6a136',
    ghost: '#735797',
    dragon: '#6f35fc',
    dark: '#705746',
    steel: '#b7b7ce',
    fairy: '#d685ad'
  };
  return map[tipo] || '#7c5cff';
}

function setLoading() {
  painel.innerHTML = `
    <div class="placeholder">
      <div class="radar"></div>
      <div class="placeholder-text">Buscando dados do Pokémon...</div>
    </div>
  `;
}

function renderError(msg) {
  painel.innerHTML = `
    <div class="error">
      <div class="error-title">Não foi possível encontrar</div>
      <div class="error-text">${msg}</div>
    </div>
  `;
}

function renderPokemon(p) {
  const tipos = p.tipos.map(t => `<span class="chip" style="background:${corTipo(t)}">${t}</span>`).join(' ');
  const habilidades = p.habilidades.map(h => `<span class="chip" style="background:linear-gradient(135deg, rgba(124,92,255,.9), rgba(0,209,255,.85))">${h}</span>`).join(' ');

  const statRow = s => {
    const val = Math.max(0, Math.min(255, Number(s.value) || 0));
    const pct = Math.round((val / 255) * 100);
    return `
      <div class="stat">
        <div class="stat-name">${s.name}</div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="stat-value">${val}</div>
      </div>
    `;
  };

  const stats = p.stats?.length ? p.stats.map(statRow).join('') : '';

  painel.innerHTML = `
    <div class="card">
      <div class="card-media">
        <img src="${p.image}" alt="${p.nome}">
      </div>
      <div class="card-body">
        <div class="title-row">
          <div class="title">${p.nome}</div>
          <div class="badge">#${p.id}</div>
        </div>
        <div class="section-title">Tipos</div>
        <div class="chips">${tipos || '<span class="chip">n/a</span>'}</div>
        <div class="section-title">Habilidades</div>
        <div class="chips">${habilidades || '<span class="chip">n/a</span>'}</div>
        <div class="section-title">Atributos</div>
        <div class="stats">
          ${stats}
        </div>
      </div>
    </div>
  `;
}

async function buscar() {
  const valor = (nomePokemon.value || '').toLowerCase().trim();
  if (!valor) {
    renderError('Digite o nome de um Pokémon para pesquisar.');
    return;
  }
  try {
    setLoading();
    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${valor}`);
    const p = new Pokemon(resp.data);
    renderPokemon(p);
  } catch (e) {
    renderError('Pokémon não encontrado. Verifique o nome e tente novamente.');
  }
}

botao.addEventListener('click', buscar);
nomePokemon.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscar();
});
