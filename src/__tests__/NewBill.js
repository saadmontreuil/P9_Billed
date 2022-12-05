/**
 * @jest-environment jsdom
 */
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => document.body.innerHTML = ROUTES({pathname})
      const newBill = new NewBill({document, onNavigate, store: null, localStorage: window.localStorage})
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const submit = screen.getByTestId("form-new-bill")
      submit.addEventListener("submit", handleSubmit)
      fireEvent.submit(submit)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
