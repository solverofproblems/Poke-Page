const nomePokemon = document.getElementById('pokemon_digitado');
const botao = document.getElementById('btnEnviar');


class Pokemon{

  constructor (data){
    this.nome = data.name;
    this.image = data.sprites.other['official-artwork'].front_default;
    this.habilidades = data.abilities.map(hab => hab.ability.name);
  }
}


botao.addEventListener('click', async () => {


  await axios.get(`https://pokeapi.co/api/v2/pokemon/${nomePokemon.value.toLowerCase().trim()}`, {

  })
    .then(function (response){

      const pokemon = new Pokemon(response.data);

      console.log(pokemon);


      document.getElementById('response').innerHTML = `
      
        <h1>Nome do Pokémon: ${pokemon.nome}</h1>
        <img src="${pokemon.image}"></img>
        <h2>Habilidades: ${pokemon.habilidades}</h2>
      `


    }).catch(function(error){

      console.log(error);

    })

});

