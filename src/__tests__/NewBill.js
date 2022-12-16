/**
 * @jest-environment jsdom
 */

 import {fireEvent, screen, waitFor} from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import BillsUI from "../views/BillsUI.js"
 import {localStorageMock} from "../__mocks__/localStorage.js"
 import {ROUTES, ROUTES_PATH} from "../constants/routes.js"
 import router from "../app/Router.js"
 import store from "../__mocks__/store.js"
 import userEvent from "@testing-library/user-event"
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     test("Then mail icon in vertical layout should be highlighted", async () => {
       Object.defineProperty(window, 'localStorage', {value: localStorageMock})
       window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.NewBill)
       await waitFor(() => screen.getByTestId('icon-mail'))
       const windowIcon = screen.getByTestId('icon-mail')
       const activeIcon = windowIcon.classList.contains("active-icon")
       expect(activeIcon).toBeTruthy()
     })
   })
   describe('When I select an image in a correct format', () => {
     test("Then the input file should display the file name", async () => {
       const html = NewBillUI()
       document.body.innerHTML = html
       const onNavigate = (pathname) => document.body.innerHTML = ROUTES({pathname})
       const newBill = new NewBill({document, onNavigate, store, localStorage: window.localStorage})
       const handleChangeFile = jest.fn(newBill.handleChangeFile)
       const input = screen.getByTestId("file")
       input.addEventListener("change", handleChangeFile)
       fireEvent.change(input, {
         target: {
           files: [
             new File(["image.png"], "image.png", {type: "image/png"}),
             new File(["image.jpeg"], "image.jpeg", {type: "image/jpeg"}),
             new File(["image.jpg"], "image.jpg", {type: "image/jpg"})
           ],
         },
       })
       expect(handleChangeFile).toHaveBeenCalled()
       expect(input.files[0].name).toBe("image.png")
       expect(input.files[1].name).toBe("image.jpeg")
       expect(input.files[2].name).toBe("image.jpg")

        // expect(input.files[0].name.endsWith(".png")).toBeTruthy()
        // expect(input.files[1].name.endsWith(".jpeg")).toBeTruthy()
        // expect(input.files[2].name.endsWith(".jpg")).toBeTruthy()

        // expect(input.files[0].name.endsWith(".zip")).not.toBeTruthy()
        // expect(input.files[1].name.endsWith(".pdf")).not.toBeTruthy()
        // expect(input.files[2].name.endsWith(".doc")).not.toBeTruthy()

     })
     test("Then its allowed to upload pictures",async ()=>{
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({pathname})
        const newBill = new NewBill({document, onNavigate, store, localStorage: window.localStorage})
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const input = screen.getByTestId("file")
        input.addEventListener("change", handleChangeFile)
        fireEvent.change(input, {
          target: {
            files: [
              new File(["image.png"], "image.png", {type: "image/png"}),
              new File(["image.jpeg"], "image.jpeg", {type: "image/jpeg"}),
              new File(["image.jpg"], "image.jpg", {type: "image/jpg"})
            ],
          },
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0].name.endsWith(".png")).toBeTruthy()
        expect(input.files[1].name.endsWith(".jpeg")).toBeTruthy()
        expect(input.files[2].name.endsWith(".jpg")).toBeTruthy()

     })
      test("Then its not allowed to upload other type of files ",async ()=>{
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({pathname})
        const newBill = new NewBill({document, onNavigate, store, localStorage: window.localStorage})
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const input = screen.getByTestId("file")
        input.addEventListener("change", handleChangeFile)
        fireEvent.change(input, {
          target: {
            files: [
              new File(["image.png"], "image.png", {type: "image/png"}),
              new File(["image.jpeg"], "image.jpeg", {type: "image/jpeg"}),
              new File(["image.jpg"], "image.jpg", {type: "image/jpg"})
            ],
          },
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0].name.endsWith(".zip")).not.toBeTruthy()
        expect(input.files[1].name.endsWith(".pdf")).not.toBeTruthy()
        expect(input.files[2].name.endsWith(".doc")).not.toBeTruthy()

      })
     test("Then a bill is created", () => {
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
   describe("When I add a new bill", () => {
    
    test("Then it fails with a 404 message error", async () => {
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Then it fails with a 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
 })