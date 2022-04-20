async function main() {
  const characterData = await fetch(
    "http://hp-api.herokuapp.com/api/characters"
  )
    .then((response) => response.json())
    .then((data) => {
      return data.filter((character) => character.image.length > 1)
    })

  const deck = buildDeck(characterData)
  const div = document.createElement("div")
  div.classList.add("container")

  for (let i = 0; i < deck.length; i++) {
    const card = document.createElement("div")
    card.classList.add("flip-card")

    card.onclick = function (event) {
      onclickhandler(event, deck.length)
    }

    const cardInner = document.createElement("div")
    cardInner.classList.add("flip-card-inner")

    const cardImage = document.createElement("img")
    cardImage.src = "/harrypotterback.jpg"
    cardImage.classList.add("flip-card-front")

    const cardImageFlipped = document.createElement("img")
    cardImageFlipped.src = deck[i].image
    cardImageFlipped.classList.add("flip-card-back")

    card.appendChild(cardInner)
    cardInner.appendChild(cardImage)
    cardInner.appendChild(cardImageFlipped)
    div.appendChild(card)
  }

  const cardGame = document.querySelector(".card-game")

  cardGame.appendChild(div)
}

function shuffle(array) {
  var m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

function buildDeck(array, count = 6) {
  const shuffledCharacters = shuffle(array)
  const selectedCharacters = shuffledCharacters.slice(0, count)
  const doubledCharacters = selectedCharacters.concat(selectedCharacters)
  return shuffle(doubledCharacters)
}

function onclickhandler(event, deckSize) {
  event.target.parentNode.classList.add("card-guessing")

  if (document.querySelectorAll(".card-guessing").length === 2) {
    document.querySelector(".backdrop").classList.add("visible")

    const guessedCards = document.querySelectorAll(".card-guessing")
    const firstCard = guessedCards[0]
    const secondCard = guessedCards[1]
    const firstCardImage = firstCard.querySelector(".flip-card-back")
    const secondCardImage = secondCard.querySelector(".flip-card-back")

    if (firstCardImage.src === secondCardImage.src) {
      firstCard.classList.add("card-correct")
      secondCard.classList.add("card-correct")
      firstCard.classList.remove("card-guessing")
      secondCard.classList.remove("card-guessing")
      document.querySelector(".backdrop").classList.remove("visible")
    } else {
      setTimeout(() => {
        firstCard.classList.remove("card-guessing")
        secondCard.classList.remove("card-guessing")
        document.querySelector(".backdrop").classList.remove("visible")
      }, 1000)
    }

    if (document.querySelectorAll(".card-correct").length === deckSize) {
      document.querySelector("h1").innerHTML = "You Win!"
      setTimeout(() => {
        document.querySelector("h1").innerHTML = "Find Matching Cards"
        const cardGame = document.querySelector(".card-game")
        cardGame.innerHTML = ""
        main()
      }, 5000)
    }
  }
}
main()