type TipoPersonagem = 'CACADOR' | 'ZUMBI'
type CelulaMapa = Personagem | null
type Mapa = CelulaMapa[][]
type Posicao = [number, number]

class Personagem {
  constructor(public tipo: 'CACADOR' | 'ZUMBI', public vivo: boolean, public posicao: Posicao) {}
}

function loopRodadas() {
  iniciarMapa()
  console.log('Rodada 0')
  printMapa()

  for (let i = 0; i < 50; i++) {
    console.log('Rodada', i + 1)
    
    movimentarPersonagens()
    printMapa()
    printStatus()
    
    const cacadoresVivos = filtrarPersonagens('CACADOR', true)
    const zumbisVivos = filtrarPersonagens('ZUMBI', true)

    if (cacadoresVivos.length === 0) {
      console.log("ZUMBIS VENCERAM!")
      break
    }
    if (zumbisVivos.length === 0) {
      console.log("CACADORES VENCERAM!")
      break
    }
  }
}

function criarMapa() {
  const linhas: CelulaMapa[][] = new Array(10).fill(null).map(() => {
    const colunas: CelulaMapa[] = new Array(10).fill(null)

    return colunas
  })

  return linhas
}

function criarPersonagem(tipo: TipoPersonagem) {
  return new Personagem(tipo, true, [
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9)
  ])
}

function posicionarPesonagem(personagem: Personagem) {
  state.mapa[personagem.posicao[0]][personagem.posicao[1]] = personagem
}

function reposicionarPersonagem(personagem: Personagem, novaPosicao: Posicao) {
  const celula = state.mapa[novaPosicao[0]][novaPosicao[1]]
  if (celula?.tipo === 'ZUMBI') {
    return
  }

  removerPersonagem(personagem)

  personagem.posicao = novaPosicao

  posicionarPesonagem(personagem)
}

function removerPersonagem(personagem: Personagem) {
  state.mapa[personagem.posicao[0]][personagem.posicao[1]] = null
}

function iniciarMapa() {
  state.personagens.forEach(personagem => posicionarPesonagem(personagem))
}

function printMapa() {
  state.mapa.forEach((colunas, x) => {
    const linhaPrint = colunas.map(celula => {
      if (celula === null) {
        return '.'
      }

      const inicial = celula.tipo.charAt(0)
  
      return celula.vivo ? inicial.toUpperCase() : inicial.toLowerCase()
    }).join(' ')

    console.log(linhaPrint)
  })
}

function filtrarPersonagens(tipo: TipoPersonagem, vivo?: boolean) {
  return state.personagens.filter(personagem => personagem.tipo === tipo && (vivo === undefined || personagem.vivo === vivo))
}

function printStatus() {
  const cacadoresVivos = filtrarPersonagens('CACADOR', true)
  const zumbisVivos = filtrarPersonagens('ZUMBI', true)

  console.log(`\nStatus: ${cacadoresVivos.length} Caçadores vivos, ${zumbisVivos.length} Zumbis vivos`)
}

function movimentarPersonagens() {
  state.personagens.forEach(personagem => {
    if (!personagem.vivo) {
      return
    }

    if (personagem.tipo === 'CACADOR') {
      movimentarCacador(personagem)
    } else {
      movimentarZumbi(personagem)
    }
  })
}

function movimentarCacador(cacador: Personagem) {
  const distanciaZumbis = filtrarPersonagens('ZUMBI', true).map(zumbi => ({ zumbi, distancia: distanciaEntre(zumbi.posicao, cacador.posicao) }))
  distanciaZumbis.sort((x, y) => x.distancia - y.distancia)

  if (distanciaZumbis.length === 0) {
    return
  }

  const zumbisProximos = distanciaZumbis.filter(({ distancia }) => distancia <= 1)
  const estaCercado = zumbisProximos.length > 1

  if (estaCercado) {
    const posicoesFuturas = [
      [cacador.posicao[0], cacador.posicao[1] - 1],
      [cacador.posicao[0] - 1, cacador.posicao[1]],
      [cacador.posicao[0], cacador.posicao[1] + 1],
      [cacador.posicao[0] + 1, cacador.posicao[1]],
    ].filter(posicao => posicao[0] >= 0
        && posicao[1] >= 0
        && posicao [0] < 10
        && posicao[1] < 10
        && state.mapa[posicao[0]][posicao[1]] === null
    )

    if (posicoesFuturas.length > 0) {
      reposicionarPersonagem(cacador, posicoesFuturas[0] as Posicao)
    }
    return
  }

  if (zumbisProximos.length === 1) {
    const { zumbi } = zumbisProximos[0]
    zumbi.vivo = false
    removerPersonagem(zumbi)
    console.log(`Zumbi ${state.personagens.indexOf(zumbi)} MORTO!`)

    if (zumbi.posicao[0] === cacador.posicao[0] && zumbi.posicao[1] === cacador.posicao[1]) {
      posicionarPesonagem(cacador)
    }
    return
  }

  // const novaPosicao = calcularMovimentoPara(cacador.posicao, distanciaZumbis[0].zumbi.posicao)

  // reposicionarPersonagem(cacador, novaPosicao)
}

function movimentarZumbi(zumbi: Personagem) {
  const distanciaCacadores = filtrarPersonagens('CACADOR', true).map(cacador => ({ cacador, distancia: distanciaEntre(cacador.posicao, zumbi.posicao) }))
  distanciaCacadores.sort((x, y) => x.distancia - y.distancia)

  if (distanciaCacadores.length < 1) {
    return
  }

  const cacadorProximo = distanciaCacadores[0]

  if (cacadorProximo.distancia > 0) {
    const novaPosicao = calcularMovimentoPara(zumbi.posicao, cacadorProximo.cacador.posicao)

    reposicionarPersonagem(zumbi, novaPosicao)
  }

  if (distanciaEntre(cacadorProximo.cacador.posicao, zumbi.posicao) === 0) {
    const { cacador } = cacadorProximo
    cacador.vivo = false
    removerPersonagem(cacador)
    console.log(`Cacador ${state.personagens.indexOf(cacador)} MORDIDO!`)

    if (zumbi.posicao[0] === cacador.posicao[0] && zumbi.posicao[1] === cacador.posicao[1]) {
      posicionarPesonagem(zumbi)
    }
  } 
}

function distanciaEntre(p1: Posicao, p2: Posicao) {
  const distanciaX = Math.abs(p1[0] - p2[0])
  const distanciaY = Math.abs(p1[1] - p2[1])

  return distanciaX + distanciaY
}

function zumbiMaisProximo(posicao: Posicao) {
  const distanciaZumbis = filtrarPersonagens('ZUMBI', true).map(zumbi => ({ zumbi, distancia: distanciaEntre(zumbi.posicao, posicao) }))
  distanciaZumbis.sort((x, y) => x.distancia - y.distancia)

  return distanciaZumbis.length > 0 ? distanciaZumbis[0] : null
}

function calcularMovimentoPara(inicio: Posicao, fim: Posicao) {
    const novaPosicao: Posicao = [...inicio]

    if (fim[0] !== inicio[0]) {
      const diffX = (fim[0] - inicio[0]) > 0 ? 1 : -1

      novaPosicao[0] = Math.min(Math.max(diffX + novaPosicao[0], 0), 9)
    } else if (fim[1] !== inicio[1]) {
      const diffY = (fim[1] - inicio[1]) > 0 ? 1 : -1

      novaPosicao[1] = Math.min(Math.max(diffY + novaPosicao[1], 0), 9)
    }

    return novaPosicao
}


const state = {
  mapa: criarMapa(),
  personagens: [
    criarPersonagem('ZUMBI'),
    criarPersonagem('ZUMBI'),
    criarPersonagem('ZUMBI'),
    criarPersonagem('ZUMBI'),
    criarPersonagem('ZUMBI'),
    criarPersonagem('CACADOR'),
    criarPersonagem('CACADOR'),
  ]
}

loopRodadas()