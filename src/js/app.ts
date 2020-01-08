import modal from './modal'
import "../sass/style.scss";

interface questionList {
  description: string,
  question: string
}

class TypingGame {
  count: number
  question: string[]
  btnStart: HTMLButtonElement
  playingDisplay: any
  questionBoad: any
  questionBoadChildren: any
  questionCharas: any
  resultModal: any
  questionList: questionList[]

  constructor () {
    this.count = 0
    this.question = []
    this.btnStart = document.querySelector('.js-btn-start')
    this.playingDisplay = document.querySelector('.js-card-playing-display')
    this.questionBoad = document.querySelector('.js-text-typing-theme')
    this.questionBoadChildren = ''
    this.questionCharas = ''
    this.resultModal = ''
    this.questionList = [
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

    this.resultModal = new modal(document.querySelector('.js-modal'))
    this.resultModal.init()
    this.playingDisplay.style.display = 'block'
    beforeDisplay.style.display = 'none'
    this.setQuestion()

    document.addEventListener('keydown', (event: any) => {
      if (/^[a-z]{1}$/.test(event.key)) {
        this.keyCheck(event)
      } else {
        return
      }
      // event.stopPropagation()
    })
  }
  setCountdown () {
    const timeDisplay: any = document.querySelector('.js-text-countdown')
    const endTimeMSec: number = 1000 * 60 * 3 // 3分
    let currentTimeMSec = endTimeMSec
    let count = 1
    const countdown: any = () => {
      currentTimeMSec = endTimeMSec - (1000 * count)
      let minutes: number | string = Math.floor(currentTimeMSec / (1000 * 60))
      let seconds: number | string = currentTimeMSec % (1000 * 60) / 1000
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
    const index: number = Math.floor(Math.random() * Math.floor(this.questionList.length))
    this.question = this.questionList[index].question.split('')
    let questionHTML: string = `<p>${this.questionList[index].description}</p>`

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
    if (this.question.length > this.count) {
      if (this.question[this.count] === event.key) {
        this.questionCharas[this.count].classList.add('active')
        this.count++

        // TODO リムーブイベントさせる
        if (this.question.length === this.count) {
          this.resultModal.showModal()

          setTimeout(() => {
            this.resultModal.closeModal()
          }, 2000, this.setQuestion())

          // const closeModalPromise: Promise<void> = new Promise(() => {
          //   setTimeout(() => {
          //     this.resultModal.closeModal()
          //   }, 2000)
          // })

          // this.resultModal.showModal()

          // closeModalPromise.then(() => {
          //   return new Promise(() => {
          //     this.setQuestion()
          //   })
          // })
        }
      } else {
        return
      }
    } else {
      this.count = 0
      return
    }
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
