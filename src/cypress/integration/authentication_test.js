describe("User can visit page", function () {
  it("Visits home page", function () {
    cy.visit('localhost:3001', {onLoad: () => { console.log('Page Loaded') }})
    console.log("On first run home page takes a while to cache")
    cy.wait(25000)
  })
})

describe("User can't visit some pages before logging in", function() {
  // Assert elements that should exist on these pags don't exist
  it("Tries to visit watchlist page", function() {
    cy.visit("localhost:3001/portfolios")
    cy.get('New Portfolio').should('not.exist');
  })

  it("Tries to visit watchlist page", function() {
    cy.visit("localhost:3001/watchlists")
    cy.get('New Watchlist').should('not.exist');
  })

  it("Tries to visit an instrument (MSFT) page", function() {
    cy.visit("localhost:3001/instruments/MSFT")
    cy.wait(1500)
    cy.get('Add To Portfolio').should('not.exist')
    cy.contains("MSFT")
  })
})

describe('User can log in', function() {
  it('Visits the home login endpoint and then logs out', function() {
    cy.contains('Login').click()
    cy.get('form').within(($form) => {
      cy.get('input[name="email"]').type('admin')
      cy.get('input[name="password"]').type('password')
      cy.root().submit()
    })
    cy.wait(500)
    cy.contains('Logout').click()
  })
})

// visiting pages when logged in is covered in further tests
