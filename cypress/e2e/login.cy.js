
describe('Login Page', () => {
  beforeEach(()=>{
    cy.visit('/login')
  });


  it('Login page Demo button works', () => {
    cy.contains("Demo Credentials").click()
    cy.url().should('not.include','/dashboard')
  });

  it('Login page input text',()=>{
    cy.get('[type="email"]').type("demouser@gmail.com")
    cy.get('[type="password"]').type("moonlover35")
    cy.get('button').contains('Login').click()
    cy.url().should('include','/dashboard')
    cy.contains('KANZAMIN')
  });


  it('Login page sup login button works',()=>{
    cy.get("p").contains('Login as Kanzamin supplier').click()
    cy.url().should('include','/login/supplier')
    cy.get('[class="w-full px-2 py-3 bg-amber-200 rounded"]')
  })

})