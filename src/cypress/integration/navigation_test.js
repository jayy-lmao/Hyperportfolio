describe('User can log in', function() {
  it('Visits the home login endpoint and logs in', function() {
    cy.visit('localhost:3001')
    cy.wait(8000)
    cy.contains('Login').click()
    cy.get('form').within(($form) => {
      cy.get('input[name="email"]').type('admin')
      cy.get('input[name="password"]').type('password')
      cy.root().submit()
    })
    cy.wait(12000)
  })
})

describe('User can navigate to all pages', function()  {
  it("Visits watchlist page", function() {
    cy.contains("Watchlists").click()
  })

  it("Creates a watchlist and visits its page", function() {
    cy.wait(500)
    cy.contains("New Watchlist").click()
    cy.get('form').within(($form) => {
      cy.get('input[name="name"]').type('navigation test')
      cy.get('input[name="description"]').type('automated test watchlist')
      cy.root().submit()
    })
    cy.contains('navigation test').click()
    cy.wait(500)
    cy.contains("Delete").click()
    cy.contains("OK").click()
  })

  it("Visits portfolio page", function () {
    cy.wait(1000)
    cy.contains("Portfolios").click()
  })

  it("Creates a new portfolio and visits its transaction page", function() {
    cy.contains("New Portfolio").click()
    cy.get('form').within(($form) => {
      cy.get('input[name="name"]').type('navigation test')
      cy.get('input[name="description"]').type('automated test portfolio')
      cy.root().submit()
    })
    cy.wait(500)
    cy.contains("navigation test").click()

  })

  it("Visits portfolio page via step on transaction page", function() {
    cy.contains("Manage Portfolios").click()
    cy.contains("navigation test").click()
    cy.wait(1000)
    cy.contains("Delete").click()
    cy.wait(500)
    cy.contains("OK").click()
  })

  it('Visits search page via BA stock search', function() {
    cy.wait(1000)
    cy.contains('Search').click()
    cy.wait(500)
      cy.get('input[name="search"]').type('BA{enter}')
  })

  it("Visits instrument page via BA stock", function() {
    cy.contains("BA").click()
    cy.contains('Boeing Company')
  })
})

describe('User logs out', function()  {
  it("Click the logout button", function() {
    cy.wait(1500)
    cy.contains('Logout').click()
    cy.wait(1000)
    cy.contains('Welcome')
  })
})
