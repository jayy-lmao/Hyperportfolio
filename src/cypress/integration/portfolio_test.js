describe('User can log in', function() {
  it('Visits the home login endpoint and logs in', function() {
    cy.visit('localhost:3001')
    cy.contains('Login').click()
    cy.get('form').within(($form) => {
      cy.get('input[name="email"]').type('admin')
      cy.get('input[name="password"]').type('password')
      cy.root().submit()
    })
    cy.wait(12000)
  })
})

describe("User can visit portfolio page and use functionalities", function() {
  it("Visits portfolio page", function () {
    cy.wait(1000)
    cy.contains("Portfolios").click()
  })

  it("Creates a new portfolio and visits its transaction page", function() {
    cy.contains("New Portfolio").click()
    cy.get('form').within(($form) => {
      cy.get('input[name="name"]').type('new portfolio')
      cy.get('input[name="description"]').type('automated test portfolio')
      cy.root().submit()
    })
    cy.wait(500)
    cy.contains("new portfolio").click()
  })

  it("Adds a stock to the portfolio", function() {
  	cy.contains("Add transaction").click()
  	cy.get("input").eq(0).click().type("BA")
    cy.wait(10000)
    cy.contains('Boe').click()
    cy.get("input").eq(2).click().type("1")
    // .clear() added to remove random 0 appearing before 1 (doesn't change behaviour)
    cy.get("input").eq(3).click().clear().type("1")
    cy.contains("Buy").click()
  })


  it("Checks that all portfolio information fields are present", function() {
    cy.wait(10000)
  	cy.contains("Instrument")
  	cy.contains("Unit")
  	cy.contains("Avg. Price")
  	cy.contains("Market Price")
  	cy.contains("Market Value")
  	cy.contains("Daily Gain/Loss");
  	cy.contains("Total Gain/Loss")
  	cy.contains("Price/Volume Trends")
  	cy.contains("BA")
  	cy.contains("The Boeing Company")
  })

  it("Removes a stock to the portfolio", function() {
  	cy.contains("Add transaction").click()
  	cy.get("input").eq(0).click().type("MSFT")
    cy.wait(4000)
    cy.contains('Microsoft').click()
    cy.get("input").eq(2).click().type("1")
    cy.get("input").eq(3).click().clear().type("1")
    cy.contains("Sell").click()
  })
})

// delete portfolio
describe("User can delete a portfolio", function() {
  it("Deletes a portfolio", function() {
    cy.contains("Delete").click()
    cy.contains("OK").click()
  })
})
