# 🧠 Desafio: 2C vs 5Z (Caçadores vs Zumbis)

## Contexto

Você foi contratado para simular um pequeno jogo de sobrevivência.  
O campo de batalha é uma matriz 10x10.  
Dois **caçadores (C)** devem eliminar cinco **zumbis (Z)** que se movem aleatoriamente.

A missão dos caçadores é **sobreviver** e **eliminar todos os zumbis**.  
Os zumbis só querem **chegar até os caçadores e morder**.

---

## Regras

- O mapa é uma grade 10x10.
- Inicialmente, os 2 caçadores e os 5 zumbis são colocados em **posições aleatórias e distintas**.
- A cada rodada:
  1. **Zumbis se movem primeiro**:
     - Cada zumbi dá 1 passo na direção do **caçador mais próximo** (distância de Manhattan).
  2. **Depois, os caçadores se movem** (1 passo), escolhendo entre:
     - Fugir (se estiverem em perigo),
     - Atacar (se houver um zumbi ao lado),
     - Reposicionar-se (livre estratégia).
- Um ataque do caçador **elimina um zumbi** se ele estiver em célula adjacente (horizontal ou vertical).
- Um zumbi **morde e elimina o caçador** se conseguir alcançar a mesma célula.
- O jogo termina se:
  - Todos os zumbis forem eliminados (**vitória dos caçadores**),
  - Os dois caçadores forem mortos (**vitória dos zumbis**),
  - Ou o número de rodadas chegar a 50 (**empate**).

---

## Exemplo de Saída

```text
Rodada 3
. . . . . . . . . .
. . Z . . . . . . .
. . . . . C . Z . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . Z . . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . C . . . .

Status: 2 Caçadores vivos, 3 Zumbis vivos
```

---

## Requisitos

- O jogo deve rodar **apenas no terminal**, sem interface gráfica.
- A **IA dos zumbis** deve ser simples: sempre ir em direção ao caçador mais próximo.
- A **IA dos caçadores** pode ser simples ou complexa, de acordo com a criatividade do programador.
- O código deve ser modular e conter instruções de execução.

---

## Extra (Opcional)

- Permitir a troca da IA dos caçadores via linha de comando:

  ```bash
  python main.py caçador1=corajoso caçador2=cauteloso
  ```

- Permitir logs ou simulações automáticas para **campeonatos entre diferentes IAs**.
  - Por exemplo, rodar 100 partidas entre dois caçadores com estratégias diferentes e contabilizar vitórias.

## Como Participar

1. Faça um fork deste repositório.
2. Implemente sua versão do simulador com as regras descritas.
3. Teste com amigos diferentes estratégias de IA.
4. Compartilhe seus resultados e compare performances!
