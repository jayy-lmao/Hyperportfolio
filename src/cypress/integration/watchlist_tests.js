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
  })
})

describe('User can create a watchlist', function() {
  it('Visits watchlist page and creates a watchlist', function() {
    cy.wait(500)
    cy.contains("Watchlist").click()
    //cy.visit('localhost:3000/Watchlists')
    cy.wait(500)
    cy.contains("New Watchlist").click()
    cy.get('form').within(($form) => {
      cy.get('input[name="name"]').type('test watchlist')
      cy.get('input[name="description"]').type('automated test watchlist')
      cy.root().submit()
    })
    //cy.contains("Create Watchlist").click()
  })
})

describe('User can rename a watchlist', function() {
  it('Visits created watchlist and renames it', function() {
    cy.wait(500)
    cy.contains("test watchlist").click()
    cy.wait(500)
    cy.contains("Edit").click()
    cy.get('form').within(($form) => {
      cy.get('input[name="name"]').clear().type('renamed')
      cy.wait(500)
      cy.root().submit()
    })
  })
})

describe('User can add to watchlist', function() {
  it('Visits created watchlist and adds MSFT stock via search bar', function() {
    cy.wait(500)
    cy.contains("renamed").click()
    cy.wait(500)
    cy.get(".prompt").eq(1).click().type("MSFT")
    cy.wait(5000)
    cy.contains("MSFT").click()
    cy.wait(500)
    cy.contains("Add").click()
  })

  // it('Visits search page and adds GOOG stock', function() {
  //   cy.visit('localhost:3001/Search')
  //   cy.wait(7000)
  //   // cy.get(".prompt").eq(0).click().type("GOOG{enter}")
  //   cy.get('input[name="search"]').type('GOOG{enter}')
  //   cy.wait(4000)
  //   cy.contains("GOOGL").click()
  //   cy.wait(500)
  //   cy.contains("Add").click()
  //   cy.wait(500)
  //   cy.contains("renamed").click()
  // })
  //
  // it('Visits instrument page and adds BA stock', function() {
  //   cy.visit('localhost:3001/Search')
  //   cy.get(".prompt").eq(0).click().type("BA{enter}")
  //   cy.wait(500)
  //   cy.contains("BA").click()
  //   cy.wait(5000)
  //   cy.contains("Add").click()
  //   cy.wait(500)
  //   cy.contains("renamed").click()
  //   cy.wait(500)
  //   cy.contains("Watchlist").click()
  //   cy.wait(500)
  //   cy.contains("renamed").click()
  // })
})

describe('User can delete a watchlst', function() {
  it('Visits created test watchlist and deletes it', function() {
    cy.wait(500)
    cy.contains("renamed").click()
    cy.wait(500)
    cy.contains("Delete").click()
    cy.wait(500)
    cy.contains("OK").click()
  })
})

describe('User logs out', function()  {
  it("Click the logout button", function() {
    cy.wait(1500)
    cy.contains('Logout').click()
  })
})
