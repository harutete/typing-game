export default class modal {
  body: any
  modalWrap: any
  constructor (elem: any) {
    this.body = document.body
    this.modalWrap = elem
  }
  init (): void {
    this.modalWrap.style.display = 'none'
  }
  showModal (): void {
    this.body.classList.add('modal-active')
    this.modalWrap.style.display = 'block'
  }
  closeModal (): void {
    this.body.classList.remove('modal-active')
    this.modalWrap.style.display = 'none'
  }
}