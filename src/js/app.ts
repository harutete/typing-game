import modal from './modal'
import "../sass/style.scss";
import { resolve } from 'dns';

interface questionList {
  description: string,
  question: string
}

class TypingGame {
  count: number
  question: string[]
  questionBoad: any
  questionBoadChildren: any
  questionCharas: any
  resultModal: any

  constructor () {
    this.count = 0
    this.question = []
    this.questionBoad = document.querySelector('.js-text-typing-theme')
    this.questionBoadChildren = ''
    this.questionCharas = ''
    this.resultModal = ''
  }
  init (): void {
    const btnStart = document.querySelector('.js-btn-start')
    document.body.setAttribute('data-script-enabled', 'true')

    btnStart.addEventListener('click', () => {
      this.setGameDisplay()
      this.setCountdown()
    })
  }
  setGameDisplay (): void {
    const beforeDisplay: HTMLElement = document.querySelector('.js-before-display') as HTMLElement
    const playingDisplay = document.querySelector('.js-card-playing-display') as HTMLElement

    this.resultModal = new modal(document.querySelector('.js-modal'))
    this.resultModal.init()

    beforeDisplay.style.display = 'none'
    playingDisplay.style.display = 'block'

    this.setQuestion()

    document.addEventListener('keydown', (event: any) => {
      if (/^[a-z]{1}$/.test(event.key)) {
        this.keyCheck(event)
      } else {
        return
      }
    })
  }
  setCountdown () {
    const timeDisplay: any = document.querySelector('.js-text-countdown')
    const endTimeMSec: number = 1000 * 60 * 3 // 3分
    let currentTimeMSec = endTimeMSec
    let count = 1
    const countdown: any = () => {
      currentTimeMSec = endTimeMSec - (1000 * count)
      let minutes: number = Math.floor(currentTimeMSec / (1000 * 60))
      let seconds: number = currentTimeMSec % (1000 * 60) / 1000
      let mm = `0${minutes}`.slice(-2)
      let ss = `0${seconds}`.slice(-2)
      let timerId

      timeDisplay.innerHTML = `${mm}:${ss}`
      count++

      timerId = setTimeout(() => countdown(), 1000)

      if (currentTimeMSec === 0) {
        clearTimeout(timerId)
        this.endGame()
      }
    }

    countdown()
  }
  setQuestion (): void {
    const questionList: questionList[] = [
      {
        description: 'りんご',
        question: 'apple'
      },
      {
        description: 'バナナ',
        question: 'banana'
      },
      {
        description: 'いちご',
        question: 'strawberry'
      },
      {
        description: 'かぼちゃ',
        question: 'squash'
      },
      {
        description: 'スイカ',
        question: 'watermelon'
      },
      {
        description: 'ぶどう',
        question: 'grape'
      },
    ]
    const index: number = Math.floor(Math.random() * Math.floor(questionList.length))
    this.question = questionList[index].question.split('')
    let questionHTML: string = `<p>${questionList[index].description}</p>`

    if (this.count > 0) {
      this.count = 0
    }

    this.question.forEach((charas: string) => {
      questionHTML += `<span class="text-charas">${charas}</span>`
    })

    this.questionBoad.innerHTML = questionHTML

    this.questionBoadChildren = this.questionBoad.children
    this.questionCharas = [...this.questionBoadChildren].filter((elem) => {
      return elem.classList.contains('text-charas')
    })
  }
  keyCheck (event: any): void {
    if (this.count > this.question.length) {
      this.count = 0

      return
    }
    if (this.question[this.count] === event.key) {
      this.questionCharas[this.count].classList.add('active')
      this.count++

      // TODO リムーブイベントさせる
      if (this.question.length === this.count) {
        this.resultModal.showModal()
        this.correctEvent()
      }
    } else {
      return
    }
  }
  correctEvent ():void {
    const promise = new Promise((resolve: any) => {
      setTimeout(() => {
        this.resultModal.closeModal()

        resolve()
      }, 1500)
    })

    promise.then(() => {
      this.setQuestion()
    })
  }
  endGame ():void {
    const afterDisplay: HTMLElement = document.querySelector('.js-after-display') as HTMLElement

    this.questionBoad.innerHTML = '<p>終了</p>'
    afterDisplay.style.display = 'block'

    document.querySelector('.js-btn-restart').addEventListener('click', () => {
      afterDisplay.style.display = 'none'
      this.setGameDisplay()
      this.setCountdown()
    })
  }
}

new TypingGame().init()
