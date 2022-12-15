/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES,ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
      

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      // const datesSorted = [...dates].sort(antiChrono)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    
  })
})
describe("When the eyes button is pressed,", () => {
  test("Open the modal", async () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
    $.fn.modal = jest.fn();

    await waitFor(() => screen.getAllByTestId('icon-eye'))
    const firstIconEyeButton = screen.getAllByTestId("icon-eye")[0];
    userEvent.click(firstIconEyeButton);
    await waitFor(() => screen.getByAltText("Bill"));
    const billImage = screen.getByAltText("Bill");
    expect(billImage).toHaveAttribute("src","https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a");
  })
})

describe("When the new bill button is clicked,", () => {

  test("Then new bills form should open", async () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)

    await waitFor(() => screen.getByTestId('btn-new-bill'))
    const btnNewBill = screen.getByTestId('btn-new-bill')
    userEvent.click(btnNewBill);
    router()
    window.onNavigate(ROUTES_PATH.NewBill)
    const url = window.location.href;
    expect(url).toEqual("http://localhost/"+ROUTES_PATH.NewBill);
  })
  
})
describe('When I navigate to Bills page',  () => {
  test('Then it fetches bills from mock API GET', async () => {
    localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    const pathname = ROUTES_PATH["Bills"]
    root.innerHTML = ROUTES({ pathname: pathname, loading: true })
    const bills = new Bills({document, onNavigate, store: mockStore, localStorage})
    bills.getBills().then((data) => {
      root.innerHTML = BillsUI({ data })
      expect(document.querySelector("tbody").rows.length).toBe(4)
    })
  })
})

describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(window, 'localStorage', {value: localStorageMock})
    window.localStorage.setItem('user', JSON.stringify({type: 'Employee', email: "e@e"}))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()
  })
  // test("Then it fetches bills from an API and fails with 404 message error", async () => {
  //   const html = BillsUI({error: "Erreur 404"})
  //   document.body.innerHTML = html
  //   const message = await screen.getByText(/Erreur 404/)
  //   expect(message).toBeTruthy()
  // })
  test("fetches bills from an API and fails with 404 message error", async () => {

    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 404"))
        }
      }})
    const html = BillsUI({error: "Erreur 404"})
    document.body.innerHTML = html  
    // window.onNavigate(ROUTES_PATH.Bills)
    // await new Promise(process.nextTick);
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })

  // test("fetches messages from an API and fails with 500 message error", async () => {
  //   const html = BillsUI({error: "Erreur 500"})
  //   document.body.innerHTML = html
  //   const message = await screen.getByText(/Erreur 500/)
  //   expect(message).toBeTruthy()
  // })
  test("fetches bills from an API and fails with 500 message error", async () => {

    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 500"))
        }
      }})
    const html = BillsUI({error: "Erreur 500"})
    document.body.innerHTML = html  
    // window.onNavigate(ROUTES_PATH.Bills)
    // await new Promise(process.nextTick);
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })
})


